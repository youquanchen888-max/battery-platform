import React from 'react'
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts'
import { exportPNG, exportSVG } from '../utils/exportChart'

export default function CVChart({ data = [] }) {
  const validData = Array.isArray(data)
    ? data.filter(d => d.voltage != null && d.current != null)
    : []

  if (validData.length === 0) return <p>无有效数据用于绘制 CV 循环伏安曲线</p>

  const axisLine = { stroke: '#000', strokeWidth: 1.2 }
  const tickStyle = { fontSize: 12, fill: '#000' }

  return (
    <div
      id="cv-chart"
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
        <h2 style={{ margin: 0 }}>CV 循环伏安曲线</h2>
        <div>
          <button onClick={() => exportPNG('cv-chart', 'cv')}>PNG</button>
          <button onClick={() => exportSVG('cv-chart', 'cv')}>SVG</button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={validData}
          margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
        >
          <CartesianGrid stroke="#e0e0e0" strokeDasharray="2 2" vertical={false} />

          <XAxis
            dataKey="voltage"
            type="number"
            axisLine={axisLine}
            tick={tickStyle}
            tickLine={{ stroke: '#000', strokeWidth: 1.2 }}
            label={{ value: '电压 (V)', position: 'insideBottomRight', offset: -5, style: { fontSize: 13 } }}
          />

          <YAxis
            type="number"
            axisLine={axisLine}
            tick={tickStyle}
            tickLine={{ stroke: '#000', strokeWidth: 1.2 }}
            label={{ value: '电流 (mA)', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 13 } }}
          />

          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 13 }} />

          <Line
            type="monotone"
            dataKey="current"
            stroke="#2ca02c"
            strokeWidth={2}
            dot={false}
            name="电流"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}