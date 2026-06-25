import { Link } from 'react-router-dom'
import { articles } from '../data/loaders'
import { articleLabel } from '../lib/format'

export default function ArticlesPage() {
  // 依章節分組
  const byChapter = new Map<string, typeof articles>()
  for (const a of articles) {
    const list = byChapter.get(a.chapter) ?? []
    list.push(a)
    byChapter.set(a.chapter, list)
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-slate-800">條文查詢</h1>
      <div className="space-y-6">
        {[...byChapter.entries()].map(([chapter, list]) => (
          <section key={chapter}>
            <h2 className="mb-2 text-sm font-semibold text-slate-500">{chapter}</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {list.map((a) => (
                <Link
                  key={a.article}
                  to={`/articles/${a.article}`}
                  className="flex items-baseline gap-2 rounded-lg border border-slate-200 bg-white p-3 transition-colors hover:border-brand-400 hover:bg-brand-50"
                >
                  <span className="font-semibold text-brand-700">{articleLabel(a.article)}</span>
                  <span className="text-sm text-slate-800">{a.title}</span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
