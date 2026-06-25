# 長期照顧服務申請及給付辦法　法規資料庫最終報告（FINAL DATABASE REPORT）

建置基準：115/07/01最新版
資料庫位置：`knowledge/regulations/`
母檔：`knowledge/01-official/長期照顧服務申請及給付辦法_1150701_逐條說明完整版.md`

---

## 一、條文數

**22 條**（應為 22　✔ 符合）
article-01.json ～ article-22.json，條次 1～22 連續無缺漏。

## 二、附表數

**7 份**（應為 7　✔ 符合）

| 檔案 | 附表 | 狀態 |
|---|---|---|
| appendix-01.json | 附表一 照顧問題清單 | 沿用111版 |
| appendix-02.json | 附表二 額度表 | 115修正 |
| appendix-03.json | 附表三 交通接送服務給付分區表 | 115修正 |
| appendix-04.json | 附表四 照顧組合表 | 115修正（161項，全文化） |
| appendix-04-1.json | 附表四之一 智慧科技輔具 | 115新增（5類，全文化） |
| appendix-05.json | 附表五 部分負擔比率 | 115修正 |
| appendix-06.json | 附表六 原民區或離島範圍 | 沿用111版 |

## 三、關鍵字數

- **search-index.json 關鍵字數：173 個**（對應 286 筆條文／附表）
- 附表四＋附表四之一 item 層級 keywords 總數：**840 個**

## 四、E碼數量

**47 個**（EA01；EB01～EB04；EC01～EC12；ED01～ED08；EE01～EE05；EF01～EF03；EG01～EG09；EH01～EH05）
全部具完整 `original_text`。

## 五、F碼數量

**29 個**（FA08、FA13、FA15、FA17、FA18、FA19、FA22～FA44）
全部具完整 `original_text`。

## 六、EI碼數量

**5 個**（EI01 移位類、EI02 移動類、EI03 沐浴排泄類、EI04 居家照顧床類、EI05 安全看視類）
全部具完整 `specification`／`original_text`／`apply_target`。

## 七、code-map 數量

**166 個**（`code-map.json`）
= 附表四 161 項照顧組合 + 附表四之一 5 項智慧科技輔具。
用途：輸入碼別（如 FA08、EI01）即可定位所屬附表與標題、關鍵字。

## 八、全文化完成率

**100%**（166 / 166 個照顧組合 items 皆具非空 `original_text`）

- 附表四 161 項（含 AA/BA/BB/BC/BD/CA/CB/CC/CD/DA/GA 服務碼 85 項 + E碼 47 + F碼 29）全部全文化。
- 附表四之一 5 項全部全文化。
- 每一 item 採統一升級結構：`code／name／category／group／service_type／payment_type／price_limit／minimum_years／conditions／specification／original_text／revision_115／keywords／search_text／citation`（附表四之一另含 `apply_target`）。

## 九、新增欄位說明

| 欄位 | 用途 |
|---|---|
| search_text | 合併 code＋name＋conditions＋specification＋original_text＋keywords 之全文字串，前端可直接 `search_text.includes(keyword)` 完成全文搜尋 |
| citation | AI 引用格式，如「附表四－FA08」「附表四之一－EI01」 |
| revision_115 | 是否屬115修正內容（布林值） |

## 十、待人工確認項目

共 **4 項**：

1. **F 碼新舊碼別對照**：111版 FA01～FA21 與115版 FA08、FA13、FA22～FA44 之對應關係，已於母檔列出對照摘要；各碼別給付上限與修繕標的文字均有調整，建議逐項以115定稿附表四再核對後建立對照表。
2. **施行日期細分**：appendix-04.json 之 item 多數採附表整體生效日 115-07-01，惟 BA08、BA09、BA09a 之 `effective_date` 標記為 115-01-01；其餘服務碼本文屬114-09-01生效，F碼項目屬115-07-01生效。如前端需逐碼精確顯示生效日，須再依第二十二條分階段規定細分。
3. **payment_type 分類為輔助標註**：服務碼統一標為「定額給付」、輔具購置標「實報實銷（以給付上限為限）」、租賃標「租賃（以給付上限為限）」、DA01 標「地方主管機關訂定公告」。此為便於前端分類之輔助欄位，非法規明文用語，實際支付方式仍以照顧及支付相關規定為準。
4. **CB01／CB01a 銜接**：115版刪除原 CB01（四次措施 4,000/4,800），新增 CB01a（三次措施 4,500/5,400）；歷史申報資料之停用與銜接時點須確認。

## 十一、檔案清單（共 32 個檔）

- 條文 JSON × 22（article-01 ～ article-22）
- 附表 JSON × 7（appendix-01～06、appendix-04-1）
- 索引 JSON × 1（search-index.json）
- 映射 JSON × 1（code-map.json）
- 報告 MD × 3（BUILD_REPORT.md、SEARCH_TEST.md、FINAL_DATABASE_REPORT.md）

---

## 最終回報

| 項目 | 數量／結果 |
|---|---|
| 1. E碼總數 | **47** |
| 2. F碼總數 | **29** |
| 3. EI碼總數 | **5** |
| 4. code-map 總數 | **166** |
| 5. 關鍵字總數（search-index） | **173**（item層級另計 840） |
| 6. 全文化完成率 | **100%** |
| 7. 待人工確認數量 | **4** |
| 8. SEARCH_TEST 通過數量 | **24 / 24** |
| 9. FINAL_DATABASE_REPORT | **已完成** |

全部 31 個 JSON 檔格式驗證通過，可正常讀取。
