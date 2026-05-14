export function normalizeCurrent(value, header = '') {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return null
  const text = String(header).toLowerCase()
  if (text.includes('(a)') || text === 'a') return numeric * 1000
  return numeric
}
