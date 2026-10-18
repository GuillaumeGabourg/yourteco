# Suivi du projet Yourteco

À relire en début de session et à mettre à jour à la fin de chaque chantier : ce qui est fait, ce qui reste, ce qui attend une réponse.
Plan détaillé d'origine (v6) : `C:\Users\desig\.claude\plans\https-www-yourteco-com-l-on-n-est-snuggly-thimble.md`.

## Où en est le site (au 18 octobre 2026)

- **En ligne** : https://guillaumegabourg.github.io/yourteco/ (dernière publication le 18 octobre : revue des 67 pages terminée, pages de devis FR, EN et DE, commit 742dd4f ; `master` contient tout).
- **Derniers audits** :
  - 69 pages (dont les 3 pages de devis) sans image cassée ni floue, sans débordement ;
  - 12 liens internes encore cassés (`npm run audit:liens`), à régler en reprenant les 12 pages manquantes ;
  - axe WCAG 2.2 AA sans violation, en thème clair et sombre ;
  - ancres exactes (73 px à 1440, 65 px à 375) ;
  - aucune photo rognée.

### Fait

| Jalon | Contenu |
|---|---|
| J1 | Accueil animé (yourte qui se construit au défilement, phases cliquables), gabarit des pages, 66 pages avec textes et photos d'origine, thèmes clair et sombre, mode léger automatique pour les portables peu puissants |
| Menu | 6 rubriques couvrant les 55 pages françaises, menu mobile en accordéon, fil d'Ariane jusqu'à la page courante, plan du site |
| Avis | Carrousel sur l'accueil (7 avis datés, lien vers tous les témoignages et vers Google), mur d'avis sur la page Avis |
| Langues | Menu déroulant à drapeaux dans la barre. Pages EN et DE avec menu, menu mobile, bandeau et pied de page traduits |
| Bandeau du haut | Supprimé sur toutes les pages. Lien boutique dans le menu (rubrique Yourteco en FR, entrée « Boutique » en EN et DE). Téléphone : celui de la barre et du pied de page |
| Publication | GitHub Pages sous `/yourteco/` |
| Logos décoratifs | Les 42 petits logos Yourteco posés sous les titres sur l'ancien site (`logo-yourteco-small-75`) sont supprimés des 32 pages. Ce n'était qu'un ornement, pas un contenu. À ne pas réintroduire. |
| Finitions pages | Bloc « Appelez-nous ! » retiré des 30 pages (le bandeau du bas suffit), bandeau devis et téléphone agrandi, pied de page compacté, « My photos / All » retiré de Chantiers participatifs (photo recentrée via `alone` dans le JSON), 7 liens seuls fondus sous le dernier paragraphe. Alignement : 7 points (6 connus + 2 traits de titre sur `comment-construire-soi-meme-sa-yourte` et `location-de-yourtes`, à contrôler). |
| Revue des pages (lot 1, retours pages 2 et 3) | Règles générales appliquées à tout le site : texte long en une colonne pleine largeur, deux photos l'une sous l'autre et plus grandes, traits verts retirés au-dessus des colonnes de texte, section de liens seuls fondue en rangée compacte sous la section précédente. Page « habitation » : le texte d'Isolation, déplacé plus loin par la copie, est remis sous son titre. Suivi de la revue : `docs/revue-pages.md` (reprise à la page 4). |
| Revue des pages (lot 1, pages 4 à 10) | Bandeau « YOURTECO / Habitons léger… » supprimé (2 pages), doublon du logo Landré retiré, texte qui suit les photos quand il y en a beaucoup plus (`is-follow`) ou photos en trop sous le texte (`is-balanced`). Reprise de la revue à la page 11. |
| Revue des pages (lot 4, pages 31 à 40) | Page 31 : étapes numérotées et sélecteur de coloris (toit et murs, 12 couleurs d'origine, images dans `public/img/couleurs/`). Page 35 : blocs de la fiche technique en deux piles. Page 40 : le bloc très long (anneau de compression) passe en pleine largeur. Validé par Guillaume et déployé. |
| Revue des pages (lots 5 à 7) | Pages 42 (contact compact à gauche), 49, 58, 65 : blocs seuls en pleine largeur, liens à un seul titre en rangée compacte. Menus EN et DE centrés, flèche « Shop » sur la même ligne. Doublon `/accueil/` supprimé (redirigé vers `/`). Bug corrigé : le bouton « Devis » donnait une 404 en ligne (`smooth.jsx`, préfixe du site ajouté deux fois). Liste des liens internes cassés à traiter : voir « À faire ». |
| Page de devis dédiée | `/devis/` : même formulaire que le bas de l'accueil (composant `QuoteSection`). Tous les boutons « Devis » du site y mènent, sauf sur l'accueil où ils font défiler jusqu'au formulaire. `/contact/` redirige vers `/devis/`. Le formulaire reste factice (envoi simulé), voir « À faire ». Pages traduites `/quote/` (EN) et `/angebot/` (DE) avec le même formulaire (un seul composant, `devisText.js` pour les textes, règles de code postal et de téléphone internationales hors français) ; les boutons Devis des pages EN et DE y mènent, le sélecteur de langue passe d'une page de devis à l'autre. |

## À faire

0. **12 liens internes cassés à rendre fonctionnels** : vraies pages du site d'origine non reprises dans la maquette (`/nos-photos/`, `/yourte-rt-2012/`, `/3d/`, `/blog/`, `/choisir-sa-toile-de-yourte/`, `/chapiteau-yourte-erp-diam-11-60-m/`, `/dome-yourte/`, `/nos-partenaires/`, `/photo-des-chantiers-participatifs/`, `/presse-medias-radio-journal-article-de-presse/`, `/une-yourte-ecole/`, `/yourte-en-bois/`). Prompt prêt pour une nouvelle conversation : `docs/prompt-reprise-12-pages.md`. Les 5 autres liens cassés du 18 octobre sont réglés : `/choisir-sa-yourte/` corrigé vers la page existante, 4 liens morts aussi sur le vrai site traités : « En savoir plus sur l'option ERP » et « yourtes ERP » renvoient vers la page Yourte ERP, « Flex yourte » vers la page Flex Yourte, « treillis » (page Portes) vers la page Treillis ; « bande d'arase » (page Fondations) reste sans lien, faute de page équivalente.

1. **J2 : back office PocketBase** (pas commencé, à confirmer avec Guillaume). Il comprend :
   - l'édition des textes, images, chiffres clés, liens et sections ;
   - l'aperçu en direct sur PC, tablette et mobile ;
   - les boutons « Rétablir » ;
   - le module Avis avec la sélection du mois.

   Suivre la compétence `site-administrable` : sécurité prioritaire, tests sur l'instance jetable (port 8091), jamais de réinitialisation de la base en direct.
2. **Formulaire de devis** : il est factice pour l'instant (envoi simulé). Pour une mise en ligne, il faut le brancher en suivant `regles-formulaires`.
3. **Devis en anglais et en allemand** : fait (pages `/quote/` et `/angebot/`). Les traductions sont à faire valider par Yourteco.
4. **6 points de l'audit d'alignement à examiner** (`npm run audit:alignement`), déjà présents avant le 17 octobre : la dernière ligne n'est pas centrée dans les blocs `why-item`, `eco-in` et `pillar` de l'accueil, et il y a un doute sur le trait de survol du titre « Commandez directement en ligne… » de la page Toiles. Il faut décider si ce sont de vrais défauts ou de fausses alertes. Depuis le 18 octobre, un 7e point est voulu : le bloc « Contacter Yourt&Co » de `chantiers-participatifs`, laissé seul à gauche à la demande de Guillaume.
5. **Plus d'avis Google** : sans connexion, Google Maps n'affiche que 5 avis. Il faut soit que Guillaume colle les textes, soit passer par l'API Google Places en production (attribution et logo Google obligatoires).

## En attente de validation par Yourteco

- `docs/alertes-contenu.md` : les affirmations à justifier (équipe de 12, 100 % de permis acceptés, garantie de 15 ans…).
- `docs/reformulations.md` : les textes nouveaux ou reformulés, y compris les libellés du menu et l'interface EN/DE.
- Les miniatures YouTube sont en basse résolution : demander des vignettes de meilleure qualité.

## Avant une vraie livraison

- Accord écrit pour réutiliser les textes, les photos et les avis.
- Formulaire de devis réel : validation serveur, champ piège, limite d'envois.
- Retirer la connexion automatique `#auto=` et changer les mots de passe de démonstration (quand le back office existera).
- Retirer le `noindex`, configurer les en-têtes de sécurité, activer HTTPS avec HSTS sur l'hébergement définitif, et prévoir les redirections 301 depuis les anciennes adresses.

## Historique des commits

```
2643239  Menu déroulant à drapeaux, menus et pied de page traduits EN/DE
4fba386  Logo sur la ligne de base, yourte cliquable et synchronisée, avis, images au format réel
cb0495c  Menu par rubriques : les 55 pages accessibles depuis le bandeau
6306456  Optimisation : fluide sur portable peu puissant, mode léger automatique
caa17af  Publication GitHub Pages
2e53c4d  Trait de survol sur le texte, cartes alignées, audit WCAG 2.2 AA
6da15cb  Carrousel d'avis sur l'accueil, thème clair par défaut
2860d66  Règles de mise en page, thème sombre, boutons et liens rétablis
ee5dcf5  Page Avis : mur de cartes
96421ef  Logo dans le titre, mise en page pleine largeur, fond vivant
e026de0  Pages plus compactes : grille éditoriale, textes en colonnes
3038ef0  Refonte visuelle « Clairière »
7da8798  Maquette J1 : accueil animé, gabarit des pages, contenus et photos
```
