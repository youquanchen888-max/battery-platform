// 上边框轴（仅显示轴线，无刻度无标签）
export const topFrameAxis = {
  orientation: 'top',
  axisLine: { stroke: '#333', strokeWidth: 1.5 },
  tick: false,
  tickLine: false,
  label: false,
}

// 右边框轴（仅显示轴线，无刻度无标签）
export const rightFrameAxis = {
  orientation: 'right',
  axisLine: { stroke: '#333', strokeWidth: 1.5 },
  tick: false,
  tickLine: false,
  label: false,
}

// 主坐标轴样式
export const mainAxisStyle = {
  tick: { fontSize: 14, fill: '#333' },
  axisLine: { stroke: '#333', strokeWidth: 1.5 },
  tickLine: { stroke: '#333', strokeWidth: 1.5 },
}

// 网格样式
export const gridStyle = {
  stroke: '#e0e0e0',
  strokeDasharray: '2 2',
}

// 配色
export const colors = {
  capacity: '#1f77b4',
  efficiency: '#d62728',
  voltage: '#2ca02c',
  dqdv: '#9467bd',
  current: '#2ca02c',
}