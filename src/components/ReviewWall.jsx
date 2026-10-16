import { useState, useId } from 'react'
import { Reveal } from './Motion.jsx'
import { Plate } from './Plate.jsx'
import { fix } from '../lib/text.jsx'
import DIMS from '../content/imageDims.json'

const LABELS = {
  fr: { more: 'Lire la suite', less: 'Réduire' },
  en: { more: 'Read more', less: 'Show less' },
  de: { more: 'Weiterlesen', less: 'Weniger' },
}

const initials = (name) =>
  name.replace(/[^\p{L}\s'-]/gu, ' ').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || '★'

function QuoteMark() {
  return (
    <svg className="rv-mark" viewBox="0 0 40 30" aria-hidden="true">
      <path d="M2 30V18C2 8 7 2 16 0l2 4c-5 2-8 6-8 11h7v15zm21 0V18c0-10 5-16 14-18l2 4c-5 2-8 6-8 11h7v15z" />
    </svg>
  )
}

function ReviewCard({ r, lang, i }) {
  const t = LABELS[lang] || LABELS.fr
  const long = r.text.length > 260
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <Reveal as="li" className={'rv-card' + (i % 5 === 2 ? ' is-tint' : '')} delay={(i % 3) * 0.06} y={20}>
      <QuoteMark />
      {/* texte client reproduit tel quel (jamais corrigé) */}
      <blockquote id={id} className={'rv-text' + (long && !open ? ' is-clamped' : '')}>
        <p>{r.text}</p>
      </blockquote>
      {long && (
        <button type="button" className="rv-more" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
          {open ? t.less : t.more}
        </button>
      )}
      <footer className="rv-by">
        <span className="rv-avatar" aria-hidden="true">{initials(r.author)}</span>
        <span className="rv-who">
          <strong>{r.author}</strong>
          {r.date && <span>{r.date}</span>}
        </span>
      </footer>
    </Reveal>
  )
}

/** Mur d'avis : cartes en colonnes (maçonnerie) entrecoupées des photos clients, à leur format réel. */
export default function ReviewWall({ items, lang = 'fr' }) {
  let n = 0
  return (
    <ul className="rv-wall">
      {items.map((it, k) => {
        if (it.type === 'image') {
          const [w, h] = DIMS[it.src] || [4, 3]
          return (
            <Reveal as="li" key={'img' + k} className="rv-photo" y={20}>
              <Plate src={it.src} alt={fix(it.alt || '')} caption={it.caption ? fix(it.caption) : undefined} ratio={`${w} / ${h}`} reveal={false} />
            </Reveal>
          )
        }
        return <ReviewCard key={'r' + k} r={it} lang={lang} i={n++} />
      })}
    </ul>
  )
}
