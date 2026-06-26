import { Link, useParams } from 'react-router-dom'
import {
  getRelatedAppendices,
  getRelatedArticles,
  getRelatedCodes,
  getRelatedTopics,
  getTopicById,
  type MistakeEntry,
  type QuotaEntry,
  type RuleEntry,
  type UseEntry,
} from '../data/practical'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="mb-2 border-b border-slate-100 pb-1.5 text-sm font-semibold text-slate-700">{title}</h2>
      {children}
    </section>
  )
}

function LawChip({ basis }: { basis: string }) {
  return (
    <span className="mt-1 inline-block rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-500">
      依據：{basis}
    </span>
  )
}

type Tone = 'green' | 'red' | 'yellow' | 'blue' | 'gray' | 'purple'
const TONE: Record<Tone, string> = {
  green: 'border-l-4 border-green-400 bg-green-50',
  red: 'border-l-4 border-red-400 bg-red-50',
  yellow: 'border-l-4 border-yellow-400 bg-yellow-50',
  blue: 'border-l-4 border-blue-400 bg-blue-50',
  gray: 'border-l-4 border-slate-300 bg-slate-50',
  purple: 'border-l-4 border-purple-400 bg-purple-50',
}

/** 有 law_basis 才顯示的彩色清單區塊；無資料則整段不渲染 */
function UseSection({ title, tone, items }: { title: string; tone: Tone; items?: UseEntry[] }) {
  if (!items || items.length === 0) return null
  return (
    <Section title={title}>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li key={i} className={`rounded ${TONE[tone]} px-3 py-2`}>
            <div className="text-sm text-slate-800">{it.value}</div>
            {it.condition && <div className="mt-0.5 text-xs text-slate-600">條件：{it.condition}</div>}
            {it.note && <div className="mt-0.5 text-xs italic text-amber-700">{it.note}</div>}
            <LawChip basis={it.law_basis} />
          </li>
        ))}
      </ul>
    </Section>
  )
}

/** 原則 / 例外規定 區塊（rule / exceptions） */
function RuleSection({
  title,
  tone,
  items,
}: {
  title: string
  tone: Tone
  items?: RuleEntry[]
}) {
  if (!items || items.length === 0) return null
  return (
    <Section title={title}>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li key={i} className={`rounded ${TONE[tone]} px-3 py-2`}>
            <div className="text-sm text-slate-800">{it.statement}</div>
            <LawChip basis={it.basis} />
          </li>
        ))}
      </ul>
    </Section>
  )
}

function QuotaSection({ items }: { items?: QuotaEntry[] }) {
  if (!items || items.length === 0) return null
  return (
    <Section title="額度規定">
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li key={i} className={`rounded ${TONE.gray} px-3 py-2`}>
            <div className="text-sm text-slate-800">{it.rule}</div>
            {it.note && <div className="mt-0.5 text-xs italic text-amber-700">{it.note}</div>}
            <LawChip basis={it.law_basis} />
          </li>
        ))}
      </ul>
    </Section>
  )
}

function MistakeSection({ items }: { items?: MistakeEntry[] }) {
  if (!items || items.length === 0) return null
  return (
    <Section title="常見誤解">
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li key={i} className="rounded border-l-4 border-amber-400 bg-amber-50 px-3 py-2">
            <div className="text-sm text-red-700">✗ {it.misconception}</div>
            <div className="mt-0.5 text-sm text-green-800">✓ {it.fact}</div>
            <LawChip basis={it.law_basis} />
          </li>
        ))}
      </ul>
    </Section>
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
          <Link to="/topics" className="text-brand-600 hover:underline">返回實務主題列表</Link>
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
        </div>
        {topic.aliases.length > 0 && <p className="mt-1 text-sm text-slate-400">別名：{topic.aliases.join('、')}</p>}
      </div>

      {topic.manual_review && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
          本主題部分內容尚待人工確認，請以原始法規為準。
        </div>
      )}

      {/* 1. 主題摘要 */}
      <Section title="主題摘要">
        <p className="text-sm leading-relaxed text-slate-700">{topic.summary || '（無摘要）'}</p>
      </Section>

      {/* 2. 原則　3. 例外規定 */}
      <RuleSection title="原則" tone="blue" items={topic.rule} />
      <RuleSection title="例外規定" tone="purple" items={topic.exceptions} />

      {/* 4-9 知識欄位（皆附法規依據，無資料則不顯示） */}
      <UseSection title="可以使用" tone="green" items={topic.can_use} />
      <UseSection title="不得使用" tone="red" items={topic.cannot_use} />
      <UseSection title="有條件使用" tone="yellow" items={topic.conditional_use} />
      <QuotaSection items={topic.quota_rules} />
      <UseSection title="限制事項" tone="red" items={topic.restrictions} />
      <UseSection title="相容服務" tone="blue" items={topic.compatibility} />
      <MistakeSection items={topic.common_mistakes} />

      {/* 9. 法規依據 */}
      {topic.law_basis && topic.law_basis.length > 0 && (
        <Section title="法規依據">
          <div className="flex flex-wrap gap-1.5">
            {topic.law_basis.map((b, i) => (
              <span key={i} className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-600">
                {b}
              </span>
            ))}
          </div>
          {topic.law_source_note && <p className="mt-2 text-xs leading-relaxed text-slate-500">{topic.law_source_note}</p>}
        </Section>
      )}

      {/* 常見問題 */}
      {topic.common_questions.length > 0 && (
        <Section title={`常見問題（${topic.common_questions.length}）`}>
          <ul className="space-y-1.5 text-sm text-slate-700">
            {topic.common_questions.map((qn, i) => (
              <li key={i}>
                <Link to={`/search?q=${encodeURIComponent(qn)}`} className="text-brand-700 hover:underline">Q：{qn}</Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* 10. 相關條文 */}
      <Section title={`相關條文（${articles.length}）`}>
        {articles.length === 0 ? (
          <p className="text-sm text-slate-400">無</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {articles.map((a) =>
              a.found ? (
                <Link key={a.num} to={`/articles/${a.num}`} className="rounded border border-slate-200 px-2.5 py-1 text-sm text-brand-700 hover:bg-brand-50">
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

      {/* 11. 相關碼別 */}
      <Section title={`相關碼別（${codes.length}）`}>
        {codes.length === 0 ? (
          <p className="text-sm text-slate-400">無（本主題之服務適用規則以法規條文與額度為準，無逐一對應之單一碼別）</p>
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

      {/* 12. 相關附表 */}
      <Section title={`相關附表（${appendices.length}）`}>
        {appendices.length === 0 ? (
          <p className="text-sm text-slate-400">無</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {appendices.map((ap) =>
              ap.found ? (
                <Link key={ap.raw} to={`/appendices/${ap.id}`} className="rounded border border-slate-200 px-2.5 py-1 text-sm text-brand-700 hover:bg-brand-50">
                  {ap.label}
                </Link>
              ) : (
                <span key={ap.raw} className="rounded border border-slate-200 px-2.5 py-1 text-sm text-slate-500">{ap.raw}</span>
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
                <Link key={rt.name} to={`/topics/${rt.id}`} className="rounded border border-teal-200 bg-teal-50 px-2.5 py-1 text-sm text-teal-700 hover:bg-teal-100">
                  {rt.name}
                </Link>
              ) : (
                <span key={rt.name} className="rounded border border-slate-200 px-2.5 py-1 text-sm text-slate-500">{rt.name}</span>
              ),
            )}
          </div>
        </Section>
      )}
    </div>
  )
}
