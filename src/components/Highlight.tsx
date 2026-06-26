// 搜尋命中高亮：將文字中符合搜尋詞的片段以 <mark> 標示。
import { Fragment } from 'react'

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export default function Highlight({ text, terms }: { text: string; terms: string[] }) {
  if (!text) return null
  const uniq = Array.from(new Set(terms.filter((t) => t && t.length >= 2))).sort(
    (a, b) => b.length - a.length,
  )
  if (uniq.length === 0) return <>{text}</>

  const re = new RegExp(`(${uniq.map(escapeRegExp).join('|')})`, 'gi')
  const parts = text.split(re)
  const lowerSet = new Set(uniq.map((u) => u.toLowerCase()))
  return (
    <>
      {parts.map((part, i) =>
        lowerSet.has(part.toLowerCase()) ? (
          <mark key={i} className="rounded bg-yellow-200 px-0.5 text-slate-900">
            {part}
          </mark>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  )
}
