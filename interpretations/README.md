# knowledge/interpretations

本資料夾用於放置**正式函釋、公告、補充說明、修正解釋**，以及其他會影響現行法規判斷之資料。

## 與 regulations 的關係

- **不得**與 `knowledge/regulations/` 原始條文混放。
- `regulations/` 為法規母檔（條文與附表原文）；本資料夾為「解釋與補充」層，用以釐清條文適用、例外與實務判斷。

## 效力順序（查詢時的優先序）

未來查詢／判斷時，效力由高至低為：

1. 最新修正條文與附表（`knowledge/regulations/`）
2. 正式函釋／公告／補充說明（本資料夾 `knowledge/interpretations/`）
3. 逐條說明（`regulations/` 之 explanation）
4. 實務主題整理（`knowledge/practical/`）
5. 搜尋同義詞與輔助規則（前端 `src/data/smartSearchRules.ts`）

## 檔案格式

每筆函釋／補充說明為一個 JSON 檔，欄位定義見 [`interpretation-schema.json`](interpretation-schema.json)。

- `source_type`：`official_interpretation`｜`official_notice`｜`amendment_note`｜`local_government_rule`｜`manual_review_note`
- `status`：`active`｜`superseded`｜`archived`｜`draft`
- `priority`：數字，越大效力參考序越前（預設 90）
- `manual_review`：無法確認時設為 `true`，不得自行推論

## 現有檔案

- `interpretation-ba09-ba09a-foreign-caregiver.json` — 聘有外籍看護者使用 BA09／BA09a 之例外規定（附表四第四點）。
