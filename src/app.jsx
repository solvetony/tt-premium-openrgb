import { render } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'
import { Keyboard as KeyboardIcon, Download, Upload, RotateCcw, Palette, MousePointer2, Square, SkipBack, SkipForward, Play, Pause, VolumeX, Trash2 } from 'lucide-preact'
import { layout } from './data/x1-layout.js'
import { labels, ruLabels } from './data/x1-led-map.js'
import { blank, device, exportConfig, normalize, parseConfig, restore, storageKey } from './lib/config.js'
import './styles/app.css'

function Toggle({ checked, onChange, label }) {
  return <label class='toggle'><input type='checkbox' checked={checked} onChange={onChange} aria-label={label === '🇬🇧 EN' ? 'Show English legends' : 'Show Russian legends'} /><span class='switch' />{label}</label>
}
const mediaIcons = { 106: Square, 108: SkipBack, 107: Play, 109: SkipForward }
function KeyLegend({ entry, english, russian, showEnglish, showRussian, Icon }) {
  if (Icon) return <span class='media-legend' aria-hidden='true'><Icon size={18} />{entry.led === 107 && <Pause size={14} />}</span>
  const hasRussian = Boolean(russian) && russian !== english
  const bilingual = showEnglish && showRussian && hasRussian && entry.type === 'character'
  if (bilingual) return <span class='key-cap is-bilingual'><span class='legend legend-en'>{english}</span><span class='legend legend-ru'>{russian}</span></span>
  const visible = showRussian && !showEnglish && hasRussian ? russian : showEnglish ? english : null
  return <span class={`key-cap ${entry.type === 'character' ? 'character-key' : 'function-key'}`}>{visible}</span>
}
function KeyboardKey({ entry, color, selected, showEnglish, showRussian, onSelect }) {
  const Icon = mediaIcons[entry.led]
  const english = entry.media ? entry.label : labels[entry.led] || entry.label
  const russianName = entry.media ? entry.label : ruLabels[entry.led] || entry.label
  const name = entry.media ? entry.label : (russianName !== english ? `${english}, Russian ${russianName}` : english)
  return <button class={`key ${selected ? 'selected' : ''} ${color !== '000000' ? 'lit' : ''}`} style={{ left: `${entry.x / 23 * 100}%`, top: `${entry.y / 7 * 100}%`, width: `${entry.w / 23 * 100}%`, height: `${entry.h / 7 * 100}%`, '--rgb': '#' + color }} aria-label={`${name}, LED ${entry.led}`} aria-pressed={selected} title={`${name} · LED ${entry.led}`} onClick={() => onSelect(entry.led)}><KeyLegend entry={entry} english={english} russian={russianName} showEnglish={showEnglish} showRussian={showRussian} Icon={Icon} /></button>
}
function Keyboard({ colors, selected, showEnglish, showRussian, onSelect }) {
  return (
    <div class='keyboard-scroll'>
      <div class='keyboard-wrap'>
        <div class='case'>
          <div class='key-bed'>
            {layout.map(entry => <KeyboardKey key={entry.id} entry={entry} color={colors[entry.led]} selected={entry.led === selected} showEnglish={showEnglish} showRussian={showRussian} onSelect={onSelect} />)}
            <div class='round-controls' aria-hidden='true'><i /><i /><i /></div>
            <div class='indicators' aria-hidden='true'><i /><i /><i /></div>
            <div class='volume' aria-label='Volume roller and mute control (unmapped)'><span class='roller' /><VolumeX size={18} /></div>
          </div>
        </div>
      </div>
    </div>
  )
}
function App() {
  const [initial] = useState(() => { try { return restore(localStorage.getItem(storageKey)) } catch { return restore(null) } })
  const [colors, setColors] = useState(initial.colors)
  const [showEnglish, setShowEnglish] = useState(initial.showLabels)
  const [showRussian, setShowRussian] = useState(initial.ruLabels)
  const [selected, setSelected] = useState(null)
  const [hex, setHex] = useState('000000')
  const [recent, setRecent] = useState([])
  const [message, setMessage] = useState('Select a key to start. Changes are saved in this browser.')
  const file = useRef()
  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify({ version: 1, colors, showLabels: showEnglish, ruLabels: showRussian })) } catch { setMessage('Browser storage unavailable. Export your configuration to save it.') }
  }, [colors, showEnglish, showRussian])
  useEffect(() => { setHex(selected === null ? '000000' : colors[selected]) }, [selected, colors])
  const entry = layout.find(key => key.led === selected)
  const selectedColor = selected === null ? '000000' : colors[selected]
  function update(value) {
    if (selected === null) return
    try {
      const color = normalize(value)
      setColors(previous => previous.map((old, id) => id === selected ? color : old))
      setRecent(previous => [color, ...previous.filter(old => old !== color)].slice(0, 8))
      setMessage(`Updated ${entry.label}, LED ${selected}. Export to apply through OpenRGB.`)
    } catch (error) { setMessage(error.message) }
  }
  function resetAll() {
    if (colors.some(color => color !== '000000') && !window.confirm('Reset all 110 LED colors to off?')) return
    setColors(blank())
    setMessage('All LED colors reset to off.')
  }
  function download() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(exportConfig(colors), null, 2)], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'thermaltake-x1-rgb.json'
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    setMessage('Configuration exported. Apply the JSON with the supplied OpenRGB bridge.')
  }
  async function importFile(event) {
    const input = event.currentTarget
    try {
      if (!input.files.length) return
      if (input.files[0].size > 100000) throw new Error('Configuration file is too large.')
      const imported = parseConfig(JSON.parse(await input.files[0].text()))
      setColors(imported)
      setMessage('Configuration imported. Omitted LED entries are off.')
    } catch (error) { setMessage(`Import failed: ${error.message}`) } finally { input.value = '' }
  }
  const toggleEnglish = event => setShowEnglish(event.currentTarget.checked)
  const toggleRussian = event => setShowRussian(event.currentTarget.checked)
  return (
    <main>
      <header><div class='brand'><div class='device-mark'><KeyboardIcon size={30} /></div><div><h1>{device}</h1><p>Keyboard Lighting Configuration</p></div></div><div class='toolbar'><button onClick={resetAll}><RotateCcw />Reset All</button><button onClick={() => file.current.click()}><Upload />Import</button><button class='primary' onClick={download}><Download />Export</button><input ref={file} hidden type='file' accept='.json,application/json' aria-label='Import X1 color configuration' onChange={importFile} /></div></header>
      <Keyboard colors={colors} selected={selected} showEnglish={showEnglish} showRussian={showRussian} onSelect={setSelected} />
      <div class='status' role='status'>{message}</div>
      <section class='cards'>
        <article><h2><Palette />Color Picker</h2><p>Colors update the selected key immediately.</p><div class='picker-row'><label class='native-picker'>Choose color<input aria-label='Choose selected key color' type='color' value={'#' + selectedColor} disabled={selected === null} onInput={event => update(event.currentTarget.value)} /></label><div class='picker-fields'><label for='hex'>Hexadecimal color</label><input id='hex' type='text' value={hex} maxLength={7} disabled={selected === null} onInput={event => { const value = event.currentTarget.value; setHex(value); if (/^#?[\da-f]{6}$/i.test(value)) update(value) }} onBlur={() => { if (!/^#?[\da-f]{6}$/i.test(hex)) { setMessage('Use six hexadecimal digits, such as FF3366.'); setHex(selectedColor) } }} /><h3>Recent colors</h3><div class='swatches'>{recent.length ? recent.map(color => <button key={color} style={{ background: '#' + color }} aria-label={`Use color #${color}`} disabled={selected === null} onClick={() => update(color)} />) : <small>Your chosen colors appear here.</small>}</div><button disabled={selected === null} onClick={() => update('000000')}><Trash2 />Clear</button></div></div></article>
        <article><h2><MousePointer2 />Selected Key</h2>{entry ? <><div class='selected-details'><div class={'mini-key ' + (selectedColor !== '000000' ? 'lit' : '')} style={{ '--rgb': '#' + selectedColor }}>{entry.label}</div><dl><dt>Key</dt><dd>{entry.label}</dd><dt>LED ID</dt><dd>{selected}</dd><dt>Color</dt><dd><span class='color-dot' style={{ background: '#' + selectedColor }} />#{selectedColor}</dd></dl></div>{selected === 109 && <p>Also lights the analog-output indicator, as observed in the physical scan.</p>}<button class='wide' onClick={() => update('000000')}><RotateCcw />Reset Key</button></> : <div class='empty'><MousePointer2 /><p>Select a key on the keyboard to edit its color.</p></div>}</article>
        <article><h2><KeyboardIcon />Layout &amp; Mapping</h2><div class='toggles'><Toggle checked={showEnglish} onChange={toggleEnglish} label='🇬🇧 EN' /><Toggle checked={showRussian} onChange={toggleRussian} label='🇷🇺 RU' /></div><p>Choose either or both visible legends without changing protocol IDs or colors.</p><p class='mapping-note'>LEDs 101 and 102 have no recorded physical position. Their colors are preserved in imported configurations.</p><button class='wide' onClick={resetAll}><RotateCcw />Reset All Keys</button></article>
      </section>
    </main>
  )
}
render(<App />, document.getElementById('app'))
