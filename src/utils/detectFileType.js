export function detectFileType(fileName = '') {
  const ext = fileName.split('.').pop()?.toLowerCase()
  if (['xlsx', 'xls'].includes(ext)) return 'excel'
  if (['csv', 'txt'].includes(ext)) return 'csv'
  if (['cex'].includes(ext)) return 'land'
  if (['ndax', 'nda'].includes(ext)) return 'neware'
  return 'unknown'
}
