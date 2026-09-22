// Physical geometry is independent of the protocol ordering. Units include key gaps.
const keys = []
function row (y, entries, start = 0) {
  let x = start
  for (const [led, label, w = 1] of entries) {
    keys.push({ id: `led-${led}`, led, label, x, y, w, h: 1 })
    x += w
  }
}
row(0.55, [[91, 'Esc']])
row(0.55, [[92, 'F1'], [93, 'F2'], [94, 'F3'], [97, 'F4']], 1.75)
row(0.55, [[98, 'F5'], [99, 'F6'], [103, 'F7'], [104, 'F8']], 6.25)
row(0.55, [[105, 'F9'], [64, 'F10'], [65, 'F11'], [66, 'F12']], 10.75)
row(2, [[0, '~'], [1, '1'], [8, '2'], [9, '3'], [16, '4'], [17, '5'], [24, '6'], [25, '7'], [32, '8'], [33, '9'], [40, '0'], [41, '−'], [48, '='], [49, 'Backspace', 2]])
row(3, [[2, 'Tab', 1.5], [3, 'Q'], [10, 'W'], [11, 'E'], [18, 'R'], [19, 'T'], [26, 'Y'], [27, 'U'], [34, 'I'], [35, 'O'], [42, 'P'], [43, '['], [50, ']'], [51, '\\', 1.5]])
row(4, [[4, 'Caps Lock', 1.75], [5, 'A'], [12, 'S'], [13, 'D'], [20, 'F'], [21, 'G'], [28, 'H'], [29, 'J'], [36, 'K'], [37, 'L'], [44, ';'], [45, '"'], [52, 'Enter', 2.25]])
row(5, [[6, 'Shift', 2.25], [7, 'Z'], [14, 'X'], [15, 'C'], [22, 'V'], [23, 'B'], [30, 'N'], [31, 'M'], [38, ','], [39, '.'], [46, '/'], [47, 'Right Shift', 2.75]])
row(6, [[86, 'Ctrl', 1.25], [85, 'Win', 1.25], [87, 'Alt', 1.25], [88, 'Space', 6.25], [89, 'Right Alt', 1.25], [90, 'Fn', 1.25], [58, 'Menu', 1.25], [53, 'Right Ctrl', 1.25]])
row(1, [[95, 'Print Screen'], [96, 'Scroll Lock'], [100, 'Pause Break']], 15.5)
row(2, [[54, 'Insert'], [55, 'Home'], [62, 'Page Up']], 15.5)
row(3, [[56, 'Delete'], [57, 'End'], [63, 'Page Down']], 15.5)
row(5, [[59, '↑']], 16.5)
row(6, [[61, '←'], [60, '↓'], [67, '→']], 15.5)
row(2, [[69, 'Num Lock'], [70, '/'], [77, '*'], [78, '−']], 19)
row(3, [[71, '7'], [72, '8'], [79, '9']], 19)
row(4, [[73, '4'], [74, '5'], [81, '6']], 19)
row(5, [[75, '1'], [76, '2'], [83, '3']], 19)
row(6, [[68, '0', 2], [84, '.']], 19)
keys.push({ id: 'led-80', led: 80, label: '+', x: 22, y: 3, w: 1, h: 2 })
keys.push({ id: 'led-82', led: 82, label: 'Enter', x: 22, y: 5, w: 1, h: 2 })
row(1, [[106, 'Stop'], [108, 'Previous track'], [107, 'Play/Pause'], [109, 'Next track']], 19)
const characterLabels = new Set(['~', '−', '=', '[', ']', '\\', ';', '"', ',', '.', '/'])
export const layout = keys.map(key => ({
  ...key,
  media: key.led >= 106,
  type: /^[A-Za-z]$/.test(key.label) || characterLabels.has(key.label) ? 'character' : 'function'
}))
// 101/102 have no established physical location; retain their color slots on import/export.
export const unlocated = [101, 102]
