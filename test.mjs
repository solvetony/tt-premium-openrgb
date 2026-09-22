import { test } from 'node:test'
import assert from 'node:assert/strict'
import { labels, ruLabels } from './src/data/x1-led-map.js'
import { layout } from './src/data/x1-layout.js'
import { blank, exportConfig, parseConfig, restore } from './src/lib/config.js'
test('physical positions use recorded LED IDs', () => {
  assert.equal(labels.length, 110)
  assert.equal(ruLabels.length, 110)
  assert.equal(ruLabels[5], 'Ф')
  assert.equal(ruLabels[20], 'А')
  assert.equal(ruLabels[31], 'Ь')
  assert.equal(ruLabels[38], 'Б')
  assert.equal(ruLabels[39], 'Ю')
  assert.equal(labels[45], '"')
  assert.equal(layout.find(key => key.led === 45).label, '"')
  assert.equal(labels[102], 'Unknown')
  for (const [label, led] of [['A', 5], ['Space', 88], ['Esc', 91], ['F1', 92], ['F12', 66], ['Right Shift', 47], ['↑', 59], ['↓', 60], ['←', 61], ['→', 67], ['Stop', 106], ['Previous track', 108], ['Play/Pause', 107], ['Next track', 109]]) assert.equal(layout.find(key => key.label === label).led, led)
  assert.equal(layout.find(key => key.led === 68).w, 2)
  assert.equal(layout.find(key => key.led === 82).h, 2)
  assert.equal(new Set(layout.map(key => key.led)).size, 108)
})
test('config validation, normalization, full roundtrip and corrupt storage', () => {
  const colors = parseConfig({ colors: { 5: '#ff0000' } })
  assert.equal(colors[5], 'FF0000')
  assert.equal(colors.filter(color => color !== '000000').length, 1)
  assert.equal(Object.keys(exportConfig(colors).colors).length, 110)
  assert.deepEqual(parseConfig(exportConfig(colors)), colors)
  for (const data of [{ device: 'other', colors: {} }, { colors: { 110: '000000' } }, { colors: { '-1': '000000' } }, { colors: { 5: 'wrong' } }]) assert.throws(() => parseConfig(data))
  assert.deepEqual(restore('bad').colors, blank())
  assert.deepEqual(restore(JSON.stringify({ version: 1, colors, showLabels: false })), { colors, showLabels: false, ruLabels: false })
})
