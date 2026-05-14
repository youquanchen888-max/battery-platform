import React from 'react'

// 简单的中文别名映射
const ALIAS_MAP = {
  cycle: '循环次数',
  capacity: '容量',
  efficiency: '库伦效率',
  voltage: '电压',
  current: '电流',
}

export default function ManualColumnMapper({ columns = [], mapping, setMapping }) {
  const fields = ['cycle', 'capacity', 'efficiency', 'voltage', 'current']
  const hasColumns = columns.length > 0

  return (
    <div style={{ marginTop: 20, padding: 15, border: '1px solid #aaa' }}>
      <h3>手动列映射</h3>
      {!hasColumns && <p style={{ color: '#d32f2f', marginTop: 0 }}>未读取到可映射列，请尝试切换 Sheet 或检查文件内容。</p>}
      {fields.map(field => (
        <div key={field} style={{ marginBottom: 10 }}>
          <label>{ALIAS_MAP[field] || field}：</label>
          <select
            value={mapping[field] || ''}
            onChange={(e) =>
              setMapping({
                ...mapping,
                [field]: e.target.value,
              })
            }
          >
            <option value="">未选择</option>
            {columns.map(col => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  )
}
