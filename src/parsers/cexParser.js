import { parseDelimitedTextToWorkbook } from './csvParser'

const ENCODINGS = ['utf-8', 'gb18030', 'utf-16le']
const HEADER_HINTS = ['cycle', '循环', 'voltage', '电压', 'capacity', '容量']

function looksLikeText(text = '') {
  if (!text) return false
  const sample = text.slice(0, 2000)
  const printable = sample.replace(/[\x09\x0A\x0D\x20-\x7E\u4E00-\u9FFF]/g, '')
  return printable.length / Math.max(sample.length, 1) < 0.2
}

export function parseCexToWorkbook(arrayBuffer) {
  let bestText = ''

  for (const encoding of ENCODINGS) {
    try {
      const text = new TextDecoder(encoding, { fatal: false }).decode(arrayBuffer)
      if (!looksLikeText(text)) continue
      const lines = text.split(/\r?\n/).filter(line => line.trim())
      if (!lines.length) continue
      const headerIndex = lines.findIndex(line => HEADER_HINTS.some(hint => line.toLowerCase().includes(hint.toLowerCase())))
      bestText = headerIndex >= 0 ? lines.slice(headerIndex).join('\n') : lines.join('\n')
      break
    } catch (_) {}
  }

  if (!bestText) throw new Error('无法从 .cex 文件中解析可读文本，请尝试导出为 CSV 或 Excel')
  return parseDelimitedTextToWorkbook(bestText)
}
