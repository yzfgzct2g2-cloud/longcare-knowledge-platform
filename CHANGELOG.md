# Changelog

本專案的所有重要變更皆記錄於此檔。

## [V1.4.2] - 2026-06-26 — Knowledge Rule Model

### 知識模型（rule / exception）
- Topic 新增欄位：`rule`、`exceptions`、`rule_basis`、`exception_basis`，以「原則 → 例外」層級表達法規。
- TopicDetailPage 調整區塊順序：主題摘要 → 原則 → 例外規定 → 可以使用 → 不得使用 → 有條件使用 → 額度規定 → 限制事項 → 相容服務 → 常見誤解 → 法規依據 → 相關條文／碼別／附表（原則藍、例外規定紫，與其他色階區分）。
- 外籍看護以 rule/exception 重新整理：Rule＝30% 額度且原則用於 BA 碼以外；Exception＝BA09／BA09a 符合附表四第四點得使用、不受第十條第二項限制（額度仍 30%）。

### 知識治理
- 新增 `DEVELOPMENT_RULES.md`（不可妥協原則：Evidence First、無依據不下結論、禁止 AI 推論、不得過度簡化等）。
- 新增 `KNOWLEDGE_GOVERNANCE.md`（Single Source of Truth、Data Hierarchy 與 priority、Never Overwrite、Evidence First、Future Compatible、Traceability、Manual Review、新增資料流程）。
- Smart Search 預留 Interpretation Layer TODO（本版不整合）。

### 修正（知識正確性）
- 外籍看護主題頁 BA09／BA09a：依附表四第四點例外規定，改列「有條件使用」，不再列入「不得使用」；related_codes 由 [] 修正為 [BA09, BA09a]（BA08 仍不納入，與外籍看護無個別關聯）。
- 移除「不得以 30% 額度使用居家照顧服務（BA 碼）／所有 BA 碼不得使用」之過度簡化結論；改為「一般 BA 原則受第十條第二項限制，BA09／BA09a 為例外」。
- 新增常見誤解：聘外籍看護者一律不得使用任何 BA 居家照顧服務（澄清 BA09／BA09a 例外）。

### 新增
- 函釋／公告／補充說明資料架構 `knowledge/interpretations/`：README.md（含效力順序）、interpretation-schema.json。
- 第一筆 interpretation：`interpretation-ba09-ba09a-foreign-caregiver.json`（amendment_note，含完整原文 citation）。
- 外籍看護主題 law_source_note 保留例外規定完整原文，並指向該 interpretation。

### 原則
- 不開發 AA01、不啟用 AI、不建後端；未修改 knowledge/regulations、knowledge/assistive-devices 原始 JSON。

## [V1.4.1] - 2026-06-26 — Practical Knowledge Enhancement

### 新增
- 實務主題知識欄位（單一資料來源，直接升級 knowledge/practical/topics/）：can_use、cannot_use、conditional_use、quota_rules、compatibility、restrictions、common_mistakes、law_basis、manual_review。
- 新主題 topic-021「協助沐浴及洗頭」（BA07）。
- TopicDetailPage 知識頁版面與顏色標示（綠＝可使用、黃＝有條件、紅＝不得使用／限制、灰＝額度／法規依據），每筆附法規依據 chip。

### 變更
- `src/data/practical.ts` 型別擴充並透傳知識欄位。
- 升級 5 個高價值主題：外籍看護、協助沐浴及洗頭（BA07）、交通接送、日間照顧、喘息服務。

### 修正（知識正確性）
- 外籍看護移除無法規依據之 related_codes：BA08、BA09、BA09a（共 3 筆）。
- 所有「可以使用／不得使用／限制」均要求法規依據；無依據者不顯示、不推論；無法確認則 manual_review=true。

### 原則
- 不開發 AA01、不啟用 AI、不建後端；不修改 knowledge/regulations、knowledge/assistive-devices 原始 JSON（本版僅升級 knowledge/practical/topics）。

## [V1.4.0] - 2026-06-26

### 新增
- 實務主題列表頁 `/topics`（搜尋主題／別名／關鍵字／常見問題／摘要）。
- 實務主題詳情頁 `/topics/:topicId`：實務摘要、別名、常見問題、相關條文／碼別／附表／相關主題、法規來源、source_type、breadcrumb。
- `src/pages/TopicsPage.tsx`、`src/pages/TopicDetailPage.tsx`。
- `src/data/practical.ts` 擴充：getAllTopics、getTopicById、getTopicByName、getRelatedArticles／Codes／Appendices／Topics（含 id 由檔名推導、欄位安全預設）。

### 變更
- `/search` 主題卡片新增「查看主題詳情」連結。
- 首頁新增「實務主題」區（8 個常用主題）；導覽列新增「實務主題」。
- 相關條文／碼別／附表找不到對應資料時顯示原始 id 並標示，不報錯。
- `package.json` 版本 1.3.1 → 1.4.0。

### 設計原則
- 純前端、唯讀；不啟用 AI、不建後端、不呼叫外部 API、不開發 AA01。
- 不修改 knowledge/regulations、knowledge/practical、knowledge/assistive-devices 原始 JSON。

## [V1.3.1] - 2026-06-26

### 修正
- 修正 GitHub Pages 空白頁問題（Vite 子路徑資源載入失敗）。

### 變更
- 改用 GitHub Actions 建置後部署 Vite `dist`（`.github/workflows/deploy.yml`）。
- `vite.config.ts` 設定 `base: '/longcare-knowledge-platform/'`。
- `BrowserRouter` 加入 `basename={import.meta.env.BASE_URL}`，子路徑路由正確。
- 加入 `404.html` SPA fallback。
- 版本 1.3.0 → 1.3.1。

## [V1.3.0] - 2026-06-26

### 新增
- Smart Search（規則式、非 AI、非後端）：同義詞展開、實務查詢導引、結果分層、命中理由、加權排序、搜尋高亮。
- `src/data/smartSearchRules.ts`：synonymGroups、practicalQueryMap、intentKeywords、priorityRules、assistiveHintKeywords。
- `src/data/practical.ts`：載入第二層實務主題資料（topics、synonym-map）參與搜尋。
- `src/lib/smartSearch.ts`：Smart Search 引擎（7 層結果、命中理由、加權排序）。
- `src/components/Highlight.tsx`：搜尋命中高亮。
- 首頁「常用實務查詢」區（口語問句捷徑）。

### 變更
- `/search` 改為分層結果（直接命中／實務主題／相關法規／照顧組合碼／附表／生效日／跨制度輔具提示），每筆顯示命中理由。
- `src/data/types.ts` 新增 Smart Search 結果型別。
- `package.json` 版本 1.2.0 → 1.3.0；版本顯示更新為 V1.3.0。

### 設計原則
- 純前端規則式搜尋；不啟用 AI、不建後端、不呼叫外部 API、不使用 API key。
- 不開發 AA01；不修改 knowledge/regulations、knowledge/practical、knowledge/assistive-devices 原始 JSON。
- 身障／醫療輔具維持以提示卡片呈現（最低優先序），不混入主搜尋結果。

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
