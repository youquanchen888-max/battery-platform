import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts'
import { exportPNG, exportSVG } from '../utils/exportChart'

export default function RateCapabilityChart({ data = [] }) {
  const validData = Array.isArray(data)
    ? data.filter(d => d.rate != null && d.capacity != null)
    : []

  if (validData.length === 0) return <p>无有效数据用于绘制倍率性能图</p>

  const axisLine = { stroke: '#000', strokeWidth: 1.2 }
  const tickStyle = { fontSize: 12, fill: '#000' }

  return (
    <div
      id="rate-chart"
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
        <h2 style={{ margin: 0 }}>倍率性能图</h2>
        <div>
          <button onClick={() => exportPNG('rate-chart', 'rate')}>PNG</button>
          <button onClick={() => exportSVG('rate-chart', 'rate')}>SVG</button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={validData}
          margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
        >
          <CartesianGrid stroke="#e0e0e0" strokeDasharray="2 2" vertical={false} />

          <XAxis
            dataKey="rate"
            axisLine={axisLine}
            tick={tickStyle}
            tickLine={{ stroke: '#000', strokeWidth: 1.2 }}
            label={{ value: '倍率 (C)', position: 'insideBottomRight', offset: -5, style: { fontSize: 13 } }}
          />

          <YAxis
            type="number"
            axisLine={axisLine}
            tick={tickStyle}
            tickLine={{ stroke: '#000', strokeWidth: 1.2 }}
            label={{ value: '容量 (mAh/g)', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 13 } }}
          />

          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 13 }} />

          <Bar dataKey="capacity" fill="#82ca9d" name="容量" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}