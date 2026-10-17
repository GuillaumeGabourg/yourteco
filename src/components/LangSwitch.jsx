import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import Icon from './Icon.jsx'
import { UI, LANGS } from '../content/ui.js'
import { useLang } from '../lib/lang.js'

/* Drapeaux dessinés en SVG : les émojis drapeaux ne s'affichent pas sous Windows */
const FLAGS = {
  fr: (
    <svg viewBox="0 0 3 2" preserveAspectRatio="none" aria-hidden="true">
      <path fill="#002654" d="M0 0h1v2H0z" /><path fill="#fff" d="M1 0h1v2H1z" /><path fill="#CE1126" d="M2 0h1v2H2z" />
    </svg>
  ),
  en: (
    <svg viewBox="0 0 60 40" preserveAspectRatio="none" aria-hidden="true">
      <path fill="#012169" d="M0 0h60v40H0z" />
      <path stroke="#fff" strokeWidth="8" d="M0 0l60 40M60 0L0 40" />
      <path stroke="#C8102E" strokeWidth="2.6" d="M0 0l60 40M60 0L0 40" />
      <path stroke="#fff" strokeWidth="12" d="M30 0v40M0 20h60" />
      <path stroke="#C8102E" strokeWidth="7" d="M30 0v40M0 20h60" />
    </svg>
  ),
  de: (
    <svg viewBox="0 0 5 3" preserveAspectRatio="none" aria-hidden="true">
      <path fill="#000" d="M0 0h5v1H0z" /><path fill="#DD0000" d="M0 1h5v1H0z" /><path fill="#FFCE00" d="M0 2h5v1H0z" />
    </svg>
  ),
}

/** Menu déroulant de langue dans la barre : drapeau + code de la langue affichée,
 *  liste des trois langues (drapeau + nom dans sa langue). Clavier : flèches, Échap, Tab. */
export default function LangMenu({ className = '' }) {
  const { lang, t } = useLang()
  const [open, setOpen] = useState(false)
  const root = useRef(null)
  const btn = useRef(null)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (!open) return
    const onDown = (e) => { if (!root.current?.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus() } }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    // focus sur la langue en cours à l'ouverture
    root.current?.querySelector('[aria-current]')?.focus()
    return () => { document.removeEventListener('pointerdown', onDown); document.removeEventListener('keydown', onKey) }
  }, [open])

  const onListKey = (e) => {
    const items = [...root.current.querySelectorAll('.lang-opt')]
    const i = items.indexOf(document.activeElement)
    if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus() }
    if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus() }
  }

  return (
    <div className={'lang-menu ' + className} ref={root} onBlur={(e) => { if (!root.current.contains(e.relatedTarget)) setOpen(false) }}>
      <button
        type="button"
        ref={btn}
        className={'lang-btn' + (open ? ' is-open' : '')}
        aria-expanded={open}
        aria-controls="lang-list"
        aria-label={t.langLabel + ' : ' + t.langName}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="lang-flag">{FLAGS[lang]}</span>
        <span className="lang-code" aria-hidden="true">{lang.toUpperCase()}</span>
        <Icon name="chevron" size={14} className="lang-chev" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            id="lang-list"
            className="lang-list"
            aria-label={t.langLabel}
            onKeyDown={onListKey}
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, transition: { duration: 0.12 } }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {LANGS.map((code) => (
              <li key={code}>
                <Link
                  to={UI[code].home}
                  lang={code}
                  hrefLang={code}
                  className={'lang-opt' + (code === lang ? ' is-current' : '')}
                  aria-current={code === lang ? 'true' : undefined}
                  onClick={() => setOpen(false)}
                >
                  <span className="lang-flag">{FLAGS[code]}</span>
                  <span>{UI[code].langName}</span>
                  {code === lang && <Icon name="check" size={16} className="lang-check" />}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
