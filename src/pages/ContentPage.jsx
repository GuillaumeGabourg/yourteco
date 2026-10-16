import { useEffect, useState, Fragment } from 'react'
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

/** Image d'origine trop petite pour être agrandie (logos, badges, petits schémas). */
const isSmall = (src) => (DIMS[src]?.[0] || 9999) < 480

const files = import.meta.glob('../content/pages/*.json')
const keyOf = (slug) => `../content/pages/${slug.replace(/\//g, '__')}.json`
export const hasPage = (slug) => !!files[keyOf(slug)]

const L = {
  fr: { home: 'Accueil', cta: 'Un projet de yourte ?', ctaText: 'Parlons-en : conseil, démarches, fabrication et pose.', video: 'Lire la vidéo (YouTube)' },
  en: { home: 'Home', cta: 'A yurt project?', ctaText: 'Let’s talk: advice, permits, manufacturing and installation.', video: 'Play video (YouTube)' },
  de: { home: 'Startseite', cta: 'Ein Jurtenprojekt?', ctaText: 'Sprechen wir darüber: Beratung, Genehmigung, Fertigung und Aufbau.', video: 'Video abspielen (YouTube)' },
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

/** Découpe une section en chapitres : un titre + ce qui le suit. */
function toChapters(blocks) {
  const chapters = []
  let cur = null
  for (const b of blocks) {
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
    if (c.heading || c.body.length || !c.media.length) continue
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
    const textOnly = !c.points && c.body.length > 0 && !c.media.length
    const last = res[res.length - 1]
    if (textOnly && last?.group) last.group.push(c)
    else if (textOnly) res.push({ group: [c] })
    else res.push(c)
  }
  return res.map((c) => (c.group?.length === 1 ? c.group[0] : c))
}

const blockLen = (b) =>
  b.type === 'list' ? b.items.reduce((n, it) => n + segsText(it).length, 0)
  : b.segs ? segsText(b.segs).length
  : b.type === 'table' ? b.rows.length * 40 : 0
const chapterLen = (c) => c.body.reduce((n, b) => n + blockLen(b), 0)

function Heading({ b, className = '' }) {
  const H = b.level <= 2 ? 'h2' : b.level === 3 ? 'h3' : 'h4'
  return <Reveal as={H} className={'cp-h cp-' + H + ' ' + className}>{fix(b.text)}</Reveal>
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
        <div className="cp-table-wrap">
          <table className="cp-table">
            {b.head && <thead><tr>{first.map((c, i) => <th key={i} scope="col"><Segs segs={c} /></th>)}</tr></thead>}
            <tbody>{body.map((r, i) => <tr key={i}>{r.map((c, j) => (j ? <td key={j}><Segs segs={c} /></td> : <th key={j} scope="row"><Segs segs={c} /></th>))}</tr>)}</tbody>
          </table>
        </div>
      )
    }
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

function Media({ items, lang, wide }) {
  const imgs = items.filter((m) => m.type === 'image')
  const vids = items.filter((m) => m.type === 'video')
  const n = imgs.length
  return (
    <div className={'cp-media n-' + Math.min(n, 4) + (wide ? ' is-wide' : '')}>
      {vids.map((v) => <Video key={v.youtube} id={v.youtube} label={L[lang].video} />)}
      {imgs.map((im, i) => {
        const small = isSmall(im.src)
        const [w, h] = DIMS[im.src] || []
        const ratio = small ? `${w} / ${h}` : n === 1 ? '4 / 3' : n === 3 && i === 0 ? '16 / 9' : '1 / 1'
        const plate = (
          <Plate
            src={im.src} alt={fix(im.alt || '')} caption={im.caption ? fix(im.caption) : undefined} ratio={ratio}
            parallax={n === 1 && !small ? 3 : 0}
            className={small ? 'is-small' : ''}
            style={small ? { maxWidth: Math.round(w * 1.15) } : undefined}
          />
        )
        return (
          <Reveal key={im.src + i} delay={(i % 4) * 0.08} className="cp-media-item">
            {im.href ? <SmartLink href={im.href} className="cp-img-link">{plate}</SmartLink> : plate}
          </Reveal>
        )
      })}
    </div>
  )
}

