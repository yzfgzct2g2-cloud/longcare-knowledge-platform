import { Link, useParams } from 'react-router-dom'
import {
  getRelatedAppendices,
  getRelatedArticles,
  getRelatedCodes,
  getRelatedTopics,
  getTopicById,
} from '../data/practical'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="mb-2 border-b border-slate-100 pb-1.5 text-sm font-semibold text-slate-700">{title}</h2>
      {children}
    </section>
  )
}

export default function TopicDetailPage() {
  const { topicId } = useParams()
  const topic = topicId ? getTopicById(topicId) : undefined

  if (!topic) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
        找不到主題「{topicId}」。
        <div className="mt-2">
          <Link to="/topics" className="text-brand-600 hover:underline">
            返回實務主題列表
          </Link>
        </div>
      </div>
    )
  }

  const articles = getRelatedArticles(topic)
  const codes = getRelatedCodes(topic)
  const appendices = getRelatedAppendices(topic)
  const relatedTopics = getRelatedTopics(topic)

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-400">
        <Link to="/" className="hover:text-brand-600">首頁</Link>
        <span className="mx-1">›</span>
        <Link to="/topics" className="hover:text-brand-600">實務主題</Link>
        <span className="mx-1">›</span>
        <span className="text-slate-600">{topic.topic}</span>
      </nav>

      <div>
        <div className="flex flex-wrap items-baseline gap-2">
          <h1 className="text-2xl font-bold text-teal-700">{topic.topic}</h1>
          <span className="text-xs text-slate-300">{topic.id}</span>
          {topic.source_type && (
            <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{topic.source_type}</span>
          )}
          {topic.needs_manual_supplement && (
            <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-700">待人工補充</span>
          )}
        </div>
        {topic.aliases.length > 0 && (
          <p className="mt-1 text-sm text-slate-400">別名：{topic.aliases.join('、')}</p>
        )}
      </div>

      <Section title="實務摘要">
        <p className="text-sm leading-relaxed text-slate-700">{topic.summary || '（無摘要）'}</p>
      </Section>

      {topic.common_questions.length > 0 && (
        <Section title={`常見問題（${topic.common_questions.length}）`}>
          <ul className="space-y-1.5 text-sm text-slate-700">
            {topic.common_questions.map((qn, i) => (
              <li key={i}>
                <Link to={`/search?q=${encodeURIComponent(qn)}`} className="text-brand-700 hover:underline">
                  Q：{qn}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title={`相關條文（${articles.length}）`}>
        {articles.length === 0 ? (
          <p className="text-sm text-slate-400">無</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {articles.map((a) =>
              a.found ? (
                <Link
                  key={a.num}
                  to={`/articles/${a.num}`}
                  className="rounded border border-slate-200 px-2.5 py-1 text-sm text-brand-700 hover:bg-brand-50"
                >
                  {a.label}
                  {a.title && <span className="ml-1 text-slate-500">{a.title}</span>}
                </Link>
              ) : (
                <span key={a.num} className="rounded border border-amber-200 bg-amber-50 px-2.5 py-1 text-sm text-amber-700">
                  {a.label}（尚未找到條文資料）
                </span>
              ),
            )}
          </div>
        )}
      </Section>

      <Section title={`相關碼別（${codes.length}）`}>
        {codes.length === 0 ? (
          <p className="text-sm text-slate-400">無</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs text-slate-500">
                  <th className="px-3 py-1.5">碼別</th>
                  <th className="px-3 py-1.5">名稱</th>
                  <th className="px-3 py-1.5">分類</th>
                  <th className="px-3 py-1.5">生效日</th>
                </tr>
              </thead>
              <tbody>
                {codes.map((c) => (
                  <tr key={c.code} className="border-b border-slate-100 last:border-0">
                    <td className="px-3 py-1.5 font-mono font-semibold text-brand-700">
                      <Link to={`/codes/${c.code}`} className="hover:underline">{c.code}</Link>
                    </td>
                    <td className="px-3 py-1.5 text-slate-800">
                      {c.found ? c.name : <span className="text-amber-700">尚未找到碼別資料</span>}
                    </td>
                    <td className="px-3 py-1.5 text-slate-500">{c.category ?? '—'}</td>
                    <td className="px-3 py-1.5 text-slate-500">{c.effective_date ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      <Section title={`相關附表（${appendices.length}）`}>
        {appendices.length === 0 ? (
          <p className="text-sm text-slate-400">無</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {appendices.map((ap) =>
              ap.found ? (
                <Link
                  key={ap.raw}
                  to={`/appendices/${ap.id}`}
                  className="rounded border border-slate-200 px-2.5 py-1 text-sm text-brand-700 hover:bg-brand-50"
                >
                  {ap.label}
                </Link>
              ) : (
                <span key={ap.raw} className="rounded border border-slate-200 px-2.5 py-1 text-sm text-slate-500">
                  {ap.raw}
                </span>
              ),
            )}
          </div>
        )}
      </Section>

      {relatedTopics.length > 0 && (
        <Section title={`相關主題（${relatedTopics.length}）`}>
          <div className="flex flex-wrap gap-2">
            {relatedTopics.map((rt) =>
              rt.found && rt.id ? (
                <Link
                  key={rt.name}
                  to={`/topics/${rt.id}`}
                  className="rounded border border-teal-200 bg-teal-50 px-2.5 py-1 text-sm text-teal-700 hover:bg-teal-100"
                >
                  {rt.name}
                </Link>
              ) : (
                <span key={rt.name} className="rounded border border-slate-200 px-2.5 py-1 text-sm text-slate-500">
                  {rt.name}
                </span>
              ),
            )}
          </div>
        </Section>
      )}

      {topic.law_source_note && (
        <Section title="法規來源">
          <p className="text-sm leading-relaxed text-slate-600">{topic.law_source_note}</p>
        </Section>
      )}
    </div>
  )
}
