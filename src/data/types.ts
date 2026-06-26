// 型別定義：對應 knowledge/regulations 的 JSON 結構（唯讀，不修改原始檔）

/** 條文 article-01.json ~ article-22.json */
export interface Article {
  article: number
  title: string
  chapter: string
  current_text: string
  explanation: string
  revision_note: string
  effective_date: string
  /** 僅 article-22 具備：分階段施行日期 */
  staged_effective_dates?: Record<string, string[]>
  keywords: string[]
  related_appendix: string[]
  effective_note: string
  source_basis: string
}

/** 附表四 / 附表四之一 的照顧組合碼項目 */
export interface AppendixItem {
  code: string
  name: string
  category: string
  group: string
  service_type: string
  payment_type: string
  price_limit: string
  minimum_years: string
  conditions: string
  specification: string
  original_text: string
  revision_115: boolean
  keywords: string[]
  search_text: string
  citation: string
  /** 僅附表四之一具備 */
  apply_target?: string
  effective_date: string
  effective_note: string
  source_basis: string
}

/** 其他附表的 item 結構各異，以寬鬆型別承接 */
export type GenericAppendixItem = Record<string, unknown>

/** 附表 appendix-01 ~ appendix-06、appendix-04-1 */
export interface Appendix {
  /** 附表編號，如 "1"、"4"、"4-1" */
  appendix: string
  title: string
  former_title?: string
  currency?: string
  unit?: string
  effective_date: string
  revision_note: string
  related_article: number[]
  general_rule?: string
  field_schema?: string[]
  keywords?: string[]
  items?: Array<AppendixItem | GenericAppendixItem>
  notes?: string[]
  effective_note?: string
  source_basis?: string
  component_effective_dates?: Record<string, string>
  // 附表六專屬欄位
  indigenous_areas?: GenericAppendixItem[]
  islands?: GenericAppendixItem[]
  total_indigenous_areas?: number
  total_islands?: number
}

/** search-index.json：關鍵字 → 文件 ID 陣列 */
export type SearchIndex = Record<string, string[]>

/** code-map.json：碼別 → 定位資訊 */
export interface CodeMapEntry {
  appendix: string
  title: string
  keywords: string[]
}
export type CodeMap = Record<string, CodeMapEntry>

/** effective-date-map.json：施行日期 → 條文/碼別字串陣列（可能含註記） */
export type EffectiveDateMap = Record<string, string[]>

/** code-transition.json：新舊碼對照 */
export interface CodeTransitionEntry {
  status: 'legacy' | 'active'
  replaced_by?: string
  replaces?: string
  note: string
  effective_date?: string
  deactivated_date?: string
  source_basis?: string
}
export type CodeTransition = Record<string, CodeTransitionEntry>

// ---- 搜尋結果型別 ----

export interface ArticleResult {
  article: number
  title: string
  chapter: string
  effective_date: string
  revisionSummary: string
}

export interface CodeResult {
  code: string
  name: string
  category: string
  payment_type: string
  price_limit: string
  minimum_years: string
  effective_date: string
  citation: string
  appendix: string
  revision_115: boolean
}

export interface AppendixResult {
  appendix: string
  title: string
  itemCount: number
}

export interface EffectiveDateResult {
  date: string
  articleCount: number
  codeCount: number
  entries: string[]
}

export interface SearchResults {
  query: string
  normalizedQuery: string
  articles: ArticleResult[]
  codes: CodeResult[]
  appendices: AppendixResult[]
  effectiveDates: EffectiveDateResult[]
}

// ---- Smart Search（V1.3.0）結果型別 ----

export type ReasonKind =
  | 'code-exact'
  | 'article-exact'
  | 'topic-exact'
  | 'synonym'
  | 'practical-map'
  | 'relation'
  | 'topic'
  | 'title'
  | 'keyword'
  | 'fulltext'
  | 'citation'
  | 'assistive'

/** 命中理由（顯示於每筆結果） */
export interface HitReason {
  kind: ReasonKind
  label: string
}

interface Scored {
  score: number
  reasons: HitReason[]
  /** 是否為直接命中（碼別／條文／實務主題之精確命中） */
  direct: boolean
}

export interface SmartArticleResult extends ArticleResult, Scored {}
export interface SmartCodeResult extends CodeResult, Scored {}
export interface SmartAppendixResult extends AppendixResult, Scored {}
export interface SmartEffectiveResult extends EffectiveDateResult, Scored {}
export interface SmartTopicResult extends Scored {
  topic: string
  summary: string
  aliases: string[]
  related_articles: number[]
  related_codes: string[]
}

export type DirectHit =
  | { type: 'article'; item: SmartArticleResult }
  | { type: 'code'; item: SmartCodeResult }
  | { type: 'topic'; item: SmartTopicResult }

export interface SmartSearchResults {
  query: string
  normalizedQuery: string
  /** 同義詞展開後的搜尋詞 */
  expandedTerms: string[]
  /** 命中的同義詞標準概念（如 外看 → 外籍看護） */
  synonymCanonicals: string[]
  directHits: DirectHit[]
  topics: SmartTopicResult[]
  articles: SmartArticleResult[]
  codes: SmartCodeResult[]
  appendices: SmartAppendixResult[]
  effectiveDates: SmartEffectiveResult[]
  assistiveHint: { hit: boolean; matched: string[] }
  totalHits: number
}
