import { Link, useParams } from 'react-router-dom'
import { getCodeItem } from '../data/loaders'
import { codeTransition } from '../data/loaders'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  if (children === undefined || children === null || children === '') return null
  return (
    <div className="border-t border-slate-100 py-3">
      <dt className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="text-sm text-slate-700">{children}</dd>
    </div>
  )
}

export default function CodeDetailPage() {
  const { code } = useParams()
  const item = code ? getCodeItem(code) : undefined

  if (!item) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
        找不到碼別 {code}。
        <div className="mt-2">
          <Link to="/codes" className="text-brand-600 hover:underline">
            返回碼別列表
          </Link>
        </div>
      </div>
    )
  }

  const transition = codeTransition[item.code]

  return (
    <article className="mx-auto max-w-3xl">
      <Link to="/codes" className="text-sm text-brand-600 hover:underline">
        ← 碼別列表
      </Link>
      <div className="mt-3 flex flex-wrap items-baseline gap-3">
        <h1 className="font-mono text-2xl font-bold text-brand-700">{item.code}</h1>
        <span className="text-xl font-medium text-slate-800">{item.name}</span>
        {item.revision_115 && (
          <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-700">115 修正</span>
        )}
      </div>
      <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-400">
        <span>{item.citation}</span>
        <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-500">生效 {item.effective_date}</span>
      </div>

      {transition && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          <span className="font-semibold">碼別異動：</span>
          {transition.status === 'legacy' ? '已停用' : '現行'}
          {transition.replaced_by && `（由 ${transition.replaced_by} 取代）`}
          {transition.replaces && `（取代 ${transition.replaces}）`}
          <div className="mt-1 text-xs">{transition.note}</div>
        </div>
      )}

      <dl className="mt-4 rounded-lg border border-slate-200 bg-white px-5">
        <Field label="類別">{item.category}</Field>
        <Field label="組別">{item.group}</Field>
        <Field label="服務類型">{item.service_type}</Field>
        <Field label="給付方式">{item.payment_type}</Field>
        <Field label="價格上限">{item.price_limit}</Field>
        <Field label="最低使用年限">{item.minimum_years}</Field>
        {item.apply_target && <Field label="適用對象">{item.apply_target}</Field>}
        <Field label="適用條件">{item.conditions}</Field>
        <Field label="規格／功能規範">
          {item.specification ? <p className="regulation-text">{item.specification}</p> : null}
        </Field>
        <Field label="法規原文">
          {item.original_text ? <p className="regulation-text">{item.original_text}</p> : null}
        </Field>
        <Field label="生效說明">{item.effective_note}</Field>
        <Field label="依據">{item.source_basis}</Field>
        <Field label="關鍵字">
          <div className="flex flex-wrap gap-1.5">
            {item.keywords.map((k) => (
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
