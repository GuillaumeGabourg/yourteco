const { CHROME, BASE, slugs, out } = require('./commun.cjs')
const { chromium } = require('playwright-core')
const fs = require('fs')
;(async () => {
  const b = await chromium.launch({ executablePath: CHROME })
  const report = { broken: [], blurry: [], overflow: [], errors: [], failedRequests: [] }
  // 1. images (1440, défilement complet pour charger les images différées)
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
  p.on('pageerror', (e) => report.errors.push('1440 ' + p.url() + ' ' + e.message))
  p.on('console', (m) => m.type() === 'error' && report.errors.push('1440 ' + p.url() + ' ' + m.text()))
  p.on('requestfailed', (r) => report.failedRequests.push(r.url()))
  p.on('response', (r) => r.status() >= 400 && report.failedRequests.push(r.status() + ' ' + r.url()))
  for (const s of slugs) {
    await p.goto(BASE + (s ? s + '/' : ''), { waitUntil: 'networkidle' })
    await p.evaluate(async () => {
      const H = document.documentElement.scrollHeight
      for (let y = 0; y < H; y += 700) { window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 90)) }
    })
    await p.waitForTimeout(1200)
    const r = await p.evaluate(() => [...document.querySelectorAll('main img')].map((i) => ({ src: i.getAttribute('src'), ok: i.complete && i.naturalWidth > 0, nat: i.naturalWidth, shown: Math.round(i.getBoundingClientRect().width) })))
    for (const i of r) {
      if (!i.ok) report.broken.push((s || '/') + ' ' + i.src)
      else if (i.shown > i.nat * 1.6 && !i.src.startsWith('https://i.ytimg')) report.blurry.push((s || '/') + ' ' + i.src + ' ' + i.nat + '→' + i.shown)
    }
  }
  // 2. débordements
  for (const w of [375, 768, 1440]) {
    const q = await b.newPage({ viewport: { width: w, height: 900 } })
    for (const s of slugs) {
      await q.goto(BASE + (s ? s + '/' : ''), { waitUntil: 'domcontentloaded' }); await q.waitForTimeout(500)
      const o = await q.evaluate(() => document.documentElement.scrollWidth - innerWidth)
      if (o > 0) report.overflow.push(w + ' ' + s + ' +' + o)
    }
  }
  report.failedRequests = [...new Set(report.failedRequests)].filter((u) => !u.includes('/@vite') && !u.includes('ytimg'))
  report.errors = [...new Set(report.errors)]
  fs.writeFileSync(out('audit.json'), JSON.stringify(report, null, 1))
  console.log('pages', slugs.length, 'broken', report.broken.length, 'blurry', report.blurry.length, 'overflow', report.overflow.length, 'errors', report.errors.length, 'failed', report.failedRequests.length)
  await b.close()
})()
