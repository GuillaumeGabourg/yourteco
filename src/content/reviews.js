// Échantillon d'avis mis à jour chaque mois (module « Avis » du back office).
// Règles : extraits courts, texte jamais modifié (coupes signalées par « […] »),
// date + source pour chaque avis, lien vers l'ensemble des avis Google.
export const REVIEWS_META = {
  updatedAt: '16 octobre 2026',
  googleRating: '4,9',
  googleCount: 88,
  googleCheckedAt: '16 octobre 2026',
}

export const REVIEWS = [
  {
    id: 'g-mag',
    author: 'Mag',
    project: 'Habitation, 2 yourtes',
    date: 'avril 2026',
    source: 'google',
    text: "Un grand merci à toute l'équipe de yourteco pour l'accompagnement, la fabrication et la construction de mes 2 yourtes. Voilà maintenant 6 mois que je vis dans cet habitat extraordinaire. Je viens de passer mon 1er hivers et je suis ravie. […]",
    reply: 'Merci Magalie pour ce commentaire. Un grand bonjour de l’équipe de Yourteco. […]',
  },
  {
    id: 'g-caumel',
    author: 'Jean-Marc C.',
    project: 'Achat de yourte',
    date: 'avril 2026',
    source: 'google',
    text: "Yourte d 'excellente qualité, je recommande fortement, Très satisfait de mon achat, très confortable, et bien isolée.",
  },
  {
    id: 's-gregoire',
    author: 'Jean G.',
    project: 'Yourte de 20 m², bureau, autoconstruction',
    date: 'mai 2023',
    source: 'site',
    text: "Le rendu est impeccable depuis la conception à la construction bois. le skydome ouvrant est une superbe technique (lumière, aération). Les assemblages bois et les toiles sont solides, contemporaines et esthétiques. Je recommande vivement.",
  },
  {
    id: 'g-greenyouth',
    author: 'The green youth',
    project: 'Stage (CAP)',
    date: 'juillet 2026',
    source: 'google',
    text: 'Très bonne expérience pour mon stage dans le cadre de mon CAP, je recommande Yourteco pour leurs conseils, et leur qualité des structures, très pro dans le domaine de la yourte […]',
  },
  {
    id: 's-pouessel',
    author: 'Fabien P.',
    project: 'Habitation',
    date: '2019',
    source: 'site',
    text: "Cela fait près d'un an que nous habitons dans notre yourte fabriquée par Yourteco. Notre retour d'expérience est très positif. Lumineuse, chaleureuse, confortable, esthétique, robuste et bien finie sont les mots qui nous viennent pour qualifier cette yourte. […]",
  },
]

export const SOURCE_LABEL = { google: 'Avis Google', site: 'Avis reçu par Yourteco' }
