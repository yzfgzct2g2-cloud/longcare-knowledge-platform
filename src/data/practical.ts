// 實務主題資料載入層（第二層資料庫，唯讀）
// 由 Vite import.meta.glob 於 build 階段打包 knowledge/practical 之 JSON，不修改原始檔。
// topic id 取自檔名（topic-001-外籍看護.json → topic-001），避免中文路由問題。

import { appendixLabel, articleLabel } from '../lib/format'
import { getAppendix, getArticle, getCodeItem } from './loaders'

interface RawTopic {
  topic: string
  source_type?: string
  aliases?: string[]
  summary?: string
  common_questions?: string[]
  related_articles?: (number | string)[]
  related_codes?: string[]
  related_appendices?: string[]
  related_topics?: string[]
  keywords?: string[]
  law_source_note?: string
  needs_manual_supplement?: boolean
}

export interface PracticalTopic {
  id: string
  topic: string
  source_type: string
  aliases: string[]
  summary: string
  common_questions: string[]
  related_articles: number[]
  related_codes: string[]
  related_appendices: string[]
  related_topics: string[]
  keywords: string[]
  law_source_note: string
  needs_manual_supplement: boolean
}

type SynonymMapFile = Record<string, string>

const topicModules = import.meta.glob<RawTopic>('/practical/topics/topic-*.json', {
  eager: true,
  import: 'default',
})

const synonymMapRaw = import.meta.glob<SynonymMapFile>('/practical/synonym-map.json', {
  eager: true,
  import: 'default',
})

/** 將 related_articles 內的值（數字或 "article-10"）正規化為條次數字 */
function toArticleNum(v: number | string): number | null {
  if (typeof v === 'number') return v
  const m = String(v).match(/(\d+)/)
  return m ? parseInt(m[1], 10) : null
}

/** 將附表 id（"2" / "appendix-02" / "04-1"）正規化為 getAppendix 的鍵（"2" / "4-1"） */
export function normalizeAppendixId(raw: string): string {
  const s = String(raw).replace(/^appendix-/i, '')
  return s
    .split('-')
    .map((seg, i) => (i === 0 ? String(parseInt(seg, 10)) : seg))
    .join('-')
}

export const practicalTopics: PracticalTopic[] = Object.entries(topicModules)
  .map(([path, data]) => {
    const m = path.match(/topic-(\d+)/)
    const id = m ? `topic-${m[1]}` : path
    return {
      id,
      topic: data.topic ?? '',
      source_type: data.source_type ?? '',
      aliases: data.aliases ?? [],
      summary: data.summary ?? '',
      common_questions: data.common_questions ?? [],
      related_articles: (data.related_articles ?? [])
        .map(toArticleNum)
        .filter((n): n is number => n !== null),
      related_codes: data.related_codes ?? [],
      related_appendices: data.related_appendices ?? [],
      related_topics: data.related_topics ?? [],
      keywords: data.keywords ?? [],
      law_source_note: data.law_source_note ?? '',
      needs_manual_supplement: data.needs_manual_supplement ?? false,
    }
  })
  .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }))

const topicById = new Map<string, PracticalTopic>()
const topicByName = new Map<string, PracticalTopic>()
for (const t of practicalTopics) {
  topicById.set(t.id, t)
  topicByName.set(t.topic, t)
}

export function getAllTopics(): PracticalTopic[] {
  return practicalTopics
}
export function getTopicById(id: string): PracticalTopic | undefined {
  return topicById.get(id)
}
export function getTopicByName(name: string): PracticalTopic | undefined {
  return topicByName.get(name)
}
/** 相容舊呼叫（smartSearch 使用） */
export function getTopic(name: string): PracticalTopic | undefined {
  return topicByName.get(name)
}

// ---- 關聯解析（供主題詳情頁顯示與連結） ----

export interface RelatedArticleRef {
  num: number
  label: string
  found: boolean
  title?: string
  effective_date?: string
}
export interface RelatedCodeRef {
  code: string
  found: boolean
  name?: string
  category?: string
  effective_date?: string
}
export interface RelatedAppendixRef {
  id: string
  raw: string
  label: string
  found: boolean
}
export interface RelatedTopicRef {
  name: string
  id?: string
  found: boolean
}

export function getRelatedArticles(topic: PracticalTopic): RelatedArticleRef[] {
  return topic.related_articles.map((num) => {
    const a = getArticle(num)
    return {
      num,
      label: articleLabel(num),
      found: Boolean(a),
      title: a?.title,
      effective_date: a?.effective_date,
    }
  })
}

export function getRelatedCodes(topic: PracticalTopic): RelatedCodeRef[] {
  return topic.related_codes.map((code) => {
    const item = getCodeItem(code)
    return {
      code,
      found: Boolean(item),
      name: item?.name,
      category: item?.category,
      effective_date: item?.effective_date,
    }
  })
}

export function getRelatedAppendices(topic: PracticalTopic): RelatedAppendixRef[] {
  return topic.related_appendices.map((raw) => {
    const id = normalizeAppendixId(raw)
    const ap = getAppendix(id)
    return { id, raw, label: appendixLabel(id), found: Boolean(ap) }
  })
}

export function getRelatedTopics(topic: PracticalTopic): RelatedTopicRef[] {
  return topic.related_topics.map((name) => {
    const t = getTopicByName(name)
    return { name, id: t?.id, found: Boolean(t) }
  })
}

/** synonym-map：別名（小寫）→ 標準主題名稱（濾除 _note 等註記鍵） */
export const synonymMap: Record<string, string> = (() => {
  const out: Record<string, string> = {}
  const file = Object.values(synonymMapRaw)[0] ?? {}
  for (const [k, v] of Object.entries(file)) {
    if (k.startsWith('_')) continue
    if (typeof v === 'string') out[k.toLowerCase()] = v
  }
  return out
})()
