export function parseAmount(cent) {
  return (parseInt(cent) / 100).toFixed(2)
}
