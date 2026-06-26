# 長照法規搜尋系統

純前端、可本機執行的長期照顧法規查詢系統，供照專、A 個管、居督等實務人員以關鍵字快速查詢長照法規、條文、照顧組合碼、附表與生效日。

- 不呼叫任何外部 API（無 Google 搜尋、無 Claude／OpenAI）
- 不使用 API key、不建立後端
- 搜尋只針對本機 JSON 資料庫
- 桌機優先

## 技術棧

React 18 · Vite · TypeScript · React Router · Tailwind CSS

## 開發 / 建置

```bash
npm install
npm run dev        # 本機開發
npm run build      # 產生 dist/
npm run preview    # 預覽建置結果
npm run typecheck  # 型別檢查
```

## 資料來源（本機唯讀，不修改原始 JSON）

| 資料夾 | 內容 | 用途 |
|---|---|---|
| `knowledge/regulations/` | 22 條條文、7 份附表、search-index、code-map、effective-date-map、code-transition | 長照法規主搜尋 |
| `knowledge/practical/` | 實務主題知識庫（同義詞、常見問題） | 實務主題對照（資料層） |
| `knowledge/assistive-devices/` | 身障／醫療輔具資料庫（93 筆）、分類、搜尋索引、跨制度對照 | `/assistive-devices` 查詢頁 |

資料以 Vite `import.meta.glob` 於 build 階段直接打包，前端不在 runtime fetch、不複製、不修改原始 JSON。

## 路由

| 路由 | 說明 |
|---|---|
| `/` | 首頁搜尋 |
| `/search` | 主搜尋結果（長照法規、照顧組合碼、附表、生效日） |
| `/articles`、`/articles/:n` | 條文查詢／詳情 |
| `/codes`、`/codes/:code` | 碼別查詢／詳情 |
| `/appendices/:id` | 附表詳情 |
| `/effective` | 生效日查詢 |
| `/revisions` | 修法沿革 |
| `/assistive-devices` | 身障／醫療輔具查詢（與長照主搜尋分離） |
| `/ask-ai` | AI 問答（預留頁，未啟用，不呼叫任何 API） |

## 設計原則：制度分離

身障／醫療輔具屬不同制度，**不混入長照主搜尋結果**。當主搜尋查詢可能涉及輔具時，`/search` 僅於結果下方顯示「跨制度提示卡片」，引導使用者前往 `/assistive-devices?query=...` 查看完整清單，避免將身障／醫療輔具誤認為長照服務碼。

## 搜尋設計：Smart Search（V1.3.0）

主搜尋為規則式 Smart Search（非 AI、非後端）：

- **同義詞展開**：口語／縮寫（外看、日照、家托、洗澡、接送…）正規化為標準概念。規則位於 `src/data/smartSearchRules.ts`。
- **實務查詢導引**：常見口語問句（外看可以用日照嗎、交通接送額度、失智症年齡限制…）導向相關條文、主題與碼別。
- **結果分層**：直接命中 / 實務主題 / 相關法規 / 照顧組合碼 / 附表 / 生效日 / 跨制度輔具提示，不混成單一列表。
- **命中理由**：每筆結果標示命中來源（直接命中、同義詞命中、實務主題命中、關鍵字命中、引用提及、輔具提示…）。
- **加權排序**：碼別完全命中 > 條文完全命中 > 實務主題完全命中 > 同義詞 > 標題/名稱 > keywords > 全文 > 引用提及 > 輔具提示。
- **搜尋高亮**：結果摘要以 `<mark>` 標示命中字詞。

搜尋規則與實務資料皆為前端設定／唯讀載入，不修改 `knowledge/` 原始 JSON。

## 部署（GitHub Pages）

本專案以 GitHub Actions 自動建置並部署 Vite `dist/` 至 GitHub Pages：

