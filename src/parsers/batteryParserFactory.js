import * as XLSX from 'xlsx'
import { detectBestSheet } from '../utils/sheetDetector'
import { detectFileType } from '../utils/detectFileType'
import { parseExcelWorkbook, parseSheetToRows } from './excelParser'
import { parseDelimitedTextToWorkbook } from './csvParser'
import { parseCexToWorkbook } from './cexParser'
import { parseNdaToWorkbook } from './ndaParser'
import { mapColumns } from './columnMapper'
import { normalizeCurrent } from '../utils/normalizeUnits'
import { cleanBatteryData } from '../utils/cleanData'
import { detectHeaderRow } from '../utils/smartHeader'

function avg(arr) {
  const valid = arr.filter(v => Number.isFinite(v))
  return valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : null
}

function parseNumericValue(value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : NaN
  if (typeof value === 'boolean' || value == null) return NaN
  const text = String(value).trim()
  if (!text) return NaN

  const normalized = text
    .replace(/,/g, '')
    .replace(/μ/g, 'u')
    .replace(/[^\d.eE+-]/g, ' ')
    .trim()

  if (!normalized) return NaN
  const match = normalized.match(/[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/)
  return match ? Number(match[0]) : NaN
}

export function buildWorkbookFromArrayBuffer(arrayBuffer, fileName = '', options = {}) {
  const type = detectFileType(fileName)

  if (type === 'cex') return parseCexToWorkbook(arrayBuffer, options)
  if (type === 'nda') return parseNdaToWorkbook(arrayBuffer)

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
  const firstNonEmptyRow = rowsAoa.findIndex(row => row?.some(cell => String(cell || '').trim()))
  const guessedHeaderRow = detectHeaderRow(rowsAoa)
  const headerRow = guessedHeaderRow >= 0 ? guessedHeaderRow : firstNonEmptyRow
  const rawRows = parseSheetToRows(workbook, targetSheet, headerRow > -1 ? headerRow : 0)
  if (!rawRows.length) throw new Error('未检测到有效数据')

  const headers = Object.keys(rawRows[0]).filter(header => !/^empty_\d+$/i.test(String(header || '').trim()))
  const detected = mapColumns(headers, manualMapping)

  const normalized = rawRows.map((row, index) => {
    const cycle = parseNumericValue(row[detected.cycle]) || index + 1
    const dischargeCapacity = parseNumericValue(row[detected.dischargeCapacity])
    const chargeCapacity = parseNumericValue(row[detected.chargeCapacity])
    const baseCapacity = parseNumericValue(row[detected.capacity])
    const capacity = Number.isFinite(baseCapacity) ? baseCapacity : (Number.isFinite(dischargeCapacity) ? dischargeCapacity : chargeCapacity)
    const rawEff = parseNumericValue(row[detected.efficiency])
    const efficiency = Number.isFinite(rawEff)
      ? (rawEff > 2 ? rawEff : rawEff * 100)
      : (Number.isFinite(dischargeCapacity) && Number.isFinite(chargeCapacity) && chargeCapacity !== 0 ? dischargeCapacity / chargeCapacity * 100 : null)

    return {
      cycle,
      capacity,
      efficiency,
      voltage: parseNumericValue(row[detected.voltage]),
      current: normalizeCurrent(row[detected.current], detected.current),
      zReal: parseNumericValue(row[detected.zReal]),
      zImag: parseNumericValue(row[detected.zImag]),
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

  if (!data.length) {
    const hint = [detected.capacity, detected.dischargeCapacity, detected.chargeCapacity].filter(Boolean).join(' / ')
    const error = new Error(hint ? `没有有效的容量数据（已匹配列：${hint}）` : '没有有效的容量数据（未识别到容量列，请手动映射）')
    error.details = { detected, sheetName: targetSheet, headerRow, columns: headers, fileType: detectFileType(fileName) }
    throw error
  }

  return { data, detected, sheetName: targetSheet, headerRow, columns: headers, fileType: detectFileType(fileName) }
}
