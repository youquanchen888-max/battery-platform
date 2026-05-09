export const detectHeaderRow = (rows) => {
  let bestRow = 0
  let bestScore = 0

  rows.slice(0, 30).forEach((row, index) => {
    const text = row.join(' ').toLowerCase()

    let score = 0

    if (text.includes('cycle') || text.includes('循环')) score += 5
    if (text.includes('capacity') || text.includes('容量')) score += 5
    if (text.includes('efficiency') || text.includes('效率')) score += 4
    if (text.includes('voltage') || text.includes('电压')) score += 4
    if (text.includes('current') || text.includes('电流')) score += 4

    if (score > bestScore) {
      bestScore = score
      bestRow = index
    }
  })

  return bestRow
}