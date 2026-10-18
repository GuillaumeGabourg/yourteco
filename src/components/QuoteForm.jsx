import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Icon from './Icon.jsx'
import { FIELDS, PROJETS, TERRAIN, DELAIS, BUDGETS, fieldFor, normalize, validate } from '../content/devisSchema.js'
import { DEVIS_TEXT } from '../content/devisText.js'
import { useLang } from '../lib/lang.js'
import { CONTACT } from '../content/site.js'

const INIT = { projet: '', terrain: '', cp: '', delai: '', budget: '', prenom: '', nom: '', email: '', tel: '', message: '', rappel: false, rgpd: false, site: '' }

function Err({ id, children }) {
  return children ? <p id={id} className="f-err" role="alert">{children}</p> : null
}

/** Formulaire unique : mêmes champs et mêmes valeurs en français, anglais et allemand ; libellés, messages et règles de code postal / téléphone selon la langue de la page. */
export default function QuoteForm() {
  const { lang } = useLang()
  const T = DEVIS_TEXT[lang]
  const f = T.form
  const opt = T.options
  const [v, setV] = useState(INIT)
  const [errs, setErrs] = useState({})
  const [state, setState] = useState('idle') // idle | sending | done

  const set = (name) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setV((o) => ({ ...o, [name]: val }))
    if (errs[name]) setErrs((o) => ({ ...o, [name]: null }))
  }
  const blur = (name) => () => {
    const n = normalize(name, v[name], lang)
    setV((o) => ({ ...o, [name]: n }))
    if (n !== '' && n !== false) setErrs((o) => ({ ...o, [name]: validate(name, n, lang) }))
  }

  const submit = (e) => {
    e.preventDefault()
    if (v.site) return // champ piège
    const clean = Object.fromEntries(Object.entries(v).map(([k, val]) => [k, normalize(k, val, lang)]))
    const next = Object.fromEntries(Object.keys(FIELDS).map((k) => [k, validate(k, clean[k], lang)]))
    setV(clean)
    setErrs(next)
    const first = Object.keys(next).find((k) => next[k])
    if (first) {
      document.querySelector(`[name="${first}"]`)?.focus()
      return
    }
    setState('sending')
    // Maquette : envoi simulé (aucune donnée ne quitte le navigateur).
    setTimeout(() => setState('done'), 900)
  }

  const a = (name) => ({
    name,
    id: 'f-' + name,
    'aria-invalid': errs[name] ? 'true' : undefined,
    'aria-describedby': errs[name] ? 'e-' + name : undefined,
  })

  return (
    <div className="quote-form-wrap">
      <AnimatePresence mode="wait">
        {state === 'done' ? (
          <motion.div key="ok" className="f-done" role="status" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Icon name="check" size={36} />
            <h3>{f.doneTitle}</h3>
            <p>{f.doneText} <a href={CONTACT.phoneHref}>{lang === 'fr' ? CONTACT.phone : CONTACT.phoneIntl}</a>.</p>
            <p className="f-demo">{f.demo}</p>
            <button type="button" className="btn btn-line" onClick={() => { setV(INIT); setState('idle') }}>{f.again}</button>
          </motion.div>
        ) : (
          <motion.form key="form" className="quote-form" noValidate onSubmit={submit} initial={false} exit={{ opacity: 0 }}>
            <fieldset className="f-group">
              <legend>{f.projet} <span className="req">{f.req}</span></legend>
              <div className="chips" role="radiogroup" aria-describedby={errs.projet ? 'e-projet' : undefined}>
                {PROJETS.map((p) => (
                  <label key={p.value} className={'chip' + (v.projet === p.value ? ' is-on' : '')}>
                    <input type="radio" name="projet" value={p.value} checked={v.projet === p.value} onChange={set('projet')} required />
                    <span>{opt.projet[p.value]}</span>
                  </label>
                ))}
              </div>
              <Err id="e-projet">{errs.projet}</Err>
            </fieldset>

            <div className="f-row">
              <fieldset className="f-group f-inline">
                <legend>{f.terrain}</legend>
                <div className="chips">
                  {TERRAIN.map((p) => (
                    <label key={p.value} className={'chip' + (v.terrain === p.value ? ' is-on' : '')}>
                      <input type="radio" name="terrain" value={p.value} checked={v.terrain === p.value} onChange={set('terrain')} />
                      <span>{opt.terrain[p.value]}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="f-field">
                <label htmlFor="f-cp">{f.cp} <span className="req">{f.req}</span></label>
                <input {...a('cp')} type="text" inputMode={lang === 'fr' ? 'numeric' : 'text'} autoComplete="postal-code" maxLength={fieldFor('cp', lang).maxLength} value={v.cp} onChange={set('cp')} onBlur={blur('cp')} placeholder={f.cpPlaceholder} />
                <Err id="e-cp">{errs.cp}</Err>
              </div>
            </div>

            <div className="f-row">
              <div className="f-field">
                <label htmlFor="f-delai">{f.delai} <span className="opt">{f.opt}</span></label>
                <select {...a('delai')} value={v.delai} onChange={set('delai')}>
                  {DELAIS.map((d) => <option key={d.value} value={d.value}>{opt.delai[d.value]}</option>)}
                </select>
              </div>
              <div className="f-field">
                <label htmlFor="f-budget">{f.budget} <span className="opt">{f.opt}</span></label>
                <select {...a('budget')} value={v.budget} onChange={set('budget')}>
                  {BUDGETS.map((d) => <option key={d.value} value={d.value}>{opt.budget[d.value]}</option>)}
                </select>
              </div>
            </div>

            <div className="f-row">
              <div className="f-field">
                <label htmlFor="f-prenom">{f.prenom} <span className="req">{f.req}</span></label>
                <input {...a('prenom')} type="text" autoComplete="given-name" maxLength={50} value={v.prenom} onChange={set('prenom')} onBlur={blur('prenom')} />
                <Err id="e-prenom">{errs.prenom}</Err>
              </div>
              <div className="f-field">
                <label htmlFor="f-nom">{f.nom} <span className="req">{f.req}</span></label>
                <input {...a('nom')} type="text" autoComplete="family-name" maxLength={50} value={v.nom} onChange={set('nom')} onBlur={blur('nom')} />
                <Err id="e-nom">{errs.nom}</Err>
              </div>
            </div>
            <div className="f-row">
              <div className="f-field">
                <label htmlFor="f-email">{f.email} <span className="req">{f.req}</span></label>
                <input {...a('email')} type="email" autoComplete="email" maxLength={254} value={v.email} onChange={set('email')} onBlur={blur('email')} />
                <Err id="e-email">{errs.email}</Err>
              </div>
              <div className="f-field">
                <label htmlFor="f-tel">{f.tel} <span className="opt">{f.opt}</span></label>
                <input {...a('tel')} type="tel" inputMode="tel" autoComplete="tel" maxLength={20} value={v.tel} onChange={set('tel')} onBlur={blur('tel')} />
                <Err id="e-tel">{errs.tel}</Err>
              </div>
            </div>
            <div className="f-field">
              <label htmlFor="f-message">{f.message} <span className="opt">{f.opt}</span></label>
              <textarea {...a('message')} rows={4} maxLength={1000} value={v.message} onChange={set('message')} />
              <p className="f-count" aria-live="polite">{v.message.length} / 1000</p>
            </div>

            <div className="f-hp" aria-hidden="true">
              <label htmlFor="f-site">{f.honeypot}</label>
              <input id="f-site" name="site" tabIndex={-1} autoComplete="off" value={v.site} onChange={set('site')} />
            </div>

            <label className="check">
              <input type="checkbox" name="rappel" checked={v.rappel} onChange={set('rappel')} />
              <span>{f.rappel}</span>
            </label>
            <label className="check">
              <input {...a('rgpd')} type="checkbox" checked={v.rgpd} onChange={set('rgpd')} />
              <span>{f.rgpd} <span className="req">{f.req}</span></span>
            </label>
            <Err id="e-rgpd">{errs.rgpd}</Err>

            <div className="f-submit">
              <button type="submit" className="btn btn-mark btn-lg" disabled={state === 'sending'}>
                <span>{state === 'sending' ? f.sending : f.submit}</span>
                <Icon name="arrow" size={20} />
              </button>
              <p className="f-note">{f.note}</p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
