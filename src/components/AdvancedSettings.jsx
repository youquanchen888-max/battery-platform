import React from 'react'

export default function AdvancedSettings({
  smoothingEnabled,
  setSmoothingEnabled,
  outlierRemovalEnabled,
  setOutlierRemovalEnabled,
}) {
  return (
    <div style={{
      marginTop: 20, padding: 15, border: '1px solid #ccc', borderRadius: 5,
      background: '#fafafa'
    }}>
      <h3 style={{ marginTop: 0 }}>数据处理</h3>
      <label style={{ display: 'block', marginBottom: 8 }}>
        <input
          type="checkbox"
          checked={smoothingEnabled}
          onChange={() => setSmoothingEnabled(!smoothingEnabled)}
        />
        移动平均平滑
      </label>
      <label style={{ display: 'block' }}>
        <input
          type="checkbox"
          checked={outlierRemovalEnabled}
          onChange={() => setOutlierRemovalEnabled(!outlierRemovalEnabled)}
        />
        去除容量异常值
      </label>
    </div>
  )
}