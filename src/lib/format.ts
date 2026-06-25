// 顯示用格式化工具

const CN_NUM = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']

/** 阿拉伯數字轉中文（1~99），用於「第十條」顯示 */
export function toChineseNumber(n: number): string {
  if (n <= 10) return CN_NUM[n]
  if (n < 20) return '十' + CN_NUM[n - 10]
  const tens = Math.floor(n / 10)
  const ones = n % 10
  return CN_NUM[tens] + '十' + (ones ? CN_NUM[ones] : '')
}

/** 條次標籤：10 → 第十條 */
export function articleLabel(n: number): string {
  return `第${toChineseNumber(n)}條`
}

/** 附表編號標籤：4 → 附表四；4-1 → 附表四之一 */
export function appendixLabel(id: string): string {
  const map: Record<string, string> = {
    '1': '附表一',
    '2': '附表二',
    '3': '附表三',
    '4': '附表四',
    '4-1': '附表四之一',
    '5': '附表五',
    '6': '附表六',
  }
  return map[id] ?? `附表 ${id}`
}
