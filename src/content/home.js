// Contenu de l'accueil, repris mot pour mot du site actuel (orthographe corrigée à l'affichage).
// Structure pensée pour le back office : chaque bloc = une section éditable.
const I = '/img/site/'

export const HOME = {
  hero: {
    title: 'Yourteco conçoit, fabrique et installe votre yourte contemporaine',
    image: I + 'double-yourte-contemporaine-scaled.webp',
    alt: 'Deux yourtes contemporaines RE 2020 fabriquées et installées par Yourteco',
    caption: 'Deux yourtes contemporaine RE 2020 fabriquées et installées par Yourteco',
    tag: 'Fabriqué en atelier · Daumeray (49)',
  },
  intro: {
    title: 'Un Fabricant de yourtes contemporaines en bois haut de gamme.',
    paragraphs: [
      "Bienvenue chez Yourteco, entreprise éthique spécialisée dans la conception, la fabrication et l'installation de yourtes contemporaines.",
      "Aujourd'hui forte de près de 20 ans d'expérience, notre équipe de 12 passionnées met son savoir-faire au service de vos projets d'habitat léger.",
      "Que vous recherchiez une yourte d'habitation, de loisir, un établissement ERP (recevant du public), un kit d'autoconstruction ou un chantier participatif, nous saurons vous conseiller et concevoir les structures parfaitement adaptées à vos besoins.",
    ],
    whyTitle: 'Pourquoi choisir une yourte Yourteco ?',
    why: [
      ['Conception haut de gamme', 'Des yourtes en bois inspirées des yourtes traditionelles mongoles, combinant des menuiseries haut de gammes en bois ou Alu , une veritable isolation, une structure robuste et des finitions impeccables.'],
      ['Sécurité & Isolation', 'Des structures de yourtes calculées selon les normes rigoureuses du bâtiment ou des chapiteaux, garantissant une veritable isolation thermique , une grande fiabilité et une robustesse à toute épreuve.'],
      ['Expertise globale', 'Un savoir-faire technique pointu et un accompagnement administratif éprouvé.'],
    ],
    ecoTitle: 'Un engagement pour la transition écologique',
    eco: "Engagé auprès des collectivités , Yourteco œuvre activement pour l'intégration de l'habitat léger sur l'ensemble des territoires. Nous sommes convaincus que nos yourtes en bois constitue une solution d’aménagement prioritaire pour répondre aux enjeux environnementaux et sociétaux de demain.",
    images: [
      { src: I + 'parispanojour.webp', alt: 'Huit yourtes contemporaines ERP installées à Paris', caption: 'Fabrication et installation de huit yourtes contemporaines ERP à Paris par Yourteco.', ratio: '1280 / 662' },
      { src: I + 'fabricant-yourtes-contemporaines-maine-et-loire.webp', alt: 'Cuisine dans une yourte contemporaine', caption: 'Cuisine dans une yourte contemporaine installée par Yourteco', ratio: '3 / 2' },
    ],
  },
  marks: [
    { value: 40, suffix: ' ans', label: 'Membranes de toiture garanties' },
    { value: 30, suffix: ' cm', label: "Isolation d'épaisseur bâtiment, jusqu'à" },
    { value: 15, suffix: ' ans', label: "Garanties constructeur, jusqu'à" },
    { value: 2007, suffix: '', label: 'Début de l’aventure associative' },
  ],
  specs: {
    kicker: 'Spécificités de nos yourtes d\'habitation et de loisirs',
    title: "Des yourtes aux normes d'aujourd'hui, pour l’habitat de demain",
    lead: "Passez du rêve à la réalité avec un habitat léger sans compromis sur la sécurité et le confort. À la croisée des normes rigoureuses du bâtiment et de l'éco-conception, Yourteco bâtit des yourtes d'exception taillées pour l'avenir.",
    groups: [
      {
        title: 'Une structure de haute résistance calculée pour durer',
        items: [
          ['Bois du Nord de forte section (Choix US)', 'Utilisation du grade le plus résistant pour une charpente robuste, purifiée et travaillée avec précision dans nos ateliers (assemblages traditionnels à tenon et mortaise).'],
          ['Calculs de structure systématiques', 'Toutes nos yourtes bénéficient de calculs de structure dédiés pour garantir une sécurité totale, même face aux conditions météorologiques les plus dures (vent, neige).'],
        ],
      },
      {
        title: "Une étanchéité d'exception et des matériaux innovants",
        items: [
          ['Membranes de toiture garanties 40 ans', 'Yourteco est le premier fabricant à équiper ses yourtes de membranes ultra-résistantes à la longévité inégalée.'],
          ['Toit panoramique Skydôme', 'Un dôme ouvrant haut de gamme (du simple au triple paroi) assurant une étanchéité parfaite, une luminosité abondante et la promesse de nuits sous les étoiles.'],
        ],
      },
      {
        title: 'Un confort thermique et acoustique toute saison',
        items: [
          ["Isolation d'épaisseur bâtiment (jusqu'à 30 cm)", 'Une véritable protection thermique pour un confort acoustique supérieur et une très faible consommation énergétique été comme hiver.'],
          ["Maîtrise de l'étanchéité à l'air", 'Une conception éco-responsable certifiée pour maintenir un climat intérieur sain et économe.'],
        ],
      },
      {
        title: 'Expertise RE2020, Urbanisme & Accompagnement',
        items: [
          ["Spécialiste Permis de Construire, Permis d'Aménager & STECAL", "Experts de la réglementation et des règles d'urbanisme, nous vous accompagnons pas à pas dans vos démarches administratives pour concrétiser votre projet en toute sérénité."],
          ['Conformité RE2020 & Respect des sols', 'Des habitats performants posés sans imperméabilisation des sols, garantissant la réversibilité complète de votre terrain.'],
          ['Savoir-faire garanti', "L'ensemble de nos structures bénéficie de nos garanties constructeur allant jusqu'à 15 ans."],
        ],
      },
    ],
    images: [
      { src: I + 'yourteco-fabricant-yourtes-contemporaines-francaises.webp', alt: "Yourte contemporaine d'habitation fabriquée par Yourteco", caption: "Yourte contemporaine d'habitation fabriquée par Yourteco" },
      { src: I + 'double-yourte-contemporaine-par-yourteco.webp', alt: 'Double yourte fabriquée par Yourteco', caption: 'Exemple de double yourte fabriquée par Yourteco' },
    ],
  },
  offers: [
    {
      group: 'Un fabricant de yourtes contemporaines éco-responsable reconnu pour sa fiabilité',
      items: [
        { title: 'Une fabrication alliant qualité et durabilité', text: "Découvrez les éléments qui caractérisent votre fabricant de yourtes contemporaines ! Pour une fabrication toujours plus responsable et écologique, Yourteco ne cesse d'innover. Notre but ? Concevoir des habitats résistantes et durables !", cta: 'En savoir plus sur notre mode de fabrication de yourtes', href: '/fabrication-de-yourte-contemporaine/', image: I + 'fabrication-yourtes-contemporaines-par-yourteco.webp', tag: 'Atelier' },
        { title: 'Différentes locations de yourtes', text: "Louer une yourte pour un événement particulier tel un anniversaire, un mariage ou une activité d'entreprise ? Découvrir le camping en yourte ? Yourteco propose différents modèles afin d'allier confort et modularité. Découvrez encore ci-dessous notre partenaire YourtEvent !", cta: 'Voir nos formules de location de yourtes', href: '/location-de-yourtes/', image: I + 'yourte-contemporaine-arc-en-ciel-par-yourteco-landscape.webp', tag: 'Location' },
      ],
    },
    {
      group: "Un fabricant qui s'engage à l'affirmation d'un mode de vie",
      items: [
        { title: 'Notre "Kit Yourte" pour l\'autoconstruction', text: 'Face à l\'engouement pour un habitat léger et dans la perspective d\'accompagner celles et ceux qui souhaiteraient construire eux-mêmes leur yourte, Yourteco vous présente son "Kit Yourte". Une solution économique, écologique et globale. On vous forme en plus !', cta: 'En savoir plus pour construire sa yourte', href: '/construire-sa-yourte/', image: I + 'kit-autoconstruction-yourte-contemporaine-par-yourteco.webp', tag: 'Kit & stages' },
        { title: 'Réalisation de toiles de yourte sur mesure', text: 'Comment choisir la toile de sa yourte ? Quels sont les services Yourteco sur la fabrication ou la réparation de votre / vos toiles ? Quels conseils pour un entretien durable et écologique de votre yourte contemporaine ? Toutes vos questions ont leur réponse ici.', cta: 'En savoir plus sur la toile de yourte', href: '/les-toiles-de-yourtes/quelle-toile-pour-votre-yourte/', image: I + 'yourte-contemporaine-par-yourteco.webp', tag: 'Toiles' },
      ],
    },
  ],
  ethics: {
    title: "De l'association à l'entreprise",
    subtitle: 'Une éthique préservée',
    lead: "Issue d'une aventure associative débutée en 2007, Yourteco réinvente l'habitat léger selon une vision éthique, portée par la recherche du bien-être et l'exigence d'un bâti de qualité. Notre engagement s'articule autour de cinq piliers :",
    pillars: [
      ['Rigueur artisanale', 'Des méthodes de fabication adaptées aux exigences modernes.'],
      ["Matériaux d'exception", 'Des composants écoresponsables sélectionnés pour leur durabilité.'],
      ['Gestion maîtrisée', 'Un respect strict des délais et une transparence totale.'],
      ['Contrôle qualité', 'Un audit systématique de chaque structure post-réalisation.'],
      ['Ingénierie collaborative', 'Un travail conjoint avec architectes, urbanistes et ingénieurs bois.'],
    ],
    craftTitle: "L'artisanat et le made in France au service de l'innovation",
    craft: "L'expertise de Yourteco s'appuie sur le savoir-faire transmis par nos menuisiers et charpentiers. En alliant charpente traditionnelle et éco-conception, nous façonnons des habitats légers durables et sûrs.",
    video: { id: '54tPZHlMY-Y', poster: I + 'video-ateliers-yourteco.webp', caption: 'Visite des ateliers Yourteco en vidéo et en musique autour de nos modèles de fabrication de yourtes contemporaines' },
  },
  steps: {
    title: 'Votre projet, étape par étape',
    proposed: true,
    items: [
      ['Le conseil', "Le conseil et l'adaptation à votre projet : habitation, loisir, ERP, kit d'autoconstruction ou chantier participatif."],
      ['Les démarches', "Permis de Construire, Permis d'Aménager & STECAL : nous vous accompagnons pas à pas dans vos démarches administratives."],
      ['La fabrication', 'Charpente en Bois du Nord, toiles et isolants travaillés dans nos ateliers de Daumeray, avec calculs de structure dédiés.'],
      ['La pose', "Livraison et installation par Yourteco, ou autoconstruction accompagnée avec le Kit Yourte. Posé sans imperméabilisation des sols."],
    ],
  },
  news: {
    title: 'Actualités Yourteco',
    items: [
      { title: 'Ouverture de la Boutique Yourteco !', text: 'Cela faisait un moment que le projet traînait dans les cartons. Le voilà maintenant réalisé ! Yourteco vous présente sa "Boutique spécialisée dans l\'habitat léger". Dans ce nouvel espace en ligne, vous trouverez tout ce qu\'il faut pour votre projet de construction, de rénovation ou d\'entretien de votre yourte contemporaine. Profitez des matériaux quotidiennement utilisés par Yourteco !', cta: 'Découvrir ici la Boutique en ligne Yourteco', href: 'https://www.yourteco-boutique.com', image: I + 'accrroche-boutique-yourteco.webp' },
      { title: 'Louez une yourte avec YourtEvent !', text: "La société Yourteco est ravie de vous présenter son nouveau partenaire. Comme son nom l'indique, YourtEvent est spécialisée dans la location de yourtes contemporaines pour vos événements. Envie de proposer un espace original pour un mariage ou tout autre soirée familiale ou entre amis ? Un colloque entreprise ? Un festival ? Découvrez les offres à la location YourtEvent !", cta: 'Découvrir ici les locations YourtEvent', href: 'https://www.yourtevent.com', image: I + 'location-de-yourte-scaled.webp' },
    ],
  },
  commitments: {
    title: 'Votre fabricant de yourtes contemporaines vous garantit',
    items: [
      ["Le conseil et l'adaptation à votre projet", ''],
      ['Des outils de conception et de production pour une parfaite réalisation de votre yourte', ''],
      ["Le développement d'une nouvelle approche de l'habitat et de l'entreprenariat responsable et éthique", "Les essences de bois utilisées proviennent toutes de plantations de forêts contrôlées et aménagées en vue d'une gestion durable."],
      ["L'optimisation et la conservation de l'énergie en vue de diminuer l'impact environnemental", ''],
      ['Ne jamais perdre de vue notre humanité', 'Le droit au logement constitue un enjeu humain.'],
      ["Agir pour un nouveau droit d'occupation des sols", "En adéquation avec des modes d'implantation à faible empreinte écologique, autonomes en énergie et respectueux des milieux et des écosystèmes."],
      ['La préservation et la mise en valeur des paysages', 'Ainsi que la diminution de la consommation en énergie, en eau et autres ressources naturelles.'],
      ["Une vision dans laquelle le client n'est pas qu'un acteur économique", ''],
    ],
  },
  price: {
    title: 'Yourteco : la qualité sans compromis, au prix le plus juste !',
    text: 'A propos ? Quel est le prix d\'une yourte "made in France" labellisée Yourteco ? La réponse dépend bien étendu de vos envies. Mais pas que ! Pour vous aider à clarifier votre projet, nous vous invitons à suivre le lien ci-dessous.',
    cta: 'En savoir plus sur le prix des yourtes Yourteco !',
    href: '/modele/',
    image: I + 'prix-yourte-contemporaine.webp',
  },
}
