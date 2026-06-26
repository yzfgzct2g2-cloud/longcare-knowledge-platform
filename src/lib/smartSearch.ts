// Smart Search 引擎（V1.3.0）。
// 規則式（非 AI）：同義詞展開 + 實務查詢導引 + 命中理由 + 加權排序 + 結果分層。
// 僅查詢本機 JSON（regulations / practical / assistive-devices），無任何外部 API。
//
// TODO（V1.4.2 預留，尚未整合）：Interpretation Layer。
//   未來搜尋外籍看護等主題時，除 Topic 外，應依 knowledge/interpretations/ 之函釋／公告
//   （依 priority：法規100 > 函釋90 > 逐條說明80 > Topic70 > 搜尋輔助60）另外提示
//   「已有函釋／行政解釋／修正公告」。本版僅建立資料架構與此 TODO，不做整合。

import {
  appendices,
  articles,
  codeItems,
  codeMap,
  countAppendixItems,
  effectiveDateMap,
  getAppendix,
  getArticle,
  getCodeItem,
  searchIndex,
} from '../data/loaders'
import { getTopic, practicalTopics } from '../data/practical'
import {
  intentKeywords,
  practicalQueryMap,
  priorityRules,
  synonymGroups,
  type QueryTarget,
} from '../data/smartSearchRules'
import type {
  HitReason,
  ReasonKind,
  SmartAppendixResult,
  SmartArticleResult,
  SmartCodeResult,
  SmartEffectiveResult,
  SmartSearchResults,
  SmartTopicResult,
  DirectHit,
} from '../data/types'
import { matchAssistiveHint } from './assistiveSearch'
import { toChineseNumber } from './format'
import { isCodeLike, normalizeQuery, parseArticleNumber, parseEffectiveDate } from './normalize'

interface InternalReason {
  kind: ReasonKind
  label: string
  score: number
}
interface Acc {
  score: number
  reasons: InternalReason[]
  direct: boolean
}

function ensure<K>(map: Map<K, Acc>, key: K): Acc {
  let a = map.get(key)
  if (!a) {
    a = { score: 0, reasons: [], direct: false }
    map.set(key, a)
  }
  return a
}

function add<K>(
  map: Map<K, Acc>,
  key: K,
  kind: ReasonKind,
  label: string,
  score: number,
  direct = false,
): void {
  const a = ensure(map, key)
  a.reasons.push({ kind, label, score })
  if (score > a.score) a.score = score
  if (direct) a.direct = true
}

/** 雙向 includes（去除過短 token，避免雜訊） */
function twoWay(a: string, b: string): boolean {
  if (!a || !b) return false
  if (b.length < 2) return false
  const x = a.toLowerCase()
  return x.includes(b) || b.includes(x)
}

function docIdToAppendixId(docId: string): string {
  return docId
    .slice('appendix-'.length)
    .split('-')
    .map((seg) => String(parseInt(seg, 10)))
    .join('-')
}

function summarize(text: string, max = 80): string {
  if (!text) return ''
  const t = text.replace(/\s+/g, ' ').trim()
  return t.length > max ? t.slice(0, max) + '…' : t
}

function finalReasons(acc: Acc): HitReason[] {
  const seen = new Set<string>()
  const out: HitReason[] = []
  for (const r of [...acc.reasons].sort((a, b) => b.score - a.score)) {
    if (seen.has(r.label)) continue
    seen.add(r.label)
    out.push({ kind: r.kind, label: r.label })
  }
  return out
}

function emptyResult(query: string, normalizedQuery: string): SmartSearchResults {
  return {
    query,
    normalizedQuery,
    expandedTerms: [],
    synonymCanonicals: [],
    directHits: [],
    topics: [],
    articles: [],
    codes: [],
    appendices: [],
    effectiveDates: [],
    assistiveHint: { hit: false, matched: [] },
    totalHits: 0,
  }
}

