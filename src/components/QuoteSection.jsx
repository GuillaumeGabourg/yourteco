import { Link } from 'react-router-dom'
import { DEVIS_TEXT } from '../content/devisText.js'
import { useLang } from '../lib/lang.js'
import { HOME } from '../content/home.js'
import { CONTACT } from '../content/site.js'
import { fix } from '../lib/text.jsx'
import { PhoneLink } from './Chrome.jsx'
import { Hills, Dapple } from './Nature.jsx'
import QuoteForm from './QuoteForm.jsx'
import Icon from './Icon.jsx'

/** Prix + demande de devis : bas de l'accueil et page /devis/ (même formulaire).
 *  Sur la page dédiée, le titre « Demander un devis » est déjà le H1 : `formTitle` le retire. */
export default function QuoteSection({ formTitle = true }) {
  const { lang } = useLang()
  const T = DEVIS_TEXT[lang]
  const p = lang === 'fr' ? HOME.price : T.side // le texte sur le prix français vient de l'accueil
  return (
    <section id="devis" className="quote section" aria-labelledby="quote-title">
      <Hills className="hills-top" to="var(--green-800)" back="var(--sun)" mid="var(--leaf)" seed={23} />
      <Dapple />
      <div className="wrap quote-grid">
        <div className="quote-side">
          <h2 id="quote-title" className="h2"><span className="ul">{fix(p.title)}</span></h2>
          <p>{fix(p.text)}</p>
          <Link to={p.href} className="more more-light"><span>{fix(p.cta)}</span><Icon name="arrow" size={18} /></Link>
          <div className="quote-contact">
            <p className="quote-contact-h">{T.side.phoneTitle}</p>
            <PhoneLink className="phone-xl" />
            <a href={'mailto:' + CONTACT.email} className="phone"><Icon name="mail" size={18} /><span>{CONTACT.email}</span></a>
            <p className="muted"><Icon name="pin" size={16} className="inline-ico" /> {T.side.address}</p>
          </div>
        </div>
        <div className="quote-main">
          {formTitle && <h3 className="quote-form-title">{T.form.title}</h3>}
          <QuoteForm />
        </div>
      </div>
    </section>
  )
}
