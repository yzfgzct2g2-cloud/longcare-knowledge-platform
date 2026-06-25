import { useNavigate, Link } from 'react-router-dom'
import SearchBox from '../components/SearchBox'
import { VERSION } from '../config/version'

const SHORTCUTS = [
  '外籍看護',
  '失智症',
  '交通接送',
  '第二組輔具',
  '日照',
  'BA09a',
  'FA08',
  'EI01',
  '115-07-01',
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center px-4">
      <div className="w-full max-w-2xl pt-16 sm:pt-24">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-brand-700 sm:text-4xl">
            長照法規搜尋系統
            <span className="ml-2 align-middle text-base font-medium text-slate-400">{VERSION}</span>
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            長期照顧服務申請及給付辦法 · 115/07/01 版 · 本機資料庫查詢
          </p>
        </div>

        <SearchBox autoFocus size="lg" />

        <div className="mt-6">
          <p className="mb-2 text-xs font-medium text-slate-400">常用查詢</p>
          <div className="flex flex-wrap gap-2">
            {SHORTCUTS.map((s) => (
              <button
                key={s}
                onClick={() => navigate(`/search?q=${encodeURIComponent(s)}`)}
                className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 transition-colors hover:border-brand-500 hover:bg-brand-50 hover:text-brand-700"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 text-center text-xs text-slate-400">
          搜尋範圍：22 條條文、7 份附表、166 個照顧組合碼、生效日時間軸。
          <br />
          身障／醫療輔具補助資料與長照法規分開呈現，請至
          <Link to="/assistive-devices" className="mx-1 text-brand-600 hover:underline">
            身障／醫療輔具查詢
          </Link>
          。
          <br />
          本系統不呼叫外部 API、不使用 AI、不產生費用。
        </div>
      </div>
    </div>
  )
}
