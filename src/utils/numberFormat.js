export const formatToThreeSignificant = (value) => {
  const num = Number(value)
  if (!Number.isFinite(num)) return ''
  if (num === 0) return '0'

  const absNum = Math.abs(num)
  if (absNum >= 1e4 || absNum < 1e-3) {
    return num.toExponential(2)
  }

  return Number(num.toPrecision(3)).toString()
}
