import { Link } from 'react-router-dom'
import { usePageMeta } from '../lib/meta.js'
import { QuoteButton } from '../components/Chrome.jsx'

export default function NotFound() {
  usePageMeta({ title: 'Page introuvable · Yourteco' })
  return (
    <section className="nf">
      <div className="wrap nf-in">
        <p className="nf-mark" aria-hidden="true">404</p>
        <h1 className="h2"><span className="ul">Cette pièce n'est pas dans le stock.</span></h1>
        <p className="lead">La page demandée n'existe pas ou a été déplacée.</p>
        <div className="nf-actions">
          <Link to="/" className="btn btn-line"><span>Retour à l'accueil</span></Link>
          <QuoteButton />
        </div>
      </div>
    </section>
  )
}
