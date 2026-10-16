import { useEffect, useState, Fragment } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { fix, Segs, SmartLink, segsText } from '../lib/text.jsx'
import { usePageMeta } from '../lib/meta.js'
import { Reveal, WordsReveal } from '../components/Motion.jsx'
import { Plate } from '../components/Plate.jsx'
import { QuoteButton, PhoneLink } from '../components/Chrome.jsx'
import Icon from '../components/Icon.jsx'
import NotFound from './NotFound.jsx'

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

/** Regroupe les images consécutives en planches / galeries. */
function groupBlocks(blocks) {
  const out = []
  for (const b of blocks) {
    const last = out[out.length - 1]
    if (b.type === 'image' && last?.type === 'gallery') last.images.push(b)
    else if (b.type === 'image') out.push({ type: 'gallery', images: [b] })
    else out.push(b)
  }
  return out
}

function Block({ b, lang }) {
  switch (b.type) {
    case 'heading': {
      const H = b.level <= 2 ? 'h2' : b.level === 3 ? 'h3' : 'h4'
      return <Reveal as={H} className={'cp-h cp-' + H}>{fix(b.text)}</Reveal>
    }
    case 'text':
      return <p className="cp-p"><Segs segs={b.segs} /></p>
    case 'quote':
      return <blockquote className="cp-quote"><p><Segs segs={b.segs} /></p></blockquote>
    case 'list': {
      const LTag = b.ordered ? 'ol' : 'ul'
      return <LTag className="cp-list">{b.items.map((it, i) => <li key={i}><Segs segs={it} /></li>)}</LTag>
    }
    case 'button':
      return (
        <p className="cp-btn">
          <SmartLink href={b.href} className="more"><span>{fix(b.label)}</span><Icon name="arrow" size={18} /></SmartLink>
        </p>
      )
    case 'video':
      return <Video id={b.youtube} label={L[lang].video} />
    case 'gallery': {
      const n = b.images.length
      return (
        <div className={'cp-gallery n-' + Math.min(n, 4)}>
          {b.images.map((im, i) => {
            const plate = <Plate src={im.src} alt={fix(im.alt || '')} caption={im.caption ? fix(im.caption) : undefined} ratio={n === 1 ? '16 / 10' : '3 / 2'} />
            return (
              <Reveal key={im.src + i} delay={(i % 4) * 0.06}>
                {im.href ? <SmartLink href={im.href} className="cp-img-link">{plate}</SmartLink> : plate}
              </Reveal>
            )
          })}
        </div>
      )
    }
    default:
      return null
  }
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
  const firstImg = blocks.find((b) => b.type === 'image')
  let skippedH1 = false
  const sections = page.sections.map((s) => ({
    blocks: groupBlocks(s.blocks.filter((b) => {
      if (b.type === 'heading' && b.level === 1 && !skippedH1) { skippedH1 = true; return false }
      if (b === firstImg) return false
      return true
    })),
  })).filter((s) => s.blocks.length)

  const crumbs = location.pathname.split('/').filter(Boolean)
  const t = L[lang]

  return (
    <article className="cp" lang={lang}>
      <header className="cp-head">
        <div className="wrap cp-head-grid">
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
          </div>
          {firstImg && (
            <Plate src={firstImg.src} alt={fix(firstImg.alt || '')} caption={firstImg.caption ? fix(firstImg.caption) : undefined} ratio="4 / 3" priority parallax={4} className="cp-head-plate" tag="Yourteco" tagTilt={3} />
          )}
        </div>
      </header>

      <div className="cp-body">
        {sections.map((s, si) => (
          <section key={si} className={'cp-section' + (si % 2 ? ' alt' : '')}>
            <div className="wrap cp-flow">
              {s.blocks.map((b, bi) => <Block key={bi} b={b} lang={lang} />)}
            </div>
          </section>
        ))}
      </div>

      <aside className="cp-cta">
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
