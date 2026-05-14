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

// 智能数值轴范围：自动留白，避免数据挤在一起
export const getSmartAxisDomain = (values = [], fallback = [0, 1]) => {
  const nums = values.filter(v => Number.isFinite(v))
  if (nums.length === 0) return fallback

  const min = Math.min(...nums)
  const max = Math.max(...nums)

  if (min === max) {
    const basePad = Math.abs(min) > 0 ? Math.abs(min) * 0.1 : 1
    return [min - basePad, max + basePad]
  }

  const span = max - min
  const pad = Math.max(span * 0.06, Math.abs(max) * 0.01, 1e-6)
  return [min - pad, max + pad]
}

export const getSmartTickCount = (values = [], preferredMax = 10) => {
  const nums = values.filter(v => Number.isFinite(v))
  if (nums.length <= 2) return 4
  return Math.min(preferredMax, Math.max(4, Math.ceil(Math.sqrt(nums.length))))
}
