export const removeOutliers = (data, key, threshold = 3) => {
  if (!data || !data.length) return []
  const values = data.map(d => Number(d[key])).filter(v => v != null && !isNaN(v))
  if (!values.length) return data

  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length
  const std = Math.sqrt(variance)

  if (std === 0) return data

  return data.filter(d => {
    const val = Number(d[key])
    return val != null && !isNaN(val) && Math.abs(val - mean) <= threshold * std
  })
}