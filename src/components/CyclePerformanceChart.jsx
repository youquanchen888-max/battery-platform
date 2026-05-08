import React from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

export default function CyclePerformanceChart({ data }) {
  const firstCap = data[0]?.capacity
  const chartData = data.map(d => ({
    cycle: d.cycle,
    capacity: d.capacity,
    retention: firstCap ? (d.capacity / firstCap) * 100 : 0,
    efficiency: d.efficiency ? d.efficiency * 100 : 0
  }))

  return (
    <div id="cycle-chart" style={{ marginTop: 30 }}>
      <h2>循环性能 / 库伦效率</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="cycle" label={{ value: '循环次数', position: 'insideBottomRight', offset: -10 }} />
          <YAxis yAxisId="left" label={{ value: '容量 (mAh/g)', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" domain={[0, 120]} label={{ value: '库伦效率 (%)', angle: -90, position: 'insideRight' }} />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="capacity" stroke="#8884d8" name="容量" dot={false} />
          <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#82ca9d" name="库伦效率" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}