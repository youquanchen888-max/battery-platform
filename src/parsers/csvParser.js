import * as XLSX from 'xlsx'

export function parseDelimitedTextToWorkbook(text) {
  const lines = text.split(/\r?\n/).filter(line => line.trim())
  if (!lines.length) throw new Error('文本文件内容为空')
  const sample = lines.slice(0, 50).join('\n')
  const tabCount = (sample.match(/\t/g) || []).length
  const commaCount = (sample.match(/,/g) || []).length
  const semiCount = (sample.match(/;/g) || []).length
  const delimiter = tabCount >= commaCount && tabCount >= semiCount ? '\t' : (commaCount >= semiCount ? ',' : ';')

  const aoa = lines.map(line => line.split(delimiter).map(cell => cell.trim()))
  const ws = XLSX.utils.aoa_to_sheet(aoa)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Data')
  return wb
}
