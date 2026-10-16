import { Reveal } from './Motion.jsx'
import { Segs, SmartLink } from '../lib/text.jsx'
import Icon from './Icon.jsx'

const LABEL = { fr: "Lire l'article", en: 'Read the article', de: 'Artikel lesen' }

/* Accroches de fin devenues inutiles une fois le lien affiché en bouton (liste dans docs/reformulations.md) */
const TAIL = /\s*(?:Voici ce qu['’]il faut savoir|Ce qu['’]il faut savoir|Réponse dans le lien suivant|Réponse|Par ici, les conseils Yourteco|Par ici)\s*(?:\.\.\.|…|!|\.)?\s*$/i

function trimTail(segs) {
  const out = segs.map((s) => ({ ...s }))
  const last = out[out.length - 1]
  if (last && !last.href) {
    last.t = last.t.replace(TAIL, '')
    if (!last.t.trim()) out.pop()
    else if (!/[.!?:»"]$/.test(last.t.trim())) last.t = last.t.trimEnd() + '.'
  }
  return out
}

/** « Sujets connexes » : chaque accroche devient une carte avec son lien. */
export default function RelatedCards({ items, lang = 'fr' }) {
  return (
    <ul className="rel-cards">
      {items.map((it, i) => {
        const href = it.segs.find((s) => s.href)?.href
        return (
          <Reveal as="li" key={i} className="rel-card" delay={(i % 3) * 0.06} y={18}>
            <span className="rel-ico" aria-hidden="true"><Icon name="leaf" size={20} /></span>
            <div className="rel-body">
              <p><Segs segs={trimTail(it.segs)} /></p>
              {href && (
                <SmartLink href={href} className="more rel-more" tabIndex={-1} aria-hidden="true">
                  <span>{LABEL[lang] || LABEL.fr}</span><Icon name="arrow" size={16} />
                </SmartLink>
              )}
            </div>
          </Reveal>
        )
      })}
    </ul>
  )
}
