import * as XLSX from 'xlsx'

export function parseExcelWorkbook(arrayBuffer) {
  return XLSX.read(arrayBuffer, { type: 'array' })
}

export function parseSheetToRows(workbook, sheetName, headerRow = 0) {
  const sheet = workbook.Sheets[sheetName]
  return XLSX.utils.sheet_to_json(sheet, { range: headerRow, defval: null })
}
