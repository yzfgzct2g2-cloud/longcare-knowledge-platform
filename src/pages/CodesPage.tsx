import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { codeItems } from '../data/loaders'
import { normalizeQuery } from '../lib/normalize'

export default function CodesPage() {
  const [filter, setFilter] = useState('')
  const [group, setGroup] = useState('全部')

  const groups = useMemo(() => {
    const set = new Set(codeItems.map((c) => c.group))
    return ['全部', ...[...set].sort()]
  }, [])

  const filtered = useMemo(() => {
    const q = normalizeQuery(filter).toLowerCase()
    return codeItems.filter((c) => {
      if (group !== '全部' && c.group !== group) return false
      if (!q) return true
      return c.search_text.toLowerCase().includes(q)
    })
  }, [filter, group])

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-slate-800">碼別查詢</h1>

      <div className="mb-4 flex flex-wrap gap-3">
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="篩選碼別、名稱、關鍵字…"
          className="w-64 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
        />
        <select
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500"
        >
          {groups.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <span className="self-center text-xs text-slate-400">{filtered.length} 個碼別</span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs text-slate-500">
              <th className="px-3 py-2">碼別</th>
              <th className="px-3 py-2">名稱</th>
              <th className="px-3 py-2">類別</th>
              <th className="px-3 py-2">給付方式</th>
              <th className="px-3 py-2">價格上限</th>
              <th className="px-3 py-2">生效日</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.code} className="border-b border-slate-100 last:border-0 hover:bg-brand-50">
                <td className="px-3 py-2 font-mono font-semibold text-brand-700">
                  <Link to={`/codes/${c.code}`} className="hover:underline">
                    {c.code}
                    {c.revision_115 && (
                      <span className="ml-1 rounded bg-amber-100 px-1 text-[10px] text-amber-700">
                        115修
                      </span>
                    )}
                  </Link>
                </td>
                <td className="px-3 py-2 text-slate-800">{c.name}</td>
                <td className="px-3 py-2 text-slate-500">{c.category}</td>
                <td className="px-3 py-2 text-slate-500">{c.payment_type}</td>
                <td className="px-3 py-2 text-slate-500">{c.price_limit}</td>
                <td className="px-3 py-2 text-slate-500">{c.effective_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
