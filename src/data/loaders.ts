// 資料載入層
// 使用 Vite import.meta.glob 於 build 階段直接打包 knowledge/regulations 的 JSON。
// 原因：不需 runtime fetch、無 base path / CORS 問題、部署平台無關，
// 且不修改、不複製原始 JSON（直接從 /regulations 讀取並 bundle）。

import type {
  Appendix,
  AppendixItem,
  Article,
  CodeMap,
  CodeTransition,
  EffectiveDateMap,
  SearchIndex,
} from './types'

// eager: true 於建置時即載入；import: 'default' 取 JSON 預設匯出。
const articleModules = import.meta.glob<Article>('/regulations/article-*.json', {
  eager: true,
  import: 'default',
})

const appendixModules = import.meta.glob<Appendix>('/regulations/appendix-*.json', {
  eager: true,
  import: 'default',
})

const searchIndexRaw = import.meta.glob<SearchIndex>('/regulations/search-index.json', {
  eager: true,
  import: 'default',
})

const codeMapRaw = import.meta.glob<CodeMap>('/regulations/code-map.json', {
  eager: true,
  import: 'default',
})

const effectiveDateMapRaw = import.meta.glob<EffectiveDateMap>(
  '/regulations/effective-date-map.json',
  { eager: true, import: 'default' },
)

const codeTransitionRaw = import.meta.glob<CodeTransition>(
  '/regulations/code-transition.json',
  { eager: true, import: 'default' },
)

function firstValue<T>(record: Record<string, T>): T {
  const values = Object.values(record)
  if (values.length === 0) {
    throw new Error('資料檔讀取失敗：找不到對應 JSON')
  }
  return values[0]
}

// ---- 條文 ----
export const articles: Article[] = Object.values(articleModules).sort(
  (a, b) => a.article - b.article,
)

const articleByNumber = new Map<number, Article>()
for (const a of articles) articleByNumber.set(a.article, a)

export function getArticle(n: number): Article | undefined {
  return articleByNumber.get(n)
}

// ---- 附表 ----
export const appendices: Appendix[] = Object.values(appendixModules).sort((a, b) =>
  a.appendix.localeCompare(b.appendix, undefined, { numeric: true }),
)

const appendixById = new Map<string, Appendix>()
for (const ap of appendices) appendixById.set(ap.appendix, ap)

export function getAppendix(id: string): Appendix | undefined {
  return appendixById.get(id)
}

// ---- 照顧組合碼項目（附表四 + 附表四之一）----
// 僅這兩份附表的 items 具備 code 欄位（AppendixItem 結構）。
function hasCode(item: unknown): item is AppendixItem {
  return typeof (item as AppendixItem)?.code === 'string'
}

export const codeItems: AppendixItem[] = appendices
  .flatMap((ap) => ap.items ?? [])
  .filter(hasCode)

const codeItemByCode = new Map<string, AppendixItem>()
for (const item of codeItems) codeItemByCode.set(item.code.toUpperCase(), item)

export function getCodeItem(code: string): AppendixItem | undefined {
  return codeItemByCode.get(code.toUpperCase())
}

// ---- 索引 / 映射 ----
export const searchIndex: SearchIndex = firstValue(searchIndexRaw)
export const codeMap: CodeMap = firstValue(codeMapRaw)
export const effectiveDateMap: EffectiveDateMap = firstValue(effectiveDateMapRaw)
export const codeTransition: CodeTransition = firstValue(codeTransitionRaw)

/** 計算附表的項目數（不同附表結構不一） */
export function countAppendixItems(ap: Appendix): number {
  if (Array.isArray(ap.items)) return ap.items.length
  if (Array.isArray(ap.indigenous_areas) || Array.isArray(ap.islands)) {
    return (ap.indigenous_areas?.length ?? 0) + (ap.islands?.length ?? 0)
  }
  return 0
}
