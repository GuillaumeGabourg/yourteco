import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react'
import Icon from './Icon.jsx'
import { CONTACT, SOCIAL, FOOTER_LINKS } from '../content/site.js'
import { MENU, findInMenu } from '../content/menu.js'
import { MegaNav, LangNav, MobileMenu } from './Menu.jsx'
import LangMenu from './LangSwitch.jsx'
import { useLang } from '../lib/lang.js'
import { pagesOf } from '../content/ui.js'
import { SmartLink } from '../lib/text.jsx'
import { asset } from '../lib/asset.js'

export function QuoteButton({ children, className = '' }) {
  const { t } = useLang()
  return (
    <Link to="/#devis" className={'btn btn-mark ' + className}>
      <span>{children || t.quote}</span>
      <Icon name="arrow" size={18} />
    </Link>
  )
}

export function PhoneLink({ className = '' }) {
  const { lang, t } = useLang()
  // numéro au format international sur les pages anglaises et allemandes
  const num = lang === 'fr' ? CONTACT.phone : CONTACT.phoneIntl
  return (
    <a href={CONTACT.phoneHref} className={'phone ' + className} aria-label={t.call + ' ' + num}>
      <Icon name="phone" size={18} />
      <span>{num}</span>
    </a>
  )
}

/** Thème clair par défaut ; sombre sur choix du visiteur (mémorisé). */
export function ThemeToggle({ className = '' }) {
  const { t } = useLang()
  const [theme, setTheme] = useState(() => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'))
  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try { localStorage.setItem('ytc-theme', next) } catch { /* stockage indisponible : choix limité à la visite */ }
    setTheme(next)
  }
  const dark = theme === 'dark'
  return (
    <button type="button" className={'theme-btn ' + className} onClick={toggle} aria-label={dark ? t.themeLight : t.themeDark} title={dark ? t.themeLight : t.themeDark}>
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
  const { lang, t } = useLang()
  const activeKey = findInMenu(location.pathname)?.rubrique.key ?? null
  useEffect(() => { document.documentElement.lang = lang }, [lang])
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
    // le menu mobile occupe exactement l'écran sous la barre
    if (open) document.documentElement.style.setProperty('--menu-top', document.getElementById('site-bar').getBoundingClientRect().bottom + 'px')
    if (open) window.__lenis?.stop(); else window.__lenis?.start()
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <header className={'site-header' + (scrolled ? ' is-scrolled' : '')}>
        <div id="site-bar" className="bar">
          <div className="wrap bar-in">
            <Link to={t.home} className="logo" aria-label={'Yourteco, ' + t.homeLabel.toLowerCase()}>
              <img className="logo-std" src={asset('/img/brand/logo-yourteco-hd.png')} alt="Yourteco" width="904" height="327" />
              <img className="logo-light" src={asset('/img/brand/logo-yourteco-light.png')} alt="Yourteco" width="904" height="327" />
            </Link>
            {lang === 'fr' ? <MegaNav activeKey={activeKey} /> : <LangNav lang={lang} />}
            <div className="bar-actions">
              <LangMenu />
              <ThemeToggle className="bar-theme" />
              <PhoneLink className="bar-phone" />
              <QuoteButton className="bar-quote">{t.quoteShort}</QuoteButton>
              <button
                className="burger"
                aria-expanded={open}
                aria-controls="menu-mobile"
                onClick={() => setOpen((o) => !o)}
              >
                <Icon name={open ? 'close' : 'menu'} size={24} />
                <span className="sr-only">{open ? t.menuClose : t.menuOpen}</span>
              </button>
            </div>
          </div>
        </div>
        <AnimatePresence>{open && <MobileMenu activeKey={activeKey} lang={lang} />}</AnimatePresence>
      </header>
    </>
  )
}

export function Footer() {
  const { lang, t } = useLang()
  const pages = pagesOf(lang)
  return (
    <footer className="site-footer">
      <div className="wrap footer-top">
        <div className="footer-brand">
          <p className="footer-claim">{t.claim}</p>
          <p className="footer-text">{t.about}</p>
          <div className="footer-cta">
            <QuoteButton />
            <PhoneLink />
          </div>
        </div>
        <address className="footer-col">
          <span className="footer-h">{t.findUs}</span>
          <a href={CONTACT.mapHref} target="_blank" rel="noopener noreferrer">
            {CONTACT.address.map((l) => <span key={l} className="block">{l}</span>)}
          </a>
          <a href={CONTACT.phoneHref}>{lang === 'fr' ? CONTACT.phone : CONTACT.phoneIntl}</a>
          <a href={'mailto:' + CONTACT.email}>{CONTACT.email}</a>
          <span className="muted">SIRET {CONTACT.siret}</span>
        </address>
        <nav className="footer-col" aria-label={lang === 'fr' ? t.otherLinks : t.pagesTitle}>
          <span className="footer-h">{lang === 'fr' ? t.otherLinks : t.pagesTitle}</span>
          {lang === 'fr'
            ? FOOTER_LINKS.map((l) => <SmartLink key={l.href} href={l.href}>{l.label}</SmartLink>)
            : pages.map((l) => <Link key={l.href} to={l.href}>{l.label}</Link>)}
          {lang !== 'fr' && <a href={CONTACT.boutique} target="_blank" rel="noopener noreferrer">{t.shop}</a>}
        </nav>
      </div>
      {/* les 6 rubriques : 5 pages phares chacune, et un lien vers la rubrique complète au plan du site */}
      {lang === 'fr' && <nav className="wrap footer-rubs" aria-label="Rubriques du site">
        {MENU.map((r) => (
          <div key={r.key} className="footer-col">
            <span className="footer-h">{r.label}</span>
            {r.groups.flatMap((g) => g.links).filter((l) => !l.external).slice(0, 5).map((l) => <Link key={l.href} to={l.href}>{l.label}</Link>)}
            <Link to={'/plan-du-site/#' + r.key} className="footer-all">Toute la rubrique <Icon name="arrow" size={14} /></Link>
          </div>
        ))}
      </nav>}
      <div className="wrap footer-bottom">
        <ul className="socials" aria-label={t.socials}>
          {SOCIAL.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}><Icon name={s.icon} size={22} /></a>
            </li>
          ))}
        </ul>
        <p className="muted small">{t.stripe}</p>
        <p className="muted small">{t.copy}</p>
      </div>
    </footer>
  )
}
