專案名稱：
長照法規查詢系統

目前完成：

1. 法規母檔
2. JSON資料庫
3. search-index
4. code-map
5. effective-date-map
6. BUILD_REPORT
7. FINAL_DATABASE_REPORT

統計：

22條條文
7份附表
166碼別
173搜尋關鍵字

下一階段：

React/Vite法規查詢頁

需求：

1. 條文搜尋
2. 碼別搜尋
3. 生效日搜尋
4. 修法沿革搜尋
5. AI法規問答

## Version 1.2.0

完成日期：

2026-06-25

完成內容：

- 身障／醫療輔具資料入口
- Assistive Devices Page
- 主搜尋跨制度提示
- GitHub Repository 建立
- 第一版正式版本上傳 GitHub

## Version 1.3.0

完成日期：

2026-06-26

完成內容：

- 新增 Smart Search（規則式、非 AI）
- 新增同義詞搜尋
- 新增實務查詢導引
- 新增結果分層
- 新增命中理由
- 新增搜尋排序權重
- 保留跨制度輔具提示

## Version 1.3.1

完成日期：

2026-06-26

完成內容：

- 修正 GitHub Pages 空白頁問題
- 改用 GitHub Actions 部署 Vite dist
- 設定 Vite base path（/longcare-knowledge-platform/）與 Router basename

## Version 1.4.0

完成日期：

2026-06-26

完成內容：

- 新增實務主題列表頁
- 新增實務主題詳情頁
- 搜尋結果可連結主題詳情
- 主題頁顯示相關條文、碼別、附表、常見問題
- 保留純前端架構
- 不啟用 AI
- 不啟用後端

## Version 1.4.1（Practical Knowledge Enhancement）

完成日期：

2026-06-26

完成內容：

- 將高價值主題升級為實務知識頁
- 新增知識欄位：can_use / cannot_use / conditional_use / quota_rules / compatibility / restrictions / common_mistakes / law_basis / manual_review
- 每筆可使用／不得使用／限制均附法規依據，無依據不顯示
- TopicDetailPage 重排版＋顏色標示
- 修正外籍看護錯誤關聯（移除 BA08/BA09/BA09a）；新增 BA07 協助沐浴及洗頭主題
- 升級主題：外籍看護、BA07 協助沐浴及洗頭、交通接送、日間照顧、喘息服務
- 維持單一資料來源（直接升級 knowledge/practical/topics）

## Version 1.4.2

完成日期：

2026-06-26

完成內容：

- 修正外籍看護 BA09／BA09a 例外規定（改列有條件使用，不再列入不得使用）
- 修正「所有 BA 碼不得使用」之過度簡化描述
- 新增函釋／公告／補充說明資料架構 knowledge/interpretations
- 建立 interpretation schema
- 建立 BA09／BA09a 外籍看護例外規定 interpretation 範例
- Topic 新增 rule／exceptions／rule_basis／exception_basis 知識模型欄位
- TopicDetailPage 調整為「原則 → 例外規定 → …」順序
- 新增 DEVELOPMENT_RULES.md 與 KNOWLEDGE_GOVERNANCE.md（知識治理）
- Smart Search 預留 Interpretation Layer（TODO）

## Version 1.5.0（Knowledge Architecture）

完成日期：

2026-06-26

完成內容：

- 建立七層知識架構（ARCHITECTURE.md，含 ASCII 圖）
- 新增 Layer 3 Rule Engine（rule-engine/）、Layer 6 Cases（cases/）、Layer 7 Knowledge Graph（knowledge-graph/）
- 各層 schema 與 metadata（version/created_at/updated_at/status/manual_review/priority）統一
- 更新 KNOWLEDGE_GOVERNANCE（Lifecycle、Update Workflow、跨層引用）
- 更新 DEVELOPMENT_RULES（Architecture Principle）
- 新增 IMPORT_GUIDE.md
- 純架構版本，未動 regulations／assistive-devices，未新增搜尋／AI／AA01／後端