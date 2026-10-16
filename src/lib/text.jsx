import { Link } from 'react-router-dom'
import { CORRECTIONS } from '../content/corrections.js'

/** Orthographe corrigée uniquement (liste dans corrections.js, remise au client). */
export function fix(str = '') {
  let s = str
  for (const [from, to] of CORRECTIONS) s = s.split(from).join(to)
  return s
}

const isInternal = (href) => href && href.startsWith('/') && !href.startsWith('//')

export function SmartLink({ href, children, className, ...rest }) {
  if (!href) return <span className={className}>{children}</span>
  if (isInternal(href)) return <Link to={href} className={className} {...rest}>{children}</Link>
  const external = /^https?:/.test(href)
  return (
    <a href={href} className={className} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
      {children}
    </a>
  )
}

/** Rend des segments [{t, href?, b?}] en texte (jamais de HTML injecté). */
export function Segs({ segs }) {
  return segs.map((s, i) => {
    const parts = fix(s.t).split('\n')
    let node = parts.flatMap((p, j) => (j ? [<br key={'b' + j} />, p] : [p]))
    if (s.b) node = <strong>{node}</strong>
    // lien sans texte (espace seul dans la source) : rendu comme simple espace, pas de lien vide
    if (s.href && s.t.trim()) node = <SmartLink href={s.href}>{node}</SmartLink>
    return <span key={i}>{node}</span>
  })
}

export const segsText = (segs) => fix(segs.map((s) => s.t).join('')).replace(/\s+/g, ' ').trim()

/** « Terme : définition » -> [terme, définition] */
export function splitTerm(text) {
  const m = text.match(/^([^:]{3,80}?)\s*:\s+(.+)$/s)
  return m ? [m[1].trim(), m[2].trim()] : [null, text]
}
