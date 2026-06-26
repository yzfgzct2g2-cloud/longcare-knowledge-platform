# DEVELOPMENT_RULES.md — 不可妥協原則

本檔列出本專案開發之**不可妥協原則（non-negotiable rules）**。任何版本、任何貢獻者皆不得違反。與 [`KNOWLEDGE_GOVERNANCE.md`](KNOWLEDGE_GOVERNANCE.md) 並列為最高開發規範。

## 1. Evidence First（先有依據才有結論）

任何「可以使用 / 不得使用 / 限制事項 / 例外規定 / 額度 / 適用條件」之陳述，**必須**引用下列已納入資料庫之正式來源之一：

- 法規條文（`knowledge/regulations/`）
- 附表（appendix）
- 正式函釋 / 公告（`knowledge/interpretations/`）

不得僅憑摘要、印象或推論建立結論。

## 2. 無依據則不下結論

若無法引用上述來源：

- **不得**建立「可以 / 不得 / 限制」之結論。
- 應將該筆標記 `manual_review = true`，留待人工確認。

## 3. 禁止 AI 推論

知識內容（Topic / Rule / Exception / 額度 / 條件）**不得**由 AI 推論產生。本平台目前不啟用 AI、不建立後端、不呼叫外部 API、不使用 API key、不開發 AA01 生成。

## 4. 不得過度簡化

法規常具「原則 → 例外 → 特殊條件」層級。不得以單一句概括（例如「所有 BA 碼不得使用」）而抹除明文例外（如附表四 BA09／BA09a 第四點）。應以 `rule` / `exceptions` 區分呈現。

## 5. Single Source of Truth

每一份資料只能有一個正式來源，不得重複維護、不得建立第二份 `practical`、不得建立 `practical-decision`。修正既有知識請直接升級既有 Topic / 來源檔。

## 6. Never Overwrite（不得覆寫）

新資料不得直接覆蓋舊資料之事實。應透過版本、生效日期、`supersedes`、`status` 表達取代關係（見 interpretations schema）。

## 7. Traceability（可追溯）

任何搜尋結果、Topic、Rule、Exception、未來 AI 回答，皆須可追溯至來源法規／附表／函釋／公告及其版本與日期。

---

> 違反上述任一原則之變更，視為不合格，應退回修正。
