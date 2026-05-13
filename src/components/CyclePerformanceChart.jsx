import React from 'react'
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts'
import { exportPNG, exportSVG } from '../utils/exportChart'

export default function CyclePerformanceChart({ data = [] }) {
  const chartData = Array.isArray(data)
    ? data.map(d => ({
        cycle: d.cycle,
        capacity: d.capacity,
        efficiency: d.efficiency != null
          ? Math.max(0, Math.min(150, d.efficiency))
          : null,
      }))
    : []

  if (chartData.length === 0) return <p>无可用数据</p>

  const axisLine = { stroke: '#000', strokeWidth: 1.2 }
  const tickStyle = { fontSize: 12, fill: '#000' }

  const minCycle = chartData[0]?.cycle ?? 1
  const maxCycle = chartData[chartData.length - 1]?.cycle ?? 1

  return (
    <div
      id="cycle-chart"
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
        <h2 style={{ margin: 0 }}>循环性能 / 库伦效率</h2>
        <div>
          <button onClick={() => exportPNG('cycle-chart', 'cycle')}>PNG</button>
          <button onClick={() => exportSVG('cycle-chart', 'cycle')}>SVG</button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 30, bottom: 30 }}
        >
          <CartesianGrid stroke="#e0e0e0" strokeDasharray="2 2" vertical={false} yAxisId="left" />

          <XAxis
            dataKey="cycle"
            type="number"
            domain={[minCycle, maxCycle]}
            ticks={Array.from({ length: maxCycle - minCycle + 1 }, (_, i) => minCycle + i)}
            axisLine={axisLine}
            tick={tickStyle}
            tickLine={{ stroke: '#000', strokeWidth: 1.2 }}
            label={{ value: '循环次数', position: 'bottom', offset: 0, style: { fontSize: 14 } }}
          />

          <YAxis
            yAxisId="left"
            type="number"
            axisLine={axisLine}
            tick={tickStyle}
            tickLine={{ stroke: '#000', strokeWidth: 1.2 }}
            label={{ value: '比容量 (mAh/g)', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 14 } }}
          />

          <YAxis
            yAxisId="right"
            orientation="right"
            type="number"
            domain={[80, 120]}
            axisLine={axisLine}
            tick={tickStyle}
            tickLine={{ stroke: '#000', strokeWidth: 1.2 }}
            label={{ value: '库伦效率 (%)', angle: -90, position: 'insideRight', offset: 10, style: { fontSize: 14 } }}
          />

          <Tooltip />
          <Legend
            align="right"
            verticalAlign="top"
            wrapperStyle={{ fontSize: 14 }}
          />

          <Line yAxisId="left" type="monotone" dataKey="capacity" stroke="#1f77b4" strokeWidth={2} dot={false} name="比容量" />
          <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#d62728" strokeWidth={2} dot={false} name="库伦效率" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}