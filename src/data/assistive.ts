// 身障／醫療輔具資料載入層（第三層資料庫）
// 與長照主資料庫分離：本檔僅供 /assistive-devices 頁面與主搜尋的「提示卡片」判斷使用，
// 不混入 /search 主結果。資料於 build 階段由 Vite import.meta.glob 直接打包，
// 唯讀、不修改、不複製 knowledge/assistive-devices/*.json 原始檔。

export type AssistiveSystem = 'disability' | 'medical' | 'longcare'

/** assistive-device-database.json 內單筆項目 */
export interface AssistiveDevice {
  id: string
  name: string
  system: AssistiveSystem
  category: string
  subcategory: string
  subsidy_amount: string
  renewal_years: string
  need_assessment: boolean
  assessment_required: string[]
  required_documents: string[]
  applicable_conditions: string[]
  effective_date: string
  source_law: string
  citation: string
  original_text: string
  keywords: string[]
  manual_review?: boolean
  review_reason?: string
  level?: string
}

/** assistive-search-index.json items 內單筆 */
export interface AssistiveIndexItem {
  canonical: string
  system: AssistiveSystem
  category: string
  aliases: string[]
  ids: string[]
}
interface AssistiveSearchIndexFile {
  _note?: string
  items: AssistiveIndexItem[]
}

/** assistive-category-map.json categories 內單筆 */
export interface AssistiveCategory {
  system: AssistiveSystem
  category: string
  subcategory: string
  item_no_range: string
  representative_devices: string[]
  source: string
}
interface AssistiveCategoryFile {
  _note?: string
  source_laws?: unknown
  categories: AssistiveCategory[]
}

/** assistive-cross-reference.json 連結 */
export interface AssistiveSystemLink {
  relationship: string
  basis: string
  disability_related: string[]
  medical_related: string[]
  longcare_related: string[]
  manual_review?: boolean
}
export interface AssistiveItemLink {
  item_name: string
  disability_related: string[]
  medical_related: string[]
  longcare_related: string[]
  basis: string
  manual_review?: boolean
}
interface AssistiveCrossRefFile {
  _note?: string
  system_level_links: AssistiveSystemLink[]
  item_level_links: AssistiveItemLink[]
}

function first<T>(record: Record<string, T>): T {
  const values = Object.values(record)
  if (values.length === 0) throw new Error('輔具資料檔讀取失敗：找不到對應 JSON')
  return values[0]
}

const dbRaw = import.meta.glob<AssistiveDevice[]>(
  '/assistive-devices/assistive-device-database.json',
  { eager: true, import: 'default' },
)
const indexRaw = import.meta.glob<AssistiveSearchIndexFile>(
  '/assistive-devices/assistive-search-index.json',
  { eager: true, import: 'default' },
)
const categoryRaw = import.meta.glob<AssistiveCategoryFile>(
  '/assistive-devices/assistive-category-map.json',
  { eager: true, import: 'default' },
)
const crossRefRaw = import.meta.glob<AssistiveCrossRefFile>(
  '/assistive-devices/assistive-cross-reference.json',
  { eager: true, import: 'default' },
)

export const assistiveDevices: AssistiveDevice[] = first(dbRaw)
export const assistiveIndex: AssistiveIndexItem[] = first(indexRaw).items ?? []
export const assistiveCategories: AssistiveCategory[] = first(categoryRaw).categories ?? []

const crossRef = first(crossRefRaw)
export const assistiveSystemLinks: AssistiveSystemLink[] = crossRef.system_level_links ?? []
export const assistiveItemLinks: AssistiveItemLink[] = crossRef.item_level_links ?? []

const deviceById = new Map<string, AssistiveDevice>()
for (const d of assistiveDevices) deviceById.set(d.id, d)
export function getAssistiveDevice(id: string): AssistiveDevice | undefined {
  return deviceById.get(id)
}

/** 制度顯示名稱 */
export function systemLabel(system: AssistiveSystem | string): string {
  switch (system) {
    case 'disability':
      return '身障輔具'
    case 'medical':
      return '醫療輔具'
    case 'longcare':
      return '長照輔具'
    default:
      return system
  }
}

/** 資料中實際存在的制度（用於決定篩選器是否顯示 longcare） */
export const presentSystems: AssistiveSystem[] = Array.from(
  new Set(assistiveDevices.map((d) => d.system)),
) as AssistiveSystem[]

/** 資料中實際存在的分類（依制度） */
export function categoriesForSystem(system: AssistiveSystem | 'all'): string[] {
  const set = new Set<string>()
  for (const d of assistiveDevices) {
    if (system === 'all' || d.system === system) {
      if (d.category) set.add(d.category)
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'zh-Hant'))
}
