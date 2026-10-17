import { Link, useLocation } from 'react-router-dom'
import { OTHER_PAGES } from '../content/menu.js'

/* Drapeaux dessinés en SVG : les émojis drapeaux ne s'affichent pas sous Windows */
const FLAGS = {
  fr: (
    <svg viewBox="0 0 3 2" preserveAspectRatio="none" aria-hidden="true">
      <path fill="#002654" d="M0 0h1v2H0z" /><path fill="#fff" d="M1 0h1v2H1z" /><path fill="#CE1126" d="M2 0h1v2H2z" />
    </svg>
  ),
  en: (
    <svg viewBox="0 0 60 40" preserveAspectRatio="none" aria-hidden="true">
      <clipPath id="flag-uk-t"><path d="M30 20h30v20zv20H0zH0V0zV0h30z" /></clipPath>
      <path fill="#012169" d="M0 0h60v40H0z" />
      <path stroke="#fff" strokeWidth="8" d="M0 0l60 40M60 0L0 40" />
      <path stroke="#C8102E" strokeWidth="4" clipPath="url(#flag-uk-t)" d="M0 0l60 40M60 0L0 40" />
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

const LANGS = [
  { code: 'fr', label: 'Français', href: '/' },
  { code: 'en', label: 'English', href: '/buying-a-yurt/' },
  { code: 'de', label: 'Deutsch', href: '/jurte-kaufen/' },
]

/** Choix de la langue : drapeau + code, la langue de la page affichée est marquée. */
export default function LangSwitch({ className = '' }) {
  const { pathname } = useLocation()
  const current = OTHER_PAGES.find((g) => g.links.some((l) => l.href === pathname))?.lang || 'fr'
  return (
    <nav aria-label="Langue / Language / Sprache" className={'langs ' + className}>
      {LANGS.map((l) => (
        <Link
          key={l.code}
          to={l.href}
          lang={l.code}
          hrefLang={l.code}
          className={'lang' + (l.code === current ? ' is-current' : '')}
          aria-current={l.code === current ? 'true' : undefined}
          aria-label={l.label}
          title={l.label}
        >
          <span className="lang-flag">{FLAGS[l.code]}</span>
          <span className="lang-code" aria-hidden="true">{l.code.toUpperCase()}</span>
        </Link>
      ))}
    </nav>
  )
}
