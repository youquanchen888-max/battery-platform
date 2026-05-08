import React from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

export default function DQDVChart({ data }) {
  return (
    <div id="dqdv-chart" style={{ marginTop: 30 }}>
      <h2>dQ/dV 微分容量曲线</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="voltage" label={{ value: '电压 (V)', position: 'insideBottomRight', offset: -10 }} />
          <YAxis label={{ value: 'dQ/dV', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="dqdv" stroke="#82ca9d" dot={false} name="dQ/dV" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}