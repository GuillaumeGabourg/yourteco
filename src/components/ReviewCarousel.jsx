import { useEffect, useRef, useState, useCallback } from 'react'
import Icon from './Icon.jsx'

/** Carrousel d'avis : défilement natif (doigt, trackpad, clavier), flèches, points, cartes de même hauteur. */
export default function ReviewCarousel({ items, renderItem, label = 'Avis clients' }) {
  const track = useRef(null)
  const [page, setPage] = useState(0)
  const [pages, setPages] = useState(1)
  const [seen, setSeen] = useState(() => new Set())

  const measure = useCallback(() => {
    const el = track.current
    if (!el) return
    const n = Math.max(1, Math.round(el.scrollWidth / el.clientWidth))
    setPages(n)
    setPage(Math.min(n - 1, Math.round(el.scrollLeft / el.clientWidth)))
  }, [])

  useEffect(() => {
    const el = track.current
    if (!el) return
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    el.addEventListener('scroll', measure, { passive: true })
    // cartes visibles : elles s'allument, les autres restent en retrait
    const io = new IntersectionObserver((entries) => {
      setSeen((prev) => {
        const next = new Set(prev)
        entries.forEach((e) => (e.intersectionRatio > 0.6 ? next.add(e.target.dataset.i) : next.delete(e.target.dataset.i)))
        return next
      })
    }, { root: el, threshold: [0, 0.6, 1] })
    el.querySelectorAll('[data-i]').forEach((c) => io.observe(c))
    return () => { ro.disconnect(); io.disconnect(); el.removeEventListener('scroll', measure) }
  }, [measure, items.length])

  const go = (p) => {
    const el = track.current
    if (!el) return
    const target = Math.max(0, Math.min(pages - 1, p))
    el.scrollTo({ left: target * el.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }

  return (
    <div className="carousel" role="region" aria-roledescription="carrousel" aria-label={label}>
      <ul className="carousel-track" ref={track} data-lenis-prevent-wheel="" tabIndex={0}>
        {items.map((it, i) => (
          <li key={i} data-i={i} className={'carousel-item' + (seen.has(String(i)) ? ' is-on' : '')} aria-roledescription="avis" aria-label={`${i + 1} sur ${items.length}`}>
            {renderItem(it, i)}
          </li>
        ))}
      </ul>
      <div className="carousel-nav">
        <button type="button" className="car-btn" onClick={() => go(page - 1)} disabled={page === 0} aria-label="Avis précédents">
          <Icon name="arrow" size={20} className="flip" />
        </button>
        <div className="car-dots" role="tablist" aria-label="Pages d'avis">
          {Array.from({ length: pages }, (_, i) => (
            <button key={i} type="button" role="tab" aria-selected={i === page} aria-label={`Page ${i + 1}`} className={'car-dot' + (i === page ? ' is-on' : '')} onClick={() => go(i)} />
          ))}
        </div>
        <button type="button" className="car-btn" onClick={() => go(page + 1)} disabled={page >= pages - 1} aria-label="Avis suivants">
          <Icon name="arrow" size={20} />
        </button>
      </div>
    </div>
  )
}
