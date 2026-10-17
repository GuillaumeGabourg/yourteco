const { CHROME, BASE, slugs, out } = require('./commun.cjs')
// Audit accessibilité (axe-core, WCAG 2.2 AA) : thèmes clair et sombre, 1440 et 375
const { chromium } = require('playwright-core')
const fs = require('fs')
const axe = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8')
;(async () => {
  const b = await chromium.launch({ executablePath: CHROME })
  const agg = {}
  for (const theme of ['light', 'dark']) for (const w of [1440, 375]) {
    const ctx = await b.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' })
    await ctx.addInitScript((t) => { try { localStorage.setItem('ytc-theme', t) } catch {} }, theme)
    const p = await ctx.newPage()
    for (const s of slugs) {
      await p.goto(BASE + (s ? s + '/' : ''), { waitUntil: 'networkidle' })
      await p.waitForTimeout(300)
      await p.addScriptTag({ content: axe })
      const res = await p.evaluate(async () => (await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'] })).violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.map((n) => n.target.join(' ') + ' :: ' + (n.any[0]?.message || n.failureSummary || '').slice(0, 140)) })))
      for (const v of res) {
        const k = v.id
        agg[k] = agg[k] || { impact: v.impact, count: 0, ex: new Set() }
        agg[k].count += v.nodes.length
        v.nodes.slice(0, 4).forEach((n) => agg[k].ex.size < 14 && agg[k].ex.add(`${theme} ${w} /${s} ${n}`))
      }
    }
    await ctx.close()
  }
  const texte = Object.entries(agg).map(([k, v]) => `## ${k} (${v.impact}) x${v.count}\n` + [...v.ex].join('\n')).join('\n\n')
  fs.writeFileSync(out('axe.txt'), texte || 'aucune violation')
  console.log(Object.entries(agg).map(([k, v]) => k + ':' + v.count).join(' ') || 'aucune violation')
  await b.close()
})()
