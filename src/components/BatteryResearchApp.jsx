import React, { useState, useEffect, useCallback } from 'react'
import { parseBatteryFile, buildWorkbookFromArrayBuffer } from '../utils/parser'
import { detectAvailableCharts } from '../utils/chartSelector'
import { calculateDQDV } from '../utils/dqdv'
import { movingAverage } from '../utils/smoothing'
import { removeOutliers } from '../utils/outlierRemoval'

import ChartErrorBoundary from './ChartErrorBoundary'
import SheetSelector from './SheetSelector'
import DetectionSummary from './DetectionSummary'
import ChartSelectorPanel from './ChartSelectorPanel'
import ManualColumnMapper from './ManualColumnMapper'
import AdvancedSettings from './AdvancedSettings'
import CyclePerformanceChart from './CyclePerformanceChart'
import VoltageCapacityChart from './VoltageCapacityChart'
import DQDVChart from './DQDVChart'
import GCDChart from './GCDChart'
import CVChart from './CVChart'
import EISChart from './EISChart'
import ExportButtons from './ExportButtons'

export default function BatteryResearchApp() {
  const [rawData, setRawData] = useState([])
  const [processedData, setProcessedData] = useState([])
  const [dqdvData, setDQDVData] = useState([])
  const [metadata, setMetadata] = useState(null)
  const [availableCharts, setAvailableCharts] = useState({})
  const [selectedCharts, setSelectedCharts] = useState({})
  const [manualMapping, setManualMapping] = useState({})
  const [smoothingEnabled, setSmoothingEnabled] = useState(false)
  const [outlierRemovalEnabled, setOutlierRemovalEnabled] = useState(false)
  const [error, setError] = useState('')

  const [sheetNames, setSheetNames] = useState([])
  const [currentSheet, setCurrentSheet] = useState('')
  const [workbook, setWorkbook] = useState(null)
  const [uploadKey, setUploadKey] = useState(0)
  const [currentFileName, setCurrentFileName] = useState('')
  const [encoding, setEncoding] = useState('auto')

  // 数据处理联动
  useEffect(() => {
    if (!rawData.length) return
    let updated = [...rawData]
    try {
      if (outlierRemovalEnabled) updated = removeOutliers(updated, 'capacity')
      if (smoothingEnabled) updated = movingAverage(updated, 'capacity', 5)
    } catch (e) { console.error(e) }
    setProcessedData(updated)
  }, [rawData, smoothingEnabled, outlierRemovalEnabled])

  // dQ/dV 联动
  useEffect(() => {
    if (availableCharts.dqdv && processedData.length > 0) {
      const valid = processedData.filter(d => d.voltage != null && d.capacity != null)
      if (valid.length > 0) setDQDVData(calculateDQDV(valid))
    }
  }, [processedData, availableCharts.dqdv])

  const analyzeSheet = useCallback((sheetName, workbookData = workbook, fileNameOverride = currentFileName) => {
    if (!workbookData) return
    setError('')
    try {
      const result = parseBatteryFile(workbookData, sheetName, manualMapping, fileNameOverride)
      setRawData(result.data)
      setMetadata(result)
      setCurrentSheet(sheetName)

      const charts = detectAvailableCharts(result.detected)
      setAvailableCharts(charts)
      setSelectedCharts({
        cyclePerformance: charts.cyclePerformance || false,
      })
    } catch (e) {
      setRawData([])
      setProcessedData([])
      if (e?.details?.columns?.length) {
        setMetadata(e.details)
      }
      setError(e.message)
    }
  }, [workbook, manualMapping, currentFileName])

  useEffect(() => {
    if (!workbook || !currentSheet) return
    analyzeSheet(currentSheet, workbook)
  }, [manualMapping, workbook, currentSheet, analyzeSheet])

  const handleUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setRawData([])
    setProcessedData([])
    setMetadata(null)
    setAvailableCharts({})
    setSelectedCharts({})
    setError('')
    setSheetNames([])
    setCurrentSheet('')
    setWorkbook(null)
    setCurrentFileName('')

    setCurrentFileName(file.name || '')

    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const binaryData = evt.target.result
        setWorkbook(binaryData)
        const wb = buildWorkbookFromArrayBuffer(binaryData, file.name, { preferredEncoding: encoding })
        const names = wb.SheetNames
        setSheetNames(names)
        if (names.length > 0) {
          analyzeSheet(names[0], binaryData, file.name || "")
        } else {
          setError('文件中未找到工作表')
        }
      } catch (err) {
        setError('文件读取失败：' + err.message)
      }
    }
    reader.onerror = () => setError('文件读取失败')
    reader.readAsArrayBuffer(file)

    setUploadKey(prev => prev + 1)
  }

  return (
    <div style={{ maxWidth: 1600, margin: '0 auto', padding: 30, fontFamily: 'Arial, sans-serif', background: '#fff' }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 20 }}>论文级电池科研绘图平台</h1>

      <input
        key={uploadKey}
        type="file"
        accept=".xlsx,.xls,.csv,.txt,.nda,.ndax,.cex"
        onChange={handleUpload}
        style={{ marginBottom: 20 }}
      />

      <div style={{ marginBottom: 20 }}>
        <label htmlFor="encoding-select" style={{ marginRight: 8, fontWeight: 600 }}>编码选择：</label>
        <select
          id="encoding-select"
          value={encoding}
          onChange={(evt) => setEncoding(evt.target.value)}
        >
          <option value="auto">自动检测</option>
          <option value="utf-8">UTF-8</option>
          <option value="gbk">GBK</option>
          <option value="gb18030">GB18030</option>
          <option value="utf-16le">UTF-16LE</option>
          <option value="utf-16be">UTF-16BE</option>
        </select>
      </div>

      {sheetNames.length > 1 && (
        <SheetSelector sheets={sheetNames} selectedSheet={currentSheet} setSelectedSheet={analyzeSheet} />
      )}

      {error && <p style={{ color: '#d32f2f' }}>{error}</p>}

      {/* 初始提示 */}
      {!rawData.length && !error && (
        <div style={{ marginTop: 30, padding: 20, background: '#f5f5f5', borderRadius: 8, fontSize: 16 }}>
          <p style={{ margin: 0, fontWeight: 600, marginBottom: 8 }}>📂 支持上传的文件格式：</p>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li>Excel 工作簿 (.xlsx, .xls)</li>
            <li>CSV 逗号分隔文件 (.csv)</li>
            <li>蓝电 / Neware 等电池测试系统直接导出的文件</li>
          </ul>
          <p style={{ marginTop: 12, marginBottom: 0 }}>上传后系统将自动识别 Sheet 和数据列，并生成论文级图表。</p>
        </div>
      )}

      {metadata && (
        <>
          {rawData.length > 0 && <DetectionSummary metadata={metadata} charts={availableCharts} />}
          <ManualColumnMapper columns={metadata.columns || []} mapping={manualMapping} setMapping={setManualMapping} />
        </>
      )}

      {Object.keys(availableCharts).length > 0 && (
        <ChartSelectorPanel
          availableCharts={availableCharts}
          selectedCharts={selectedCharts}
          setSelectedCharts={setSelectedCharts}
        />
      )}

      {metadata && (
        <AdvancedSettings
          smoothingEnabled={smoothingEnabled}
          setSmoothingEnabled={setSmoothingEnabled}
          outlierRemovalEnabled={outlierRemovalEnabled}
          setOutlierRemovalEnabled={setOutlierRemovalEnabled}
        />
      )}

      {processedData.length > 0 && (
        <>
          {selectedCharts.cyclePerformance && (
            <ChartErrorBoundary>
              <CyclePerformanceChart data={processedData} />
            </ChartErrorBoundary>
          )}

          {selectedCharts.voltageCapacity && (
            <ChartErrorBoundary>
              <VoltageCapacityChart data={processedData} />
            </ChartErrorBoundary>
          )}

          {selectedCharts.dqdv && dqdvData.length > 0 && (
            <ChartErrorBoundary>
              <DQDVChart data={dqdvData} />
            </ChartErrorBoundary>
          )}

          {selectedCharts.gcd && (
            <ChartErrorBoundary>
              <GCDChart data={processedData} />
            </ChartErrorBoundary>
          )}

          {selectedCharts.cv && (
            <ChartErrorBoundary>
              <CVChart data={processedData} />
            </ChartErrorBoundary>
          )}

          {selectedCharts.eis && (
            <ChartErrorBoundary>
              <EISChart data={processedData} />
            </ChartErrorBoundary>
          )}
        </>
      )}

      {processedData.length > 0 && <ExportButtons />}
    </div>
  )
}
