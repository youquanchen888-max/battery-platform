export function cleanBatteryData(rows) {
  return rows.filter(row => Number.isFinite(row.cycle) && Number.isFinite(row.capacity))
}
