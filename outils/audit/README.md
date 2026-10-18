# Audits du site

Le serveur local doit tourner (`npm run dev`, http://127.0.0.1:4173). Chrome installé est utilisé (`CHROME_PATH` pour un autre chemin).

| Commande | Ce qui est vérifié | Résultat attendu |
|---|---|---|
| `npm run audit:pages` | 66 pages : images cassées ou agrandies (floues), débordement horizontal à 375/768/1440, erreurs console, requêtes en échec | tout à 0 |
| `npm run audit:axe` | accessibilité axe-core WCAG 2.2 AA, thèmes clair et sombre, 1440 et 375 | « aucune violation » |
| `npm run audit:ancres` | ancre depuis une autre page (fil d'Ariane vers le plan du site), `#devis` depuis la même page et en arrivée directe, et le bouton Devis d'une page intérieure (doit mener à `/devis/`) | haut de la section = hauteur de la barre (73 px à 1440, 65 px à 375), bouton Devis -> `/devis/` |
| `npm run audit:images` | part de chaque photo masquée par son cadre, photos agrandies | 0 rognée, 0 agrandie (les 15 miniatures YouTube, aux bandes noires rognées volontairement, sont comptées à part) |
| `npm run audit:alignement` | rangées alignées, dernière ligne centrée, icône au-dessus du texte, trait de survol | 6 points connus sur l’accueil et la page Toiles (voir docs/suivi.md), rien d’autre |
| `npm run audit:perf` | fluidité au défilement, processeur ralenti ×6 | environ 55 images/s ou plus |
| `npm run audit` | les cinq premiers à la suite | |

Chaque commande affiche une ligne de synthèse ; le détail est dans `outils/audit/rapports/` (non versionné).
Site publié : préfixer par `AUDIT_URL=https://guillaumegabourg.github.io/yourteco/` (les pages profondes y répondent en 404 puis s'affichent : normal).
