import React from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

export default function VoltageCapacityChart({ data }) {
  const voltageData = data.map(d => ({
    capacity: d.capacity,
    voltage: d.voltage
  }))

  return (
    <div id="voltage-chart" style={{ marginTop: 30 }}>
      <h2>电压 - 容量曲线</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={voltageData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="capacity" label={{ value: '容量 (mAh/g)', position: 'insideBottomRight', offset: -10 }} />
          <YAxis label={{ value: '电压 (V)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="voltage" stroke="#ff7300" dot={false} name="电压" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}