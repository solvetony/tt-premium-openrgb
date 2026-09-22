export const device = 'Thermaltake TT Premium X1 RGB'
export const storageKey = 'thermaltake-x1-rgb-v1'
export const blank = () => Array(110).fill('000000')
export function normalize (value) {
  if (typeof value !== 'string' || !/^#?[\da-f]{6}$/i.test(value)) throw new Error('Use a six-digit hexadecimal color, such as #FF3366.')
  return value.replace('#', '').toUpperCase()
}
export function parseConfig (value) {
  if (!value || typeof value !== 'object' || (value.device !== undefined && value.device !== device)) throw new Error('This is not a Thermaltake X1 configuration.')
  if (!value.colors || typeof value.colors !== 'object' || Array.isArray(value.colors)) throw new Error('Expected a colors object indexed from 0 to 109.')
  const colors = blank()
  for (const [id, color] of Object.entries(value.colors)) {
    if (!/^(0|[1-9]\d*)$/.test(id) || Number(id) > 109) throw new Error(`Invalid LED index: ${id}`)
    colors[Number(id)] = normalize(color)
  }
  return colors
}
export function exportConfig (colors) {
  return { device, colors: Object.fromEntries(colors.map((color, id) => [id, normalize(color)])) }
}
export function restore (raw) {
  try {
    const saved = JSON.parse(raw)
    if (saved.version !== 1 || saved.colors.length !== 110 || !Array.isArray(saved.colors) || typeof saved.showLabels !== 'boolean') throw new Error('Invalid saved configuration')
    return { colors: Array.from(saved.colors, normalize), showLabels: saved.showLabels, ruLabels: saved.ruLabels === true }
  } catch { return { colors: blank(), showLabels: true } }
}
