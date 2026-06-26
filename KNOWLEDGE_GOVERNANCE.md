# KNOWLEDGE_GOVERNANCE.md — 知識治理規範

本檔為本平台**所有法規資料之最高原則**。任何開發皆不得違反 Knowledge Governance。實作層級之不可妥協原則另見 [`DEVELOPMENT_RULES.md`](DEVELOPMENT_RULES.md)。

> 本平台建立目的不是「搜尋」，而是建立**可信、可追溯、可驗證、可持續維護、可供 AI 使用**之長照法規知識平台。

---

## 一、Single Source of Truth（單一事實來源）

任何法規、附表、函釋、公告、逐條說明、Topic，**不得重複維護**。每一份資料只能有一個正式來源。修正須升級該來源，不得另建平行副本（不得建立第二份 `practical`、`practical-decision`）。

## 二、Data Hierarchy（知識層級與優先順序）

查詢結果之優先順序依下列層級決定（對應 interpretation `priority`）：

| Level | 內容 | 位置 | priority |
|---|---|---|---|
| 1 | 正式法規（最新修正條文與附表） | `knowledge/regulations/` | 100 |
| 2 | 正式函釋／公告／行政解釋 | `knowledge/interpretations/` | 90 |
| 3 | 逐條說明 | `regulations/`（explanation） | 80 |
| 4 | Practical Topic（實務主題整理） | `knowledge/practical/` | 70 |
| 5 | 搜尋規則／同義詞（Smart Search） | `src/data/smartSearchRules.ts` | 60 |

高層級資料優先於低層級；低層級不得牴觸高層級。

## 三、Never Overwrite（不得覆寫）

任何新資料不得直接覆蓋舊資料。應建立：版本、生效日期、是否取代（`supersedes`）、引用來源。被取代者標 `status: superseded` 而非刪除。

## 四、Evidence First（先有依據）

任何「可以使用／不得使用／限制／例外／額度／適用條件」，皆須引用法規／附表／函釋／公告等正式來源。不得 AI 推論、不得無引用。

## 五、Future Compatible（向後相容）

未來加入 AI、地方政府公告、新法、函釋時，**不得修改 Topic 本身**，而應**新增資料**，由搜尋引擎依 `priority` 自動整合。

## 六、Version History（版本歷程）

每一份 Interpretation / Topic / Rule 皆保留建立日期、更新日期、對應法規版本，不得直接覆寫歷史。

## 七、Manual Review（人工確認）

任何無法確認、存在不同解釋、地方政府不同規定者，皆標 `manual_review = true`，不得直接下結論。

## 八、Knowledge Traceability（可追溯）

任何搜尋結果、Topic、Rule、Exception、未來 AI 回答，皆須可追溯至：來源法規、來源附表、來源函釋、來源公告、來源版本、來源日期。任何結論皆須可追溯。

## 九、新增資料流程

1. 判斷資料類型（法規／函釋／公告／逐條說明／Topic）
2. 確認是否已有同來源（避免重複維護）
3. 建立資料（不得覆寫）
4. 建立 Citation
5. 建立 Priority
6. 建立 Search Mapping

## 十、最高原則

本平台目的為建立可信、可追溯、可驗證、可持續維護、可供 AI 使用之長照法規知識平台。任何開發皆不得違反本 Knowledge Governance。

---

## 十一、Knowledge Lifecycle（知識生命週期）

任何新增資料**不得直接覆寫**，須依下列生命週期推進：

```
Raw（原始：PDF／公文／公告）
   ↓
Structured（結構化：依各層 schema 建立 JSON）
   ↓
Validation（驗證：引用查核、JSON 驗證、manual_review 判定）
   ↓
Publish（發布：status=active，納入 priority 與搜尋）
   ↓
Archive（封存：被取代者 status=superseded／archived，保留歷史，不刪除）
```

## 十二、Knowledge Update Workflow（新增資料流程）

| Step | 動作 |
|---|---|
| 1 | 判斷資料類型（法規／函釋／公告／逐條說明／Topic／Rule／Case） |
| 2 | 建立 Raw（保留原始來源，如 `01-official/`） |
| 3 | 建立 Structured（依對應層 schema 建立 JSON） |
| 4 | 建立 Citation（引用 L1／L2 來源與日期） |
| 5 | 建立 Rule（如屬規則／例外／額度，於 `rule-engine/` 建立或更新 Rule） |
| 6 | 更新 Graph（於 `knowledge-graph/` 新增節點與關聯） |
| 7 | 更新 Search（必要時於 `smartSearchRules.ts` 增同義詞／導引） |
| 8 | 更新 Topic（呈現層引用上述，不寫死規則） |

## 十三、Rule／Topic／Interpretation／Case 彼此引用原則

- **Rule** 引用 Regulation／Interpretation；被 Topic／Case／Graph 引用。
- **Topic** 引用 Rule／Regulation／Interpretation（呈現），不重述規則。
- **Interpretation** 引用 Regulation；被 Rule／Topic 引用。
- **Case** 引用 Rule／Regulation；不重述規則。
- **嚴禁雙向重複維護**：同一事實只在來源層維護一次，其餘層以 id／citation 單向引用。

