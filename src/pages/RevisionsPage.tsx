import { Link } from 'react-router-dom'
import { getRevisionData } from '../lib/derived'
import { articleLabel } from '../lib/format'

export default function RevisionsPage() {
  const { revisedArticles, revisedCodes, transitions } = getRevisionData()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-1 text-xl font-bold text-slate-800">修法沿革</h1>
        <p className="text-sm text-slate-500">115/07/01 版相對於 111 版的修正條文、新增/調整碼別與新舊碼對照。</p>
      </div>

      {/* 新舊碼對照 */}
      <section>
        <h2 className="mb-3 border-b border-slate-200 pb-2 text-base font-semibold text-slate-800">
          新舊碼別對照（{transitions.length}）
        </h2>
        <div className="space-y-2">
          {transitions.map(({ code, entry }) => (
            <div
              key={code}
              className="rounded-lg border border-slate-200 bg-white p-3 text-sm"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold text-brand-700">{code}</span>
                <span
                  className={`rounded px-2 py-0.5 text-xs ${
                    entry.status === 'legacy'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {entry.status === 'legacy' ? '已停用' : '現行'}
                </span>
                {entry.replaced_by && (
                  <span className="text-xs text-slate-500">→ 由 {entry.replaced_by} 取代</span>
                )}
                {entry.replaces && (
                  <span className="text-xs text-slate-500">← 取代 {entry.replaces}</span>
                )}
              </div>
              <p className="mt-1 text-xs text-slate-500">{entry.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 修正條文 */}
      <section>
        <h2 className="mb-3 border-b border-slate-200 pb-2 text-base font-semibold text-slate-800">
          修正條文（{revisedArticles.length}）
        </h2>
        <div className="space-y-2">
          {revisedArticles.map((a) => (
            <Link
              key={a.article}
              to={`/articles/${a.article}`}
              className="block rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-brand-400 hover:bg-brand-50"
            >
              <div className="flex flex-wrap items-center gap-x-3">
                <span className="font-semibold text-brand-700">{articleLabel(a.article)}</span>
                <span className="font-medium text-slate-800">{a.title}</span>
                <span className="ml-auto rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                  生效 {a.effective_date}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">{a.revision_note}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 115 新增/修正碼別 */}
      <section>
        <h2 className="mb-3 border-b border-slate-200 pb-2 text-base font-semibold text-slate-800">
          115 修正／新增碼別（{revisedCodes.length}）
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {revisedCodes.map((c) => (
            <Link
              key={c.code}
              to={`/codes/${c.code}`}
              className="rounded bg-amber-50 px-2 py-1 font-mono text-xs text-amber-800 hover:bg-amber-100"
              title={c.name}
            >
              {c.code}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
