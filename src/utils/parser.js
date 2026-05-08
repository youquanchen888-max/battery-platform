export const findColumn = (columns, aliases) => {
  return columns.find(col =>
    aliases.some(alias =>
      col.toLowerCase().includes(alias.toLowerCase())
    )
  )
}

export const parseBatteryData = (jsonData) => {
  const columns = Object.keys(jsonData[0])

  const cycleCol = findColumn(columns, ['Cycle', 'Cycle ID', '循环'])
  const capCol = findColumn(columns, ['Capacity', 'Discharge Capacity', '放电'])
  const effCol = findColumn(columns, ['Efficiency', 'Coulombic', 'CE'])
  const voltageCol = findColumn(columns, ['Voltage'])
  const currentCol = findColumn(columns, ['Current'])

  const missing = []
  if (!cycleCol) missing.push('Cycle / 循环次数')
  if (!capCol) missing.push('Capacity / 放电容量')
  if (!effCol) missing.push('Efficiency / 库伦效率')
  if (!voltageCol) missing.push('Voltage / 电压')
  if (!currentCol) missing.push('Current / 电流')

  if (missing.length > 0) {
    throw new Error(`找不到以下必要列：${missing.join('、')}。当前文件列名：${columns.join(', ')}`)
  }

  return jsonData.map(row => ({
    cycle: Number(row[cycleCol]),
    capacity: Number(row[capCol]),
    efficiency: Number(row[effCol]),
    voltage: Number(row[voltageCol]),
    current: Number(row[currentCol]),
  }))
}