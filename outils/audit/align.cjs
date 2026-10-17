const { CHROME, BASE, slugs, out } = require('./commun.cjs')
// Audit de mise en page : alignement des rangées, icônes au-dessus du texte, dernière ligne centrée, trait de survol
const { chromium } = require('playwright-core')
const fs = require('fs')
;(async () => {
  const b = await chromium.launch({ executablePath: CHROME })
  const lignes = []
  for (const w of [1440, 375]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' })
    for (const s of slugs) {
      await p.goto(BASE + (s ? s + '/' : ''), { waitUntil: 'networkidle' })
      await p.waitForTimeout(400)
      const r = await p.evaluate(() => {
        const bad = []
        const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).position !== 'absolute' && getComputedStyle(e).position !== 'fixed' }
        const name = (e) => e.tagName.toLowerCase() + (e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/).join('.') : '')
        for (const el of document.querySelectorAll('main *, footer *')) {
          const cs = getComputedStyle(el)
          if (!/grid|flex/.test(cs.display)) continue
          if (cs.display.includes('flex') && cs.flexDirection.startsWith('column')) continue
          if (el.matches('.crumbs')) continue // fil d'Ariane : du texte qui passe à la ligne, aligné à gauche
          const kids = [...el.children].filter(vis)
          if (kids.length < 2) continue
          // rangées
          const rows = []
          for (const k of kids) {
            const kr = k.getBoundingClientRect(), t = kr.top, c = (kr.top + kr.bottom) / 2
            // même rangée : le centre vertical tombe dans la rangée (gère les rangées centrées verticalement)
            const row = rows.find((r) => c > r.t && c < r.b)
            row ? (row.items.push(k), row.t = Math.min(row.t, t), row.b = Math.max(row.b, kr.bottom)) : rows.push({ t, b: kr.bottom, items: [k] })
          }
          // A. titres d'une même rangée à la même hauteur
          for (const row of rows) {
            if (row.items.length < 2) continue
            const hs = row.items.map((k) => k.querySelector('h2,h3,h4,h5,h6')).filter(Boolean)
            if (hs.length === row.items.length) {
              const tops = hs.map((h) => h.getBoundingClientRect().top)
              const d = Math.max(...tops) - Math.min(...tops)
              if (d > 3) bad.push(['rangée désalignée', name(el), Math.round(d) + 'px', hs.map((h) => h.textContent.slice(0, 30)).join(' | ')])
            }
          }
          // D. dernière ligne incomplète centrée
          if (rows.length >= 2) {
            const first = rows[0].items, last = rows[rows.length - 1].items
            if (last.length < first.length) {
              const cr = el.getBoundingClientRect(), pl = parseFloat(cs.paddingLeft), pr = parseFloat(cs.paddingRight)
              const L = last[0].getBoundingClientRect().left - (cr.left + pl), R = cr.right - pr - last[last.length - 1].getBoundingClientRect().right
              const cols = first.length
              if (cols > 1 && Math.abs(L - R) > 8) bad.push(['dernière ligne non centrée', name(el), `${first.length}+…+${last.length}`, `gauche ${Math.round(L)} / droite ${Math.round(R)}`])
            }
          }
        }
        // C. icône posée au-dessus d'un titre aligné à gauche
        for (const ic of document.querySelectorAll('main [class*="icon"], main [class*="ico"]')) {
          if (!vis(ic) || !ic.querySelector('svg')) continue
          const parent = ic.parentElement
          const h = parent.querySelector(':scope > h2, :scope > h3, :scope > h4, :scope > p, :scope > div')
          if (!h || h === ic) continue
          const a = ic.getBoundingClientRect(), c = h.getBoundingClientRect()
          if (a.bottom <= c.top + 2 && Math.abs(a.left - c.left) < 6 && getComputedStyle(h).textAlign !== 'center') bad.push(['icône au-dessus du texte', name(ic), h.textContent.slice(0, 40)])
        }
        // B. titres survolables sans trait posé sur le texte
        for (const h of document.querySelectorAll('.h2, .h3, .cp-h, .why-item h4, .pillar h3, .step h3')) {
          if (!vis(h)) continue
          if (!h.querySelector('.ul')) bad.push(['titre sans trait sur le texte', name(h), h.textContent.slice(0, 40)])
          else {
            const u = h.querySelector('.ul'), rs = [...u.getClientRects()]
            const lastR = rs[rs.length - 1], hr = h.getBoundingClientRect()
            // le trait finit à la fin du texte, pas au bord du bloc (seulement signalé si le bloc est nettement plus large)
            if (rs.length > 1 && hr.right - lastR.right < 1 && getComputedStyle(h).textAlign === 'start') bad.push(['trait = largeur du bloc ?', name(h), h.textContent.slice(0, 40)])
          }
        }
        return bad
      })
      for (const x of r) lignes.push([w, s || '/', ...x].join(' · '))
    }
    await p.close()
  }
  const uniq = [...new Set(lignes)]
  fs.writeFileSync(out('align.txt'), uniq.join('\n'))
  const byType = {}
  for (const l of uniq) { const t = l.split(' · ')[2]; byType[t] = (byType[t] || 0) + 1 }
  console.log(JSON.stringify(byType), 'total', uniq.length)
  await b.close()
})()