- `vite.config.ts` 設定 `base: '/longcare-knowledge-platform/'`（與 repo 名稱一致），避免子路徑下資源 404 造成空白頁。
- `BrowserRouter` 以 `import.meta.env.BASE_URL` 作為 `basename`，使子路徑路由正確。
- workflow：`.github/workflows/deploy.yml`（push main → `npm ci` → `npm run build` → `upload-pages-artifact` → `deploy-pages`），並將 `index.html` 複製為 `404.html` 作為 SPA fallback。

啟用方式：GitHub repo → Settings → Pages → Build and deployment → Source 選擇 **GitHub Actions**。

## Version History

### V1.4.2 — Knowledge Rule Model
- Topic 新增「原則／例外」知識模型欄位：`rule`、`exceptions`、`rule_basis`、`exception_basis`
- TopicDetailPage 調整為「摘要 → 原則 → 例外規定 → 可使用 → 不得使用 → 有條件使用 → …」順序與配色
- 外籍看護以 Rule/Exception 重新整理；BA09／BA09a 改列例外（不再誤列為「不得使用」），修正「所有 BA 碼不得使用」之過度簡化
- 新增函釋／公告資料架構 `knowledge/interpretations/`（README、schema、第一筆 BA09／BA09a 例外函釋）
- 新增 `DEVELOPMENT_RULES.md`（不可妥協原則）與 `KNOWLEDGE_GOVERNANCE.md`（知識治理規範）
- Smart Search 預留 Interpretation Layer（TODO，本版不整合）

### V1.4.1 — Practical Knowledge Enhancement
- 將高價值實務主題由「搜尋結果整理」升級為「實務知識頁」
- 新增主題知識欄位：can_use／cannot_use／conditional_use／quota_rules／compatibility／restrictions／common_mistakes／law_basis／manual_review
- 每一條「可以使用／不得使用／限制」均附法規依據（article／appendix／code／citation），無依據不顯示、不推論
- TopicDetailPage 重新排版並加入顏色標示（綠＝可使用、黃＝有條件、紅＝限制、灰＝法規依據）
- 修正錯誤關聯：外籍看護移除無依據之 BA08／BA09／BA09a；新增 BA07（協助沐浴及洗頭）主題
- 本版升級對象：外籍看護、BA07 協助沐浴及洗頭、交通接送、日間照顧、喘息服務

### V1.4.0
- 新增實務主題列表頁 `/topics`
- 新增實務主題詳情頁 `/topics/:topicId`（採檔名 id，如 topic-001）
- 搜尋結果之主題卡片可連結至主題詳情
- 主題頁顯示相關條文、碼別、附表、相關主題、常見問題、法規來源
- 首頁新增常用實務主題；導覽列新增「實務主題」
- 保留純前端架構，不啟用 AI／後端

### V1.3.1
- 修正 GitHub Pages 空白頁問題
- 改用 GitHub Actions 部署 Vite `dist`
- 設定 Vite `base` path 與 Router `basename`

### V1.3.0
- 新增 Smart Search（規則式、非 AI）
- 新增同義詞搜尋（`src/data/smartSearchRules.ts`）
- 新增實務查詢導引（口語問句 → 法規／主題／碼別）
- 新增搜尋結果分層（7 層）與命中理由標示
- 新增搜尋排序權重與命中高亮
- 載入第二層實務主題資料（`knowledge/practical`）參與搜尋
- 首頁新增「常用實務查詢」
- 保留 V1.2.0 跨制度身障／醫療輔具提示（不混入主結果）

### V1.2.0
- 新增身障／醫療輔具查詢頁（`/assistive-devices`）
- 主搜尋新增跨制度輔具提示（hint 卡片，不混入主結果）
- 身障／醫療輔具資料與長照主搜尋分離
- 新增 `src/config/version.ts`，首頁與頁尾顯示版本
- 不啟用 AI、不啟用後端

### V1.0.0
- 長照法規搜尋系統初版：條文／碼別／附表／生效日搜尋、修法沿革、AI 問答預留頁
