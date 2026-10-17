const { CHROME, BASE, slugs, out } = require('./commun.cjs')
// Rognage : pour chaque photo, part de l'image masquée par le cadre (object-fit: cover + agrandissement du parallaxe)
const { chromium } = require('playwright-core')
const pages = slugs.map((s) => '/' + (s ? s + '/' : ''))
;(async () => {
  const b = await chromium.launch({ executablePath: CHROME })
  for (const w of [1440]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } })
    const all = []
    for (const u of pages) {
      await p.goto(BASE + u.slice(1), { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(400)
      await p.evaluate(() => document.querySelectorAll('img').forEach(i => { i.loading = 'eager' }))
      await p.waitForLoadState('networkidle').catch(() => {})
      const r = await p.evaluate(() => [...document.querySelectorAll('.plate-frame img')].filter(i => i.naturalWidth).map(i => {
        const f = i.parentElement.getBoundingClientRect(); const fr = f.width / f.height; const nr = i.naturalWidth / i.naturalHeight
        const fit = getComputedStyle(i).objectFit; const sc = parseFloat(getComputedStyle(i).scale) || 1
        let lost = fit === 'cover' ? 1 - Math.min(fr, nr) / Math.max(fr, nr) : 0
        lost = 1 - (1 - lost) / (sc * sc)
        const up = i.getBoundingClientRect().width / i.naturalWidth
        return { src: i.currentSrc.split('/').pop(), lost: Math.round(lost * 100), up: +up.toFixed(2), sec: i.closest('section,header,article')?.className.split(' ')[0] }
      }))
      r.forEach(x => all.push({ u, ...x }))
    }
    // miniatures YouTube (hqdefault) : bandes noires rognées volontairement, comptées à part
    const yt = (x) => /hqdefault/.test(x.src)
    const cut = all.filter(x => x.lost > 4 && !yt(x))
    console.log(w, 'photos', all.length, 'rognées >4 %', cut.length, 'agrandies >1.2', all.filter(x=>x.up>1.2 && !/\.800\./.test(x.src) && !yt(x)).length, '| miniatures YouTube', all.filter(yt).length)
    const bySec = {}; cut.forEach(x => { const k = (x.u === '/' ? 'accueil ' : 'pages ') + x.sec; bySec[k] = (bySec[k] || 0) + 1 })
    if (cut.length) console.log('  par zone', JSON.stringify(bySec))
    if (w===1440) { cut.filter(x=>x.u!=='/').forEach(x => console.log('  ', x.u, x.src, x.lost + '%')); all.filter(x=>x.up>1.2 && !/.800./.test(x.src) && !yt(x)).forEach(x=>console.log('  UP', x.u, x.src, x.up)) }
    await p.close()
  }
  await b.close()
})()
