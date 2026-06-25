// 由本機資料庫衍生的彙整資料，供條文/生效日/修法沿革頁使用。
import {
  articles,
  codeItems,
  codeTransition,
  effectiveDateMap,
  getArticle,
} from '../data/loaders'
import type { Article, AppendixItem, CodeTransitionEntry } from '../data/types'

export interface EffectiveGroup {
  date: string
  articles: Article[]
  codes: string[]
  appendices: string[]
  /** 含註記、無法歸類者（如「CB01（111版，115年停用）」） */
  others: string[]
  total: number
}

/** 依施行日期分組（依日期排序） */
export function getEffectiveGroups(): EffectiveGroup[] {
  return Object.keys(effectiveDateMap)
    .sort()
    .map((date) => {
      const entries = effectiveDateMap[date]
      const articleList: Article[] = []
      const codes: string[] = []
      const appendixList: string[] = []
      const others: string[] = []

      for (const e of entries) {
        const am = e.match(/^article-(\d+)$/)
        if (am) {
          const a = getArticle(parseInt(am[1], 10))
          if (a) articleList.push(a)
          continue
        }
        if (e.startsWith('appendix-')) {
          appendixList.push(e)
          continue
        }
        if (/^[A-Za-z]{1,3}\d{1,3}[A-Za-z0-9]*$/.test(e)) {
          codes.push(e)
          continue
        }
        others.push(e)
      }

      return {
        date,
        articles: articleList,
        codes,
        appendices: appendixList,
        others,
        total: entries.length,
      }
    })
}

/** 判斷條文是否為修正條文（排除「無修正/未修正」） */
function isRevisedArticle(a: Article): boolean {
  return !/^(無|未)/.test(a.revision_note.trim())
}

export interface RevisionData {
  revisedArticles: Article[]
  revisedCodes: AppendixItem[]
  transitions: Array<{ code: string; entry: CodeTransitionEntry }>
}

export function getRevisionData(): RevisionData {
  return {
    revisedArticles: articles.filter(isRevisedArticle),
    revisedCodes: codeItems.filter((c) => c.revision_115),
    transitions: Object.entries(codeTransition).map(([code, entry]) => ({ code, entry })),
  }
}
