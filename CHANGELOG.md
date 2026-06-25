# Changelog

本專案的所有重要變更皆記錄於此檔。

## [V1.2.0] - 2026-06-25

### 新增
- 身障／醫療輔具查詢頁 `/assistive-devices`（搜尋、制度篩選、類別篩選、詳情展開、跨制度對照顯示）。
- 主搜尋 `/search` 新增「跨制度輔具提示卡片」：當查詢可能涉及身障／醫療輔具時顯示入口，點擊導向 `/assistive-devices?query=...`。
- `src/config/version.ts`（VERSION / LAST_UPDATE），首頁與頁尾顯示版本。
- `src/data/assistive.ts` 輔具資料載入層、`src/lib/assistiveSearch.ts` 輔具搜尋與 UI hint fallback 關鍵字。
- README.md、CHANGELOG.md。

### 變更
- 導覽列新增「身障／醫療輔具」連結。
- `package.json` 版本 1.0.0 → 1.2.0。

### 設計原則
- 身障／醫療輔具資料與長照法規主搜尋分離，不混入主結果；提示卡片排序為最低優先。
- 不啟用 AI、不建立後端、不呼叫任何外部 API、不使用 API key。
- 不修改 knowledge/regulations、knowledge/practical、knowledge/assistive-devices 之原始 JSON。

## [V1.0.0]

### 新增
- 長照法規搜尋系統初版：首頁搜尋、`/search` 主搜尋（條文／照顧組合碼／附表／生效日）、條文與碼別詳情、修法沿革、AI 問答預留頁。
