export function detectFileType(fileName = '') {
  const ext = fileName.split('.').pop()?.toLowerCase()
  if (['xlsx', 'xls'].includes(ext)) return 'excel'
  if (['csv', 'txt'].includes(ext)) return 'csv'
  if (ext === 'cex') return 'cex'
  if (['ndax', 'nda'].includes(ext)) return 'nda'
  return 'unknown'
}
