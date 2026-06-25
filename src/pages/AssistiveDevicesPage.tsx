import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  categoriesForSystem,
  presentSystems,
  systemLabel,
  type AssistiveDevice,
  type AssistiveSystem,
} from '../data/assistive'
import { searchAssistive, crossRefsForDevice } from '../lib/assistiveSearch'

type SystemFilter = AssistiveSystem | 'all'

function SystemBadge({ system }: { system: string }) {
  const color =
    system === 'disability'
      ? 'bg-indigo-100 text-indigo-700'
      : system === 'medical'
        ? 'bg-teal-100 text-teal-700'
        : 'bg-emerald-100 text-emerald-700'
  return (
    <span className={`rounded px-2 py-0.5 text-xs font-medium ${color}`}>
      {systemLabel(system)}
    </span>
  )
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (value == null || value === '' || (Array.isArray(value) && value.length === 0)) return null
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-2 border-b border-slate-100 py-1.5 text-sm last:border-0">
      <div className="text-slate-400">{label}</div>
      <div className="text-slate-700">{value}</div>
    </div>
  )
}

function DeviceDetail({ device }: { device: AssistiveDevice }) {
  const crossRefs = crossRefsForDevice(device)
  return (
    <div className="border-t border-slate-200 bg-slate-50 px-4 py-3">
      <DetailRow label="代碼 id" value={<span className="font-mono">{device.id}</span>} />
      <DetailRow label="名稱" value={device.name} />
      <DetailRow label="制度" value={systemLabel(device.system)} />
      <DetailRow label="分類" value={device.category} />
      <DetailRow label="子分類" value={device.subcategory} />
      <DetailRow label="補助金額" value={device.subsidy_amount || '—（資料未確認）'} />
      <DetailRow label="最低使用年限" value={device.renewal_years || '—（資料未確認）'} />
      <DetailRow label="是否需評估" value={device.need_assessment ? '需評估' : '不需評估'} />
      <DetailRow
        label="評估要求"
        value={
          device.assessment_required.length > 0 ? (
            <ul className="list-disc pl-4">
              {device.assessment_required.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          ) : null
        }
      />
      <DetailRow
        label="應備文件"
        value={
          device.required_documents.length > 0 ? (
            <ul className="list-disc pl-4">
              {device.required_documents.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          ) : null
        }
      />
      <DetailRow
        label="適用條件"
        value={
          device.applicable_conditions.length > 0 ? (
            <ul className="list-disc pl-4">
              {device.applicable_conditions.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          ) : null
        }
      />
      <DetailRow label="生效日" value={device.effective_date} />
      <DetailRow label="法規來源" value={device.source_law} />
      <DetailRow label="引用 citation" value={device.citation} />
      {device.review_reason && <DetailRow label="待確認原因" value={device.review_reason} />}
      <DetailRow
        label="法規原文"
        value={
          device.original_text ? (
            <p className="whitespace-pre-wrap leading-relaxed text-slate-600">
              {device.original_text}
            </p>
          ) : null
        }
      />
      <DetailRow
        label="關鍵字"
        value={
          device.keywords.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {device.keywords.map((k, i) => (
                <span key={i} className="rounded bg-white px-1.5 py-0.5 text-xs text-slate-500 ring-1 ring-slate-200">
                  {k}
                </span>
              ))}
            </div>
          ) : null
        }
      />

      {/* 跨制度對照 */}
      {crossRefs.length > 0 && (
        <div className="mt-3 rounded border border-slate-200 bg-white p-3">
          <div className="mb-1 text-sm font-semibold text-slate-700">相關制度對照</div>
          {crossRefs.map((link, i) => (
            <div key={i} className="mb-2 text-sm last:mb-0">
              <div className="text-slate-600">{link.item_name}</div>
              <div className="mt-1 grid gap-1 text-xs text-slate-500 sm:grid-cols-3">
                <div>長照：{link.longcare_related.join('、') || '—'}</div>
                <div>身障：{link.disability_related.join('、') || '—'}</div>
                <div>醫療：{link.medical_related.join('、') || '—'}</div>
              </div>
              {link.basis && <div className="mt-1 text-xs text-slate-400">依據：{link.basis}</div>}
              {link.manual_review && (
                <div className="mt-1 text-xs text-amber-600">此跨制度對照尚待人工確認。</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AssistiveDevicesPage() {
  const [params, setParams] = useSearchParams()
  const initialQuery = params.get('query') ?? ''

  const [query, setQuery] = useState(initialQuery)
  const [system, setSystem] = useState<SystemFilter>('all')
  const [category, setCategory] = useState<string>('all')
  const [openId, setOpenId] = useState<string | null>(null)

  // 同步網址 ?query= 變動（例如由 /search 提示卡片帶入）
  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  const categories = useMemo(() => categoriesForSystem(system), [system])

  // 切換制度時，若目前分類不存在於新制度則重置
  useEffect(() => {
    if (category !== 'all' && !categories.includes(category)) setCategory('all')
  }, [categories, category])

  const results = useMemo(
    () => searchAssistive(query, { system, category }),
    [query, system, category],
  )

  const systemOptions: SystemFilter[] = [
    'all',
    'disability',
    'medical',
    ...(presentSystems.includes('longcare') ? (['longcare'] as SystemFilter[]) : []),
  ]

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const next = new URLSearchParams(params)
    if (query) next.set('query', query)
    else next.delete('query')
    setParams(next, { replace: true })
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-slate-800">身障／醫療輔具查詢</h1>
        <p className="mt-1 max-w-3xl text-sm text-slate-500">
          本頁提供身心障礙者輔具費用補助、醫療復健費用及醫療輔具補助資料查詢。此區與長照法規主搜尋分開呈現，避免不同制度混淆。
        </p>
      </div>

      {/* 搜尋與篩選 */}
      <form onSubmit={submit} className="mb-5 space-y-3 rounded-lg border border-slate-200 bg-white p-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="輸入輔具名稱、別名或關鍵字，例如：輪椅、氧氣製造機、人工電子耳"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
        />
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">制度</span>
            <div className="flex flex-wrap gap-1">
              {systemOptions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSystem(s)}
                  className={`rounded-full border px-3 py-1 transition-colors ${
                    system === s
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {s === 'all' ? '全部' : `${systemLabel(s)} ${s}`}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">類別</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-md border border-slate-300 px-2 py-1 text-sm outline-none focus:border-brand-500"
            >
              <option value="all">全部類別</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </form>

      <p className="mb-3 text-xs text-slate-400">
        共 {results.length} 筆（本頁資料屬身障／醫療輔具制度，與長照服務碼不同，請勿混用）
      </p>

      {results.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500">
          找不到符合的輔具項目。可嘗試輸入：輪椅、助行器、氧氣製造機、人工電子耳。
        </div>
      ) : (
        <div className="space-y-2">
          {results.map((d) => {
            const open = openId === d.id
            return (
              <div key={d.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                <button
                  onClick={() => setOpenId(open ? null : d.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-brand-50"
                >
                  <SystemBadge system={d.system} />
                  <span className="font-medium text-slate-800">{d.name}</span>
                  <span className="text-xs text-slate-400">{d.category}</span>
                  {d.manual_review && (
                    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-700">
                      待人工確認
                    </span>
                  )}
                  <span className="ml-auto flex items-center gap-3 text-xs text-slate-500">
                    <span>補助 {d.subsidy_amount ? d.subsidy_amount.slice(0, 18) : '—'}</span>
                    <span>年限 {d.renewal_years || '—'}</span>
                    <span>{d.need_assessment ? '需評估' : '不需評估'}</span>
                    <span className="text-brand-600">{open ? '收合 ▲' : '展開 ▼'}</span>
                  </span>
                </button>
                {d.manual_review && !open && (
                  <div className="border-t border-amber-100 bg-amber-50 px-4 py-1.5 text-xs text-amber-700">
                    此筆資料尚待人工確認，請以原始法規 PDF 或主管機關公告為準。
                  </div>
                )}
                {open && (
                  <>
                    {d.manual_review && (
                      <div className="border-t border-amber-100 bg-amber-50 px-4 py-1.5 text-xs text-amber-700">
                        此筆資料尚待人工確認，請以原始法規 PDF 或主管機關公告為準。
                      </div>
                    )}
                    <DeviceDetail device={d} />
                  </>
                )}
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-6 text-xs text-slate-400">
        資料來源：knowledge/assistive-devices（本機唯讀）。補助金額與使用年限以原始法規 PDF 及主管機關公告為準；標記「待人工確認」者尚未完成校對。
      </div>
    </div>
  )
}
