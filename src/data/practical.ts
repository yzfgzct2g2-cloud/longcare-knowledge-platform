// 實務主題資料載入層（第二層資料庫，唯讀）
// 由 Vite import.meta.glob 於 build 階段打包 knowledge/practical 之 JSON，不修改原始檔。

export interface PracticalTopic {
  topic: string
  source_type?: string
  aliases: string[]
  summary: string
  common_questions: string[]
  related_articles: number[]
  related_codes: string[]
  related_appendices: string[]
  related_topics: string[]
  keywords: string[]
  law_source_note?: string
  needs_manual_supplement?: boolean
}

/** synonym-map.json：別名 → 標準主題名稱（含 _note 鍵，需濾除） */
type SynonymMapFile = Record<string, string>

const topicModules = import.meta.glob<PracticalTopic>('/practical/topics/topic-*.json', {
  eager: true,
  import: 'default',
})

const synonymMapRaw = import.meta.glob<SynonymMapFile>('/practical/synonym-map.json', {
  eager: true,
  import: 'default',
})

export const practicalTopics: PracticalTopic[] = Object.values(topicModules).sort((a, b) =>
  a.topic.localeCompare(b.topic, 'zh-Hant'),
)

const topicByName = new Map<string, PracticalTopic>()
for (const t of practicalTopics) topicByName.set(t.topic, t)

export function getTopic(name: string): PracticalTopic | undefined {
  return topicByName.get(name)
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
