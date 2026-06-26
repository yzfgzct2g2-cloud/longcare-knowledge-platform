# ARCHITECTURE.md — 長照法規知識平台 Knowledge Architecture

本檔描述整個知識平台的資料模型與分層架構。所有未來新增之法規、函釋、規則、案例、知識關聯，皆須依本架構建立，不得任意建立新的資料格式。

核心原則：Single Source of Truth、Evidence First、Knowledge Governance、Knowledge Lifecycle、Knowledge Traceability、Future Compatible。

---

## 七層知識架構（Knowledge Layers）

| Layer | 名稱 | 內容 | 位置 | priority | 狀態 |
|---|---|---|---|---|---|
| 1 | Regulations 正式法規 | 條文、附表、逐條說明 | `regulations/` | 100（附表 95、逐條說明 80） | ✓ 完成 |
| 2 | Interpretations 函釋 | 函釋、公告、行政解釋、修正說明 | `interpretations/` | 90 | ✓ 架構＋首筆 |
| 3 | Rule Engine 規則引擎 | 規則、例外、限制、額度、條件 | `rule-engine/` | 85 | ✓ 架構＋首筆（本版） |
| 4 | Practical Topics 實務主題 | 實務主題整理（呈現層） | `practical/` | 80 | ✓ 完成（21 主題） |
| 5 | Assistive Devices 輔具 | 長照／身障／醫療輔具 | `assistive-devices/` | 80 | ✓ 完成（93 項） |
| 6 | Cases 匿名案例 | 去識別化實務案例 | `cases/` | 70 | ✓ 架構（本版，無案例） |
| 7 | Knowledge Graph 知識關聯 | 跨層節點與關聯 | `knowledge-graph/` | — | ✓ 架構＋示範（本版） |
| （輔助） | Search 搜尋規則 | 同義詞、Smart Search | `src/data/smartSearchRules.ts` | 60 | ✓ 完成 |

> priority 數字越大，效力／查詢優先序越前。低層不得牴觸高層。

---

## ASCII 架構圖

```
                ┌─────────────────────────────────────────────┐
                │   長照法規知識平台 Knowledge Platform        │
                └─────────────────────────────────────────────┘

   證據來源（Evidence）                      解釋與規則（Reasoning）
 ┌──────────────────────┐                 ┌──────────────────────────┐
 │ L1 Regulations  (100)│  ──引用──▶      │ L2 Interpretations  (90) │
 │  條文 / 附表 / 逐條   │ ◀─supersedes─   │  函釋 / 公告 / 行政解釋   │
 └──────────┬───────────┘                 └────────────┬─────────────┘
            │  citations                                │ citations
            ▼                                           ▼
 ┌──────────────────────────────────────────────────────────────────┐
 │ L3 Rule Engine (85)  rule / exception / limit / quota / condition  │
 │   每條 Rule 必引用 L1 / L2，不得自行推論                          │
 └───────────┬───────────────────────────────────┬──────────────────┘
             │ rule_reference                      │ rule_reference
             ▼                                     ▼
 ┌────────────────────────┐            ┌────────────────────────────┐
 │ L4 Practical Topics(80) │            │ L5 Assistive Devices  (80) │
 │  呈現層（引用 Rule/L1） │            │  長照 / 身障 / 醫療輔具     │
 └───────────┬────────────┘            └──────────────┬─────────────┘
             │                                          │
             ▼                                          ▼
 ┌────────────────────────┐            ┌────────────────────────────┐
 │ L6 Cases (70)           │            │  Search 輔助 (60)           │
 │  匿名案例（引用 Rule）  │            │  同義詞 / Smart Search      │
 └───────────┬────────────┘            └────────────────────────────┘
             │
             ▼
 ┌────────────────────────────────────────────────────────────────┐
 │ L7 Knowledge Graph  節點＋關聯（跨所有層，僅引用不重複維護）     │
 │   article-10 → foreign-caregiver-rule → topic-001 → BA09 → 函釋 │
 └────────────────────────────────────────────────────────────────┘
```

---

## 各層職責（Single Source of Truth）

- **Regulation** 只負責正式法規（條文／附表原文）。
- **Interpretation** 只負責解釋（函釋／公告／修正說明）。
- **Rule** 只負責規則（原則／例外／限制／額度／條件），且必引用 L1／L2。
- **Topic** 只負責呈現（整合並引用 Rule／L1／L2，不得自行寫死規則）。
- **Case** 只負責案例（引用 Rule／法規，不重述規則內容）。
- **Knowledge Graph** 只負責關聯（節點間引用，不重複維護內容）。

任一事實只在其「來源層」維護一次；其他層以引用（citation / reference id）連結，不得雙向重複維護。

---

## 缺少／後續（截至 V1.5.0）

- Rule Engine：僅首筆 `foreign-caregiver-001`，其餘高價值主題之 Rule 待補。
- Cases：僅 Schema，尚無案例。
- Knowledge Graph：僅示範節點，待擴充。
- Interpretation Layer 之搜尋整合：仍為 TODO（見 `src/lib/smartSearch.ts`）。
- 載入層：Rule／Case／Graph 尚未接入前端（本版為資料架構，不含前端整合）。
