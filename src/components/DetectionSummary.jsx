import React from 'react'

const CHART_LABELS = {
  cyclePerformance: '循环性能图',
  voltageCapacity: '电压-容量图',
  dqdv: 'dQ/dV图',
  gcd: 'GCD充放电曲线',
  cv: 'CV循环伏安图',
  eis: 'EIS Nyquist图',
  rateCapability: '倍率性能图',
  ragone: 'Ragone图',
}

export default function DetectionSummary({ metadata, charts }) {
  return (
    <div style={{ marginTop: 20, padding: 15, border: '1px solid #ccc' }}>
      <h3>数据识别结果</h3>
      <p>Sheet：{metadata.sheetName}</p>
      <p>表头行：第 {metadata.headerRow + 1} 行</p>

      <h4>识别列：</h4>
      <ul>
        {Object.entries(metadata.detected).map(([key, colName]) => (
          <li key={key}>
            {CHART_LABELS[key] || key}：{colName || '未识别'}
          </li>
        ))}
      </ul>

      <h4>可生成图表：</h4>
      <ul>
        {Object.entries(charts).map(([chartKey, available]) => (
          <li key={chartKey}>
            {available ? '✔' : '✘'} {CHART_LABELS[chartKey] || chartKey}
          </li>
        ))}
      </ul>
    </div>
  )
}