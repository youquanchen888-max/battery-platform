import React from 'react'

// 简单的中文别名映射
const ALIAS_MAP = {
  cycle: '循环次数',
  capacity: '容量',
  efficiency: '库伦效率',
  voltage: '电压',
  current: '电流',
}

export default function ManualColumnMapper({ columns, mapping, setMapping }) {
  const fields = ['cycle', 'capacity', 'efficiency', 'voltage', 'current']

  return (
    <div style={{ marginTop: 20, padding: 15, border: '1px solid #aaa' }}>
      <h3>手动列映射</h3>
      {fields.map(field => (
        <div key={field} style={{ marginBottom: 10 }}>
          <label>{field}：</label>
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
                {col}{ALIAS_MAP[col] ? ` (${ALIAS_MAP[col]})` : ''}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  )
}