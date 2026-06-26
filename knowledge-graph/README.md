# knowledge/knowledge-graph — Layer 7 知識關聯

本資料夾存放**知識圖（Knowledge Graph）**：以節點（node）與關聯（relation）連結跨層之法規、函釋、規則、主題、碼別。圖只負責「關聯」，內容仍維護於各來源層，圖僅以 id 引用，不重複維護。

## 節點型別（node_type）

`article`（法規條文）、`appendix`（附表）、`code`（照顧組合碼）、`rule`、`topic`、`interpretation`、`case`、`device`。

## 檔案格式

每個圖檔為節點陣列，每個節點符合 [`graph-schema.json`](graph-schema.json)。`relations` 內以 `{ type, target }` 指向其他 `node_id`。

## 示範

`graph-foreign-caregiver.json` 示範外籍看護知識鏈：

```
article-10  ──defines──▶  rule:foreign-caregiver-001
rule:foreign-caregiver-001  ──exception_of──▶  code:BA09 / code:BA09a
rule:foreign-caregiver-001  ──presented_by──▶  topic-001
rule:foreign-caregiver-001  ──clarified_by──▶  interpretation-ba09-ba09a-foreign-caregiver
topic-001  ──cites──▶  article-10 / appendix-04
```

## 現況

本版（V1.5.0）僅建立 Schema 與一組示範節點，待後續擴充。
