import { parseDelimitedTextToWorkbook } from './csvParser'

function hasSqliteHeader(arrayBuffer) {
  const head = new Uint8Array(arrayBuffer.slice(0, 16))
  const signature = Array.from(head).map(byte => String.fromCharCode(byte)).join('')
  return signature === 'SQLite format 3\u0000'
}

export function parseNdaToWorkbook(arrayBuffer) {
  if (hasSqliteHeader(arrayBuffer)) {
    throw new Error('检测到 .nda/.ndax 为 SQLite 二进制格式，纯前端暂不稳定支持，请优先导出 CSV 或 Excel')
  }

  for (const encoding of ['utf-8', 'gb18030', 'utf-16le']) {
    try {
      const text = new TextDecoder(encoding).decode(arrayBuffer)
      if (/[,\t;]/.test(text) && /\r?\n/.test(text)) return parseDelimitedTextToWorkbook(text)
    } catch (_) {}
  }

  throw new Error('无法解析 .nda/.ndax 文件，请尝试在测试软件中导出 CSV 或 Excel')
}
