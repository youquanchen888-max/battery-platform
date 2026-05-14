import * as XLSX from 'xlsx'
import { detectBestSheet } from './sheetDetector'
import { detectHeaderRow } from './smartHeader'

const COLUMN_ALIASES = {
  cycle: ['cycle', '循环', '循环次数', '循环序号', '圈数'],
  capacity: ['capacity', '比容量', '放电比容量', '容量', 'mah/g', 'mahg'],
  efficiency: ['efficiency', 'ce', '库伦效率', '效率'],
  voltage: ['voltage', '电压'],
  current: ['current', '电流'],
  zReal: ['zreal', "z'", '实部阻抗'],
  zImag: ['zimag', "z''", '虚部阻抗'],
}

const normalize = (str) =>
  String(str || '')
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[()（）/%_,\-:/]/g, '')

const findColumn = (columns, aliases) =>
  columns.find(col =>
    aliases.some(a => normalize(col).includes(normalize(a)))
  )

const avg = (arr) => {
  const valid = arr.filter(v => v != null && !isNaN(v))
  if (!valid.length) return null
  return valid.reduce((a, b) => a + b, 0) / valid.length
}

const pickMappedColumn = (columns, mappedColumn) => {
  if (!mappedColumn) return null
  return columns.find(col => col === mappedColumn) || null
}

const pickCapacityColumn = (columns, manualCapacity = null) => {
  const mapped = pickMappedColumn(columns, manualCapacity)
  if (mapped) return mapped

  const preferred = [
    '放电比容量', '放电容量', 'discharge specific capacity', 'discharge capacity',
    'dcapacity', 'q discharge', 'qdischarge', 'dchg capacity'
  ]
  const byPreferred = findColumn(columns, preferred)
  if (byPreferred) return byPreferred

  return findColumn(columns, COLUMN_ALIASES.capacity)
}

export const parseBatteryFile = (binaryData, sheetName = null, manualMapping = {}) => {
  const workbook = XLSX.read(binaryData, { type: 'binary' })
  const targetSheet = sheetName || detectBestSheet(workbook)
  const sheet = workbook.Sheets[targetSheet]

  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 })
  const headerRow = detectHeaderRow(rows)

  const jsonData = XLSX.utils.sheet_to_json(sheet, {
    range: headerRow,
    defval: null,
  })

  if (!jsonData.length) throw new Error('未检测到有效数据')

  const columns = Object.keys(jsonData[0])

  const detected = {
    cycle: pickMappedColumn(columns, manualMapping.cycle) || findColumn(columns, COLUMN_ALIASES.cycle),
    capacity: pickCapacityColumn(columns, manualMapping.capacity),
    efficiency: pickMappedColumn(columns, manualMapping.efficiency) || findColumn(columns, COLUMN_ALIASES.efficiency),
    voltage: pickMappedColumn(columns, manualMapping.voltage) || findColumn(columns, COLUMN_ALIASES.voltage),
    current: pickMappedColumn(columns, manualMapping.current) || findColumn(columns, COLUMN_ALIASES.current),
    zReal: findColumn(columns, COLUMN_ALIASES.zReal),
    zImag: findColumn(columns, COLUMN_ALIASES.zImag),
  }

  let parsedData = jsonData.map((row, index) => {
    const rawCycle = detected.cycle ? Number(row[detected.cycle]) : null
    const rawCap = detected.capacity ? Number(row[detected.capacity]) : null
    const rawEff = detected.efficiency ? Number(row[detected.efficiency]) : null

    const cycle = (rawCycle != null && !isNaN(rawCycle)) ? rawCycle : index + 1
    let capacity = (!isNaN(rawCap) ? rawCap : null)
    let efficiency = null
    if (rawEff != null && !isNaN(rawEff)) {
      efficiency = rawEff > 2 ? rawEff : rawEff * 100
      efficiency = Math.max(0, Math.min(150, efficiency))
    }

    return {
      cycle,
      capacity,
      efficiency,
      voltage: detected.voltage ? Number(row[detected.voltage]) : null,
      current: detected.current ? Number(row[detected.current]) : null,
      zReal: detected.zReal ? Number(row[detected.zReal]) : null,
      zImag: detected.zImag ? Number(row[detected.zImag]) : null,
    }
  })

  parsedData = parsedData.filter(d => d.capacity != null)
  if (!parsedData.length) throw new Error('没有有效的容量数据')

  parsedData.sort((a, b) => a.cycle - b.cycle)

  const grouped = {}
  parsedData.forEach(d => {
    const key = d.cycle
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(d)
  })

  const averagedData = Object.keys(grouped).map(key => {
    const group = grouped[key]
    return {
      cycle: Number(key),
      capacity: avg(group.map(d => d.capacity)),
      efficiency: avg(group.map(d => d.efficiency)),
      voltage: avg(group.map(d => d.voltage)),
      current: avg(group.map(d => d.current)),
      zReal: avg(group.map(d => d.zReal)),
      zImag: avg(group.map(d => d.zImag)),
    }
  })

  averagedData.sort((a, b) => a.cycle - b.cycle)

  return {
    data: averagedData,
    detected,
    sheetName: targetSheet,
    headerRow,
    columns,
  }
}
