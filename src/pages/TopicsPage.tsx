import { useMemo, useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getAllTopics, type PracticalTopic } from '../data/practical'
import { normalizeQuery } from '../lib/normalize'

function matches(t: PracticalTopic, q: string): boolean {
  if (!q) return true
  const hay = [
    t.topic,
    t.aliases.join(' '),
    t.keywords.join(' '),
    t.common_questions.join(' '),
    t.summary,
  ]
    .join(' ')
    .toLowerCase()
  return hay.includes(q)
}

export default function TopicsPage() {
  const all = getAllTopics()
  const [params, setParams] = useSearchParams()
  const initialQ = params.get('q') ?? ''
  const [q, setQ] = useState(initialQ)

  useEffect(() => {
    setQ(initialQ)
  }, [initialQ])

  const nq = normalizeQuery(q).toLowerCase()
  const results = useMemo(() => all.filter((t) => matches(t, nq)), [all, nq])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const next = new URLSearchParams(params)
    if (q) next.set('q', q)
    else next.delete('q')
    setParams(next, { replace: true })
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-slate-800">實務主題</h1>
        <p className="mt-1 text-sm text-slate-500">
          以實務角度整理之長照主題，連結對應條文、照顧組合碼與附表。內容依現有法規資料庫產生，非照護建議。
        </p>
      </div>

      <form onSubmit={submit} className="mb-5">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜尋主題、別名、關鍵字或常見問題，例如：外看、洗澡、交通"
          className="w-full max-w-xl rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
        />
      </form>

      <p className="mb-3 text-xs text-slate-400">共 {results.length} 個主題</p>

      {results.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
          找不到符合的主題。
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((t) => (
            <div key={t.id} className="flex flex-col rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-baseline gap-2">
                <h2 className="font-semibold text-teal-700">{t.topic}</h2>
                <span className="text-xs text-slate-300">{t.id}</span>
              </div>
              <p className="mt-1 flex-1 text-sm leading-relaxed text-slate-600">
                {t.summary.slice(0, 100)}
                {t.summary.length > 100 && '…'}
              </p>
              {t.aliases.length > 0 && (
                <p className="mt-2 text-xs text-slate-400">別名：{t.aliases.slice(0, 6).join('、')}</p>
              )}
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                <span>常見問題 {t.common_questions.length}</span>
                <span>相關條文 {t.related_articles.length}</span>
                <span>相關碼別 {t.related_codes.length}</span>
              </div>
              <Link
                to={`/topics/${t.id}`}
                className="mt-3 inline-block rounded-md bg-teal-600 px-3 py-1.5 text-center text-sm font-medium text-white transition-colors hover:bg-teal-700"
              >
                查看詳情
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