function Chapter({ c, lang, side }) {
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
    return (
      <div className={'cp-columns cols-' + cols}>
        {c.group.map((g, i) => (
          <Reveal key={i} className="cp-col-item" delay={(i % cols) * 0.08}>
            {g.heading && <Heading b={g.heading} />}
            {g.body.map((b, j) => <Body key={j} b={b} />)}
          </Reveal>
        ))}
      </div>
    )
  }
  if (c.media.length && c.body.length) {
    const long = chapterLen(c) > 1400
    return (
      <div className={'cp-split' + (side ? ' is-flip' : '') + (long ? ' is-long' : '')}>
        <div className="cp-text">
          {c.heading && <Heading b={c.heading} />}
          {c.body.map((b, i) => <Body key={i} b={b} />)}
        </div>
        <Media items={c.media} lang={lang} />
      </div>
    )
  }
  if (c.body.length) {
    // texte seul : titre à gauche, texte à droite (2 colonnes si très long)
    const len = chapterLen(c)
    return (
      <div className={'cp-aside' + (c.heading ? '' : ' no-head')}>
        {c.heading && <div className="cp-aside-h"><Heading b={c.heading} /></div>}
        <div className={'cp-text' + (len > (c.heading ? 1300 : 480) ? ' is-cols' : '')}>
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
  const sections = page.sections.map((s) => toChapters(s.blocks.filter((b) => {
    if (b.type === 'heading' && b.level === 1 && !skippedH1) { skippedH1 = true; return false }
    if (b === firstImg) return false
    return true
  }))).filter((s) => s.length)

  const crumbs = location.pathname.split('/').filter(Boolean)
  const t = L[lang]

  return (
    <article className="cp" lang={lang}>
      <header className="cp-head">
        <div className="wrap cp-head-in">
          <div className="cp-head-text">
            <nav aria-label="Fil d'Ariane" className="crumbs">
              <Link to="/">{t.home}</Link>
              {crumbs.slice(0, -1).map((c, i) => (
                <Fragment key={c}>
                  <span aria-hidden="true">/</span>
                  {hasPage(crumbs.slice(0, i + 1).join('/'))
                    ? <Link to={'/' + crumbs.slice(0, i + 1).join('/') + '/'}>{c.replace(/-/g, ' ')}</Link>
                    : <span>{c.replace(/-/g, ' ')}</span>}
                </Fragment>
              ))}
            </nav>
            <WordsReveal as="h1" text={title} className="cp-title" immediate stagger={0.035} />
            {page.description && <p className="lead cp-lead">{fix(page.description)}</p>}
          </div>
          {firstImg && (
            <div className="cp-head-media">
              <Plate src={firstImg.src} alt={fix(firstImg.alt || '')} caption={firstImg.caption ? fix(firstImg.caption) : undefined} ratio="21 / 9" priority parallax={6} className="cp-head-plate" />
              <FallingLeaves count={5} seed={title.length + 1} className="cp-leaves" />
            </div>
          )}
        </div>
      </header>

      <div className="cp-body">
        {sections.map((chs, si) => {
          let flip = si % 2
          return (
            <section key={si} className={'cp-section' + (si % 2 ? ' alt' : '')}>
              <div className="wrap cp-flow">
                {chs.map((c, ci) => {
                  const isSplit = !c.points && !c.group && c.media.length > 0 && c.body.length > 0
                  if (isSplit) flip = 1 - flip
                  return <Chapter key={ci} c={c} lang={lang} side={isSplit ? flip : 0} />
                })}
              </div>
            </section>
          )
        })}
      </div>

      <aside className="cp-cta">
        <Hills className="hills-top" to="var(--green-800)" back="var(--sun)" mid="var(--leaf)" seed={5} />
        <div className="wrap cp-cta-in">
          <div>
            <p className="cp-cta-title">{t.cta}</p>
            <p>{t.ctaText}</p>
          </div>
          <div className="cp-cta-actions">
            <QuoteButton className="btn-lg" />
            <PhoneLink className="phone-lg" />
          </div>
        </div>
      </aside>
    </article>
  )
}

export { segsText }
