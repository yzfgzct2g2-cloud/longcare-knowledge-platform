import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { searchSmart } from '../lib/smartSearch'
import { getTopicByName } from '../data/practical'
import { articleLabel, appendixLabel } from '../lib/format'
import Highlight from '../components/Highlight'
import type {
  HitReason,
  ReasonKind,
  SmartArticleResult,
  SmartCodeResult,
  SmartTopicResult,
  DirectHit,
} from '../data/types'

const REASON_COLOR: Record<ReasonKind, string> = {
  'code-exact': 'bg-green-100 text-green-800',
  'article-exact': 'bg-green-100 text-green-800',
  'topic-exact': 'bg-green-100 text-green-800',
  synonym: 'bg-indigo-100 text-indigo-700',
  'practical-map': 'bg-blue-100 text-blue-700',
  relation: 'bg-slate-100 text-slate-600',
  topic: 'bg-teal-100 text-teal-700',
  title: 'bg-slate-100 text-slate-600',
  keyword: 'bg-slate-100 text-slate-600',
  fulltext: 'bg-slate-100 text-slate-500',
  citation: 'bg-slate-100 text-slate-500',
  assistive: 'bg-indigo-100 text-indigo-700',
}

function Reasons({ reasons, max = 3 }: { reasons: HitReason[]; max?: number }) {
  if (reasons.length === 0) return null
  return (
    <div className="mt-1.5 flex flex-wrap gap-1">
      {reasons.slice(0, max).map((r, i) => (
        <span key={i} className={`rounded px-1.5 py-0.5 text-[11px] ${REASON_COLOR[r.kind]}`}>
          {r.label}
        </span>
      ))}
    </div>
  )
}

function SectionHeading({ title, count, hint }: { title: string; count: number; hint?: string }) {
  return (
    <div className="mb-3 flex items-center gap-2 border-b border-slate-200 pb-2">
      <h2 className="text-base font-semibold text-slate-800">{title}</h2>
      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{count}</span>
      {hint && <span className="text-xs text-slate-400">{hint}</span>}
    </div>
  )
}

function ArticleCard({ a, terms }: { a: SmartArticleResult; terms: string[] }) {
  return (
    <Link
      to={`/articles/${a.article}`}
      className="block rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-brand-400 hover:bg-brand-50"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="font-semibold text-brand-700">{articleLabel(a.article)}</span>
        <span className="font-medium text-slate-800">
          <Highlight text={a.title} terms={terms} />
        </span>
        <span className="text-xs text-slate-400">{a.chapter}</span>
        <span className="ml-auto rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500">生效 {a.effective_date}</span>
      </div>
      {a.revisionSummary && (
        <p className="mt-1 text-sm text-slate-500">
          修正：<Highlight text={a.revisionSummary} terms={terms} />
        </p>
      )}
      <Reasons reasons={a.reasons} />
    </Link>
  )
}

function TopicCard({ t, terms }: { t: SmartTopicResult; terms: string[] }) {
  const topicId = getTopicByName(t.topic)?.id
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center gap-x-2">
        <span className="font-semibold text-teal-700">
          <Highlight text={t.topic} terms={terms} />
        </span>
        {t.aliases.length > 0 && (
          <span className="text-xs text-slate-400">別名：{t.aliases.slice(0, 5).join('、')}</span>
        )}
        {topicId && (
          <Link to={`/topics/${topicId}`} className="ml-auto text-xs font-medium text-teal-700 hover:underline">
            查看主題詳情 →
          </Link>
        )}
      </div>
      <p className="mt-1 text-sm leading-relaxed text-slate-600">
        <Highlight text={t.summary} terms={terms} />
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
        {t.related_articles.map((n) => (
          <Link key={`a${n}`} to={`/articles/${n}`} className="rounded bg-slate-100 px-2 py-0.5 text-slate-600 hover:bg-brand-100">
            {articleLabel(n)}
          </Link>
        ))}
        {t.related_codes.slice(0, 12).map((c) => (
          <Link key={`c${c}`} to={`/codes/${c}`} className="rounded bg-slate-100 px-2 py-0.5 font-mono text-slate-600 hover:bg-brand-100">
            {c}
          </Link>
        ))}
      </div>
      <Reasons reasons={t.reasons} />
    </div>
  )
}

