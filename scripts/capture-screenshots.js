/**
 * capture-screenshots.js
 *
 * Regenerates the four ProductFeatures screenshots from the live dev server by
 * driving a headless Chrome over the DevTools Protocol. Each shot loads a
 * URL-parameterized map state and captures a precise clip of the map.
 *
 * Prereqs: dev server running (npm run dev) and Google Chrome installed.
 * Run: node scripts/capture-screenshots.js [baseURL]
 */

import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import os from 'os'

const BASE = process.argv[2] || 'http://localhost:5173'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const OUT_DIR = path.join(process.cwd(), 'public', 'screenshots')
const PORT = 9311

// Pick the highest-risk intersection for the report-card shot.
const fc = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'intersection-risk.json'), 'utf-8'))
const top = [...fc.features].sort(
  (a, b) => b.properties.risk_score - a.properties.risk_score || b.properties.total_crashes - a.properties.total_crashes
)[0]
const [lng, lat] = top.geometry.coordinates
const focusKey = `${lat.toFixed(5)},${lng.toFixed(5)}`

const SHOTS = [
  { file: 'risk-scored.png', query: '' },
  { file: 'report-card.png', query: `?focus=${encodeURIComponent(focusKey)}`, hideLayers: true },
  { file: 'highlight-injury.png', query: '?injury=1' },
  { file: 'hotspots.png', query: '?hotspots=1' },
]

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mtg-chrome-'))
  const chrome = spawn(CHROME, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${userDataDir}`,
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank',
  ], { stdio: 'ignore' })

  try {
    // Wait for the debugging endpoint, then grab a page target.
    let target
    for (let i = 0; i < 40; i++) {
      await sleep(250)
      try {
        const list = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()
        target = list.find(t => t.type === 'page' && t.webSocketDebuggerUrl)
        if (target) break
      } catch { /* not up yet */ }
    }
    if (!target) throw new Error('Chrome debugging endpoint never came up')

    const ws = new WebSocket(target.webSocketDebuggerUrl)
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej })

    let nextId = 1
    const pending = new Map()
    const loadWaiters = []
    ws.onmessage = ev => {
      const msg = JSON.parse(ev.data)
      if (msg.id && pending.has(msg.id)) {
        pending.get(msg.id)(msg.result)
        pending.delete(msg.id)
      }
      if (msg.method === 'Page.loadEventFired') {
        while (loadWaiters.length) loadWaiters.shift()()
      }
    }
    const send = (method, params = {}) =>
      new Promise(res => { const id = nextId++; pending.set(id, res); ws.send(JSON.stringify({ id, method, params })) })

    await send('Page.enable')
    await send('Runtime.enable')
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1200, height: 820, deviceScaleFactor: 2, mobile: false,
    })

    for (const shot of SHOTS) {
      const loaded = new Promise(res => loadWaiters.push(res))
      await send('Page.navigate', { url: `${BASE}/${shot.query}` })
      await loaded
      await sleep(3200) // data fetch + leaflet tiles + marker render

      // Headless screenshots don't composite backdrop-filter, so the
      // translucent floating panels bleed. Force them opaque for the capture,
      // disable the card slide-in animation, and (for the report-card shot)
      // hide the layer panel so it doesn't sit under the card.
      const hideCss = shot.hideLayers ? '[data-panel="layers"]{display:none !important;}' : ''
      const { result: dbg } = await send('Runtime.evaluate', {
        returnByValue: true,
        expression: `(() => {
          const s = document.createElement('style');
          s.textContent = ':root{--color-panel:#ffffff !important;}'
            + '.cs-panel{background:#ffffff !important;backdrop-filter:none !important;opacity:1 !important;}'
            + '.report-card{animation:none !important;opacity:1 !important;}'
            + '${hideCss}';
          document.head.appendChild(s);
          const card = document.querySelector('.report-card');
          return getComputedStyle(card || document.body).backgroundColor;
        })()`,
      })
      if (shot.hideLayers) console.log(`    card bg after override: ${dbg.value}`)
      await sleep(200)

      // Measure the map container in document coordinates.
      const { result } = await send('Runtime.evaluate', {
        returnByValue: true,
        expression: `(() => {
          const el = document.querySelector('.leaflet-container');
          el.scrollIntoView();
          const r = el.getBoundingClientRect();
          return { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height };
        })()`,
      })
      const clip = { ...result.value, scale: 1 }

      const { data } = await send('Page.captureScreenshot', {
        format: 'png', clip, captureBeyondViewport: true,
      })
      fs.writeFileSync(path.join(OUT_DIR, shot.file), Buffer.from(data, 'base64'))
      console.log(`  ✓ ${shot.file}  (${Math.round(clip.width)}×${Math.round(clip.height)})`)
    }

    ws.close()
    console.log(`\nWrote ${SHOTS.length} screenshots → public/screenshots/`)
    console.log(`Report card shows: ${top.properties.name} (${top.properties.total_crashes} crashes)`)
  } finally {
    chrome.kill()
  }
}

main().catch(err => { console.error('Capture failed:', err.message); process.exit(1) })
