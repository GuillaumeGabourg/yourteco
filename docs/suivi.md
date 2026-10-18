# Suivi du projet Yourteco

À relire en début de session et à mettre à jour à la fin de chaque chantier : ce qui est fait, ce qui reste, ce qui attend une réponse.
Plan détaillé d'origine (v6) : `C:\Users\desig\.claude\plans\https-www-yourteco-com-l-on-n-est-snuggly-thimble.md`.

## Où en est le site (au 17 octobre 2026)

- **En ligne** : https://guillaumegabourg.github.io/yourteco/ (dernière publication le 17 octobre : titres des offres alignés, commit 321eba3).
- **Derniers audits** :
  - 66 pages sans image cassée ni floue, sans débordement ni erreur ;
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

## À faire

0. **17 liens internes cassés** (anciennes pages du site d'origine qui n'existent pas dans la maquette, ils donnent la page « introuvable ») : `/nos-photos/` (3 pages), `/yourte-rt-2012/` (2), `/location-de-yourtes-2/reglementation-pour-les-erp/` (2), `/location-de-yourtes-2/locations-evenementielles/`, `/3d/`, `/blog/`, `/charpente.php/`, `/choisir-sa-toile-de-yourte/`, `/choisir-sa-yourte/`, `/chapiteau-yourte-erp-diam-11-60-m/`, `/dome-yourte/`, `/nos-partenaires/`, `/photo-des-chantiers-participatifs/`, `/presse-medias-radio-journal-article-de-presse/`, `/produit/bande-arase-35-mm/`, `/une-yourte-ecole/`, `/yourte-en-bois/`. À rediriger vers une page existante ou à retirer, avec l'accord de Guillaume.

1. **J2 : back office PocketBase** (pas commencé, à confirmer avec Guillaume). Il comprend :
   - l'édition des textes, images, chiffres clés, liens et sections ;
   - l'aperçu en direct sur PC, tablette et mobile ;
   - les boutons « Rétablir » ;
   - le module Avis avec la sélection du mois.

   Suivre la compétence `site-administrable` : sécurité prioritaire, tests sur l'instance jetable (port 8091), jamais de réinitialisation de la base en direct.
2. **Formulaire de devis** : il est factice pour l'instant (envoi simulé). Pour une mise en ligne, il faut le brancher en suivant `regles-formulaires`.
3. **Devis en anglais et en allemand** : le bouton « Quote » / « Angebot » mène au formulaire de l'accueil, qui est en français. À décider : formulaire traduit ou page de contact dans la langue.
4. **6 points de l'audit d'alignement à examiner** (`npm run audit:alignement`), déjà présents avant le 17 octobre : la dernière ligne n'est pas centrée dans les blocs `why-item`, `eco-in` et `pillar` de l'accueil, et il y a un doute sur le trait de survol du titre « Commandez directement en ligne… » de la page Toiles. Il faut décider si ce sont de vrais défauts ou de fausses alertes.
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
