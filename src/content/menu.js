/* Rubriques du site : source unique du grand menu, du menu mobile, du pied de page,
 * du plan du site et du bloc « Dans cette rubrique ». Les 55 pages françaises y figurent toutes.
 * Les libellés sont courts (menu) ; les titres des pages ne changent pas. */
const I = '/img/site/'

export const MENU = [
  {
    key: 'yourtes',
    label: 'Nos yourtes',
    intro: "Habitation, loisir, accueil du public : des yourtes en bois fabriquées dans notre atelier du Maine-et-Loire.",
    groups: [
      { title: 'Modèles', icon: 'home', links: [
        { label: "Yourtes d'habitation", href: '/fabrication-de-yourte-contemporaine/nos-yourtes-dhabitation/' },
        { label: 'Yourtes de loisirs', href: '/fabrication-de-yourte-contemporaine/nos-yourtes-loisirs/' },
        { label: 'Tiny-Yourte 20 à 30 m²', href: '/la-surface-dune-tiny-yourte-est-egale-a-20-m2-ou-30-m2/' },
        { label: 'Ossature bois et bardage', href: '/des-yourtes-de-qualites/' },
        { label: 'Yourte ERP', href: '/reglementation-pour-yourte-erp/' },
        { label: 'Zome-serre', href: '/le-zome-serre/' },
      ] },
      { title: 'Inspirations', icon: 'image', links: [
        { label: 'Intérieurs de yourtes', href: '/nos-yourtes-contemporaines/' },
        { label: 'Galerie photos', href: '/la-poetique-de-lespace/' },
        { label: 'Notre fabrication', href: '/fabrication-de-yourte-contemporaine/' },
        { label: "Prix d'une yourte", href: '/modele/' },
      ] },
      { title: 'Location', icon: 'calendar', links: [
        { label: 'Location pour événements', href: '/location-de-yourtes/' },
        { label: 'Flex Yourte', href: '/flex-yourte-evenementiel/' },
      ] },
    ],
    feature: { image: I + 'yourte-contemporaine-habitation-alpine-par-yourteco.webp', title: "Le prix d'une yourte Yourteco", href: '/modele/' },
  },
  {
    key: 'detail',
    label: 'En détail',
    intro: 'Chaque élément de la yourte, de la charpente aux fondations, et les équipements pour y vivre toute l’année.',
    groups: [
      { title: 'Structure', icon: 'hammer', links: [
        { label: 'Charpente', href: '/charpentes/' },
        { label: 'Choix du bois', href: '/quel-bois-pour-votre-yourte/' },
        { label: 'Treillis', href: '/plan-de-yourte/' },
        { label: 'Toono (couronne)', href: '/nos-skydome/' },
        { label: 'Skydômes et prix', href: '/skydome-yourte/' },
        { label: 'Portes sur mesure', href: '/nos-portes/' },
      ] },
      { title: 'Isolation et sol', icon: 'layers', links: [
        { label: 'Isolants', href: '/nos-isolants/' },
        { label: 'Planchers', href: '/nos-plancher-de-yourtes/' },
        { label: 'Montage du plancher', href: '/montage-yourte/' },
        { label: 'Fondations', href: '/fondations-yourte/' },
      ] },
      { title: 'Confort et eau', icon: 'drop', links: [
        { label: 'Chauffage', href: '/fabrication-de-yourte-contemporaine/yourtes-et-chauffage/' },
        { label: 'Citerne', href: '/citerne-pour-yourte/' },
        { label: 'Gouttière', href: '/gouttiere-yourte/' },
        { label: 'Toilettes sèches', href: '/toilettes-seche-yourte/' },
      ] },
    ],
    feature: { image: I + 'isolant-de-la-yourte.webp', title: 'Quel isolant choisir pour sa yourte ?', href: '/nos-isolants/' },
  },
  {
    key: 'toiles',
    label: 'Toiles & entretien',
    intro: 'Des toiles acryliques étanches et perspirantes, faites sur mesure, et les gestes pour les faire durer.',
    groups: [
      { title: 'Toiles', icon: 'tent', links: [
        { label: 'Nos toiles de yourtes', href: '/les-toiles-de-yourtes/' },
        { label: 'Choisir sa toile', href: '/les-toiles-de-yourtes/comment-choisir-sa-toile-de-yourte/' },
        { label: 'Pourquoi une toile acrylique', href: '/les-toiles-de-yourtes/quelle-toile-pour-votre-yourte/' },
        { label: 'Toiles sur mesure : tarifs', href: '/les-toiles-de-yourtes/nos-toiles-de-yourtes-sur-mesure/' },
      ] },
      { title: 'Entretien', icon: 'sprout', links: [
        { label: 'Entretenir sa toile', href: '/les-toiles-de-yourtes/comment-entretenir-sa-toile-de-yourte/' },
        { label: "Produits d'entretien", href: '/les-toiles-de-yourtes/nos-produits-dentretien-pour-les-toiles-de-yourtes/' },
        { label: 'Nettoyer sa toile', href: '/nettoyer-votre-toile-de-yourte/' },
        { label: 'Imperméabiliser sa toile', href: '/impermeabiliser-sa-yourte/' },
        { label: "Éviter les infiltrations d'eau", href: '/eviter-les-fuites-et-entree-deau-dans-votre-yourte/' },
      ] },
    ],
    feature: { image: I + 'toile-de-yourtes.webp', title: 'Toiles sur mesure : les tarifs', href: '/les-toiles-de-yourtes/nos-toiles-de-yourtes-sur-mesure/' },
  },
  {
    key: 'autoconstruction',
    label: 'Autoconstruction',
    intro: 'Construire sa yourte soi-même avec un kit, des plans et l’accompagnement de nos chantiers.',
    groups: [
      { title: 'Se lancer', icon: 'compass', links: [
        { label: 'Construire sa yourte', href: '/construire-sa-yourte/' },
        { label: 'Le kit yourte', href: '/kit-yourte/' },
        { label: 'Plans de yourtes', href: '/construire-sa-yourte/plans-de-yourtes-a-construire/' },
        { label: 'Conseils de construction', href: '/construire-une-yourte/' },
      ] },
      { title: 'Apprendre', icon: 'hand', links: [
        { label: 'Chantiers solidaires', href: '/construire-sa-yourte/comment-construire-soi-meme-sa-yourte/' },
        { label: 'Chantiers participatifs', href: '/chantiers-participatifs/' },
        { label: "Avantages de l'autoconstruction", href: '/construire-sa-yourte/les-avantages-de-construire-soi-meme-sa-yourte/' },
        { label: 'Pourquoi vivre en yourte', href: '/construire-sa-yourte/pourquoi-vivre-en-yourte/' },
      ] },
    ],
    feature: { image: I + 'construire-kit-auconstruction-yourte.webp', title: 'Le kit yourte Yourteco', href: '/kit-yourte/' },
  },
  {
    key: 'reglementation',
    label: 'Réglementation',
    intro: 'Permis, lois, normes thermiques et sécurité : ce qu’il faut savoir avant d’installer une yourte.',
    groups: [
      { title: 'Urbanisme', icon: 'doc', links: [
        { label: 'Permis de construire', href: '/fabrication-de-yourte-contemporaine/yourtes-et-permis-de-construire/' },
        { label: 'Lois et législation', href: '/fabrication-de-yourte-contemporaine/yourtes-et-legislation/' },
      ] },
      { title: 'Normes et sécurité', icon: 'shield', links: [
        { label: 'Yourte RT 2012', href: '/nos-yourtes-rt-2012/' },
        { label: 'Réglementation thermique 2012', href: '/fabrication-de-yourte-contemporaine/les-yourtes-et-la-reglementation-thermique-rt-2012/' },
        { label: 'RE 2020', href: '/les-yourtes-rt2020/' },
        { label: 'Sécurité de la yourte', href: '/fabrication-de-yourte-contemporaine/choisir-sa-yourte/' },
      ] },
    ],
    feature: { image: I + 'plan-facades-yourte-pour-permis-de-construire.webp', title: 'Permis de construire : nos conseils', href: '/fabrication-de-yourte-contemporaine/yourtes-et-permis-de-construire/' },
  },
  {
    key: 'yourteco',
    label: 'Yourteco',
    intro: "Une entreprise artisanale française : nos services, notre histoire et l'avis de nos clients.",
    groups: [
      { title: 'Services', icon: 'tag', links: [
        { label: 'Services et tarifs', href: '/chiffres/' },
        { label: 'Livraison et montage', href: '/livraison-des-yourtes/' },
        { label: 'La boutique Yourteco', href: 'https://www.yourteco-boutique.com/', external: true },
      ] },
      { title: "L'entreprise", icon: 'tree', links: [
        { label: 'Qui sommes-nous', href: '/fabricant-de-yourtes-francaises/' },
        { label: 'Entretien avec le gérant', href: '/entretien/' },
        { label: 'Histoire de la yourte', href: '/fabrication-de-yourte-contemporaine/origine-de-yourte/' },
        { label: 'Avis clients', href: '/avis-clients-sur-la-societe-yourteco/' },
      ] },
    ],
    feature: { image: I + 'video-ateliers-yourteco.webp', title: 'Qui sommes-nous ?', href: '/fabricant-de-yourtes-francaises/' },
  },
]