function CodeTable({ codes, terms }: { codes: SmartCodeResult[]; terms: string[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs text-slate-500">
            <th className="px-3 py-2">碼別</th>
            <th className="px-3 py-2">名稱</th>
            <th className="px-3 py-2">給付方式</th>
            <th className="px-3 py-2">價格上限</th>
            <th className="px-3 py-2">生效日</th>
            <th className="px-3 py-2">命中理由</th>
          </tr>
        </thead>
        <tbody>
          {codes.map((c) => (
            <tr key={c.code} className="border-b border-slate-100 last:border-0 hover:bg-brand-50">
              <td className="px-3 py-2 font-mono font-semibold text-brand-700">
                <Link to={`/codes/${c.code}`} className="hover:underline">
                  {c.code}
                  {c.revision_115 && <span className="ml-1 rounded bg-amber-100 px-1 text-[10px] text-amber-700">115修</span>}
                </Link>
              </td>
              <td className="px-3 py-2 text-slate-800">
                <Highlight text={c.name} terms={terms} />
              </td>
              <td className="px-3 py-2 text-slate-500">{c.payment_type}</td>
              <td className="px-3 py-2 text-slate-500">{c.price_limit}</td>
              <td className="px-3 py-2 text-slate-500">{c.effective_date}</td>
              <td className="px-3 py-2">
                {c.reasons[0] && (
                  <span className={`rounded px-1.5 py-0.5 text-[11px] ${REASON_COLOR[c.reasons[0].kind]}`}>
                    {c.reasons[0].label}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function DirectHitCard({ hit, terms }: { hit: DirectHit; terms: string[] }) {
  if (hit.type === 'article') return <ArticleCard a={hit.item} terms={terms} />
  if (hit.type === 'topic') return <TopicCard t={hit.item} terms={terms} />
  const c = hit.item
  return (
    <Link
      to={`/codes/${c.code}`}
      className="block rounded-lg border border-green-200 bg-white p-4 transition-colors hover:border-brand-400 hover:bg-brand-50"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="font-mono text-lg font-bold text-brand-700">{c.code}</span>
        <span className="font-medium text-slate-800">
          <Highlight text={c.name} terms={terms} />
        </span>
        {c.revision_115 && <span className="rounded bg-amber-100 px-1 text-[10px] text-amber-700">115修</span>}
        <span className="ml-auto text-xs text-slate-400">{c.citation}</span>
      </div>
      <div className="mt-1 text-sm text-slate-500">
        {c.category} · {c.payment_type} · {c.price_limit} · 生效 {c.effective_date}
      </div>
      <Reasons reasons={c.reasons} />
    </Link>
  )
}

export default function SearchPage() {
  const [params] = useSearchParams()
  const q = params.get('q') ?? ''
  const r = useMemo(() => searchSmart(q), [q])
  const terms = r.expandedTerms

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm text-slate-500">
          搜尋：<span className="font-medium text-slate-800">{q}</span>
          {r.normalizedQuery !== q && <span className="ml-2 text-xs text-slate-400">（正規化：{r.normalizedQuery}）</span>}
        </p>
        {r.synonymCanonicals.length > 0 && (
          <p className="mt-0.5 text-xs text-indigo-600">同義詞展開：{q} → {r.synonymCanonicals.join('、')}</p>
        )}
        <p className="text-xs text-slate-400">共 {r.totalHits} 筆結果（依命中強度分層排序）</p>
      </div>

      {r.totalHits === 0 && !r.assistiveHint.hit && (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
          找不到符合「{q}」的結果。
          <div className="mt-2 text-sm text-slate-400">
            可嘗試：口語詞（外看、洗澡、接送）、碼別（BA09a、FA08）、條次（第十條）、生效日（115-07-01）。
          </div>
        </div>
      )}

      <div className="space-y-8">
        {/* 1. 直接命中 */}
        {r.directHits.length > 0 && (
          <section>
            <SectionHeading title="直接命中" count={r.directHits.length} hint="碼別／條文／實務主題精確命中" />
            <div className="space-y-2">
              {r.directHits.map((h, i) => (
                <DirectHitCard key={i} hit={h} terms={terms} />
              ))}
            </div>
          </section>
        )}

        {/* 2. 實務主題 */}
        {r.topics.length > 0 && (
          <section>
            <SectionHeading title="實務主題" count={r.topics.length} />
            <div className="space-y-2">
              {r.topics.map((t) => (
                <TopicCard key={t.topic} t={t} terms={terms} />
              ))}
            </div>
          </section>
        )}

        {/* 3. 相關法規 */}
        {r.articles.length > 0 && (
          <section>
            <SectionHeading title="相關法規" count={r.articles.length} />
            <div className="space-y-2">
              {r.articles.map((a) => (
                <ArticleCard key={a.article} a={a} terms={terms} />
              ))}
            </div>
          </section>
        )}

        {/* 4. 照顧組合碼 */}
        {r.codes.length > 0 && (
          <section>
            <SectionHeading title="照顧組合碼" count={r.codes.length} />
            <CodeTable codes={r.codes} terms={terms} />
          </section>
        )}

        {/* 5. 附表 */}
        {r.appendices.length > 0 && (
          <section>
            <SectionHeading title="附表" count={r.appendices.length} />
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {r.appendices.map((ap) => (
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

        {/* 6. 生效日 */}
        {r.effectiveDates.length > 0 && (
          <section>
            <SectionHeading title="生效日" count={r.effectiveDates.length} />
            <div className="space-y-2">
              {r.effectiveDates.map((e) => (
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

        {/* 7. 跨制度輔具提示（最低優先序，不混入主結果） */}
        {r.assistiveHint.hit && (
          <aside className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
            <div className="flex items-center gap-2">
              <span className="rounded bg-indigo-600 px-2 py-0.5 text-xs font-medium text-white">跨制度</span>
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
    </div>
  )
}
