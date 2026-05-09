import React from 'react'

const LABELS = {
  cyclePerformance: '循环性能图',
  voltageCapacity: '电压-容量图',
  dqdv: 'dQ/dV图',
  gcd: 'GCD充放电曲线',
  cv: 'CV循环伏安图',
  eis: 'EIS Nyquist图',
  rateCapability: '倍率性能图',
  ragone: 'Ragone图',
}

export default function ChartSelectorPanel({ availableCharts, selectedCharts, setSelectedCharts }) {
  const toggleChart = (chart) => {
    setSelectedCharts({
      ...selectedCharts,
      [chart]: !selectedCharts[chart],
    })
  }

  return (
    <div style={{ marginTop: 20, padding: 15, border: '1px solid #aaa' }}>
      <h3>选择要绘制的图表</h3>
      {Object.keys(availableCharts).map(chart => (
        availableCharts[chart] && (
          <label key={chart} style={{ display: 'block', marginBottom: 8 }}>
            <input
              type="checkbox"
              checked={selectedCharts[chart] || false}
              onChange={() => toggleChart(chart)}
            />
            {LABELS[chart] || chart}
          </label>
        )
      ))}
    </div>
  )
}