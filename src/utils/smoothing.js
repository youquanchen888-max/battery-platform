export const movingAverage = (data, key, windowSize = 5) => {
  if (!data || !data.length) return []
  return data.map((item, index) => {
    const start = Math.max(0, index - Math.floor(windowSize / 2))
    const end = Math.min(data.length, index + Math.floor(windowSize / 2) + 1)

    const subset = data.slice(start, end)
    const sum = subset.reduce((acc, row) => acc + (Number(row[key]) || 0), 0)
    const avg = sum / subset.length

    return {
      ...item,
      [key]: avg,
    }
  })
}