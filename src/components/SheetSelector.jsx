import React from 'react'

export default function SheetSelector({ sheets, selectedSheet, setSelectedSheet }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h3>选择数据Sheet</h3>
      <select value={selectedSheet} onChange={(e) => setSelectedSheet(e.target.value)}>
        {sheets.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>
  )
}