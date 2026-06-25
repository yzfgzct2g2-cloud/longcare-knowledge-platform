import { NavLink, Link, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import SearchBox from './SearchBox'
import { VERSION, LAST_UPDATE } from '../config/version'

const NAV = [
  { to: '/articles', label: '條文查詢' },
  { to: '/codes', label: '碼別查詢' },
  { to: '/effective', label: '生效日查詢' },
  { to: '/revisions', label: '修法沿革' },
  { to: '/assistive-devices', label: '身障／醫療輔具' },
  { to: '/ask-ai', label: 'AI 問答' },
]

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-baseline gap-2 whitespace-nowrap">
              <span className="text-lg font-bold text-brand-700">長照法規搜尋系統</span>
              <span className="text-xs text-slate-400">本機資料庫 · 115/07/01 版</span>
            </Link>
            {!isHome && (
              <div className="hidden w-full max-w-xl md:block">
                <SearchBox size="md" initial={new URLSearchParams(location.search).get('q') ?? ''} />
              </div>
            )}
          </div>
          <nav className="flex flex-wrap gap-1 text-sm">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `rounded px-3 py-1.5 font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      <footer className="mx-auto max-w-6xl px-4 py-8 text-xs text-slate-400">
        <div>
          資料來源：knowledge/regulations、knowledge/practical、knowledge/assistive-devices（本機唯讀）。本系統不呼叫任何外部 API、不使用 AI、不設後端。
        </div>
        <div className="mt-1">
          長照法規搜尋系統 {VERSION} · 更新日期 {LAST_UPDATE}
        </div>
      </footer>
    </div>
  )
}
