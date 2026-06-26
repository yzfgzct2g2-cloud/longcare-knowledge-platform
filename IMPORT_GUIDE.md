# IMPORT_GUIDE.md — 知識匯入指南

說明未來新法規、函釋、公告、地方政府公文如何加入本平台。所有匯入皆須遵循 `KNOWLEDGE_GOVERNANCE.md` 與 `DEVELOPMENT_RULES.md`。

## 匯入流程

```
PDF / 公文 / 公告（原始來源）
   ↓  保存於 01-official/（Raw，不修改）
raw
   ↓  依層別 schema 結構化為 JSON
structured
   ↓  引用查核 + JSON 驗證 + manual_review 判定
validation
   ↓  屬規則／例外／額度者，建立或更新 Rule（rule-engine/）
rule
   ↓  於 knowledge-graph/ 建立節點與關聯
graph
   ↓  於 practical/topics/ 以引用方式呈現（不寫死規則）
topic
```

## 各類型對應位置與 schema

| 資料類型 | 位置 | Schema | priority |
|---|---|---|---|
| 正式法規條文／附表 | `regulations/`（唯讀，受保護） | 既有 article/appendix 結構 | 100 / 95 |
| 函釋／公告／行政解釋 | `interpretations/` | `interpretations/interpretation-schema.json` | 90 |
| 規則／例外／額度 | `rule-engine/` | `rule-engine/rule-schema.json` | 85 |
| 實務主題 | `practical/topics/` | 既有 topic 欄位（含 rule/exceptions） | 80 |
| 輔具 | `assistive-devices/`（唯讀，受保護） | 既有 device 結構 | 80 |
| 匿名案例 | `cases/` | `cases/case-schema.json` | 70 |
| 知識關聯 | `knowledge-graph/` | `knowledge-graph/graph-schema.json` | — |

## 規則（不可違反）

1. **不得修改** `regulations/`、`assistive-devices/` 原始 JSON（受保護來源層）。
2. **不得直接覆寫**任何既有資料；以 `version`／`status`／`supersedes`／`effective_date` 表達取代。
3. 每筆匯入須附 `citation` 並可追溯至原始來源與日期。
4. 無法確認者 `manual_review = true`；不得 AI 推論。
5. 規則一律於 `rule-engine/` 維護，Topic 僅引用。

## 範例：地方政府公告之匯入

1. 原始 PDF 置於 `01-official/`（Raw）。
2. 於 `interpretations/` 建立 JSON，`source_type: "local_government_rule"`，填入 citation 與 original_text。
3. 若影響額度／適用，於 `rule-engine/` 新增或更新 Rule（標 `manual_review` 視確定性）。
4. 於 `knowledge-graph/` 連結相關 article／topic／code 節點。
5. 相關 Topic 之呈現以引用方式更新（不寫死）。
