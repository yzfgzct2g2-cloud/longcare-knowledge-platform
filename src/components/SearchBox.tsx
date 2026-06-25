import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

interface Props {
  initial?: string
  autoFocus?: boolean
  size?: 'lg' | 'md'
  placeholder?: string
}

const DEFAULT_PLACEHOLDER =
  '請輸入條文、碼別、關鍵字或生效日，例如：外籍看護、BA09a、第十條、FA08、115-07-01'

export default function SearchBox({
  initial = '',
  autoFocus = false,
  size = 'lg',
  placeholder = DEFAULT_PLACEHOLDER,
}: Props) {
  const [value, setValue] = useState(initial)
  const navigate = useNavigate()

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const q = value.trim()
    if (!q) return
    navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  const inputClass =
    size === 'lg'
      ? 'w-full rounded-lg border border-slate-300 bg-white px-5 py-4 text-lg shadow-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200'
      : 'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-200'

  return (
    <form onSubmit={onSubmit} className="flex w-full gap-2">
      <input
        type="text"
        value={value}
        autoFocus={autoFocus}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        className={inputClass}
        aria-label="法規搜尋"
      />
      <button
        type="submit"
        className={
          size === 'lg'
            ? 'shrink-0 rounded-lg bg-brand-600 px-6 py-4 text-lg font-medium text-white hover:bg-brand-700'
            : 'shrink-0 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700'
        }
      >
        搜尋
      </button>
    </form>
  )
}
