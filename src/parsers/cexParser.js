import { parseDelimitedTextToWorkbook } from './csvParser'
import * as XLSX from 'xlsx'

const ENCODINGS = ['utf-8', 'gbk', 'gb18030', 'utf-16le', 'utf-16be']
const HEADER_HINTS = ['cycle', '循环', 'voltage', '电压', 'capacity', '容量', 'current', '电流']
const CONTENT_HINTS = ['cycle', 'voltage', 'capacity', '循环', '电压', '容量']

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

function isGarbled(text = '') {
  if (!text) return true
  const garbledChars = (text.match(/[�□]/g) || []).length
  return garbledChars > text.length * 0.05
}

function hasCexKeywords(text = '') {
  const lower = text.toLowerCase()
  return CONTENT_HINTS.some(hint => lower.includes(hint.toLowerCase()))
}

export function parseCexToWorkbook(arrayBuffer, options = {}) {
  const preferredEncoding = options.preferredEncoding || 'auto'
  const encodings = preferredEncoding === 'auto'
    ? ENCODINGS
    : [preferredEncoding, ...ENCODINGS.filter(item => item !== preferredEncoding)]

  try {
    const workbook = XLSX.read(arrayBuffer, { type: 'array' })
    if (workbook?.SheetNames?.length) return workbook
  } catch (_) {}

  let bestText = ''

  for (const encoding of encodings) {
    try {
      const text = new TextDecoder(encoding, { fatal: false }).decode(arrayBuffer)
      if (!looksLikeText(text)) continue
      if (isGarbled(text)) continue
      if (!hasCexKeywords(text)) continue
      const lines = text.split(/\r?\n/).filter(line => line.trim())
      if (!lines.length) continue
      const headerIndex = findRealHeader(lines)
      const tableLines = headerIndex >= 0 ? lines.slice(headerIndex) : lines
      const delimiter = detectDelimiter(tableLines)
      const normalizedLines = tableLines.map(line => line.split(delimiter).map(cell => cell.trim()).join(delimiter))
      bestText = normalizedLines.join('\n')
      console.log(`成功使用编码: ${encoding}`)
      break
    } catch (_) {}
  }

  if (!bestText) throw new Error('无法从 .cex 文件中解析可读文本，请尝试导出为 CSV 或 Excel')
  return parseDelimitedTextToWorkbook(bestText)
}
