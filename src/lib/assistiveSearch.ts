// 身障／醫療輔具搜尋工具。
// 僅針對 knowledge/assistive-devices 本機 JSON，無任何外部 API。
// 重要：本模組的結果不得混入 /search 主結果；/search 只用 matchAssistiveHint() 判斷是否顯示提示卡片。

import {
  assistiveDevices,
  assistiveIndex,
  assistiveItemLinks,
  type AssistiveDevice,
  type AssistiveItemLink,
  type AssistiveSystem,
} from '../data/assistive'
import { normalizeQuery } from './normalize'
import { assistiveHintKeywords } from '../data/smartSearchRules'

/**
 * UI 提示用後備關鍵字（assistiveFallbackKeywords）。
 *
 * ⚠️ 這是「UI hint fallback」，不是法規資料。
 * 用途：即使 assistive-search-index.json 尚未收錄某些常見輔具名稱，
 * 主搜尋仍能在使用者輸入這些字時顯示「可能相關：身障／醫療輔具」提示卡片。
 * 本清單不影響任何法規資料、不寫入任何 JSON、不參與補助金額或年限判斷。
 *
 * V1.3.0：統一以 smartSearchRules.assistiveHintKeywords 為單一來源。
 */
export const assistiveFallbackKeywords: readonly string[] = assistiveHintKeywords

function twoWayMatch(a: string, b: string): boolean {
  if (!a || !b) return false
  return a.includes(b) || b.includes(a)
}

/**
 * 判斷查詢是否「可能涉及身障／醫療輔具」，供 /search 顯示提示卡片。
 * 比對來源：assistive-search-index.json（canonical + aliases）與 assistiveFallbackKeywords。
 * 不回傳完整輔具資料，只回傳是否命中與部分命中名稱（供卡片文案參考）。
 */
export function matchAssistiveHint(rawQuery: string): { hit: boolean; matched: string[] } {
  const q = normalizeQuery(rawQuery).toLowerCase()
  if (q.length < 2) return { hit: false, matched: [] }

  const matched = new Set<string>()

  // 1) 法規索引（assistive-search-index.json）
  for (const item of assistiveIndex) {
    if (twoWayMatch(item.canonical.toLowerCase(), q)) matched.add(item.canonical)
    for (const alias of item.aliases) {
      if (twoWayMatch(alias.toLowerCase(), q)) {
        matched.add(item.canonical)
        break
      }
    }
  }

  // 2) UI hint fallback 關鍵字（非法規資料）
  for (const kw of assistiveFallbackKeywords) {
    if (twoWayMatch(kw.toLowerCase(), q)) matched.add(kw)
  }

  return { hit: matched.size > 0, matched: [...matched] }
}

export interface AssistiveFilters {
  system?: AssistiveSystem | 'all'
  category?: string | 'all'
}

/**
 * /assistive-devices 頁面搜尋。
 * query 比對 device 欄位 + assistive-search-index 別名；filters 套用制度／分類。
 */
export function searchAssistive(
  rawQuery: string,
  filters: AssistiveFilters = {},
): AssistiveDevice[] {
  const q = normalizeQuery(rawQuery).toLowerCase()
  const system = filters.system ?? 'all'
  const category = filters.category ?? 'all'

  // 透過 search-index 別名 → ids
  const aliasIds = new Set<string>()
  if (q) {
    for (const item of assistiveIndex) {
      const hit =
        twoWayMatch(item.canonical.toLowerCase(), q) ||
        item.aliases.some((a) => twoWayMatch(a.toLowerCase(), q))
      if (hit) item.ids.forEach((id) => aliasIds.add(id))
    }
  }

  const results = assistiveDevices.filter((d) => {
    if (system !== 'all' && d.system !== system) return false
    if (category !== 'all' && d.category !== category) return false
    if (!q) return true

    if (aliasIds.has(d.id)) return true
    const hay = [
      d.name,
      d.category,
      d.subcategory,
      d.keywords.join(' '),
      d.original_text,
      d.subsidy_amount,
      d.citation,
    ]
      .join(' ')
      .toLowerCase()
    return hay.includes(q)
  })

  return results.sort((a, b) => {
    // 名稱完全相符優先
    const ax = a.name.toLowerCase() === q ? 0 : 1
    const bx = b.name.toLowerCase() === q ? 0 : 1
    if (ax !== bx) return ax - bx
    return a.id.localeCompare(b.id, undefined, { numeric: true })
  })
}

/** 取得某輔具相關的跨制度品項對照（item-level） */
export function crossRefsForDevice(device: AssistiveDevice): AssistiveItemLink[] {
  return assistiveItemLinks.filter(
    (link) =>
      link.item_name === device.name ||
      link.disability_related.includes(device.id) ||
      link.medical_related.includes(device.id) ||
      twoWayMatch(link.item_name, device.name),
  )
}
