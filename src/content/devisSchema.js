// Schéma unique du formulaire de devis : il génère les attributs HTML ici,
// et servira aux contraintes PocketBase + hook serveur (jalon back office).
export const PATTERNS = {
  NOM: "^[\\p{L}][\\p{L}\\p{M} '’\\-]{0,49}$",
  TEL_FR: '^(?:0[1-9][0-9]{8}|\\+33[1-9][0-9]{8})$',
  CP_FR: '^(?:0[1-9]|[1-8][0-9]|9[0-8])[0-9]{3}$',
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
  projet: { required: true, oneOf: PROJETS.map((p) => p.value), msg: 'Choisissez le type de projet.' },
  terrain: { required: false, oneOf: TERRAIN.map((p) => p.value) },
  cp: { required: true, pattern: PATTERNS.CP_FR, maxLength: 5, normalize: 'digits', msg: 'Code postal du projet : 5 chiffres, par exemple 49640.' },
  delai: { required: false, oneOf: DELAIS.map((p) => p.value) },
  budget: { required: false, oneOf: BUDGETS.map((p) => p.value) },
  prenom: { required: true, pattern: PATTERNS.NOM, maxLength: 50, msg: 'Indiquez votre prénom (lettres, espaces, tirets).' },
  nom: { required: true, pattern: PATTERNS.NOM, maxLength: 50, msg: 'Indiquez votre nom (lettres, espaces, tirets).' },
  email: { required: true, type: 'email', maxLength: 254, msg: 'Adresse e-mail incomplète, par exemple prenom@exemple.fr.' },
  tel: { required: false, pattern: PATTERNS.TEL_FR, maxLength: 20, normalize: 'phone', msg: 'Numéro à 10 chiffres, par exemple 06 12 34 56 78.' },
  message: { required: false, maxLength: 1000 },
  rappel: { required: false },
  rgpd: { required: true, msg: 'Merci d’accepter l’utilisation de vos données pour traiter la demande.' },
}

export function normalize(name, raw) {
  const f = FIELDS[name]
  if (typeof raw !== 'string') return raw
  let v = raw.normalize('NFC').replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, '')
  if (name !== 'message') v = v.replace(/\s+/g, ' ')
  v = v.trim()
  if (f?.normalize === 'digits') v = v.replace(/\s/g, '')
  if (f?.normalize === 'phone') v = v.replace(/[\s.\-()]/g, '')
  if (name === 'email') v = v.toLowerCase()
  return v
}

export function validate(name, value) {
  const f = FIELDS[name]
  if (!f) return null
  const empty = value === '' || value === false || value == null
  if (empty) return f.required ? f.msg || 'Champ requis.' : null
  if (typeof value === 'string' && f.maxLength && value.length > f.maxLength) return `${f.maxLength} caractères maximum.`
  if (f.oneOf && !f.oneOf.includes(value)) return f.msg || 'Valeur non autorisée.'
  if (f.pattern && !new RegExp(f.pattern, 'u').test(value)) return f.msg
  if (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return f.msg
  return null
}
