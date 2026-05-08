import React from 'react'
import { exportPNG, exportSVG } from '../utils/exportChart'

export default function ExportButtons() {
  return (
    <div style={{ marginTop: 30 }}>
      <h3>导出图表</h3>
      <button onClick={() => exportPNG('cycle-chart', 'cycle-performance')}>循环性能图 PNG</button>
      <button onClick={() => exportPNG('voltage-chart', 'voltage-capacity')}>电压容量图 PNG</button>
      <button onClick={() => exportPNG('dqdv-chart', 'dqdv')}>dQ/dV 图 PNG</button>
      <br />
      <button onClick={() => exportSVG('cycle-chart', 'cycle-performance')}>循环性能图 SVG</button>
      <button onClick={() => exportSVG('voltage-chart', 'voltage-capacity')}>电压容量图 SVG</button>
      <button onClick={() => exportSVG('dqdv-chart', 'dqdv')}>dQ/dV 图 SVG</button>
    </div>
  )
}