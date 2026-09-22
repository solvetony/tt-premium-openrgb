import { build } from 'esbuild'
import { mkdir, writeFile } from 'node:fs/promises'
const result = await build({ entryPoints: ['src/app.jsx'], bundle: true, minify: true, write: false, outdir: 'out', jsx: 'automatic', jsxImportSource: 'preact', format: 'iife' })
const script = result.outputFiles.find(file => file.path.endsWith('.js')).text.replaceAll('</script', '<\\/script')
const style = result.outputFiles.find(file => file.path.endsWith('.css')).text
await mkdir('out', { recursive: true })
await writeFile('out/index.html', `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>X1 · Keyboard Lighting Configuration</title><style>${style}</style></head><body><div id="app"></div><script>${script}</script></body></html>`)
