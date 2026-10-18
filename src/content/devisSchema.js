// Schéma unique du formulaire de devis (français, anglais, allemand) : il génère les attributs HTML ici,
// et servira aux contraintes PocketBase + hook serveur (jalon back office).
// Les valeurs envoyées sont les mêmes dans les trois langues ; seuls les libellés et messages changent (devisText.js).
// Code postal et téléphone : règles françaises en français, règles internationales en anglais et allemand.
import { DEVIS_TEXT } from './devisText.js'

export const PATTERNS = {
  NOM: "^[\\p{L}][\\p{L}\\p{M} '’\\-]{0,49}$",
  TEL_FR: '^(?:0[1-9][0-9]{8}|\\+33[1-9][0-9]{8})$',
  CP_FR: '^(?:0[1-9]|[1-8][0-9]|9[0-8])[0-9]{3}$',
  CP_INTL: '^[\\p{L}\\p{N}][\\p{L}\\p{N} \\-]{2,9}$',
  TEL_INTL: '^\\+?[0-9]{6,15}$',
}

export const PROJETS = [
  { value: 'habitation', label: 'Yourte d’habitation' },
  { value: 'loisir', label: 'Yourte de loisir / gîte' },
  { value: 'erp', label: 'Établissement recevant du public (ERP)' },
  { value: 'kit', label: 'Kit d’autoconstruction' },
  { value: 'stage', label: 'Stage / chantier participatif' },
  { value: 'toile', label: 'Toile, Skydôme, isolants' },
]

export const TERRAIN = [
  { value: 'oui', label: 'J’ai un terrain' },
  { value: 'recherche', label: 'Je cherche un terrain' },
]

export const DELAIS = [
  { value: '', label: 'Je ne sais pas encore' },
  { value: '6m', label: 'Moins de 6 mois' },
  { value: '12m', label: '6 à 12 mois' },
  { value: 'plus', label: 'Plus d’un an' },
]

export const BUDGETS = [
  { value: '', label: 'Je préfère en parler' },
  { value: 'b1', label: 'Moins de 30 000 €' },
  { value: 'b2', label: '30 000 à 60 000 €' },
  { value: 'b3', label: '60 000 à 100 000 €' },
  { value: 'b4', label: 'Plus de 100 000 €' },
]

export const FIELDS = {
  projet: { required: true, oneOf: PROJETS.map((p) => p.value) },
  terrain: { required: false, oneOf: TERRAIN.map((p) => p.value) },
  cp: { required: true, pattern: PATTERNS.CP_FR, maxLength: 5, normalize: 'digits' },
  delai: { required: false, oneOf: DELAIS.map((p) => p.value) },
  budget: { required: false, oneOf: BUDGETS.map((p) => p.value) },
  prenom: { required: true, pattern: PATTERNS.NOM, maxLength: 50 },
  nom: { required: true, pattern: PATTERNS.NOM, maxLength: 50 },
  email: { required: true, type: 'email', maxLength: 254 },
  tel: { required: false, pattern: PATTERNS.TEL_FR, maxLength: 20, normalize: 'phone' },
  message: { required: false, maxLength: 1000 },
  rappel: { required: false },
  rgpd: { required: true },
}

/** Règles d'un champ selon la langue de la page (anglais et allemand : code postal et téléphone internationaux). */
const INTL = {
  cp: { pattern: PATTERNS.CP_INTL, maxLength: 10, normalize: 'trim' },
  tel: { pattern: PATTERNS.TEL_INTL, maxLength: 20, normalize: 'phone' },
}
export const fieldFor = (name, lang = 'fr') => (lang === 'fr' ? FIELDS[name] : { ...FIELDS[name], ...INTL[name] })

export function normalize(name, raw, lang = 'fr') {
  const f = fieldFor(name, lang)
  if (typeof raw !== 'string') return raw
  let v = raw.normalize('NFC').replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, '')
  if (name !== 'message') v = v.replace(/\s+/g, ' ')
  v = v.trim()
  if (f?.normalize === 'digits') v = v.replace(/\s/g, '')
  if (f?.normalize === 'phone') v = v.replace(/[\s.\-()]/g, '')
  if (name === 'email') v = v.toLowerCase()
  return v
}

/** Message d'erreur dans la langue de la page, ou null si la valeur est valide. */
export function validate(name, value, lang = 'fr') {
  const f = fieldFor(name, lang)
  if (!f) return null
  const e = DEVIS_TEXT[lang].errors
  const empty = value === '' || value === false || value == null
  if (empty) return f.required ? e[name] || e.required : null
  if (typeof value === 'string' && f.maxLength && value.length > f.maxLength) return e.max(f.maxLength)
  if (f.oneOf && !f.oneOf.includes(value)) return e[name] || e.notAllowed
  if (f.pattern && !new RegExp(f.pattern, 'u').test(value)) return e[name]
  if (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return e[name]
  return null
}
