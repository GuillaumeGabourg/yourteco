import { Link } from 'react-router-dom'
import { WordsReveal, Reveal } from '../components/Motion.jsx'
import Icon from '../components/Icon.jsx'
import { MENU, OTHER_PAGES } from '../content/menu.js'
import { SmartLink } from '../lib/text.jsx'

const count = MENU.reduce((n, r) => n + r.groups.reduce((m, g) => m + g.links.filter((l) => !l.external).length, 0), 0)

/** Plan du site : toutes les pages, rubrique par rubrique (ancres #rubrique utilisées par le fil d'Ariane et le pied de page). */
export default function SitePlan() {
  return (
    <article className="cp plan">
      <header className="cp-head">
        <div className="wrap cp-head-in">
          <div className="cp-head-text">
            <nav aria-label="Fil d'Ariane" className="crumbs"><Link to="/">Accueil</Link><span aria-hidden="true">/</span><span className="crumb-here" aria-current="page">Plan du site</span></nav>
            <WordsReveal as="h1" text="Plan du site" className="cp-title" immediate stagger={0.035} />
            <p className="lead cp-lead">Les {count} pages du site Yourteco, classées par rubrique, et nos pages en anglais et en allemand.</p>
          </div>
        </div>
      </header>
      <div className="wrap plan-body">
        {MENU.map((r) => (
          <section key={r.key} id={r.key} className="plan-rub" aria-labelledby={'plan-' + r.key}>
            <Reveal className="plan-head">
              <h2 id={'plan-' + r.key} className="h3"><span className="ul">{r.label}</span></h2>
              <p>{r.intro}</p>
            </Reveal>
            <div className="plan-groups">
              {r.groups.map((g) => (
                <div key={g.title} className="plan-group">
                  <p className="mega-gh"><span className="mega-gico" aria-hidden="true"><Icon name={g.icon} size={18} /></span>{g.title}</p>
                  <ul>
                    {g.links.map((l) => (
                      <li key={l.href}><SmartLink href={l.href} className="mega-link"><span>{l.label}</span>{l.external && <Icon name="out" size={14} />}</SmartLink></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ))}
        <section className="plan-rub" aria-labelledby="plan-langues">
          <Reveal className="plan-head">
            <h2 id="plan-langues" className="h3"><span className="ul">Autres langues</span></h2>
            <p>Les pages traduites pour nos visiteurs anglophones et germanophones.</p>
          </Reveal>
          <div className="plan-groups">
            {OTHER_PAGES.map((g) => (
              <div key={g.title} className="plan-group" lang={g.lang}>
                <p className="mega-gh"><span className="mega-gico" aria-hidden="true"><Icon name="compass" size={18} /></span>{g.title}</p>
                <ul>
                  {g.links.map((l) => <li key={l.href}><Link to={l.href} className="mega-link"><span>{l.label}</span></Link></li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </article>
  )
}
