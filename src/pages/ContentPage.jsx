import { useEffect, useRef, useState, Fragment } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { fix, Segs, SmartLink, segsText } from '../lib/text.jsx'
import { usePageMeta } from '../lib/meta.js'
import { Reveal, WordsReveal } from '../components/Motion.jsx'
import { Plate } from '../components/Plate.jsx'
import { QuoteButton, PhoneLink } from '../components/Chrome.jsx'
import Icon from '../components/Icon.jsx'
import { FallingLeaves, Hills } from '../components/Nature.jsx'
import NotFound from './NotFound.jsx'
import DIMS from '../content/imageDims.json'
import { asset } from '../lib/asset.js'
import ReviewWall from '../components/ReviewWall.jsx'
import ColorPicker from '../components/ColorPicker.jsx'
import RelatedCards from '../components/RelatedCards.jsx'
import InRubrique from '../components/InRubrique.jsx'
import { findInMenu, OTHER_PAGES } from '../content/menu.js'

/* « Sujets connexes » : les accroches avec lien qui suivent ce titre deviennent des cartes */
const RELATED = /^(Sujets connexes|Articles connexes|Related (topics|articles)|Verwandte Themen)/i
function extractRelated(blocks) {
  const out = []
  let inRel = false
  for (const b of blocks) {
    if (b.type === 'heading') { inRel = RELATED.test(b.text); out.push(b); continue }
    const linked = b.type === 'text' && b.segs.some((x) => x.href)
    if (inRel && linked) {
      const last = out[out.length - 1]
      if (last?.type === 'related') last.items.push(b)
      else out.push({ type: 'related', items: [b] })
      continue
    }
    out.push(b)
  }
  return out
}

