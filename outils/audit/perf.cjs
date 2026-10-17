const { CHROME, BASE, slugs, out } = require('./commun.cjs')
// Mesure de fluidité sur PC peu puissant simulé (CPU ralenti x6) : défilement réel à la molette
// npm run audit:perf -- [url] [variantes]
const { chromium } = require('playwright-core')
const url = process.argv[2] || BASE
const variants = (process.argv[3] || 'base,nofilter,noseed,reduce').split(',')
const CSS = {
  nofilter: '*,*::before,*::after{filter:none!important;backdrop-filter:none!important;mix-blend-mode:normal!important}',
  noseed: '.seed-field{display:none!important}',
  nomask: '*{mask-image:none!important;-webkit-mask-image:none!important;clip-path:none!important}',
  noleaves: '.leaves,.falling-leaves,[class*="leaf-fall"]{display:none!important}',
}
;(async () => {
  const b = await chromium.launch({ executablePath: CHROME, args: ['--disable-gpu-vsync'] })
  for (const v of variants) {
    const ctx = await b.newContext({ viewport: { width: 1366, height: 768 }, reducedMotion: v === 'reduce' ? 'reduce' : 'no-preference' })
    const p = await ctx.newPage()
    const cdp = await ctx.newCDPSession(p)
    await p.goto(url + (v === 'high' ? '?perf=high' : v === 'low' ? '?perf=low' : ''), { waitUntil: 'networkidle' })
    if (CSS[v]) await p.addStyleTag({ content: CSS[v] })
    await p.waitForTimeout(1500)
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 6 })
    await cdp.send('Performance.enable')
    const m0 = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((x) => [x.name, x.value]))
    if (v === 'base') await cdp.send('Profiler.enable'), await cdp.send('Profiler.start')
    await p.evaluate(() => {
      window.__f = []; let l = performance.now()
      const loop = (t) => { window.__f.push(t - l); l = t; if (!window.__stop) requestAnimationFrame(loop) }
      requestAnimationFrame(loop)
      window.__lt = 0; new PerformanceObserver((li) => li.getEntries().forEach((e) => (window.__lt += e.duration))).observe({ type: 'longtask', buffered: false })
    })
    await p.mouse.move(600, 400)
    for (let i = 0; i < 60; i++) { await p.mouse.wheel(0, 260); await p.waitForTimeout(110) }
    const r = await p.evaluate(() => {
      window.__stop = true
      const f = window.__f.slice(2).sort((a, b) => a - b)
      const avg = f.reduce((a, b) => a + b, 0) / f.length
      return { frames: f.length, fps: Math.round(1000 / avg), p95: Math.round(f[Math.floor(f.length * 0.95)]), jank: f.filter((x) => x > 50).length, longTasks: Math.round(window.__lt), y: Math.round(scrollY) }
    })
    const m1 = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((x) => [x.name, x.value]))
    const d = (k) => Math.round((m1[k] - m0[k]) * 1000)
    console.log(v.padEnd(9), JSON.stringify({ ...r, scriptMs: d('ScriptDuration'), layoutMs: d('LayoutDuration'), styleMs: d('RecalcStyleDuration'), taskMs: d('TaskDuration') }))
    if (v === 'base') {
      const { profile } = await cdp.send('Profiler.stop')
      const self = {}
      const dt = profile.timeDeltas; const byId = new Map(profile.nodes.map((n) => [n.id, n]))
      profile.samples.forEach((id, i) => { const n = byId.get(id); const k = (n.callFrame.functionName || '(anon)') + ' ' + (n.callFrame.url.split('/').pop().split('?')[0]) + ':' + n.callFrame.lineNumber; self[k] = (self[k] || 0) + (dt[i] || 0) })
      const top = Object.entries(self).sort((a, b) => b[1] - a[1]).slice(0, 18).map(([k, us]) => Math.round(us / 1000) + 'ms ' + k)
      console.log(top.join('\n'))
    }
    await ctx.close()
  }
  await b.close()
})()
