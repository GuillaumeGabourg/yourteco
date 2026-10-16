import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react'
import Icon from './Icon.jsx'
import { CONTACT, NAV, SOCIAL, FOOTER_LINKS } from '../content/site.js'
import { SmartLink } from '../lib/text.jsx'

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
    <a href={CONTACT.phoneHref} className={'phone ' + className}>
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
      <div className="utility">
        <div className="wrap utility-in">
          <a href={CONTACT.boutique} target="_blank" rel="noopener noreferrer">Voir la boutique Yourteco <Icon name="out" size={14} /></a>
          <nav aria-label="Autres langues" className="langs">
            <Link to="/jurte-kaufen/" lang="de">Jurte kaufen</Link>
            <Link to="/buying-a-yurt/" lang="en">Buying a Yurt</Link>
          </nav>
        </div>
      </div>
      <header className={'site-header' + (scrolled ? ' is-scrolled' : '')}>
        <div id="site-bar" className="bar">
          <div className="wrap bar-in">
            <Link to="/" className="logo" aria-label="Yourteco, accueil">
              <img className="logo-std" src="/img/brand/logo-yourteco-hd.png" alt="Yourteco" width="904" height="327" />
              <img className="logo-light" src="/img/brand/logo-yourteco-light.png" alt="Yourteco" width="904" height="327" />
            </Link>
            <nav aria-label="Navigation principale" className="nav-desktop">
              {NAV.map((n) => (
                <NavLink key={n.href} to={n.href} className="nav-link">{n.label}</NavLink>
              ))}
            </nav>
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
        <AnimatePresence>
          {open && (
            <motion.nav
              id="menu-mobile"
              aria-label="Menu"
              className="menu-mobile"
              initial={{ clipPath: 'inset(0 0 100% 0)' }}
              animate={{ clipPath: 'inset(0 0 0% 0)' }}
              exit={{ clipPath: 'inset(0 0 100% 0)' }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <ul>
                <li><NavLink to="/" end>Accueil</NavLink></li>
                {NAV.map((n, i) => (
                  <motion.li key={n.href} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + i * 0.04 }}>
                    <NavLink to={n.href}>{n.label}</NavLink>
                  </motion.li>
                ))}
                <li><Link to="/#devis">Contact &amp; devis</Link></li>
              </ul>
              <div className="menu-mobile-foot">
                <PhoneLink />
                <a href={'mailto:' + CONTACT.email} className="phone"><Icon name="mail" size={18} /><span>{CONTACT.email}</span></a>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
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
