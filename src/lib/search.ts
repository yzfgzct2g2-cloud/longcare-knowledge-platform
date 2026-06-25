// 核心搜尋：僅針對本機 JSON 資料庫，無任何外部 API 呼叫。
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
import type {
  AppendixResult,
  ArticleResult,
  CodeResult,
  EffectiveDateResult,
  SearchResults,
} from '../data/types'
import {
  isCodeLike,
  normalizeQuery,
  parseArticleNumber,
  parseEffectiveDate,
} from './normalize'

/** docId（如 appendix-04 / appendix-04-1）轉附表編號（4 / 4-1） */
function docIdToAppendixId(docId: string): string {
  const rest = docId.slice('appendix-'.length)
  return rest
    .split('-')
    .map((seg) => String(parseInt(seg, 10)))
    .join('-')
}

/** 從 effective-date-map 的條目字串取出開頭的碼別 token（如 "CB01（...）" → CB01） */
function leadingCodeToken(entry: string): string | null {
  const m = entry.match(/^([A-Za-z]{1,3}\d{1,3}[A-Za-z0-9]*)/)
  return m ? m[1] : null
}

function summarize(text: string, max = 80): string {
  if (!text) return ''
  const t = text.replace(/\s+/g, ' ').trim()
  return t.length > max ? t.slice(0, max) + '…' : t
}

export function searchAll(rawQuery: string): SearchResults {
  const normalizedQuery = normalizeQuery(rawQuery)
  const empty: SearchResults = {
    query: rawQuery,
    normalizedQuery,
    articles: [],
    codes: [],
    appendices: [],
    effectiveDates: [],
  }
  if (!normalizedQuery) return empty

  const lower = normalizedQuery.toLowerCase()

  // ---------- 條文 ----------
  const articleNums = new Set<number>()

  const directArticle = parseArticleNumber(rawQuery)
  if (directArticle) articleNums.add(directArticle)

  // search-index 關鍵字比對
  for (const [keyword, docIds] of Object.entries(searchIndex)) {
    const k = keyword.toLowerCase()
    if (k.includes(lower) || lower.includes(k)) {
      for (const id of docIds) {
        const m = id.match(/^article-(\d+)$/)
        if (m) articleNums.add(parseInt(m[1], 10))
      }
    }
  }

  // 條文全文掃描
  for (const a of articles) {
    const hay = [
      a.title,
      a.current_text,
      a.explanation,
      a.revision_note,
      a.keywords.join(' '),
    ]
      .join(' ')
      .toLowerCase()
    if (hay.includes(lower)) articleNums.add(a.article)
  }

  const articleResults: ArticleResult[] = [...articleNums]
    .map((n) => getArticle(n))
    .filter((a): a is NonNullable<typeof a> => Boolean(a))
    .sort((a, b) => a.article - b.article)
    .map((a) => ({
      article: a.article,
      title: a.title,
      chapter: a.chapter,
      effective_date: a.effective_date,
      revisionSummary: summarize(a.revision_note),
    }))

  // ---------- 照顧組合碼 ----------
  const matchedCodes = new Set<string>()
  const upper = normalizedQuery.toUpperCase()
  const codeLike = isCodeLike(normalizedQuery)

  // 碼別樣式：精確 + 前綴/包含（如 EI → EI01~EI05）
  if (codeLike) {
    for (const code of Object.keys(codeMap)) {
      if (code.toUpperCase().includes(upper)) matchedCodes.add(code.toUpperCase())
    }
  }

  // code-map 標題/關鍵字比對
  for (const [code, entry] of Object.entries(codeMap)) {
    const hay = [code, entry.title, entry.keywords.join(' ')].join(' ').toLowerCase()
    if (hay.includes(lower)) matchedCodes.add(code.toUpperCase())
  }

  // 附表四 item 全文（search_text）掃描
  for (const item of codeItems) {
    if (item.search_text.toLowerCase().includes(lower)) {
      matchedCodes.add(item.code.toUpperCase())
    }
  }

  const codeResults: CodeResult[] = [...matchedCodes]
    .map((code) => {
      const item = getCodeItem(code)
      if (!item) return null
      const appendixId = codeMap[item.code]?.appendix ?? ''
      return {
        code: item.code,
        name: item.name,
        category: item.category,
        payment_type: item.payment_type,
        price_limit: item.price_limit,
        minimum_years: item.minimum_years,
        effective_date: item.effective_date,
        citation: item.citation,
        appendix: appendixId,
        revision_115: item.revision_115,
      } satisfies CodeResult
    })
    .filter((c): c is CodeResult => c !== null)
    .sort((a, b) => {
      // 與查詢完全相符的碼排最前
      const ax = a.code.toUpperCase() === upper ? 0 : 1
      const bx = b.code.toUpperCase() === upper ? 0 : 1
      if (ax !== bx) return ax - bx
      return a.code.localeCompare(b.code, undefined, { numeric: true })
    })

  // ---------- 附表 ----------
  const matchedAppendix = new Set<string>()

  for (const [keyword, docIds] of Object.entries(searchIndex)) {
    const k = keyword.toLowerCase()
    if (k.includes(lower) || lower.includes(k)) {
      for (const id of docIds) {
        if (id.startsWith('appendix-')) matchedAppendix.add(docIdToAppendixId(id))
      }
    }
  }

  for (const ap of appendices) {
    const hay = [ap.title, ap.former_title ?? '', ap.revision_note, (ap.keywords ?? []).join(' ')]
      .join(' ')
      .toLowerCase()
    if (hay.includes(lower)) matchedAppendix.add(ap.appendix)
  }

  // 命中碼別所屬之附表四 / 附表四之一 亦納入
  for (const c of codeResults) {
    if (c.appendix) matchedAppendix.add(c.appendix)
  }

  const appendixResults: AppendixResult[] = [...matchedAppendix]
    .map((id) => getAppendix(id))
    .filter((ap): ap is NonNullable<typeof ap> => Boolean(ap))
    .sort((a, b) => a.appendix.localeCompare(b.appendix, undefined, { numeric: true }))
    .map((ap) => ({
      appendix: ap.appendix,
      title: ap.title,
      itemCount: countAppendixItems(ap),
    }))

  // ---------- 生效日 ----------
  const matchedDates = new Set<string>()
  const dateQuery = parseEffectiveDate(rawQuery)
  if (dateQuery && effectiveDateMap[dateQuery]) matchedDates.add(dateQuery)

  const effectiveResults: EffectiveDateResult[] = [...matchedDates]
    .sort()
    .map((date) => {
      const entries = effectiveDateMap[date]
      const articleCount = entries.filter((e) => /^article-\d+/.test(e)).length
      const codeCount = entries.filter(
        (e) => !e.startsWith('article-') && !e.startsWith('appendix-') && leadingCodeToken(e),
      ).length
      return { date, articleCount, codeCount, entries }
    })

  return {
    query: rawQuery,
    normalizedQuery,
    articles: articleResults,
    codes: codeResults,
    appendices: appendixResults,
    effectiveDates: effectiveResults,
  }
}
