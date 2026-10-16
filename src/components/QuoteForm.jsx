import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Icon from './Icon.jsx'
import { FIELDS, PROJETS, TERRAIN, DELAIS, BUDGETS, normalize, validate } from '../content/devisSchema.js'

const INIT = { projet: '', terrain: '', cp: '', delai: '', budget: '', prenom: '', nom: '', email: '', tel: '', message: '', rappel: false, rgpd: false, site: '' }

function Err({ id, children }) {
  return children ? <p id={id} className="f-err" role="alert">{children}</p> : null
}

export default function QuoteForm() {
  const [v, setV] = useState(INIT)
  const [errs, setErrs] = useState({})
  const [state, setState] = useState('idle') // idle | sending | done

  const set = (name) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setV((o) => ({ ...o, [name]: val }))
    if (errs[name]) setErrs((o) => ({ ...o, [name]: null }))
  }
  const blur = (name) => () => {
    const n = normalize(name, v[name])
    setV((o) => ({ ...o, [name]: n }))
    if (n !== '' && n !== false) setErrs((o) => ({ ...o, [name]: validate(name, n) }))
  }

  const submit = (e) => {
    e.preventDefault()
    if (v.site) return // champ piège
    const clean = Object.fromEntries(Object.entries(v).map(([k, val]) => [k, normalize(k, val)]))
    const next = Object.fromEntries(Object.keys(FIELDS).map((k) => [k, validate(k, clean[k])]))
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
            <h3>Demande bien reçue.</h3>
            <p>L'équipe Yourteco revient vers vous pour en parler. Pour une question urgente : <a href="tel:+33241244987">02 41 24 49 87</a>.</p>
            <p className="f-demo">Maquette : l'envoi est simulé, aucune donnée n'a été transmise.</p>
            <button type="button" className="btn btn-line" onClick={() => { setV(INIT); setState('idle') }}>Nouvelle demande</button>
          </motion.div>
        ) : (
          <motion.form key="form" className="quote-form" noValidate onSubmit={submit} initial={false} exit={{ opacity: 0 }}>
            <fieldset className="f-group">
              <legend>Votre projet <span className="req">obligatoire</span></legend>
              <div className="chips" role="radiogroup" aria-describedby={errs.projet ? 'e-projet' : undefined}>
                {PROJETS.map((p) => (
                  <label key={p.value} className={'chip' + (v.projet === p.value ? ' is-on' : '')}>
                    <input type="radio" name="projet" value={p.value} checked={v.projet === p.value} onChange={set('projet')} required />
                    <span>{p.label}</span>
                  </label>
                ))}
              </div>
              <Err id="e-projet">{errs.projet}</Err>
            </fieldset>

            <div className="f-row">
              <fieldset className="f-group f-inline">
                <legend>Terrain</legend>
                <div className="chips">
                  {TERRAIN.map((p) => (
                    <label key={p.value} className={'chip' + (v.terrain === p.value ? ' is-on' : '')}>
                      <input type="radio" name="terrain" value={p.value} checked={v.terrain === p.value} onChange={set('terrain')} />
                      <span>{p.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="f-field">
                <label htmlFor="f-cp">Code postal du projet <span className="req">obligatoire</span></label>
                <input {...a('cp')} type="text" inputMode="numeric" autoComplete="postal-code" maxLength={5} value={v.cp} onChange={set('cp')} onBlur={blur('cp')} placeholder="49640" />
                <Err id="e-cp">{errs.cp}</Err>
              </div>
            </div>

            <div className="f-row">
              <div className="f-field">
                <label htmlFor="f-delai">Délai souhaité <span className="opt">facultatif</span></label>
                <select {...a('delai')} value={v.delai} onChange={set('delai')}>
                  {DELAIS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>
              <div className="f-field">
                <label htmlFor="f-budget">Budget indicatif <span className="opt">facultatif</span></label>
                <select {...a('budget')} value={v.budget} onChange={set('budget')}>
                  {BUDGETS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>
            </div>

            <div className="f-row">
              <div className="f-field">
                <label htmlFor="f-prenom">Prénom <span className="req">obligatoire</span></label>
                <input {...a('prenom')} type="text" autoComplete="given-name" maxLength={50} value={v.prenom} onChange={set('prenom')} onBlur={blur('prenom')} />
                <Err id="e-prenom">{errs.prenom}</Err>
              </div>
              <div className="f-field">
                <label htmlFor="f-nom">Nom <span className="req">obligatoire</span></label>
                <input {...a('nom')} type="text" autoComplete="family-name" maxLength={50} value={v.nom} onChange={set('nom')} onBlur={blur('nom')} />
                <Err id="e-nom">{errs.nom}</Err>
              </div>
            </div>
            <div className="f-row">
              <div className="f-field">
                <label htmlFor="f-email">E-mail <span className="req">obligatoire</span></label>
                <input {...a('email')} type="email" autoComplete="email" maxLength={254} value={v.email} onChange={set('email')} onBlur={blur('email')} />
                <Err id="e-email">{errs.email}</Err>
              </div>
              <div className="f-field">
                <label htmlFor="f-tel">Téléphone <span className="opt">facultatif</span></label>
                <input {...a('tel')} type="tel" inputMode="tel" autoComplete="tel" maxLength={20} value={v.tel} onChange={set('tel')} onBlur={blur('tel')} />
                <Err id="e-tel">{errs.tel}</Err>
              </div>
            </div>
            <div className="f-field">
              <label htmlFor="f-message">Votre projet en quelques mots <span className="opt">facultatif</span></label>
              <textarea {...a('message')} rows={4} maxLength={1000} value={v.message} onChange={set('message')} />
              <p className="f-count" aria-live="polite">{v.message.length} / 1000</p>
            </div>

            <div className="f-hp" aria-hidden="true">
              <label htmlFor="f-site">Ne pas remplir</label>
              <input id="f-site" name="site" tabIndex={-1} autoComplete="off" value={v.site} onChange={set('site')} />
            </div>

            <label className="check">
              <input type="checkbox" name="rappel" checked={v.rappel} onChange={set('rappel')} />
              <span>Je souhaite être rappelé(e) par l'équipe.</span>
            </label>
            <label className="check">
              <input {...a('rgpd')} type="checkbox" checked={v.rgpd} onChange={set('rgpd')} />
              <span>J'accepte que Yourteco utilise ces informations pour répondre à ma demande. Elles ne sont ni vendues ni transmises, et conservées 3 ans au plus. <span className="req">obligatoire</span></span>
            </label>
            <Err id="e-rgpd">{errs.rgpd}</Err>

            <div className="f-submit">
              <button type="submit" className="btn btn-mark btn-lg" disabled={state === 'sending'}>
                <span>{state === 'sending' ? 'Envoi…' : 'Envoyer ma demande de devis'}</span>
                <Icon name="arrow" size={20} />
              </button>
              <p className="f-note">Réponse de l'équipe, sans engagement.</p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
