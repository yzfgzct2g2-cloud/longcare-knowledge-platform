// Smart Search 規則設定（V1.3.0）
//
// ⚠️ 重要：本檔為「前端搜尋規則」，不是法規資料、不是 AI、不產生照護建議。
// 僅用於：同義詞正規化、實務查詢導引、命中排序權重、跨制度輔具提示判斷。
// 不修改 knowledge/ 任何原始 JSON。所有導引目標（topics/articles/codes/appendices）
// 皆指向既有法規／實務資料庫中確實存在的項目。

/** 同義詞群組：群組內任一詞被輸入時，視為命中該概念，並以群組內所有詞作為搜尋變體 */
export interface SynonymGroup {
  /** 標準概念名稱（顯示於「同義詞命中：X → canonical」） */
  canonical: string
  /** 同義／口語／縮寫／碼別等變體（含 canonical 本身亦可） */
  terms: string[]
}

export const synonymGroups: SynonymGroup[] = [
  { canonical: '外籍看護', terms: ['外看', '外籍看護', '外籍家庭看護工', '移工', '看護工', '外籍看護工'] },
  { canonical: '日間照顧', terms: ['日照', '日間照顧', '日托'] },
  { canonical: '家庭托顧', terms: ['家托', '家庭托顧'] },
  { canonical: '交通接送', terms: ['交通', '接送', '復康巴士', '交通接送', 'BD03', 'DA01'] },
  { canonical: '喘息服務', terms: ['喘息', '短照', '居喘', '機構喘息', '喘息服務'] },
  { canonical: '輔具', terms: ['輔具', '輔具補助', 'EF', 'E碼', 'F碼'] },
  { canonical: '居家無障礙改善', terms: ['居改', '無障礙', '扶手', '斜坡', '浴室改善', '居家無障礙環境改善', '居家無障礙改善'] },
  { canonical: '失智症', terms: ['失智', '失智症', 'dementia', 'CDR'] },
  { canonical: '復能服務', terms: ['復能', '專業復能', 'CA07', 'CB02', '復能服務'] },
  { canonical: '營養照護', terms: ['營養', '營養照護', '管灌', '吞嚥'] },
  { canonical: '沐浴服務', terms: ['洗澡', '沐浴', '協助沐浴', '到宅沐浴', '沐浴服務'] },
  { canonical: '陪同外出', terms: ['陪外', '陪同外出', '外出復健', '陪同就醫'] },
  { canonical: '長照需要等級', terms: ['額度', '給付額度', 'CMS', '長照需要等級'] },
]

/** 導引目標：指向既有資料庫項目（皆為實際存在者） */
export interface QueryTarget {
  /** 實務主題名稱（knowledge/practical/topics） */
  topics?: string[]
  /** 條次（article-N） */
  articles?: number[]
  /** 精確碼別 */
  codes?: string[]
  /** 碼別前綴（如 'BB' → 所有 BB* 碼） */
  codePrefixes?: string[]
  /** 附表編號（'2'、'3'、'4-1' …） */
  appendices?: string[]
  /** 是否觸發跨制度身障／醫療輔具提示 */
  assistiveHint?: boolean
}

/** 實務查詢導引：多詞口語問句 → 導引目標 */
export interface PracticalQueryRule extends QueryTarget {
  /** 比對樣式（normalize 後做雙向 includes 比對） */
  patterns: string[]
  /** 命中理由顯示文字 */
  label: string
}

