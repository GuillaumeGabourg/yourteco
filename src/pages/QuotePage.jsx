import { Link } from 'react-router-dom'
import { usePageMeta } from '../lib/meta.js'
import { useLang } from '../lib/lang.js'
import { DEVIS_TEXT } from '../content/devisText.js'
import { WordsReveal } from '../components/Motion.jsx'
import QuoteSection from '../components/QuoteSection.jsx'

/** Page dédiée à la demande de devis : /devis/ (français), /quote/ (anglais), /angebot/ (allemand).
 *  Tous les boutons « Devis » du site y mènent (sauf sur l'accueil français, où le formulaire est en bas de page). */
export default function QuotePage() {
  const { lang, t } = useLang()
  const T = DEVIS_TEXT[lang]
  usePageMeta({ title: T.meta.title, description: T.meta.description, lang })
  return (
    <article className="cp qp" lang={lang}>
      <header className="cp-head">
        <div className="wrap cp-head-in">
          <div className="cp-head-text">
            <nav aria-label={T.page.crumbsLabel} className="crumbs">
              <Link to={t.home}>{T.page.crumb}</Link>
              <span aria-hidden="true">/</span>
              <span className="crumb-here" aria-current="page">{T.page.h1}</span>
            </nav>
            <WordsReveal as="h1" text={T.page.h1} className="cp-title" immediate stagger={0.035} />
          </div>
        </div>
      </header>
      <QuoteSection formTitle={false} />
    </article>
  )
}