/* ---------- témoignages : « Avis de X - date » + citation  |  « Testimonial 1: X » + citation ---------- */
const plain = (b) => (b?.segs ? b.segs.map((x) => x.t).join('').trim() : '')
const isQuote = (b) => b?.type === 'text' && /^["“«„]/.test(plain(b))
const AUTHOR_LINE = /^(?:Avis (?:de |d'|d’))?(.{2,60}?)\s+[-–]\s+(.{3,40})$/
const AUTHOR_HEAD = /^(?:Testimonial|Erfahrungsbericht|Témoignage)\s*\d+\s*:\s*(.+)$/i
const unquote = (t) => t.replace(/^["“«„]\s*/, '').replace(/\s*["”»“]\s*\.?\s*$/, '').trim()

function readReview(blocks, i) {
  const a = blocks[i], q = blocks[i + 1]
  if (!isQuote(q)) return null
  if (a.type === 'text') {
    const m = plain(a).match(AUTHOR_LINE)
    if (m) return { author: m[1].trim(), date: m[2].trim(), text: unquote(plain(q)) }
  }
  if (a.type === 'heading') {
    const m = a.text.match(AUTHOR_HEAD)
    if (m) return { author: m[1].trim(), date: '', text: unquote(plain(q)) }
  }
  return null
}

/** Remplace chaque suite de témoignages (et les photos glissées entre eux) par un bloc « reviews ». */
function extractReviews(blocks) {
  const out = []
  for (let i = 0; i < blocks.length; i++) {
    const r = readReview(blocks, i)
    if (!r) { out.push(blocks[i]); continue }
    let last = out[out.length - 1]
    if (last?.type !== 'reviews') { last = { type: 'reviews', items: [] }; out.push(last) }
    last.items.push(r)
    i++
    // photos placées entre deux témoignages (ou juste après le dernier) : intégrées au mur
    while (blocks[i + 1]?.type === 'image' && (readReview(blocks, i + 2) || !blocks[i + 2] || blocks[i + 2].type === 'image' || i + 2 >= blocks.length)) {
      last.items.push(blocks[++i])
    }
  }
  return out
}


/** Image d'origine trop petite pour être agrandie (logos, badges, petits schémas). */
const isSmall = (src) => (DIMS[src]?.[0] || 9999) < 480

const files = import.meta.glob('../content/pages/*.json')
const keyOf = (slug) => `../content/pages/${slug.replace(/\//g, '__')}.json`
export const hasPage = (slug) => !!files[keyOf(slug)]

const L = {
  fr: { home: 'Accueil', cta: 'Un projet de yourte ?', ctaText: 'Parlons-en : conseil, démarches, fabrication et pose.', video: 'Lire la vidéo (YouTube)', links: 'Pages liées' },
  en: { home: 'Home', cta: 'A yurt project?', ctaText: 'Let’s talk: advice, permits, manufacturing and installation.', video: 'Play video (YouTube)', links: 'Related pages' },
  de: { home: 'Startseite', cta: 'Ein Jurtenprojekt?', ctaText: 'Sprechen wir darüber: Beratung, Genehmigung, Fertigung und Aufbau.', video: 'Video abspielen (YouTube)', links: 'Verwandte Seiten' },
}

function Video({ id, label }) {
  const [play, setPlay] = useState(false)
  return (
    <figure className="plate cp-video">
      <div className="plate-frame" style={{ aspectRatio: '16 / 9' }}>
        {play ? (
          <iframe src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`} title="Vidéo Yourteco" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
        ) : (
          <button className="video-btn" onClick={() => setPlay(true)} aria-label={label}>
            <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" />
            <span className="video-play"><Icon name="play" size={30} /></span>
          </button>
        )}
      </div>
    </figure>
  )
}

/* Contenu externe intégré (modèle 3D, Street View) : rien n'est chargé tant qu'on n'a pas cliqué, donc aucun cookie tiers avant accord */
function Embed({ b }) {
  const [on, setOn] = useState(false)
  let host = ''
  try { host = new URL(b.src).hostname.replace(/^www\./, '') } catch { /* adresse inattendue */ }
  return (
    <figure className="plate cp-embed">
      <div className="plate-frame" style={{ height: Math.min(b.height || 450, 600) }}>
        {on ? (
          <iframe src={b.src} title={b.title} allowFullScreen loading="lazy" />
        ) : (
          <button type="button" className="embed-btn" onClick={() => setOn(true)}>
            <span className="embed-title">{b.title}</span>
            <span className="more"><span>Afficher le contenu</span><Icon name="arrow" size={18} /></span>
            {host && <span className="embed-note">Hébergé par {host} : l'affichage charge leur site.</span>}
          </button>
        )}
      </div>
    </figure>
  )
}

/** Découpe une section en chapitres : un titre + ce qui le suit. */
function toChapters(blocks) {
  const chapters = []
  let cur = null
  for (const b of blocks) {
    // image marquée « seule » : son propre chapitre, centrée, jamais rattachée au texte voisin
    if (b.type === 'image' && b.alone) { chapters.push({ heading: null, body: [], media: [b], solo: true }); cur = null; continue }
    if (b.type === 'heading' || !cur) {
      cur = { heading: b.type === 'heading' ? b : null, body: [], media: [] }
      chapters.push(cur)
      if (b.type === 'heading') continue
    }
    if (b.type === 'image' || b.type === 'video') cur.media.push(b)
    else cur.body.push(b)
  }
  // une image placée juste avant un titre illustre souvent le chapitre suivant
  for (let i = 0; i < chapters.length - 1; i++) {
    const c = chapters[i], n = chapters[i + 1]
    if (c.media.length > 1 && !n.media.length && c.body.length) n.media.push(c.media.pop())
  }
  // photos seules (sans titre ni texte) : rattachées au texte voisin qui n'a pas d'image
  for (let i = 0; i < chapters.length; i++) {
    const c = chapters[i]
    if (c.solo || c.heading || c.body.length || !c.media.length) continue
    const n = chapters[i + 1], p = chapters[i - 1]
    const target = n && n.body.length && !n.media.length ? n
      : p && p.body.length && !p.media.length ? p
      : p && p.body.length && p.media.length < 4 ? p // sinon : ajoutée aux photos du texte précédent
      : null
    if (target) { target.media.push(...c.media); c.media = []; c.dead = true }
  }
  // titres seuls à la suite : regroupés en une liste de points
  const out = []
  for (const c of chapters.filter((x) => !x.dead)) {
    const lone = c.heading && !c.body.length && !c.media.length
    const last = out[out.length - 1]
    if (lone && last?.points) last.points.push(c.heading)
    else if (lone) out.push({ points: [c.heading] })
    else out.push(c)
  }
  const flat = out.map((c) => (c.points?.length === 1 ? { heading: c.points[0], body: [], media: [] } : c))
  // chapitres de texte seul qui se suivent : posés côte à côte (colonnes)
  const res = []
  for (const c of flat) {
    const textOnly = !c.points && c.body.some((b) => b.type !== 'button') && !c.body.some((b) => b.type === 'steps') && !c.media.length && !c.body.some((b) => b.type === 'reviews' || b.type === 'related')
    const last = res[res.length - 1]
    if (textOnly && last?.group) last.group.push(c)
    else if (textOnly) res.push({ group: [c] })
    else res.push(c)
  }
  const single = res.map((c) => (c.group?.length === 1 ? c.group[0] : c))
  // titres qui n'ont qu'un lien chacun, à la suite : une seule rangée compacte
  const out2 = []
  for (const c of single) {
    const lk = !c.points && !c.group && c.heading && !c.media.length && c.body.length && c.body.every((b) => b.type === 'button')
    const last = out2[out2.length - 1]
    if (lk && last?.links) last.links.push(c)
    else if (lk) out2.push({ links: [c] })
    else out2.push(c)
  }
  return out2.map((c) => (c.links?.length === 1 ? c.links[0] : c))
}

const blockLen = (b) =>
  b.type === 'list' ? b.items.reduce((n, it) => n + segsText(it).length, 0)
  : b.segs ? segsText(b.segs).length
  : b.type === 'table' ? b.rows.length * 40 : 0
const chapterLen = (c) => c.body.reduce((n, b) => n + blockLen(b), 0)

function Heading({ b, className = '' }) {
  const H = b.level <= 2 ? 'h2' : b.level === 3 ? 'h3' : 'h4'
  return <Reveal as={H} className={'cp-h cp-' + H + ' ' + className}><span className="ul">{fix(b.text)}</span></Reveal>
}

function Body({ b }) {
  switch (b.type) {
    case 'heading':
      return <Heading b={b} />
    case 'text':
      return <p className="cp-p"><Segs segs={b.segs} /></p>
    case 'quote':
      return <blockquote className="cp-quote"><p><Segs segs={b.segs} /></p></blockquote>
    case 'list': {
      const LTag = b.ordered ? 'ol' : 'ul'
      return <LTag className="cp-list">{b.items.map((it, i) => <li key={i}><Segs segs={it} /></li>)}</LTag>
    }
    case 'table': {
      const pairs = b.rows.every((r) => r.length === 2)
      if (pairs) {
        return (
          <dl className="cp-specs">
            {b.rows.map(([k, v], i) => (
              <div key={i}><dt><Segs segs={k} /></dt><dd><Segs segs={v} /></dd></div>
            ))}
          </dl>
        )
      }
      const [first, ...rest] = b.rows
      const body = b.head ? rest : b.rows
      return (
        <div className="cp-table-wrap" tabIndex={0}>
          <table className="cp-table">
            {b.head && <thead><tr>{first.map((c, i) => <th key={i} scope="col"><Segs segs={c} /></th>)}</tr></thead>}
            <tbody>{body.map((r, i) => <tr key={i}>{r.map((c, j) => (j ? <td key={j}><Segs segs={c} /></td> : <th key={j} scope="row"><Segs segs={c} /></th>))}</tr>)}</tbody>
          </table>
        </div>
      )
    }
    case 'steps':
      return (
        <ol className="cp-steps">
          {b.items.map((it, i) => (
            <Reveal as="li" key={i} className={'cp-step' + (it.image || it.widget ? ' has-media' : '')} delay={i * 0.08}>
              <span className="cp-step-n" aria-hidden="true">{i + 1}</span>
              <div className="cp-step-body">
                {it.blocks.map((x, j) => <Body key={j} b={x} />)}
                {it.quote && <QuoteButton />}
              </div>
              {it.image && <Media items={[it.image]} lang="fr" />}
              {it.widget === 'colors' && <ColorPicker />}
            </Reveal>
          ))}
        </ol>
      )
    case 'embed':
      return <Embed b={b} />
    case 'partners':
      return (
        <ul className="rel-cards partner-cards" style={{ '--max': b.items.length <= 3 ? b.items.length : b.items.length === 4 ? 2 : b.items.length % 4 === 0 ? 4 : 3 }}>
          {b.items.map((it, i) => (
            <Reveal as="li" key={it.name} delay={(i % 4) * 0.06} y={18}>
              <SmartLink href={it.href} className="rel-card partner-card">
                <img src={asset(it.src)} alt="" width={DIMS[it.src]?.[0]} height={DIMS[it.src]?.[1]} loading="lazy" decoding="async" />
                <span className="rel-body">
                  <strong>{fix(it.name)}</strong>
                  <span>{fix(it.text)}</span>
                </span>
              </SmartLink>
            </Reveal>
          ))}
        </ul>
      )
    case 'button':
      return (
        <p className="cp-btn">
          <SmartLink href={b.href} className="more"><span>{fix(b.label)}</span><Icon name="arrow" size={18} /></SmartLink>
        </p>
      )
    default:
      return null
  }
}

/* format réel d'une image (largeur / hauteur) */
const ratioOf = (src) => { const [w, h] = DIMS[src] || []; return w && h ? w / h : 4 / 3 }
/* rangées de photos : chaque photo garde son format réel (jamais rognée) ; dans une rangée,
   la largeur est proportionnelle au format, donc toutes ont la même hauteur (galerie justifiée) */
function rowsOf(imgs, wide) {
  const n = imgs.length
  // deux photos hors galerie : l'une sous l'autre, plus grandes
  const sizes = n === 1 ? [1] : n === 2 ? (wide ? [2] : [1, 1]) : n === 3 ? (wide ? [3] : [1, 2]) : n === 4 ? (wide ? [4] : [2, 2]) : []
  if (!sizes.length) for (let i = 0; i < n; i += wide ? 3 : 2) sizes.push(Math.min(wide ? 3 : 2, n - i))
  const rows = []
  let i = 0
  for (const k of sizes) { rows.push(imgs.slice(i, i + k)); i += k }
  // formats trop différents (logo très large à côté d'une photo carrée) : une image par ligne, sinon la plus étroite devient minuscule
  return rows.flatMap((row) => {
    const rs = row.map((im) => ratioOf(im.src))
    return Math.max(...rs) / Math.min(...rs) > 2.2 ? row.map((im) => [im]) : [row]
  })
}

function Media({ items, lang, wide, range }) {
  const imgs = items.filter((m) => m.type === 'image')
  const vids = items.filter((m) => m.type === 'video')
  const n = imgs.length
  let k = 0
  return (
    <div className={'cp-media n-' + Math.min(n, 4) + (wide ? ' is-wide' : '')}>
      {(!range || range[0] === 0) && vids.map((v) => <Video key={v.youtube} id={v.youtube} label={L[lang].video} />)}
      {rowsOf(imgs, wide).map((row, ri) => (
        (range && (ri < range[0] || ri >= range[1])) ? (k += row.length, null) : <div key={ri} className="cp-row">
          {row.map((im) => {
            const i = k++
            const small = isSmall(im.src)
            const [w, h] = DIMS[im.src] || []
            const r = ratioOf(im.src)
            const plate = (
              <Plate
                src={im.src} alt={fix(im.alt || '')} caption={im.caption ? fix(im.caption) : undefined} ratio={String(r)}
                className={small ? 'is-small' : ''}
              />
            )
            return (
              <Reveal
                key={im.src + i}
                delay={(i % 4) * 0.08}
                className={'cp-media-item' + (small ? ' is-small' : '')}
                // petite image : sa taille réelle au plus (jamais agrandie et floue)
                style={{ '--r': r, maxWidth: w ? (small ? Math.round(w * 1.15) : w) : undefined }}
              >
                {im.href ? <SmartLink href={im.href} className="cp-img-link">{plate}</SmartLink> : plate}
              </Reveal>
            )
          })}
        </div>
      ))}
    </div>
  )
}

/** Texte + photos côte à côte. Quand les photos sont bien plus hautes que le texte, le texte
 *  les suit au défilement (collant) au lieu de laisser un grand vide à côté des photos. */
function Split({ c, lang, side }) {
  const root = useRef(null)
  const [follow, setFollow] = useState(false)
  const [cut, setCut] = useState(null) // nombre de rangées de photos gardées à côté du texte
  const [wide, setWide] = useState(typeof innerWidth === 'number' ? innerWidth : 1440)
  const long = chapterLen(c) > 1400
  const nRows = rowsOf(c.media.filter((m) => m.type === 'image'), false).length
  useEffect(() => {
    const el = root.current
    const text = el?.querySelector(':scope > .cp-text'), media = el?.querySelector(':scope > .cp-media')
    if (!text || !media) return
    const measure = () => {
      const T = text.offsetHeight, M = media.offsetHeight
      const big = innerWidth > 900
      setFollow(big && M > T + 160 && T < innerHeight - 140)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(media); ro.observe(text)
    const onResize = () => { setWide(innerWidth); setCut(null) }
    addEventListener('resize', onResize)
    return () => { ro.disconnect(); removeEventListener('resize', onResize) }
  }, [])
  // texte trop haut pour rester collant et photos bien plus hautes que lui : les photos en trop
  // passent sous le texte, dans sa colonne, pour équilibrer les deux colonnes
  useEffect(() => {
    if (cut !== null || wide <= 900 || nRows < 2) return
    const el = root.current
    const text = el?.querySelector(':scope > .cp-text'), media = el?.querySelector(':scope > .cp-media')
    if (!text || !media) return
    const rows = [...media.querySelectorAll(':scope > .cp-row')].map((r) => r.offsetHeight)
    if (rows.length < 2) return
    const T = text.offsetHeight, g = 16, total = rows.reduce((a, b) => a + b, 0) + g * (rows.length - 1)
    if (T >= innerHeight - 140 && total > T + 300) {
      let best = null, bestDiff = total - T
      for (let k = 1; k < rows.length; k++) {
        const left = rows.slice(0, k).reduce((a, b) => a + b, 0) + g * (k - 1)
        const right = T + 28 + (rows.slice(k).reduce((a, b) => a + b, 0) + g * (rows.length - k - 1)) * (5 / 6)
        if (Math.abs(left - right) < bestDiff) { best = k; bestDiff = Math.abs(left - right) }
      }
      if (best) setCut(best)
    }
  }, [cut, wide, nRows])
  const balanced = cut !== null
  return (
    <div ref={root} className={'cp-split' + (side ? ' is-flip' : '') + (long ? ' is-long' : '') + (follow && !balanced ? ' is-follow' : '') + (balanced ? ' is-balanced' : '')}>
      <div className="cp-text">
        {c.heading && <Heading b={c.heading} />}
        {c.body.map((b, i) => <Body key={i} b={b} />)}
        {balanced && <Media items={c.media} lang={lang} range={[cut, nRows]} />}
      </div>
      <Media items={c.media} lang={lang} range={balanced ? [0, cut] : undefined} />
    </div>
  )
}

function Chapter({ c, lang, side }) {
  if (c.links) {
    return (
      <div className="cp-linkset">
        {c.links.map((l, i) => (
          <Reveal key={i} className="cp-linkitem" delay={(i % 3) * 0.08}>
            <Heading b={l.heading} />
            {l.body.map((b, j) => <Body key={j} b={b} />)}
          </Reveal>
        ))}
      </div>
    )
  }
  const relAt = c.body ? c.body.findIndex((b) => b.type === 'related') : -1
  if (relAt >= 0) {
    const before = c.body.slice(0, relAt), after = c.body.slice(relAt + 1)
    return (
      <div className="cp-chapter cp-related">
        {c.heading && <Heading b={c.heading} />}
        {before.map((b, i) => <Body key={i} b={b} />)}
        <RelatedCards items={c.body[relAt].items} lang={lang} />
        {after.length > 0 && <Chapter c={{ heading: null, body: after, media: c.media }} lang={lang} side={0} />}
      </div>
    )
  }
  const wallAt = c.body ? c.body.findIndex((b) => b.type === 'reviews') : -1
  if (wallAt >= 0) {
    const before = c.body.slice(0, wallAt), wall = c.body[wallAt], after = c.body.slice(wallAt + 1)
    const intro = { heading: c.heading, body: before, media: c.media }
    return (
      <div className="cp-chapter cp-reviews">
        {(intro.heading || before.length || c.media.length) ? <Chapter c={intro} lang={lang} side={0} /> : null}
        <ReviewWall items={wall.items} lang={lang} />
        {after.length > 0 && <Chapter c={{ heading: null, body: after, media: [] }} lang={lang} side={0} />}
      </div>
    )
  }
  if (c.points) {
    return (
      <div className="cp-points">
        {c.points.map((h, i) => (
          <Reveal key={i} className="cp-point" delay={i * 0.08}>
            <span className="cp-point-ico"><Icon name="leaf" size={22} /></span>
            <p>{fix(h.text)}</p>
          </Reveal>
        ))}
      </div>
    )
  }
  if (c.group) {
    const cols = c.group.length >= 3 && c.group.every((g) => chapterLen(g) < 420) ? 3 : 2
    const lens = c.group.map(chapterLen)
    // un bloc bien plus long que les autres prend toute la largeur ; le court qui le précède et se
    // retrouverait seul sur sa ligne (son introduction) aussi
    const wide = lens.map((n, i) => n > 1500 && n > 2.5 * (lens.reduce((a, b) => a + b, 0) - n) / Math.max(lens.length - 1, 1))
    // coordonnées (quatre lignes courtes ou plus) : bloc compact qui reste dans la colonne de gauche
    const lines = c.group.map((g) => g.body.length >= 4 && g.body.every((b) => b.type === 'text' && blockLen(b) < 80))
    const full = wide.map((w, i) => w || (wide[i + 1] && i % cols === 0))
    // bloc seul sur sa ligne (dernier, ou coincé entre deux blocs pleine largeur) : toute la largeur,
    // jamais au milieu avec du vide de chaque côté
    let row = []
    const rows = []
    c.group.forEach((_, i) => {
      if (full[i]) { if (row.length) rows.push(row); row = []; rows.push([i]) }
      else { row.push(i); if (row.length === cols) { rows.push(row); row = [] } }
    })
    if (row.length) rows.push(row)
    if (c.group.length > 1) rows.forEach((r) => { if (r.length === 1 && !lines[r[0]]) full[r[0]] = true })
    // quatre blocs ou plus, sans bloc très long : deux piles côte à côte (la dernière ligne ne reste pas seule au milieu)
    const stacked = !wide.some(Boolean) && cols === 2 && c.group.length >= 4
    return (
      <div className={'cp-columns cols-' + cols + (stacked ? ' is-stacked' : '')}>
        {c.group.map((g, i) => (
          <Reveal key={i} className={'cp-col-item' + (full[i] ? ' is-full' : '') + (lines[i] ? ' is-lines' : '')} delay={(i % cols) * 0.08}>
            {g.heading && <Heading b={g.heading} />}
                        {lines[i]
              ? <div className="cp-lines">{g.body.map((b, j) => <Body key={j} b={b} />)}</div>
              : g.body.map((b, j) => <Body key={j} b={b} />)}
          </Reveal>
        ))}
      </div>
    )
  }
  if (c.media.length && c.body.length) return <Split c={c} lang={lang} side={side} />
  if (c.body.length) {
    // texte seul : titre à gauche, texte à droite (2 colonnes si très long)
    const len = chapterLen(c)
    return (
      <div className={'cp-aside' + (c.heading ? '' : ' no-head')}>
        {c.heading && <div className="cp-aside-h"><Heading b={c.heading} /></div>}
        <div className={'cp-text' + (len < 520 ? ' is-short' : '')}>
          {c.body.map((b, i) => <Body key={i} b={b} />)}
        </div>
      </div>
    )
  }
  return (
    <div className="cp-chapter">
      {c.heading && <Heading b={c.heading} className="cp-lone" />}
      {c.media.length > 0 && <Media items={c.media} lang={lang} wide />}
    </div>
  )
}

export default function ContentPage({ slug }) {
  const [page, setPage] = useState(undefined)
  const location = useLocation()
  useEffect(() => {
    let alive = true
    setPage(undefined)
    const loader = files[keyOf(slug)]
    if (!loader) { setPage(null); return }
    loader().then((m) => alive && setPage(m.default))
    return () => { alive = false }
  }, [slug])

  const lang = page?.lang && L[page.lang] ? page.lang : 'fr'
  const title = page ? fix(page.h1 || page.title.split(' - ')[0]) : ''
  usePageMeta({ title: page ? fix(page.title) : 'Yourteco', description: page?.description, lang })

  if (page === null) return <NotFound />
  if (!page) return <div className="cp-loading" aria-busy="true" />

  // premier titre h1 retiré du flux (affiché en tête), première image = planche d'ouverture
  const blocks = page.sections.flatMap((s) => s.blocks)
  // bannière : première image assez grande (jamais un petit logo agrandi)
  const firstImg = blocks.find((b) => b.type === 'image' && (DIMS[b.src]?.[0] || 0) >= 900)
  let skippedH1 = false
  let prevLvl = 1
  // section faite uniquement de liens : fondue sous la section précédente, en rangée compacte
  const merged = []
  for (const s of page.sections) {
    if (merged.length && s.blocks.length && s.blocks.every((b) => b.type === 'button')) merged[merged.length - 1].links.push(...s.blocks)
    else merged.push({ blocks: s.blocks, links: [] })
  }
  const sections = merged.map((s) => ({ links: s.links, chs: toChapters(extractRelated(extractReviews(s.blocks)).filter((b) => {
    if (b.type === 'heading' && b.level === 1 && !skippedH1) { skippedH1 = true; return false }
    if (b === firstImg) return false
    return true
  }).map((b) => {
    if (b.type !== 'heading') return b
    const level = Math.min(Math.max(b.level, 2), prevLvl + 1)
    prevLvl = level
    return level === b.level ? b : { ...b, level }
  })) })).filter((s) => s.chs.length)

  const crumbs = location.pathname.split('/').filter(Boolean)
  const found = findInMenu(location.pathname)
  const t = L[lang]

  return (
    <article className="cp" lang={lang}>
      <header className="cp-head">
        <div className="wrap cp-head-in">
          <div className="cp-head-text">
            <nav aria-label="Fil d'Ariane" className="crumbs">
              <Link to="/">{t.home}</Link>
              {/* rubrique du menu, puis la page parente éventuelle (libellé du menu quand il existe) */}
              {found && (
                <>
                  <span aria-hidden="true">/</span>
                  <Link to={'/plan-du-site/#' + found.rubrique.key}>{found.rubrique.label}</Link>
                </>
              )}
              {crumbs.slice(0, -1).map((c, i) => {
                const path = crumbs.slice(0, i + 1).join('/')
                const label = findInMenu(path)?.link.label || c.replace(/-/g, ' ')
                return (
                  <Fragment key={c}>
                    <span aria-hidden="true">/</span>
                    {hasPage(path) ? <Link to={'/' + path + '/'}>{label}</Link> : <span>{label}</span>}
                  </Fragment>
                )
              })}
              {/* page en cours : libellé court du menu, sinon le titre de la page */}
              <span aria-hidden="true">/</span>
              <span className="crumb-here" aria-current="page">{found?.link.label || OTHER_PAGES.flatMap((g) => g.links).find((l) => l.href === location.pathname)?.label || title}</span>
            </nav>
            <WordsReveal as="h1" text={title} className="cp-title" immediate stagger={0.035} />
            {page.description && <p className="lead cp-lead">{fix(page.description)}</p>}
          </div>
          {firstImg && (
            <div className="cp-head-media">
              <Plate src={firstImg.src} alt={fix(firstImg.alt || '')} caption={firstImg.caption ? fix(firstImg.caption) : undefined} ratio={String(ratioOf(firstImg.src))} priority sizes="100vw" className="cp-head-plate" style={{ '--r': ratioOf(firstImg.src), '--w': (DIMS[firstImg.src]?.[0] || 2000) + 'px' }} />
              <FallingLeaves count={5} seed={title.length + 1} className="cp-leaves" />
            </div>
          )}
        </div>
      </header>

      <div className="cp-body">
        {sections.map(({ chs, links }, si) => {
          let flip = si % 2
          return (
            <section key={si} className={'cp-section' + (si % 2 ? ' alt' : '')}>
              <div className="wrap cp-flow">
                {chs.map((c, ci) => {
                  const isSplit = !c.points && !c.group && !c.links && c.media.length > 0 && c.body.length > 0
                  if (isSplit) flip = 1 - flip
                  return <Chapter key={ci} c={c} lang={lang} side={isSplit ? flip : 0} />
                })}
                {links.length > 0 && (
                  <nav className="cp-links" aria-label={t.links}>
                    {links.map((b, i) => (
                      <SmartLink key={i} href={b.href} className="more"><span>{fix(b.label)}</span><Icon name="arrow" size={18} /></SmartLink>
                    ))}
                  </nav>
                )}
              </div>
            </section>
          )
        })}
      </div>

      {found && <InRubrique found={found} pathname={location.pathname} />}

      <section className="cp-cta" aria-label={t.cta}>
        <Hills className="hills-top" to="var(--green-800)" back="var(--sun)" mid="var(--leaf)" seed={5} />
        <div className="wrap cp-cta-in">
          <div>
            <p className="cp-cta-title">{t.cta}</p>
            <p>{t.ctaText}</p>
          </div>
          <div className="cp-cta-actions">
            <QuoteButton className="btn-xl" />
            <PhoneLink className="phone-xl" />
          </div>
        </div>
      </section>
    </article>
  )
}

export { segsText }
