import { parseDelimitedTextToWorkbook } from './csvParser'

const HEADER_HINTS = ['cycle', '循环', 'capacity', '容量', 'voltage', '电压', 'current', '电流']

function hasSqliteHeader(arrayBuffer) {
  const head = new Uint8Array(arrayBuffer.slice(0, 16))
  const signature = Array.from(head).map(byte => String.fromCharCode(byte)).join('')
  return signature === 'SQLite format 3\u0000'
}

function extractTextTableFromBinary(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer)
  let text = ''
  for (const byte of bytes) {
    if ((byte >= 32 && byte <= 126) || byte === 9 || byte === 10 || byte === 13) {
      text += String.fromCharCode(byte)
    } else {
      text += '\n'
    }
  }

  const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean)
  if (!lines.length) return null

  const headerIndex = lines.findIndex(line => HEADER_HINTS.some(hint => line.toLowerCase().includes(hint.toLowerCase())) && /[,\t;]/.test(line))
  const tableLines = (headerIndex >= 0 ? lines.slice(headerIndex) : lines).filter(line => /[,\t;]/.test(line))
  if (tableLines.length < 2) return null
  return tableLines.join('\n')
}

export function parseNdaToWorkbook(arrayBuffer) {
  if (hasSqliteHeader(arrayBuffer)) {
    const recovered = extractTextTableFromBinary(arrayBuffer)
    if (recovered) return parseDelimitedTextToWorkbook(recovered)
    throw new Error('检测到 .nda/.ndax 为 SQLite 二进制格式，未提取到有效表格数据，请优先导出 CSV 或 Excel')
  }

  for (const encoding of ['utf-8', 'gb18030', 'utf-16le']) {
    try {
      const text = new TextDecoder(encoding).decode(arrayBuffer)
      if (/[,\t;]/.test(text) && /\r?\n/.test(text)) return parseDelimitedTextToWorkbook(text)
    } catch (_) {}
  }

  const recovered = extractTextTableFromBinary(arrayBuffer)
  if (recovered) return parseDelimitedTextToWorkbook(recovered)

  throw new Error('无法解析 .nda/.ndax 文件，请尝试在测试软件中导出 CSV 或 Excel')
}
