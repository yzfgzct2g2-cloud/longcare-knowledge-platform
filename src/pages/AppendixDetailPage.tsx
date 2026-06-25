import { Link, useParams } from 'react-router-dom'
import { getAppendix } from '../data/loaders'
import { appendixLabel } from '../lib/format'
import type { AppendixItem, GenericAppendixItem } from '../data/types'

function hasCode(item: unknown): item is AppendixItem {
  return typeof (item as AppendixItem)?.code === 'string'
}

/** 通用物件陣列表格（用於非碼別附表） */
function GenericTable({ rows }: { rows: GenericAppendixItem[] }) {
  if (rows.length === 0) return null
  const cols = Array.from(new Set(rows.flatMap((r) => Object.keys(r))))
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs text-slate-500">
            {cols.map((c) => (
              <th key={c} className="px-3 py-2">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-slate-100 last:border-0">
              {cols.map((c) => (
                <td key={c} className="px-3 py-2 text-slate-700">
                  {String(r[c] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function AppendixDetailPage() {
  const { id } = useParams()
  const appendix = id ? getAppendix(id) : undefined

  if (!appendix) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
        找不到附表 {id}。
        <div className="mt-2">
          <Link to="/" className="text-brand-600 hover:underline">
            返回首頁
          </Link>
        </div>
      </div>
    )
  }

  const items = appendix.items ?? []
  const codeItems = items.filter(hasCode)
  const genericItems = items.filter((i) => !hasCode(i)) as GenericAppendixItem[]

  return (
    <article>
      <div className="flex flex-wrap items-baseline gap-3">
        <h1 className="text-2xl font-bold text-brand-700">{appendixLabel(appendix.appendix)}</h1>
        <span className="text-xl font-medium text-slate-800">{appendix.title}</span>
        <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
          生效 {appendix.effective_date}
        </span>
      </div>

      {appendix.revision_note && (
        <p className="mt-2 text-sm text-slate-500">{appendix.revision_note}</p>
      )}
      {appendix.general_rule && (
        <div className="mt-3 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
          <span className="font-semibold text-slate-700">通則：</span>
          {appendix.general_rule}
        </div>
      )}

      {/* 碼別項目（附表四 / 四之一） */}
      {codeItems.length > 0 && (
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs text-slate-500">
                <th className="px-3 py-2">碼別</th>
                <th className="px-3 py-2">名稱</th>
                <th className="px-3 py-2">類別</th>
                <th className="px-3 py-2">價格上限</th>
                <th className="px-3 py-2">生效日</th>
              </tr>
            </thead>
            <tbody>
              {codeItems.map((c) => (
                <tr key={c.code} className="border-b border-slate-100 last:border-0 hover:bg-brand-50">
                  <td className="px-3 py-2 font-mono font-semibold text-brand-700">
                    <Link to={`/codes/${c.code}`} className="hover:underline">
                      {c.code}
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-slate-800">{c.name}</td>
                  <td className="px-3 py-2 text-slate-500">{c.category}</td>
                  <td className="px-3 py-2 text-slate-500">{c.price_limit}</td>
                  <td className="px-3 py-2 text-slate-500">{c.effective_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 一般項目（附表一/二/三/五） */}
      {genericItems.length > 0 && (
        <div className="mt-4">
          <GenericTable rows={genericItems} />
        </div>
      )}

      {/* 附表六：原民區/離島 */}
      {appendix.indigenous_areas && (
        <div className="mt-4">
          <h3 className="mb-2 text-sm font-semibold text-slate-500">
            原住民族地區（共 {appendix.total_indigenous_areas} 個）
          </h3>
          <GenericTable rows={appendix.indigenous_areas} />
        </div>
      )}
      {appendix.islands && (
        <div className="mt-4">
          <h3 className="mb-2 text-sm font-semibold text-slate-500">
            離島（共 {appendix.total_islands} 個）
          </h3>
          <GenericTable rows={appendix.islands} />
        </div>
      )}

      {appendix.notes && appendix.notes.length > 0 && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="mb-2 text-xs font-semibold uppercase text-slate-400">附註</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
            {appendix.notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </div>
      )}

      {appendix.source_basis && (
        <p className="mt-4 text-xs text-slate-400">依據：{appendix.source_basis}</p>
      )}
    </article>
  )
}
