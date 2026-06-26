# knowledge/rule-engine — Layer 3 規則引擎

本資料夾存放**規則（Rule）**：將法規與函釋之「原則 → 例外 → 限制 → 額度 → 條件」結構化，供 Topic、Case、Knowledge Graph 引用。

## 原則

- **Evidence First**：每條 Rule 之 conditions／exceptions／results 皆須在 `citations` 引用 L1（regulations）或 L2（interpretations）之正式來源。不得自行推論。
- **Single Source of Truth**：規則只在此處維護一次；Topic／Case 以 `rule_id` 引用，不得把規則寫死於 Topic。
- **Never Overwrite**：規則變更以 `version`／`status`／`supersedes` 表達，不得直接覆寫。
- **Manual Review**：無法確認或有不同解釋者，`manual_review = true`。

## 檔案格式

每條規則為一個符合 [`rule-schema.json`](rule-schema.json) 的 JSON 檔，命名為 `<rule-slug>.json`。

- `priority` 建議 85（Rule 層）。
- `status`：`draft` / `active` / `superseded` / `archived`。

## 現有規則

- `foreign-caregiver-001.json` — 聘有外籍看護者之 30% 額度原則，及 BA09／BA09a 例外（引用第十條、附表四）。
