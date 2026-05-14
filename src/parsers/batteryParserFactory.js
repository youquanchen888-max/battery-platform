import * as XLSX from 'xlsx'
import { detectBestSheet } from '../utils/sheetDetector'
import { detectHeaderRow } from '../utils/smartHeader'
import { detectFileType } from '../utils/detectFileType'
import { parseExcelWorkbook, parseSheetToRows } from './excelParser'
import { parseDelimitedTextToWorkbook } from './csvParser'
import { parseLandProprietary } from './landParser'
import { parseNewareProprietary } from './newareParser'
import { mapColumns } from './columnMapper'
import { normalizeCurrent } from '../utils/normalizeUnits'
import { cleanBatteryData } from '../utils/cleanData'

function avg(arr) {
  const valid = arr.filter(v => Number.isFinite(v))
  return valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : null
}

export function buildWorkbookFromArrayBuffer(arrayBuffer, fileName = '') {
  const type = detectFileType(fileName)
  if (type === 'land') parseLandProprietary()
  if (type === 'neware') parseNewareProprietary()

  if (type === 'csv') {
    for (const encoding of ['utf-8', 'gb18030']) {
      try {
        const text = new TextDecoder(encoding).decode(arrayBuffer)
        return parseDelimitedTextToWorkbook(text)
      } catch (_) {}
    }
  }

  try {
    return parseExcelWorkbook(arrayBuffer)
  } catch (_) {
    const text = new TextDecoder('utf-8').decode(arrayBuffer)
    return parseDelimitedTextToWorkbook(text)
  }
}

export function parseBatteryFile(binaryData, sheetName = null, manualMapping = {}, fileName = '') {
  const workbook = typeof binaryData === 'string' ? XLSX.read(binaryData, { type: 'binary' }) : buildWorkbookFromArrayBuffer(binaryData, fileName)
  const targetSheet = sheetName || detectBestSheet(workbook)
  const rowsAoa = XLSX.utils.sheet_to_json(workbook.Sheets[targetSheet], { header: 1 })
  const headerRow = detectHeaderRow(rowsAoa)
  const rawRows = parseSheetToRows(workbook, targetSheet, headerRow)
  if (!rawRows.length) throw new Error('未检测到有效数据')

  const headers = Object.keys(rawRows[0])
  const detected = mapColumns(headers, manualMapping)

  const normalized = rawRows.map((row, index) => {
    const cycle = Number(row[detected.cycle]) || index + 1
    const dischargeCapacity = Number(row[detected.dischargeCapacity])
    const chargeCapacity = Number(row[detected.chargeCapacity])
    const baseCapacity = Number(row[detected.capacity])
    const capacity = Number.isFinite(baseCapacity) ? baseCapacity : (Number.isFinite(dischargeCapacity) ? dischargeCapacity : chargeCapacity)
    const rawEff = Number(row[detected.efficiency])
    const efficiency = Number.isFinite(rawEff)
      ? (rawEff > 2 ? rawEff : rawEff * 100)
      : (Number.isFinite(dischargeCapacity) && Number.isFinite(chargeCapacity) && chargeCapacity !== 0 ? dischargeCapacity / chargeCapacity * 100 : null)

    return {
      cycle,
      capacity,
      efficiency,
      voltage: Number(row[detected.voltage]),
      current: normalizeCurrent(row[detected.current], detected.current),
      zReal: Number(row[detected.zReal]),
      zImag: Number(row[detected.zImag]),
    }
  })

  const cleaned = cleanBatteryData(normalized)
  const grouped = {}
  cleaned.forEach(item => {
    if (!grouped[item.cycle]) grouped[item.cycle] = []
    grouped[item.cycle].push(item)
  })
  const data = Object.entries(grouped).map(([cycle, items]) => ({
    cycle: Number(cycle),
    capacity: avg(items.map(i => i.capacity)),
    efficiency: avg(items.map(i => i.efficiency)),
    voltage: avg(items.map(i => i.voltage)),
    current: avg(items.map(i => i.current)),
    zReal: avg(items.map(i => i.zReal)),
    zImag: avg(items.map(i => i.zImag)),
  })).sort((a, b) => a.cycle - b.cycle)

  if (!data.length) throw new Error('没有有效的容量数据')

  return { data, detected, sheetName: targetSheet, headerRow, columns: headers, fileType: detectFileType(fileName) }
}
