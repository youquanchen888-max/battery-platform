import { parseDelimitedTextToWorkbook } from './csvParser'
import * as XLSX from 'xlsx'

const ENCODINGS = ['utf-8', 'gb18030', 'utf-16le']
const HEADER_HINTS = ['cycle', '循环', 'voltage', '电压', 'capacity', '容量', 'current', '电流']

function detectDelimiter(lines = []) {
  const sample = lines.slice(0, 50).join('\n')
  const tabCount = (sample.match(/\t/g) || []).length
  const commaCount = (sample.match(/,/g) || []).length
  const semiCount = (sample.match(/;/g) || []).length

  if (tabCount >= commaCount && tabCount >= semiCount) return '\t'
  if (commaCount >= semiCount) return ','
  return ';'
}

function findRealHeader(lines = []) {
  const maxScan = Math.min(lines.length, 100)
  for (let i = 0; i < maxScan; i += 1) {
    const lowerLine = String(lines[i] || '').toLowerCase()
    const score = HEADER_HINTS.filter(hint => lowerLine.includes(hint.toLowerCase())).length
    if (score >= 2) return i
  }
  return -1
}

function looksLikeText(text = '') {
  if (!text) return false
  const sample = text.slice(0, 2000)
  const printable = sample.replace(/[\x09\x0A\x0D\x20-\x7E\u4E00-\u9FFF]/g, '')
  return printable.length / Math.max(sample.length, 1) < 0.2
}

export function parseCexToWorkbook(arrayBuffer) {
  try {
    const workbook = XLSX.read(arrayBuffer, { type: 'array' })
    if (workbook?.SheetNames?.length) return workbook
  } catch (_) {}

  let bestText = ''

  for (const encoding of ENCODINGS) {
    try {
      const text = new TextDecoder(encoding, { fatal: false }).decode(arrayBuffer)
      if (!looksLikeText(text)) continue
      const lines = text.split(/\r?\n/).filter(line => line.trim())
      if (!lines.length) continue
      const headerIndex = findRealHeader(lines)
      const tableLines = headerIndex >= 0 ? lines.slice(headerIndex) : lines
      const delimiter = detectDelimiter(tableLines)
      const normalizedLines = tableLines.map(line => line.split(delimiter).map(cell => cell.trim()).join(delimiter))
      bestText = normalizedLines.join('\n')
      break
    } catch (_) {}
  }

  if (!bestText) throw new Error('无法从 .cex 文件中解析可读文本，请尝试导出为 CSV 或 Excel')
  return parseDelimitedTextToWorkbook(bestText)
}
