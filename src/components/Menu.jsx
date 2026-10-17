import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import Icon from './Icon.jsx'
import { QuoteButton, PhoneLink, ThemeToggle } from './Chrome.jsx'
import { MENU } from '../content/menu.js'
import { UI, pagesOf } from '../content/ui.js'
import { CONTACT } from '../content/site.js'
import { SmartLink } from '../lib/text.jsx'
import { asset } from '../lib/asset.js'
import VARIANTS from '../content/imageVariants.json'

/* photo à la une : version 800 px quand elle existe (affichée sur 300 px) */
const small = (src) => asset(VARIANTS[src] ? src.replace(/\.webp$/, '.800.webp') : src)

const EASE = [0.16, 1, 0.3, 1]

function PageLink({ l, className, here }) {
  return (
    <SmartLink href={l.href} className={className + (here ? ' is-here' : '')} aria-current={here ? 'page' : undefined}>
      <span>{l.label}</span>{l.external && <Icon name="out" size={14} />}
    </SmartLink>
  )
}

/** Grand menu : chaque rubrique ouvre un panneau (pages en colonnes, photo à la une, devis).
 *  Survol temporisé, clic, clavier (Échap referme et rend le focus au bouton), fermeture au changement de page. */
export function MegaNav({ activeKey }) {
  const [openKey, setOpenKey] = useState(null)
  const timer = useRef(0)
  const btns = useRef({})
  const { pathname, hash } = useLocation()

  useEffect(() => setOpenKey(null), [pathname, hash])
  useEffect(() => {
    if (!openKey) return
    const onKey = (e) => { if (e.key === 'Escape') { btns.current[openKey]?.focus(); setOpenKey(null) } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openKey])
  useEffect(() => () => clearTimeout(timer.current), [])

  const later = (fn, ms) => { clearTimeout(timer.current); timer.current = setTimeout(fn, ms) }
  const enter = (key) => (e) => { if (e.pointerType === 'mouse') later(() => setOpenKey(key), openKey ? 0 : 110) }
  const leave = (e) => { if (e.pointerType === 'mouse') later(() => setOpenKey(null), 260) }
  // focus sorti de la rubrique (clavier) : on referme son panneau
  const blur = (e) => {
    const key = e.currentTarget.dataset.key
    if (!e.currentTarget.contains(e.relatedTarget)) later(() => setOpenKey((k) => (k === key ? null : k)), 0)
  }

  return (
    <>
      <nav aria-label="Navigation principale" className="nav-desktop" onPointerLeave={leave}>
        {MENU.map((r) => {
          const open = openKey === r.key
          return (
            <div key={r.key} className="nav-item" data-key={r.key} onPointerEnter={enter(r.key)} onBlur={blur}>
              <button
                type="button"
                ref={(el) => (btns.current[r.key] = el)}
                className={'nav-link' + (open ? ' is-open' : '') + (activeKey === r.key ? ' active' : '')}
                aria-expanded={open}
                aria-controls={'mega-' + r.key}
                onClick={() => { clearTimeout(timer.current); setOpenKey(open ? null : r.key) }}
              >
                {r.label}<Icon name="chevron" size={16} className="nav-chev" />
              </button>
              <AnimatePresence>
                {open && (
                  <motion.div
                    id={'mega-' + r.key}
                    className="mega"
                    data-lenis-prevent=""
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
                    transition={{ duration: 0.28, ease: EASE }}
                  >
                    <div className="wrap mega-in">
                      <div className="mega-main">
                        <p className="mega-title">{r.label}</p>
                        <p className="mega-intro">{r.intro}</p>
                        <div className="mega-groups">
                          {r.groups.map((g) => (
                            <div key={g.title} className="mega-group">
                              <p className="mega-gh"><span className="mega-gico" aria-hidden="true"><Icon name={g.icon} size={18} /></span>{g.title}</p>
                              <ul>
                                {g.links.map((l) => <li key={l.href}><PageLink l={l} className="mega-link" here={pathname === l.href} /></li>)}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mega-side">
                        <Link to={r.feature.href} className="mega-feature">
                          <span className="mega-feature-img"><img src={small(r.feature.image)} alt="" loading="lazy" decoding="async" /></span>
                          <span className="mega-feature-t"><span>{r.feature.title}</span><Icon name="arrow" size={18} /></span>
                        </Link>
                        <QuoteButton className="mega-quote" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </nav>
      {/* voile sous le bandeau : rendu dans <body> (le flou du bandeau enfermerait un élément fixe) */}
      {createPortal(<AnimatePresence>
        {openKey && (
          <motion.div
            className="mega-scrim"
            aria-hidden="true"
            onClick={() => setOpenKey(null)}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
          />
        )}
      </AnimatePresence>, document.body)}
    </>
  )
}

/** Pages anglaises ou allemandes : seules ces 5 pages existent dans la langue, elles forment le menu. */
export function LangNav({ lang }) {
  const pages = pagesOf(lang).slice(0, 4) // la page légale est au pied de page
  return (
    <nav aria-label={UI[lang].nav} className="nav-desktop nav-lang">
      {pages.map((l) => <NavLink key={l.href} to={l.href} className="nav-link">{l.label}</NavLink>)}
      <a href={CONTACT.boutique} target="_blank" rel="noopener noreferrer" className="nav-link nav-shop">{UI[lang].shopShort}<Icon name="out" size={14} /></a>
    </nav>
  )
}

/** Menu mobile plein écran : rubriques en accordéon (celle de la page ouverte d'office), devis et téléphone toujours en bas.
 *  Pages anglaises ou allemandes : la liste des pages de la langue. */
export function MobileMenu({ activeKey, lang = 'fr' }) {
  const [exp, setExp] = useState(activeKey)
  const { pathname } = useLocation()
  const foot = (
    <div className="menu-mobile-foot">
      <QuoteButton />
      <PhoneLink />
    </div>
  )
  const shell = (children) => (
    <motion.nav
      id="menu-mobile"
      aria-label={lang === 'fr' ? 'Menu' : UI[lang].nav}
      className="menu-mobile"
      data-lenis-prevent=""
      initial={{ clipPath: 'inset(0 0 100% 0)' }}
      animate={{ clipPath: 'inset(0 0 0% 0)' }}
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {children}
      <div className="mm-theme-row">
        <span>{UI[lang].themeLabel}</span>
        <ThemeToggle className="mm-theme" />
      </div>
      {foot}
    </motion.nav>
  )
  if (lang !== 'fr') {
    return shell(
      <ul className="mm-list">
        {pagesOf(lang).map((l) => <li key={l.href}><NavLink to={l.href} className="mm-link">{l.label}</NavLink></li>)}
        <li><a href={CONTACT.boutique} target="_blank" rel="noopener noreferrer" className="mm-link">{UI[lang].shop}</a></li>
      </ul>
    )
  }
  return shell(
      <ul className="mm-list">
        <li><NavLink to="/" end className="mm-link">Accueil</NavLink></li>
        {MENU.map((r) => {
          const open = exp === r.key
          return (
            <li key={r.key}>
              <button
                type="button"
                className={'mm-toggle' + (activeKey === r.key ? ' active' : '')}
                aria-expanded={open}
                aria-controls={'mm-' + r.key}
                onClick={() => setExp(open ? null : r.key)}
              >
                {r.label}<Icon name="chevron" size={22} className="mm-chev" />
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    id={'mm-' + r.key}
                    className="mm-panel"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.32, ease: EASE }}
                  >
                    {r.groups.map((g) => (
                      <div key={g.title} className="mm-group">
                        <p className="mm-gh"><Icon name={g.icon} size={16} />{g.title}</p>
                        <ul>
                          {g.links.map((l) => <li key={l.href}><PageLink l={l} className="mm-sub" here={pathname === l.href} /></li>)}
                        </ul>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          )
        })}
        <li><Link to="/plan-du-site/" className="mm-link mm-small">Plan du site</Link></li>
      </ul>
  )
}
