import { useLocation } from 'react-router-dom'
import { UI, langOf } from '../content/ui.js'

/** Langue de la page affichée et textes d'interface correspondants. */
export function useLang() {
  const { pathname } = useLocation()
  const lang = langOf(pathname)
  return { lang, t: UI[lang] }
}
