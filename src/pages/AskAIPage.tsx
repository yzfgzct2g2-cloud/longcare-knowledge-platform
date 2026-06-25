export default function AskAIPage() {
  return (
    <div className="mx-auto max-w-xl pt-12 text-center">
      <h1 className="text-xl font-bold text-slate-800">AI 法規問答</h1>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-8">
        <p className="text-lg font-medium text-slate-700">AI 法規問答尚未開放。</p>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          目前版本僅提供本機資料庫搜尋，不會呼叫外部 API，也不會產生費用。
        </p>
      </div>
    </div>
  )
}
