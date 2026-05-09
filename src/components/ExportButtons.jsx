import React from 'react'
import { exportPNG, exportSVG } from '../utils/exportChart'

export default function ExportButtons() {
  const chartIds = [
    'cycle-chart', 'voltage-chart', 'dqdv-chart',
    'gcd-chart', 'cv-chart', 'eis-chart'
  ]

  return (
    <div style={{ marginTop: 30 }}>
      <h3>导出图表</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {chartIds.map(id => (
          <div key={id}>
            <strong>{id.replace('-chart', '').toUpperCase()}：</strong>
            <button onClick={() => exportPNG(id, id)}>PNG</button>
            <button onClick={() => exportSVG(id, id)} style={{ marginLeft: 5 }}>SVG</button>
          </div>
        ))}
      </div>
    </div>
  )
}