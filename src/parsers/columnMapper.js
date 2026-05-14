const COLUMN_PATTERNS = {
  cycle: [/cycle/i, /循环/i, /cyc/i],
  capacity: [/capacity/i, /比容量/i, /容量/i, /mah\/?g/i],
  dischargeCapacity: [/dchg.*capacity/i, /discharge.*capacity/i, /放电容量/i, /放电比容量/i],
  chargeCapacity: [/chg.*capacity/i, /charge.*capacity/i, /充电容量/i, /充电比容量/i],
  efficiency: [/efficiency/i, /库伦效率/i, /^ce$/i],
  voltage: [/voltage/i, /电压/i],
  current: [/current/i, /电流/i],
  time: [/time/i, /测试时间/i, /日期/i],
  zReal: [/zreal/i, /实部阻抗/i, /z'/i],
  zImag: [/zimag/i, /虚部阻抗/i, /z''/i],
}

export function mapColumns(headers = [], manualMapping = {}) {
  const mapping = { ...manualMapping }
  Object.entries(COLUMN_PATTERNS).forEach(([key, patterns]) => {
    if (mapping[key]) return
    const hit = headers.find(header => patterns.some(pattern => pattern.test(String(header))))
    if (hit) mapping[key] = hit
  })
  return mapping
}
