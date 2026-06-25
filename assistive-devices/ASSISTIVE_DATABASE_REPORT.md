# 身障／醫療輔具資料庫建置報告（ASSISTIVE DATABASE REPORT）

第三層資料庫位置：`knowledge/assistive-devices/`
建置性質：**法規資料整合**（非 AI 推論、非推薦系統、未產生任何照護建議）。

## 資料來源（唯讀，未修改）

| 檔案 | 頁數 | 用途 |
|---|---|---|
| `身心障礙者輔具費用補助辦法1111020.pdf` | 4 | 母法（111.10.20修正，112.01.01施行，全文22條） |
| `附表　身心障礙者輔具費用補助基準表.pdf` | 95 | 身障輔具項目、序次、補助金額、年限、評估分類、補助規定 |
| `附表　醫療復健費用及醫療輔具補助標準.pdf` | 13 | 醫療復健費用＋醫療輔具項目與三級補助金額 |

> 另有 `身心障礙者輔具費用補助資源手冊.pdf`（159頁）為宣導手冊，非法規，未納入。

## 重要技術前提（影響資料完整度，必讀）

三份來源 PDF **無可抽取之中文文字層**（中文採子集化字型、無 ToUnicode 對映；`pdftotext` 僅能取得數字）。因此本階段以 **PyMuPDF 將每頁影像化 → RapidOCR 中文 OCR** 取得文字，並以逐頁影像目視核對關鍵數值。

OCR 對**內文文字**辨識良好，但對**金額欄**辨識不穩定（千分位逗號常被切成「6, 500」，242 個金額僅 16 個以標準格式還原）。依使用者限制「不得自行推測補助金額／使用年限」，凡無法可靠辨識或目視核對之金額／年限，一律**留空並標記 `manual_review: true`**，絕不臆造。

## 建置統計

| 項目 | 數量 |
|---|---|
| **1. 身障輔具項目數（system=disability）** | **78** |
| **2. 醫療輔具項目數（system=medical）** | **15**（醫療復健費用 3＋醫療輔具 12） |
| 　　總項目數 | **93** |
| **3. 分類數量** | 身障 **10 大類**（含 6 子類，目次列為 15 列）＋ 醫療 **2 類**＝ 對照表 **17 列** |
| **4. 同義詞數量（search-index 別名總計）** | **196**（涵蓋 93 個品項） |
| **5. 跨制度對照數量** | **8**（制度層級 2＋品項層級 6） |
| **6. manual_review 數量** | **86 / 93** |
| **7. 缺漏資料數量** | 缺補助金額 **75**、缺最低使用年限 **86**（其中醫療復健費用之年限欄原表即為空白，屬正常） |
| **8. JSON 驗證結果** | **4 / 4 全部通過** |

### 已逐項核對（amount 已驗證、manual_review=false）共 7 項

- 身障（基準表逐頁目視核對）：推車－一般型（6,500/3年/甲類）、推車－荷重型（12,000/3年/甲類）、推車－躺位型（28,000/3年/甲類）、輪椅－非輕量化量產型（3,500/3年/不需評估）。
- 醫療復健費用（逐頁目視核對）：人工電子耳植入手術費用（120,000/90,000/60,000，終身一次）、開具診斷證明書費用（200/200/100）、開具醫療輔具評估報告費用（200/200/100）。

### manual_review 內容分布

| 類型 | 數量 | 原因 |
|---|---|---|
| 身障家族／品項骨架（取自基準表目次） | 74 | 名稱、分類、序次範圍可靠；個別項次之金額／年限／評估分類須依基準表逐項補正 |
| 醫療輔具（編碼1-13、壓力衣、矽膠片） | 12 | 補助金額取自 OCR，最低使用年限欄未能可靠辨識，須對照原 PDF |

## 檔案結構

```
knowledge/assistive-devices/
├── assistive-device-database.json     # 93 項（schema 如需求；另含 manual_review/review_reason/level）
├── assistive-category-map.json        # 17 列分類（依法規目次，未自創分類）
├── assistive-search-index.json        # 93 品項，196 別名（名稱/簡稱/常見稱呼/同義詞）
├── assistive-cross-reference.json     # 8 筆跨制度對照
└── ASSISTIVE_DATABASE_REPORT.md
```

每筆 device 紀錄欄位：`id / name / system / category / subcategory / subsidy_amount / renewal_years / need_assessment / assessment_required / required_documents / applicable_conditions / effective_date / source_law / citation / original_text / keywords`，並依需要附 `manual_review / review_reason / level`。`system` 僅使用 `disability` / `medical`（`longcare` 保留作跨制度對照值，現有項目皆為前二者）。

## 跨制度對照（assistive-cross-reference.json）

**制度層級（法規明確、manual_review=false）：**
1. 身障輔具 ↔ 醫療輔具：兩表項目合併計算「每人每二年補助四項」（醫療標準備註2、身障辦法第7條）。
2. 身障輔具 ↔ 長照輔具：長照辦法第10條第3項（相同輔具未達使用年限不得重複申請）、第20條（長照輔具準用身心障礙者輔具費用補助辦法）。已連結 `regulations:article-10/20` 與 `practical:topic-016-身障輔具`。

**品項層級：** 人工電子耳（身障↔醫療，名稱一致，false）；居家用照顧床↔長照 EI04、移位輔具↔長照 EI01、居家無障礙修繕↔長照 F碼、氣墊床/減壓座墊↔長照 E碼、輪椅↔長照 E碼（以上名稱相近但分屬不同制度／給付方式，皆 `manual_review:true`）。

> 依限制「僅法規明確存在或名稱高度一致才建立關聯」：制度層級關聯有明文依據；品項層級除人工電子耳外，因跨制度品項是否為同一物無法由現有資料庫確認，一律標 `manual_review:true`。

## 需人工補充清單

1. **基準表 242 項次之逐項金額／年限／評估分類**：本階段以「目次家族層級」建檔（74 筆），未逐項展開全部 242 個序次之個別金額。需以原 PDF 逐頁補正（建議具中文 PDF 文字層或人工輸入）。
2. **醫療輔具 12 項之金額複核與年限**：OCR 金額須對照原 PDF；壓力衣 A–K 各款金額須逐款確認。
3. **醫療標準之施行日期**：來源附表未明列，`effective_date` 留空待補。
4. **個人照顧及保護輔具、矯具及義具之目次裝置名稱**：OCR 有少數缺漏字，已於 category-map 標註待補正。
5. **長照 E碼是否涵蓋輪椅／氣墊床等**：現有長照資料庫（附表四 E碼採結構化欄位）無法確認，品項層級對照保留 manual_review。

## 限制遵循情形（自我檢核）

| 限制 | 遵循 |
|---|---|
| 不得自行推測補助金額 | ✔ 僅收錄 OCR 可辨識或目視核對之金額；不確定者留空＋manual_review |
| 不得自行推測使用年限 | ✔ 同上；原表空白即留空 |
| 不得自行建立照護建議 | ✔ 全程無任何建議性內容 |
| 不得建立 AI 規則 | ✔ 純資料整合 |
| 保留完整法規原文 | ✔ `original_text` 保留 OCR 擷取原文，並註明來源為掃描頁 OCR |
| 保留法規來源 | ✔ 每筆具 `source_law` 與 `citation` |
| 無法確認時 manual_review:true | ✔ 86/93 已標記 |
| 未修改 regulations / practical / 來源 PDF | ✔ 僅讀取 |

## JSON 驗證結果

`assistive-device-database.json`、`assistive-category-map.json`、`assistive-search-index.json`、`assistive-cross-reference.json` — **4 / 4 解析通過**。
