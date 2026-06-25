import { useSearchParams, Link } from 'react-router-dom'
import { getEffectiveGroups } from '../lib/derived'
import { articleLabel, appendixLabel } from '../lib/format'
import { getCodeItem } from '../data/loaders'

export default function EffectivePage() {
  const [params, setParams] = useSearchParams()
  const activeDate = params.get('date')
  const groups = getEffectiveGroups()

  return (
    <div>
      <h1 className="mb-1 text-xl font-bold text-slate-800">生效日查詢</h1>
      <p className="mb-4 text-sm text-slate-500">依施行日期檢視條文與照顧組合碼的生效時間軸。</p>

      <div className="space-y-3">
        {groups.map((g) => {
          const open = activeDate ? activeDate === g.date : true
          return (
            <section key={g.date} className="rounded-lg border border-slate-200 bg-white">
              <button
                onClick={() => setParams(open && activeDate === g.date ? {} : { date: g.date })}
                className="flex w-full items-center gap-3 px-4 py-3 text-left"
              >
                <span className="text-lg font-bold text-brand-700">{g.date}</span>
                <span className="text-sm text-slate-500">條文 {g.articles.length} 條</span>
                <span className="text-sm text-slate-500">碼別 {g.codes.length} 個</span>
                {g.appendices.length > 0 && (
                  <span className="text-sm text-slate-500">附表 {g.appendices.length}</span>
                )}
                <span className="ml-auto text-xs text-brand-600">{open ? '收合 ▲' : '展開 ▼'}</span>
              </button>

              {open && (
                <div className="space-y-4 border-t border-slate-100 px-4 py-4">
                  {g.articles.length > 0 && (
                    <div>
                      <h3 className="mb-2 text-xs font-semibold uppercase text-slate-400">條文</h3>
                      <div className="flex flex-wrap gap-2">
                        {g.articles.map((a) => (
                          <Link
                            key={a.article}
                            to={`/articles/${a.article}`}
                            className="rounded border border-slate-300 px-2 py-1 text-xs text-brand-700 hover:bg-brand-50"
                          >
                            {articleLabel(a.article)} {a.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {g.codes.length > 0 && (
                    <div>
                      <h3 className="mb-2 text-xs font-semibold uppercase text-slate-400">
                        照顧組合碼
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {g.codes.map((code) => {
                          const exists = getCodeItem(code)
                          return exists ? (
                            <Link
                              key={code}
                              to={`/codes/${code}`}
                              className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs text-brand-700 hover:bg-brand-100"
                            >
                              {code}
                            </Link>
                          ) : (
                            <span
                              key={code}
                              className="rounded bg-slate-50 px-2 py-0.5 font-mono text-xs text-slate-400"
                            >
                              {code}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {g.appendices.length > 0 && (
                    <div>
                      <h3 className="mb-2 text-xs font-semibold uppercase text-slate-400">附表</h3>
                      <div className="flex flex-wrap gap-2">
                        {g.appendices.map((id) => {
                          const apId = id
                            .replace(/^appendix-/, '')
                            .split('-')
                            .map((s) => String(parseInt(s, 10)))
                            .join('-')
                          return (
                            <Link
                              key={id}
                              to={`/appendices/${apId}`}
                              className="rounded border border-slate-300 px-2 py-1 text-xs text-brand-700 hover:bg-brand-50"
                            >
                              {appendixLabel(apId)}
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {g.others.length > 0 && (
                    <div>
                      <h3 className="mb-2 text-xs font-semibold uppercase text-slate-400">其他備註</h3>
                      <ul className="list-disc pl-5 text-xs text-slate-500">
                        {g.others.map((o) => (
                          <li key={o}>{o}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
