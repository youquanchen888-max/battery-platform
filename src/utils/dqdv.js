export const calculateDQDV = (data) => {
  const results = []

  for (let i = 1; i < data.length; i++) {
    const dQ = data[i].capacity - data[i - 1].capacity
    const dV = data[i].voltage - data[i - 1].voltage

    if (dV !== 0) {
      results.push({
        voltage: data[i].voltage,
        dqdv: dQ / dV,
      })
    }
  }

  return results
}