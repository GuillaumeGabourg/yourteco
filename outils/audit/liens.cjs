// Liens internes : chaque lien (pages, menu, accueil) doit mener à une page qui existe dans la maquette.
// Un lien vers yourteco.com compte aussi (ce serait une page du site d'origine non reprise). Détail dans rapports/liens.txt.
const fs = require('fs')
const path = require('path')
const { PAGES_DIR, out } = require('./commun.cjs')

const ROOT = path.join(PAGES_DIR, '..', '..', '..')
const ROUTES = ['', 'plan-du-site', 'devis', 'quote', 'angebot', 'contact', 'accueil']
const known = new Set([...ROUTES, ...fs.readdirSync(PAGES_DIR).map((f) => f.replace('.json', '').replace(/__/g, '/'))])

const bad = new Map() // lien -> pages où il se trouve
const total = { n: 0 }
function check(href, where) {
  const m = href.match(/^(?:https?:\/\/(?:www\.)?yourteco\.com)?(\/[^?#]*)?(#.*)?$/)
  if (!m) return // lien externe, mailto, tel
  const p = (m[1] || '/').replace(/^\/+|\/+$/g, '')
  if (/^(img|assets|wp-content)(\/|$)/.test(p)) return
  total.n++
  if (!known.has(p)) bad.set(href, [...(bad.get(href) || []), where])
}
function walk(o, where) {
  if (Array.isArray(o)) o.forEach((v) => walk(v, where))
  else if (o && typeof o === 'object') {
    if (typeof o.href === 'string') check(o.href, where)
    Object.values(o).forEach((v) => walk(v, where))
  }
}

for (const f of fs.readdirSync(PAGES_DIR)) walk(JSON.parse(fs.readFileSync(path.join(PAGES_DIR, f), 'utf8')), f.replace('.json', ''))
for (const f of ['menu.js', 'home.js', 'ui.js']) {
  const src = fs.readFileSync(path.join(ROOT, 'src', 'content', f), 'utf8')
  for (const m of src.matchAll(/href:\s*['"]([^'"]+)['"]/g)) check(m[1], f)
}

const lines = [...bad].map(([h, w]) => `${h} <- ${[...new Set(w)].join(', ')}`)
fs.writeFileSync(out('liens.txt'), lines.join('\n') + '\n')
console.log(`liens internes ${total.n} cassés ${bad.size}`)
if (bad.size) console.log(lines.slice(0, 15).join('\n'))
