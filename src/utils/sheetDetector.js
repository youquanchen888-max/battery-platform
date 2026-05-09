import * as XLSX from 'xlsx'

export const detectBestSheet = (workbook) => {
  let bestSheet = workbook.SheetNames[0]
  let bestScore = 0

  workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName]
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 })

    let score = 0

    rows.slice(0, 30).forEach(row => {
      const text = row.join(' ').toLowerCase()

      if (text.includes('cycle') || text.includes('循环')) score += 5
      if (text.includes('capacity') || text.includes('容量')) score += 5
      if (text.includes('efficiency') || text.includes('效率')) score += 4
      if (text.includes('voltage') || text.includes('电压')) score += 4
      if (text.includes('current') || text.includes('电流')) score += 4
    })

    if (score > bestScore) {
      bestScore = score
      bestSheet = sheetName
    }
  })

  return bestSheet
}