export function searchSmart(raw: string): SmartSearchResults {
  const nq = normalizeQuery(raw)
  if (!nq) return emptyResult(raw, nq)
  const lowerNq = nq.toLowerCase()

  // ---------- 同義詞展開 ----------
  const expandedSet = new Set<string>([lowerNq])
  const synonymCanonicals: string[] = []
  for (const group of synonymGroups) {
    if (group.terms.some((t) => twoWay(t, nq))) {
      synonymCanonicals.push(group.canonical)
      for (const t of group.terms) expandedSet.add(t.toLowerCase())
      expandedSet.add(group.canonical.toLowerCase())
    }
  }
  const expandedTerms = [...expandedSet].filter((t) => t.length >= 2)
  const synonymLabel = (canonical: string) => `同義詞命中：${nq} → ${canonical}`

  // ---------- 實務查詢導引 / 口語意圖 ----------
  const appliedTargets: Array<QueryTarget & { label: string }> = []
  let forcedAssistive = false
  for (const rule of practicalQueryMap) {
    if (rule.patterns.some((p) => twoWay(p, nq))) {
      appliedTargets.push(rule)
      if (rule.assistiveHint) forcedAssistive = true
    }
  }
  for (const kw of intentKeywords) {
    if (twoWay(kw.keyword, nq)) {
      appliedTargets.push(kw)
      if (kw.assistiveHint) forcedAssistive = true
    }
  }

  const articleAcc = new Map<number, Acc>()
  const codeAcc = new Map<string, Acc>()
  const topicAcc = new Map<string, Acc>()
  const appendixAcc = new Map<string, Acc>()
  const dateAcc = new Map<string, Acc>()

  const termHit = (hay: string) => {
    const h = hay.toLowerCase()
    return expandedTerms.some((t) => h.includes(t))
  }

  // ---------- 條文 ----------
  const directArticle = parseArticleNumber(raw)
  if (directArticle && getArticle(directArticle)) {
    add(
      articleAcc,
      directArticle,
      'article-exact',
      `直接命中：第${toChineseNumber(directArticle)}條`,
      priorityRules.articleExact,
      true,
    )
  }

  // search-index 關鍵字 → 條文 / 附表
  for (const [keyword, docIds] of Object.entries(searchIndex)) {
    if (!expandedTerms.some((t) => twoWay(keyword, t))) continue
    for (const id of docIds) {
      const m = id.match(/^article-(\d+)$/)
      if (m) add(articleAcc, parseInt(m[1], 10), 'keyword', `關鍵字命中：${keyword}`, priorityRules.keyword)
      else if (id.startsWith('appendix-'))
        add(appendixAcc, docIdToAppendixId(id), 'keyword', `關鍵字命中：${keyword}`, priorityRules.keyword)
    }
  }

  // 條文欄位
  for (const a of articles) {
    if (termHit(a.title)) add(articleAcc, a.article, 'title', `標題命中：${a.title}`, priorityRules.title)
    if (termHit(a.keywords.join(' '))) add(articleAcc, a.article, 'keyword', '關鍵字命中', priorityRules.keyword)
    if (termHit(a.current_text + a.explanation + a.revision_note))
      add(articleAcc, a.article, 'fulltext', '全文命中（條文內容）', priorityRules.fulltext)
  }

  // ---------- 照顧組合碼 ----------
  const exactItem = getCodeItem(nq)
  if (isCodeLike(nq) && exactItem) {
    add(codeAcc, exactItem.code.toUpperCase(), 'code-exact', `直接命中：碼別 ${exactItem.code}`, priorityRules.codeExact, true)
  }
  if (isCodeLike(nq)) {
    const upper = nq.toUpperCase()
    for (const code of Object.keys(codeMap)) {
      const cu = code.toUpperCase()
      if (cu !== upper && cu.includes(upper))
        add(codeAcc, cu, 'keyword', `碼別前綴命中：${nq}`, priorityRules.keyword)
    }
  }
  for (const [code, entry] of Object.entries(codeMap)) {
    if (termHit(entry.title)) add(codeAcc, code.toUpperCase(), 'title', `名稱命中：${entry.title}`, priorityRules.title)
    if (termHit(entry.keywords.join(' '))) add(codeAcc, code.toUpperCase(), 'keyword', '關鍵字命中', priorityRules.keyword)
  }
  for (const item of codeItems) {
    if (termHit(item.search_text))
      add(codeAcc, item.code.toUpperCase(), 'fulltext', '全文命中（附表內容）', priorityRules.fulltext)
  }

  // ---------- 實務主題 ----------
  for (const tp of practicalTopics) {
    if (lowerNq === tp.topic.toLowerCase())
      add(topicAcc, tp.topic, 'topic-exact', `直接命中：實務主題 ${tp.topic}`, priorityRules.topicExact, true)
    if (synonymCanonicals.includes(tp.topic))
      add(topicAcc, tp.topic, 'synonym', synonymLabel(tp.topic), priorityRules.synonym)
    if (tp.aliases.some((al) => expandedTerms.some((t) => twoWay(al, t))))
      add(topicAcc, tp.topic, 'synonym', `別名命中：${tp.topic}`, priorityRules.synonym)
    if (termHit(tp.topic)) add(topicAcc, tp.topic, 'topic', `實務主題命中：${tp.topic}`, priorityRules.topicName)
    if (tp.keywords.some((k) => expandedTerms.some((t) => twoWay(k, t))))
      add(topicAcc, tp.topic, 'keyword', '關鍵字命中', priorityRules.keyword)
    if (termHit(tp.summary)) add(topicAcc, tp.topic, 'fulltext', '全文命中（主題摘要）', priorityRules.fulltext)
  }

  // ---------- 套用導引目標 ----------
  const applyTarget = (tgt: QueryTarget & { label: string }) => {
    for (const n of tgt.articles ?? []) if (getArticle(n)) add(articleAcc, n, 'practical-map', tgt.label, priorityRules.practicalMap)
    for (const c of tgt.codes ?? []) if (getCodeItem(c)) add(codeAcc, c.toUpperCase(), 'practical-map', tgt.label, priorityRules.practicalMap)
    for (const pfx of tgt.codePrefixes ?? []) {
      const P = pfx.toUpperCase()
      for (const code of Object.keys(codeMap)) if (code.toUpperCase().startsWith(P)) add(codeAcc, code.toUpperCase(), 'practical-map', tgt.label, priorityRules.practicalMap)
    }
    for (const ap of tgt.appendices ?? []) if (getAppendix(ap)) add(appendixAcc, ap, 'practical-map', tgt.label, priorityRules.practicalMap)
    for (const tn of tgt.topics ?? []) if (getTopic(tn)) add(topicAcc, tn, 'practical-map', tgt.label, priorityRules.practicalMap)
  }
  for (const tgt of appliedTargets) applyTarget(tgt)

  // ---------- 強命中主題 → 關聯條文/碼別/附表 ----------
  for (const [name, acc] of [...topicAcc]) {
    if (acc.score < priorityRules.synonym) continue
    const tp = getTopic(name)
    if (!tp) continue
    for (const n of tp.related_articles)
      if (getArticle(n)) add(articleAcc, n, 'relation', `實務主題關聯：${name} → 第${toChineseNumber(n)}條`, priorityRules.relation)
    for (const c of tp.related_codes)
      if (getCodeItem(c)) add(codeAcc, c.toUpperCase(), 'relation', `實務主題關聯：${name} → ${c}`, priorityRules.relation)
    for (const ap of tp.related_appendices)
      if (getAppendix(ap)) add(appendixAcc, ap, 'relation', `實務主題關聯：${name}`, priorityRules.relation)
  }

  // 命中碼別所屬附表
  for (const [cu] of [...codeAcc]) {
    const item = getCodeItem(cu)
    const apId = item ? codeMap[item.code]?.appendix : undefined
    if (apId && getAppendix(apId)) add(appendixAcc, apId, 'citation', `含命中碼別 ${item!.code}`, priorityRules.citation)
  }

  // 附表欄位
  for (const ap of appendices) {
    if (termHit([ap.title, ap.former_title ?? '', ap.revision_note, (ap.keywords ?? []).join(' ')].join(' ')))
      add(appendixAcc, ap.appendix, 'title', `附表命中：${ap.title}`, priorityRules.title)
  }

  // ---------- 生效日 ----------
  const dateQuery = parseEffectiveDate(raw)
  if (dateQuery && effectiveDateMap[dateQuery]) add(dateAcc, dateQuery, 'keyword', `生效日命中：${dateQuery}`, priorityRules.keyword)

  // ---------- 組裝 ----------
  const articleResults: SmartArticleResult[] = [...articleAcc]
    .map(([n, acc]) => {
      const a = getArticle(n)!
      return {
        article: a.article,
        title: a.title,
        chapter: a.chapter,
        effective_date: a.effective_date,
        revisionSummary: summarize(a.revision_note),
        score: acc.score,
        reasons: finalReasons(acc),
        direct: acc.direct,
      }
    })
    .sort((x, y) => y.score - x.score || x.article - y.article)

  const codeResults: SmartCodeResult[] = [...codeAcc]
    .map(([cu, acc]) => {
      const item = getCodeItem(cu)
      if (!item) return null
      return {
        code: item.code,
        name: item.name,
        category: item.category,
        payment_type: item.payment_type,
        price_limit: item.price_limit,
        minimum_years: item.minimum_years,
        effective_date: item.effective_date,
        citation: item.citation,
        appendix: codeMap[item.code]?.appendix ?? '',
        revision_115: item.revision_115,
        score: acc.score,
        reasons: finalReasons(acc),
        direct: acc.direct,
      } satisfies SmartCodeResult
    })
    .filter((c): c is SmartCodeResult => c !== null)
    .sort((x, y) => y.score - x.score || x.code.localeCompare(y.code, undefined, { numeric: true }))

  const topicResults: SmartTopicResult[] = [...topicAcc]
    .map(([name, acc]) => {
      const tp = getTopic(name)!
      return {
        topic: tp.topic,
        summary: tp.summary,
        aliases: tp.aliases,
        related_articles: tp.related_articles,
        related_codes: tp.related_codes,
        score: acc.score,
        reasons: finalReasons(acc),
        direct: acc.direct,
      }
    })
    .sort((x, y) => y.score - x.score || x.topic.localeCompare(y.topic, 'zh-Hant'))

  const appendixResults: SmartAppendixResult[] = [...appendixAcc]
    .map(([id, acc]) => {
      const ap = getAppendix(id)
      if (!ap) return null
      return {
        appendix: ap.appendix,
        title: ap.title,
        itemCount: countAppendixItems(ap),
        score: acc.score,
        reasons: finalReasons(acc),
        direct: acc.direct,
      } satisfies SmartAppendixResult
    })
    .filter((a): a is SmartAppendixResult => a !== null)
    .sort((x, y) => y.score - x.score || x.appendix.localeCompare(y.appendix, undefined, { numeric: true }))

  const effectiveResults: SmartEffectiveResult[] = [...dateAcc]
    .map(([date, acc]) => {
      const entries = effectiveDateMap[date]
      return {
        date,
        articleCount: entries.filter((e) => /^article-\d+/.test(e)).length,
        codeCount: entries.filter((e) => !e.startsWith('article-') && !e.startsWith('appendix-')).length,
        entries,
        score: acc.score,
        reasons: finalReasons(acc),
        direct: acc.direct,
      }
    })
    .sort((x, y) => x.date.localeCompare(y.date))

  // 直接命中層（跨型別）
  const directHits: DirectHit[] = []
  for (const a of articleResults) if (a.direct) directHits.push({ type: 'article', item: a })
  for (const c of codeResults) if (c.direct) directHits.push({ type: 'code', item: c })
  for (const t of topicResults) if (t.direct) directHits.push({ type: 'topic', item: t })
  directHits.sort((x, y) => y.item.score - x.item.score)

  const topics = topicResults.filter((t) => !t.direct)
  const articleLayer = articleResults.filter((a) => !a.direct)
  const codeLayer = codeResults.filter((c) => !c.direct)

  // 跨制度輔具提示
  const baseHint = matchAssistiveHint(raw)
  const assistiveHint = {
    hit: baseHint.hit || forcedAssistive,
    matched: baseHint.matched,
  }

  const totalHits =
    directHits.length + topics.length + articleLayer.length + codeLayer.length + appendixResults.length + effectiveResults.length

  return {
    query: raw,
    normalizedQuery: nq,
    expandedTerms,
    synonymCanonicals,
    directHits,
    topics,
    articles: articleLayer,
    codes: codeLayer,
    appendices: appendixResults,
    effectiveDates: effectiveResults,
    assistiveHint,
    totalHits,
  }
}
