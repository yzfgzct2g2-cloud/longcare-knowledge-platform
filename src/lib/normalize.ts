// 查詢字串正規化工具

/** 全形轉半形（ASCII 區 + 全形空白） */
export function toHalfWidth(input: string): string {
  return input
    .replace(/[！-～]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0))
    .replace(/　/g, ' ')
}

/** 基本正規化：去頭尾空白、全形轉半形、壓縮多餘空白 */
export function normalizeQuery(input: string): string {
  return toHalfWidth(input).trim().replace(/\s+/g, ' ')
}

/** 是否為碼別樣式，如 BA09a、FA08、EI01、BA17d1 */
export function isCodeLike(token: string): boolean {
  return /^[A-Za-z]{1,3}\d{1,3}[A-Za-z0-9]*$/.test(token)
}

/** 中文數字轉阿拉伯數字（支援 1~99，足夠涵蓋 22 條） */
export function chineseNumToArabic(cn: string): number | null {
  const digits: Record<string, number> = {
    零: 0,
    一: 1,
    二: 2,
    兩: 2,
    三: 3,
    四: 4,
    五: 5,
    六: 6,
    七: 7,
    八: 8,
    九: 9,
  }
  if (cn === '十') return 10
  // 處理「十X」 (11-19)
  if (/^十[一二三四五六七八九]$/.test(cn)) {
    return 10 + digits[cn[1]]
  }
  // 處理「X十」與「X十Y」(20-99)
  const m = cn.match(/^([一二三四五六七八九])十([一二三四五六七八九])?$/)
  if (m) {
    return digits[m[1]] * 10 + (m[2] ? digits[m[2]] : 0)
  }
  // 純個位中文數字
  if (cn.length === 1 && cn in digits) return digits[cn]
  return null
}

/**
 * 嘗試從查詢解析出條次。
 * 支援：第十條 / 第10條 / 第10 / 10 / article-10
 */
export function parseArticleNumber(query: string): number | null {
  const q = normalizeQuery(query)

  // article-10 / article10
  const am = q.match(/^article-?(\d{1,2})$/i)
  if (am) return clampArticle(parseInt(am[1], 10))

  // 第10條 / 第10
  const dm = q.match(/^第?\s*(\d{1,2})\s*條?$/)
  if (dm) return clampArticle(parseInt(dm[1], 10))

  // 第十條 / 第二十二條
  const cm = q.match(/^第?\s*([零一二兩三四五六七八九十]+)\s*條$/)
  if (cm) {
    const n = chineseNumToArabic(cm[1])
    return n ? clampArticle(n) : null
  }

  return null
}

function clampArticle(n: number): number | null {
  return n >= 1 && n <= 22 ? n : null
}

/**
 * 正規化施行日期。
 * 支援：115-07-01 / 115/07/01 / 115.07.01
 * 回傳 YYYY-MM-DD（民國年沿用原資料格式 115-07-01），非日期則回傳 null。
 */
export function parseEffectiveDate(query: string): string | null {
  const q = normalizeQuery(query).replace(/[/.]/g, '-')
  const m = q.match(/^(\d{3})-(\d{1,2})-(\d{1,2})$/)
  if (!m) return null
  const [, y, mo, d] = m
  return `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`
}
