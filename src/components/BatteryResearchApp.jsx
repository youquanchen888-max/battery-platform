import React, { useState } from 'react'
import * as XLSX from 'xlsx'
import { parseBatteryData } from '../utils/parser'
import { calculateDQDV } from '../utils/dqdv'

import CyclePerformanceChart from './CyclePerformanceChart'
import VoltageCapacityChart from './VoltageCapacityChart'
import DQDVChart from './DQDVChart'
import ExportButtons from './ExportButtons'

export default function BatteryResearchApp() {
  const [data, setData] = useState([])
  const [dqdvData, setDQDVData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // 文件大小限制
    if (file.size > 50 * 1024 * 1024) {
      setError('文件过大，请上传小于 50MB 的文件')
      return
    }

    setLoading(true)
    setError('')
    const reader = new FileReader()

    reader.onload = (evt) => {
      try {
        const workbook = XLSX.read(evt.target.result, { type: 'binary' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(sheet)

        const parsed = parseBatteryData(jsonData)
        setData(parsed)
        setDQDVData(calculateDQDV(parsed))
      } catch (err) {
        setError('文件解析失败：' + err.message)
      } finally {
        setLoading(false)
      }
    }

    reader.onerror = () => {
      setError('文件读取失败')
      setLoading(false)
    }

    reader.readAsBinaryString(file)
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>论文级电池科研绘图分析平台</h1>

      <input type="file" accept=".xlsx,.xls,.csv" onChange={handleUpload} />

      {loading && <p>正在处理数据，请稍候...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {data.length > 0 && (
        <>
          <CyclePerformanceChart data={data} />
          <VoltageCapacityChart data={data} />
          <DQDVChart data={dqdvData} />
          <ExportButtons />
        </>
      )}
    </div>
  )
}