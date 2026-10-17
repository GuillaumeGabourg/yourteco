const { CHROME, BASE, slugs, out } = require('./commun.cjs')
const { chromium } = require('playwright-core')
;(async () => {
  const b = await chromium.launch({ executablePath: CHROME })
  for (const [w, h] of [[1440, 900], [375, 812]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } })
    // depuis une autre page
    await p.goto(BASE + 'kit-yourte/'); await p.waitForTimeout(1500)
    if (w < 1340) { await p.click('.burger'); await p.waitForTimeout(700); await p.click('#menu-mobile a[href="/#devis"]') }
    else await p.click('.bar-quote')
    await p.waitForTimeout(2500)
    const r1 = await p.evaluate(() => [document.getElementById('devis').getBoundingClientRect().top, document.getElementById('site-bar').getBoundingClientRect().height])
    // même page, depuis le haut
    await p.evaluate(() => window.__lenis.scrollTo(0, { immediate: true })); await p.waitForTimeout(500)
    await p.click('.hero-actions .btn'); await p.waitForTimeout(2500)
    const r2 = await p.evaluate(() => [document.getElementById('devis').getBoundingClientRect().top, document.getElementById('site-bar').getBoundingClientRect().height])
    // arrivée directe
    await p.goto(BASE + '#devis'); await p.waitForTimeout(2500)
    const r3 = await p.evaluate(() => [document.getElementById('devis').getBoundingClientRect().top, document.getElementById('site-bar').getBoundingClientRect().height])
    console.log(w, 'autre page', r1, 'meme page', r2, 'direct', r3)
  }
  await b.close()
})()
