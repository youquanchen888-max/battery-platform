import React from 'react'
import {
  ScatterChart, Scatter, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ZAxis
} from 'recharts'
import { exportPNG, exportSVG } from '../utils/exportChart'
import { getSmartAxisDomain, getSmartTickCount } from '../utils/chartTheme'

export default function EISChart({ data = [] }) {
  const validData = Array.isArray(data)
    ? data.filter(d => d.zReal != null && d.zImag != null)
        .map(d => ({
          zReal: Number(d.zReal),
          zImag: Number(d.zImag) > 0 ? -Number(d.zImag) : Number(d.zImag),
        }))
    : []

  if (validData.length === 0) return <p>无有效数据用于绘制 EIS Nyquist 图</p>

  const axisLine = { stroke: '#000', strokeWidth: 1.2 }
  const tickStyle = { fontSize: 12, fill: '#000' }

  const xValues = validData.map(d => d.zReal)
  const yValues = validData.map(d => d.zImag)

  return (
    <div
      id="eis-chart"
      style={{
        marginTop: 30,
        background: '#fff',
        padding: 18,
        position: 'relative',
        borderRadius: 4
      }}
    >
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
        preserveAspectRatio="none"
      >
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="none"
          stroke="#000"
          strokeWidth="2"
        />
      </svg>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <h2 style={{ margin: 0 }}>EIS Nyquist 图</h2>
        <div>
          <button onClick={() => exportPNG('eis-chart', 'eis')}>PNG</button>
          <button onClick={() => exportSVG('eis-chart', 'eis')}>SVG</button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart
          margin={{ top: 20, right: 30, left: 30, bottom: 30 }}
        >
          <CartesianGrid stroke="#e0e0e0" strokeDasharray="2 2" />

          <XAxis
            dataKey="zReal"
            type="number"
            domain={getSmartAxisDomain(xValues, [0, 1])}
            tickCount={getSmartTickCount(xValues)}
            name="Z'"
            unit="Ω"
            axisLine={axisLine}
            tick={tickStyle}
            tickLine={{ stroke: '#000', strokeWidth: 1.2 }}
            label={{ value: "Z' (Ω)", position: 'bottom', offset: 0, style: { fontSize: 14 } }}
          />

          <YAxis
            dataKey="zImag"
            type="number"
            domain={getSmartAxisDomain(yValues, [-1, 1])}
            tickCount={getSmartTickCount(yValues)}
            name='-Z"'
            unit="Ω"
            axisLine={axisLine}
            tick={tickStyle}
            tickLine={{ stroke: '#000', strokeWidth: 1.2 }}
            label={{ value: '-Z" (Ω)', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 14 } }}
          />

          <ZAxis range={[60, 60]} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Legend
            align="right"
            verticalAlign="top"
            wrapperStyle={{ fontSize: 14 }}
          />

          <Scatter name="样品" data={validData} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}