/* Pages en anglais et en allemand (sélecteur de langue) et informations légales : listées au plan du site */
export const OTHER_PAGES = [
  { title: 'English', lang: 'en', links: [
    { label: 'Buying a yurt', href: '/buying-a-yurt/' },
    { label: 'Yurt manufacturer Yourteco', href: '/yurt-manufacturer-yourteco/' },
    { label: 'Modern yurt for glamping', href: '/modern-yurt-for-glamping/' },
    { label: 'Customer testimonials', href: '/testimonials/' },
    { label: 'Legal notice', href: '/legal-notice/' },
  ] },
  { title: 'Deutsch', lang: 'de', links: [
    { label: 'Jurte kaufen', href: '/jurte-kaufen/' },
    { label: 'Jurtenhersteller Yourteco', href: '/jurtenhersteller-yourteco/' },
    { label: 'Moderne Holz-Jurte', href: '/moderne-holz-jurte/' },
    { label: 'Kundenstimmen', href: '/kundenstimmen/' },
    { label: 'Impressum', href: '/impressum/' },
  ] },
]

const norm = (p) => '/' + p.replace(/^\/+|\/+$/g, '') + '/'

/** Rubrique, groupe et lien d'une adresse (null si la page n'est dans aucune rubrique). */
export function findInMenu(pathname) {
  const p = norm(pathname)
  for (const r of MENU) for (const g of r.groups) for (const l of g.links) if (!l.external && l.href === p) return { rubrique: r, group: g, link: l }
  return null
}
