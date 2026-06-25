import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { searchAll } from '../lib/search'
import { matchAssistiveHint } from '../lib/assistiveSearch'
import { articleLabel, appendixLabel } from '../lib/format'

function SectionHeading({ title, count }: { title: string; count: number }) {
  return (
    <div className="mb-3 flex items-center gap-2 border-b border-slate-200 pb-2">
      <h2 className="text-base font-semibold text-slate-800">{title}</h2>
      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{count}</span>
    </div>
  )
}

export default function SearchPage() {
  const [params] = useSearchParams()
  const q = params.get('q') ?? ''
  const results = useMemo(() => searchAll(q), [q])
  // 跨制度提示：僅判斷是否「可能涉及」身障／醫療輔具，不在主結果顯示其完整資料。
  const assistiveHint = useMemo(() => matchAssistiveHint(q), [q])

  const totalHits =
    results.articles.length +
    results.codes.length +
    results.appendices.length +
    results.effectiveDates.length

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm text-slate-500">
          搜尋：<span className="font-medium text-slate-800">{q}</span>
          {results.normalizedQuery !== q && (
            <span className="ml-2 text-xs text-slate-400">（正規化：{results.normalizedQuery}）</span>
          )}
        </p>
        <p className="text-xs text-slate-400">共 {totalHits} 筆結果</p>
      </div>

      {totalHits === 0 && (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
          找不到符合「{q}」的結果。
          <div className="mt-2 text-sm text-slate-400">
            可嘗試：關鍵字（外籍看護）、碼別（BA09a、FA08、EI01）、條次（第十條）、生效日（115-07-01）。
          </div>
        </div>
      )}

      <div className="space-y-8">
        {/* 條文結果 */}
        {results.articles.length > 0 && (
          <section>
            <SectionHeading title="條文結果" count={results.articles.length} />
            <div className="space-y-2">
              {results.articles.map((a) => (
                <Link
                  key={a.article}
                  to={`/articles/${a.article}`}
                  className="block rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-brand-400 hover:bg-brand-50"
                >
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-semibold text-brand-700">{articleLabel(a.article)}</span>
                    <span className="font-medium text-slate-800">{a.title}</span>
                    <span className="text-xs text-slate-400">{a.chapter}</span>
                    <span className="ml-auto rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                      生效 {a.effective_date}
                    </span>
                  </div>
                  {a.revisionSummary && (
                    <p className="mt-1 text-sm text-slate-500">修正：{a.revisionSummary}</p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 照顧組合碼結果 */}
        {results.codes.length > 0 && (
          <section>
            <SectionHeading title="照顧組合碼結果" count={results.codes.length} />
            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs text-slate-500">
                    <th className="px-3 py-2">碼別</th>
                    <th className="px-3 py-2">名稱</th>
                    <th className="px-3 py-2">類別</th>
                    <th className="px-3 py-2">給付方式</th>
                    <th className="px-3 py-2">價格上限</th>
                    <th className="px-3 py-2">最低年限</th>
                    <th className="px-3 py-2">生效日</th>
                    <th className="px-3 py-2">引用</th>
                  </tr>
                </thead>
                <tbody>
                  {results.codes.map((c) => (
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
                      <td className="px-3 py-2 text-slate-500">{c.minimum_years}</td>
                      <td className="px-3 py-2 text-slate-500">{c.effective_date}</td>
                      <td className="px-3 py-2 text-slate-400">{c.citation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* 附表結果 */}
        {results.appendices.length > 0 && (
          <section>
            <SectionHeading title="附表結果" count={results.appendices.length} />
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {results.appendices.map((ap) => (
                <Link
                  key={ap.appendix}
                  to={`/appendices/${ap.appendix}`}
                  className="rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-brand-400 hover:bg-brand-50"
                >
                  <div className="font-semibold text-brand-700">{appendixLabel(ap.appendix)}</div>
                  <div className="text-sm text-slate-800">{ap.title}</div>
                  <div className="mt-1 text-xs text-slate-400">相關項目 {ap.itemCount} 項</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 生效日結果 */}
        {results.effectiveDates.length > 0 && (
          <section>
            <SectionHeading title="生效日結果" count={results.effectiveDates.length} />
            <div className="space-y-2">
              {results.effectiveDates.map((e) => (
                <Link
                  key={e.date}
                  to={`/effective?date=${e.date}`}
                  className="block rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-brand-400 hover:bg-brand-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-brand-700">{e.date}</span>
                    <span className="text-sm text-slate-500">條文 {e.articleCount} 條</span>
                    <span className="text-sm text-slate-500">碼別 {e.codeCount} 個</span>
                    <span className="ml-auto text-xs text-brand-600">點擊展開清單 →</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* 跨制度提示卡片（最低優先序，與長照主結果分離；不顯示身障／醫療輔具完整資料） */}
      {assistiveHint.hit && (
        <aside className="mt-8 rounded-lg border border-indigo-200 bg-indigo-50 p-4">
          <div className="flex items-center gap-2">
            <span className="rounded bg-indigo-600 px-2 py-0.5 text-xs font-medium text-white">
              跨制度
            </span>
            <h2 className="text-sm font-semibold text-indigo-900">可能相關：身障／醫療輔具資料</h2>
          </div>
          <p className="mt-2 text-sm text-indigo-800">
            此查詢可能涉及身心障礙者輔具費用補助或醫療復健／醫療輔具補助資料。為避免與長照法規結果混淆，請至獨立頁面查看完整清單。
          </p>
          <Link
            to={`/assistive-devices?query=${encodeURIComponent(q)}`}
            className="mt-3 inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            查看身障／醫療輔具 →
          </Link>
        </aside>
      )}
    </div>
  )
}
