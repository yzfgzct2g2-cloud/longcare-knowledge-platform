import { Link, useParams } from 'react-router-dom'
import { getArticle } from '../data/loaders'
import { articleLabel, appendixLabel } from '../lib/format'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  if (!children) return null
  return (
    <div className="border-t border-slate-100 py-3">
      <dt className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="text-sm text-slate-700">{children}</dd>
    </div>
  )
}

export default function ArticleDetailPage() {
  const { n } = useParams()
  const num = Number(n)
  const article = Number.isFinite(num) ? getArticle(num) : undefined

  if (!article) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
        找不到條文 {n}。
        <div className="mt-2">
          <Link to="/articles" className="text-brand-600 hover:underline">
            返回條文列表
          </Link>
        </div>
      </div>
    )
  }

  return (
    <article className="mx-auto max-w-3xl">
      <Link to="/articles" className="text-sm text-brand-600 hover:underline">
        ← 條文列表
      </Link>
      <div className="mt-3 flex flex-wrap items-baseline gap-3">
        <h1 className="text-2xl font-bold text-brand-700">{articleLabel(article.article)}</h1>
        <span className="text-xl font-medium text-slate-800">{article.title}</span>
      </div>
      <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-400">
        <span>{article.chapter}</span>
        <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-500">
          生效 {article.effective_date}
        </span>
      </div>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="mb-2 text-sm font-semibold text-slate-500">現行條文</h2>
        <p className="regulation-text text-[15px] text-slate-800">{article.current_text}</p>
      </section>

      <dl className="mt-4 rounded-lg border border-slate-200 bg-white px-5">
        <Field label="逐條說明">
          <p className="regulation-text">{article.explanation}</p>
        </Field>
        <Field label="修正註記">{article.revision_note}</Field>
        {article.staged_effective_dates && (
          <Field label="分階段施行日期">
            <ul className="space-y-2">
              {Object.entries(article.staged_effective_dates).map(([date, items]) => (
                <li key={date}>
                  <span className="font-medium text-brand-700">{date}</span>
                  <span className="text-slate-500">：{items.join('、')}</span>
                </li>
              ))}
            </ul>
          </Field>
        )}
        <Field label="生效說明">{article.effective_note}</Field>
        <Field label="依據">{article.source_basis}</Field>
        {article.related_appendix.length > 0 && (
          <Field label="相關附表">
            <div className="flex flex-wrap gap-2">
              {article.related_appendix.map((id) => {
                const apId = id
                  .replace(/^appendix-/, '')
                  .split('-')
                  .map((seg) => String(parseInt(seg, 10)))
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
          </Field>
        )}
        <Field label="關鍵字">
          <div className="flex flex-wrap gap-1.5">
            {article.keywords.map((k) => (
              <Link
                key={k}
                to={`/search?q=${encodeURIComponent(k)}`}
                className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 hover:bg-brand-100"
              >
                {k}
              </Link>
            ))}
          </div>
        </Field>
      </dl>
    </article>
  )
}
