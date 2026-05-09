export const detectAvailableCharts = (detected) => {
  return {
    cyclePerformance: !!detected.capacity,
    voltageCapacity: !!(detected.voltage && detected.capacity),
    dqdv: !!(detected.voltage && detected.capacity),
    gcd: !!(detected.voltage && detected.capacity),
    cv: !!(detected.voltage && detected.current),
    eis: !!(detected.zReal && detected.zImag),
    rateCapability: !!(detected.cycle && detected.capacity && (detected.current || detected.rate)),
    ragone: !!(detected.capacity && detected.current),
  }
}