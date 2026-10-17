# Suivi du projet Yourteco

À relire en début de session et à mettre à jour à la fin de chaque chantier : ce qui est fait, ce qui reste, ce qui attend une réponse.
Plan détaillé d'origine (v6) : `C:\Users\desig\.claude\plans\https-www-yourteco-com-l-on-n-est-snuggly-thimble.md`.

## Où en est le site (au 17 octobre 2026)

- **En ligne** : https://guillaumegabourg.github.io/yourteco/ (dernière publication : commit 2643239).
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
| Publication | GitHub Pages sous `/yourteco/` |

## À faire

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
