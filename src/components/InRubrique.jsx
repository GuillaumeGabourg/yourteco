import { Reveal } from './Motion.jsx'
import Icon from './Icon.jsx'
import { SmartLink } from '../lib/text.jsx'

/** « Dans cette rubrique » : les autres pages de la rubrique, en cartes (icône du groupe à gauche). */
export default function InRubrique({ found, pathname }) {
  const items = found.rubrique.groups.flatMap((g) => g.links.filter((l) => l.href !== pathname).map((l) => ({ ...l, group: g })))
  if (!items.length) return null
  return (
    <section className="cp-rub" aria-labelledby="cp-rub-title">
      <div className="wrap">
        <header className="sec-head">
          <h2 id="cp-rub-title" className="h3"><span className="ul">Dans la rubrique « {found.rubrique.label} »</span></h2>
        </header>
        <ul className="rub-cards">
          {items.map((l, i) => (
            <Reveal as="li" key={l.href} className="rub-card" delay={(i % 4) * 0.05} y={14}>
              <SmartLink href={l.href} className="rub-link">
                <span className="rub-ico" aria-hidden="true"><Icon name={l.group.icon} size={18} /></span>
                <span className="rub-txt">
                  <span className="rub-g">{l.group.title}</span>
                  <span className="rub-t">{l.label}</span>
                </span>
                <Icon name={l.external ? 'out' : 'arrow'} size={16} className="rub-arrow" />
              </SmartLink>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
