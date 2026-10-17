import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react'
import Icon from './Icon.jsx'
import { CONTACT, SOCIAL, FOOTER_LINKS } from '../content/site.js'
import { MENU, findInMenu } from '../content/menu.js'
import { MegaNav, MobileMenu } from './Menu.jsx'
import LangSwitch from './LangSwitch.jsx'
import { SmartLink } from '../lib/text.jsx'
import { asset } from '../lib/asset.js'

export function QuoteButton({ children = 'Demander un devis', className = '' }) {
  return (
    <Link to="/#devis" className={'btn btn-mark ' + className}>
      <span>{children}</span>
      <Icon name="arrow" size={18} />
    </Link>
  )
}

export function PhoneLink({ className = '' }) {
  return (
    <a href={CONTACT.phoneHref} className={'phone ' + className} aria-label={'Appeler le ' + CONTACT.phone}>
      <Icon name="phone" size={18} />
      <span>{CONTACT.phone}</span>
    </a>
  )
}

/** Thème clair par défaut ; sombre sur choix du visiteur (mémorisé). */
function ThemeToggle() {
  const [theme, setTheme] = useState(() => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'))
  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try { localStorage.setItem('ytc-theme', next) } catch { /* stockage indisponible : choix limité à la visite */ }
    setTheme(next)
  }
  const dark = theme === 'dark'
  return (
    <button type="button" className="theme-btn" onClick={toggle} aria-label={dark ? 'Passer au thème clair' : 'Passer au thème sombre'} title={dark ? 'Thème clair' : 'Thème sombre'}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ y: 18, rotate: -60, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -18, rotate: 60, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 24 }}
        >
          <Icon name={dark ? 'sun' : 'moon'} size={20} />
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()
  const location = useLocation()
  const activeKey = findInMenu(location.pathname)?.rubrique.key ?? null
  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 24))

  useEffect(() => setOpen(false), [location.pathname, location.hash])
  useEffect(() => {
    const close = () => setOpen(false)
    window.addEventListener('ytc:navclick', close)
    return () => window.removeEventListener('ytc:navclick', close)
  }, [])
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    document.documentElement.classList.toggle('menu-open', open)
    if (open) window.__lenis?.stop(); else window.__lenis?.start()
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <aside className="utility" aria-label="Boutique, téléphone et langues">
        <div className="wrap utility-in">
          <a href={CONTACT.boutique} target="_blank" rel="noopener noreferrer"><span className="u-long">Voir la boutique Yourteco</span><span className="u-short">Boutique</span> <Icon name="out" size={14} /></a>
          <div className="utility-right">
            <a href={CONTACT.phoneHref} className="utility-phone"><Icon name="phone" size={14} /> {CONTACT.phone}</a>
            <LangSwitch />
          </div>
        </div>
      </aside>
      <header className={'site-header' + (scrolled ? ' is-scrolled' : '')}>
        <div id="site-bar" className="bar">
          <div className="wrap bar-in">
            <Link to="/" className="logo" aria-label="Yourteco, accueil">
              <img className="logo-std" src={asset('/img/brand/logo-yourteco-hd.png')} alt="Yourteco" width="904" height="327" />
              <img className="logo-light" src={asset('/img/brand/logo-yourteco-light.png')} alt="Yourteco" width="904" height="327" />
            </Link>
            <MegaNav activeKey={activeKey} />
            <div className="bar-actions">
              <ThemeToggle />
              <PhoneLink className="bar-phone" />
              <QuoteButton className="bar-quote">Devis</QuoteButton>
              <button
                className="burger"
                aria-expanded={open}
                aria-controls="menu-mobile"
                onClick={() => setOpen((o) => !o)}
              >
                <Icon name={open ? 'close' : 'menu'} size={24} />
                <span className="sr-only">{open ? 'Fermer le menu' : 'Ouvrir le menu'}</span>
              </button>
            </div>
          </div>
        </div>
        <AnimatePresence>{open && <MobileMenu activeKey={activeKey} />}</AnimatePresence>
      </header>
    </>
  )
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-top">
        <div className="footer-brand">
          <p className="footer-claim">Yourteco, votre fabricant de yourtes</p>
          <p className="footer-text">
            Yourteco est un fabricant de yourtes contemporaines français localisé dans le Maine-et-Loire. Nous construisons dans toute la France et à l'étranger.
          </p>
          <div className="footer-cta">
            <QuoteButton />
            <PhoneLink />
          </div>
        </div>
        <address className="footer-col">
          <span className="footer-h">Nous trouver</span>
          <a href={CONTACT.mapHref} target="_blank" rel="noopener noreferrer">
            {CONTACT.address.map((l) => <span key={l} className="block">{l}</span>)}
          </a>
          <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
          <a href={'mailto:' + CONTACT.email}>{CONTACT.email}</a>
          <span className="muted">SIRET {CONTACT.siret}</span>
        </address>
        <nav className="footer-col" aria-label="Autres liens">
          <span className="footer-h">Autres liens</span>
          {FOOTER_LINKS.map((l) => <SmartLink key={l.href} href={l.href}>{l.label}</SmartLink>)}
        </nav>
      </div>
      {/* les 6 rubriques : 5 pages phares chacune, et un lien vers la rubrique complète au plan du site */}
      <nav className="wrap footer-rubs" aria-label="Rubriques du site">
        {MENU.map((r) => (
          <div key={r.key} className="footer-col">
            <span className="footer-h">{r.label}</span>
            {r.groups.flatMap((g) => g.links).filter((l) => !l.external).slice(0, 5).map((l) => <Link key={l.href} to={l.href}>{l.label}</Link>)}
            <Link to={'/plan-du-site/#' + r.key} className="footer-all">Toute la rubrique <Icon name="arrow" size={14} /></Link>
          </div>
        ))}
      </nav>
      <div className="wrap footer-bottom">
        <ul className="socials" aria-label="Réseaux sociaux">
          {SOCIAL.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}><Icon name={s.icon} size={22} /></a>
            </li>
          ))}
        </ul>
        <p className="muted small">Vos transactions bancaires sur la Boutique Yourteco sont protégées par le référent Stripe.</p>
        <p className="muted small">© 2026 Yourteco. Maquette de démonstration, non publiée.</p>
      </div>
    </footer>
  )
}
