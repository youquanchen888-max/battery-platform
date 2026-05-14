import React from 'react'
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts'
import { exportPNG, exportSVG } from '../utils/exportChart'
import { getSmartAxisDomain, getSmartTickCount } from '../utils/chartTheme'
import { formatToThreeSignificant } from '../utils/numberFormat'

export default function DQDVChart({ data = [] }) {
  if (!Array.isArray(data) || data.length === 0) {
    return <p>无有效数据用于绘制 dQ/dV 曲线</p>
  }

  const axisLine = { stroke: '#000', strokeWidth: 1.2 }
  const tickStyle = { fontSize: 12, fill: '#000' }

  const xValues = data.map(d => d.voltage)
  const yValues = data.map(d => d.dqdv)

  return (
    <div
      id="dqdv-chart"
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
        <h2 style={{ margin: 0 }}>dQ/dV 微分容量曲线</h2>
        <div>
          <button onClick={() => exportPNG('dqdv-chart', 'dqdv')}>PNG</button>
          <button onClick={() => exportSVG('dqdv-chart', 'dqdv')}>SVG</button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 30, bottom: 30 }}
        >
          <CartesianGrid stroke="#e0e0e0" strokeDasharray="2 2" vertical={false} />

          <XAxis
            dataKey="voltage"
            type="number"
            domain={getSmartAxisDomain(xValues, [0, 1])}
            tickCount={getSmartTickCount(xValues)}
            axisLine={axisLine}
            tick={tickStyle}
            tickLine={{ stroke: '#000', strokeWidth: 1.2 }}
            tickFormatter={formatToThreeSignificant}
            label={{ value: '电压 (V)', position: 'bottom', offset: 0, style: { fontSize: 14 } }}
          />

          <YAxis
            type="number"
            domain={getSmartAxisDomain(yValues, [-1, 1])}
            tickCount={getSmartTickCount(yValues)}
            axisLine={axisLine}
            tick={tickStyle}
            tickLine={{ stroke: '#000', strokeWidth: 1.2 }}
            tickFormatter={formatToThreeSignificant}
            label={{ value: 'dQ/dV', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 14 } }}
          />

          <Tooltip />
          <Legend
            align="right"
            verticalAlign="top"
            wrapperStyle={{ fontSize: 14 }}
          />

          <Line
            type="monotone"
            dataKey="dqdv"
            stroke="#9467bd"
            strokeWidth={2}
            dot={false}
            name="dQ/dV"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}