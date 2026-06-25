# 法規資料庫搜尋測試（SEARCH_TEST）

測試方法：對每一查詢字串，依序比對 (1) code-map 碼別、(2) search-index 關鍵字、(3) 附表 items 之 search_text、(4) 條文全文，回傳所有命中之識別碼，並檢查是否包含全部預期結果。

共 24 組測試案例。

| # | 搜尋 | 應找到 | 實際命中（節錄） | 結果 |
|---|---|---|---|---|
| 1 | FA08 | FA08 | FA08（另含1項） | ✔ PASS |
| 2 | 扶手 | FA22、FA23、FA24 | FA22、FA23、FA24（另含4項） | ✔ PASS |
| 3 | 智慧科技輔具 | EI01、EI02、EI03、EI04、EI05 | EI01、EI02、EI03、EI04、EI05（另含4項） | ✔ PASS |
| 4 | 馬桶增高器 | EA01 | EA01（另含1項） | ✔ PASS |
| 5 | 外籍看護 | article-10 | article-10（另含2項） | ✔ PASS |
| 6 | 失智症 | article-02 | article-02（另含7項） | ✔ PASS |
| 7 | PAC | article-02 | article-02 | ✔ PASS |
| 8 | 團體家屋 | article-02 | article-02 | ✔ PASS |
| 9 | 部分負擔 | article-14、appendix-05 | article-14、appendix-05（另含33項） | ✔ PASS |
| 10 | 交通接送 | article-07、appendix-03、DA01 | article-07、appendix-03、DA01（另含39項） | ✔ PASS |
| 11 | 電動輪椅 | EC11 | EC11（另含4項） | ✔ PASS |
| 12 | 氣墊床 | EG01、EG02 | EG01、EG02（另含3項） | ✔ PASS |
| 13 | 爬梯機 | EH04、EH05 | EH04、EH05（另含2項） | ✔ PASS |
| 14 | 改善馬桶 | FA41 | FA41（另含1項） | ✔ PASS |
| 15 | 防滑 | FA34、FA35 | FA34、FA35（另含3項） | ✔ PASS |
| 16 | 居家喘息 | GA09 | GA09（另含1項） | ✔ PASS |
| 17 | 到宅沐浴車 | BA09、BA09a | BA09、BA09a（另含1項） | ✔ PASS |
| 18 | 營養照護 | CB01a | CB01a（另含1項） | ✔ PASS |
| 19 | 施行日期 | article-22 | article-22 | ✔ PASS |
| 20 | 原民區 | article-17、appendix-06 | article-17、appendix-06（另含1項） | ✔ PASS |
| 21 | 移位機 | ED07、ED08 | ED07、ED08（另含1項） | ✔ PASS |
| 22 | 日間照顧 | BB01 | BB01（另含22項） | ✔ PASS |
| 23 | EI01 | EI01 | EI01（另含1項） | ✔ PASS |
| 24 | 第二組 | article-10、appendix-02 | article-10、appendix-02（另含1項） | ✔ PASS |

## 測試結果：24 / 24 通過

全部測試案例通過 ✔