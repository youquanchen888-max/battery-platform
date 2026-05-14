import React from 'react'
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts'
import { exportPNG, exportSVG } from '../utils/exportChart'
import { getSmartAxisDomain, getSmartTickCount } from '../utils/chartTheme'

export default function GCDChart({ data = [] }) {
  const validData = Array.isArray(data)
    ? data.filter(d => d.capacity != null && d.voltage != null)
    : []

  if (validData.length === 0) return <p>无有效数据用于绘制 GCD 充放电曲线</p>

  const axisLine = { stroke: '#000', strokeWidth: 1.2 }
  const tickStyle = { fontSize: 12, fill: '#000' }

  const xValues = validData.map(d => d.capacity)
  const yValues = validData.map(d => d.voltage)

  return (
    <div
      id="gcd-chart"
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
        <h2 style={{ margin: 0 }}>GCD 充放电曲线</h2>
        <div>
          <button onClick={() => exportPNG('gcd-chart', 'gcd')}>PNG</button>
          <button onClick={() => exportSVG('gcd-chart', 'gcd')}>SVG</button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={validData}
          margin={{ top: 20, right: 30, left: 30, bottom: 30 }}
        >
          <CartesianGrid stroke="#e0e0e0" strokeDasharray="2 2" vertical={false} />

          <XAxis
            dataKey="capacity"
            type="number"
            domain={getSmartAxisDomain(xValues, [0, 1])}
            tickCount={getSmartTickCount(xValues)}
            axisLine={axisLine}
            tick={tickStyle}
            tickLine={{ stroke: '#000', strokeWidth: 1.2 }}
            label={{ value: '容量 (mAh/g)', position: 'bottom', offset: 0, style: { fontSize: 14 } }}
          />

          <YAxis
            type="number"
            domain={getSmartAxisDomain(yValues, [0, 1])}
            tickCount={getSmartTickCount(yValues)}
            axisLine={axisLine}
            tick={tickStyle}
            tickLine={{ stroke: '#000', strokeWidth: 1.2 }}
            label={{ value: '电压 (V)', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 14 } }}
          />

          <Tooltip />
          <Legend
            align="right"
            verticalAlign="top"
            wrapperStyle={{ fontSize: 14 }}
          />

          <Line
            type="monotone"
            dataKey="voltage"
            stroke="#1f77b4"
            strokeWidth={2}
            dot={false}
            name="电压"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}