export const practicalQueryMap: PracticalQueryRule[] = [
  {
    patterns: ['聘有外籍看護還能用什麼', '外籍看護還能用', '外看還能用', '請外看', '聘外籍看護'],
    label: '實務查詢導引：外籍看護可用服務',
    topics: ['外籍看護', '外籍看護與日照'],
    articles: [10],
    codePrefixes: ['BB', 'BC'],
    codes: ['BA09a'],
  },
  {
    patterns: ['外看可以用日照嗎', '外看可以用日照', '外籍看護可以用日照', '外看日照', '外看用日照'],
    label: '實務查詢導引：外籍看護與日照',
    topics: ['外籍看護與日照', '外籍看護'],
    articles: [10],
    codePrefixes: ['BB', 'BC'],
  },
  {
    patterns: ['失智症年齡限制', '失智年齡', '失智幾歲', '失智症幾歲'],
    label: '實務查詢導引：失智症申請資格',
    topics: ['失智症'],
    articles: [2],
  },
  {
    patterns: ['交通接送額度', '接送額度', '交通額度'],
    label: '實務查詢導引：交通接送額度',
    topics: ['交通接送'],
    appendices: ['2', '3'],
    codes: ['BD03', 'DA01'],
  },
  {
    patterns: ['cms7交通', 'cms 交通', 'cms交通', '等級交通', '交通分區'],
    label: '實務查詢導引：交通接送分區與額度',
    appendices: ['2', '3'],
    codes: ['BD03', 'DA01'],
  },
  {
    patterns: ['洗澡', '沐浴', '協助沐浴', '到宅沐浴', '洗頭'],
    label: '實務查詢導引：沐浴相關服務',
    codes: ['BA07', 'BA09', 'BA09a', 'BD01'],
    assistiveHint: true,
  },
  {
    patterns: ['跌倒', '預防跌倒', '怕跌倒'],
    label: '實務查詢導引：跌倒相關輔具與居家改善',
    topics: ['輔具', '居家無障礙改善'],
    assistiveHint: true,
  },
  {
    patterns: ['喘息', '喘息服務', '居喘', '機構喘息'],
    label: '實務查詢導引：喘息服務',
    topics: ['喘息服務'],
    codePrefixes: ['GA'],
  },
  {
    patterns: ['營養', '營養照護', '管灌'],
    label: '實務查詢導引：營養照護',
    topics: ['營養照護'],
    codes: ['CB01a'],
  },
  {
    patterns: ['吞嚥', '吞嚥訓練', '進食'],
    label: '實務查詢導引：吞嚥與營養',
    topics: ['營養照護', '吞嚥訓練'],
    codes: ['CB01a', 'CB02'],
  },
  {
    patterns: ['陪同外出', '陪同就醫', '外出復健', '陪外'],
    label: '實務查詢導引：陪同外出／就醫',
    codes: ['BA13', 'BA14'],
  },
]

/** 口語意圖關鍵字：單一口語詞 → 導引目標（與 practicalQueryMap 互補） */
export interface IntentKeyword extends QueryTarget {
  keyword: string
  label: string
}

export const intentKeywords: IntentKeyword[] = [
  { keyword: '洗澡', label: '口語意圖：洗澡 → 沐浴服務', codes: ['BA07', 'BA09', 'BA09a', 'BD01'], assistiveHint: true },
  { keyword: '跌倒', label: '口語意圖：跌倒 → 輔具／居家無障礙', topics: ['輔具', '居家無障礙改善'], assistiveHint: true },
  { keyword: '接送', label: '口語意圖：接送 → 交通接送', topics: ['交通接送'], codes: ['DA01', 'BD03'], appendices: ['3'] },
  { keyword: '管灌', label: '口語意圖：管灌 → 營養照護', topics: ['營養照護'], codes: ['CB01a'] },
  { keyword: '輪椅', label: '口語意圖：輪椅（長照與輔具）', assistiveHint: true },
]

/**
 * 排序權重（數字越大越前）。對應實務期待：
 * 碼別完全命中 > 條文完全命中 > 實務主題完全命中 > 同義詞命中 >
 * 標題/名稱命中 > keywords 命中 > 全文命中 > 引用提及 > 輔具提示。
 */
export const priorityRules = {
  codeExact: 1000,
  articleExact: 950,
  topicExact: 900,
  practicalMap: 880,
  synonym: 800,
  topicName: 760,
  relation: 740,
  title: 700,
  keyword: 600,
  fulltext: 500,
  citation: 300,
  assistive: 100,
} as const

export type PriorityKey = keyof typeof priorityRules

/**
 * 跨制度身障／醫療輔具提示關鍵字。
 * ⚠️ UI hint 用途，非法規資料。命中時 /search 僅顯示提示卡片，不混入主結果。
 */
export const assistiveHintKeywords: readonly string[] = [
  '輪椅',
  '助行器',
  '柺杖',
  '拐杖',
  '移位機',
  '移位腰帶',
  '馬桶增高器',
  '沐浴椅',
  '氧氣製造機',
  '血氧機',
  '抽痰機',
  '人工電子耳',
  '助聽器',
  '氣墊床',
  '減壓座墊',
  '居家用照顧床',
]
