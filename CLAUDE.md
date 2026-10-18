# Yourteco : maquette de refonte

Refonte React de yourteco.com (fabricant français de yourtes en bois), préparée par Guillaume Naste (Stena Web) pour démarcher le client. Contexte produit : `PRODUCT.md`. Où en est le projet : `docs/suivi.md` (à lire en début de session, à mettre à jour en fin de chantier).

## Commandes

- `npm run dev` : site local sur http://127.0.0.1:4173 (port fixe). Ne pas le relancer s'il tourne déjà.
- `npm run build` : site de production, servi sous `/yourteco/` (voir `vite.config.js`).
- `npm run deploy` : construit puis publie `dist/` sur la branche `gh-pages`. **Uniquement sur demande explicite.** Ensuite, relancer la construction GitHub Pages avec `gh api -X POST repos/GuillaumeGabourg/yourteco/pages/builds`, attendre que le nouveau fichier `assets/index-*.js` apparaisse sur https://guillaumegabourg.github.io/yourteco/, puis vérifier le site publié.
- Audits : `npm run audit` (ou `audit:pages`, `audit:axe`, `audit:ancres`, `audit:images`, `audit:alignement`, `audit:perf`). Détail et résultats attendus dans `outils/audit/README.md`.
- Commits : identité reprise de `git log -1` (`git -c user.name=… -c user.email=…`), message en français. Ne pousser que sur demande.

## Organisation du code

- `src/content/` : les données.
  - `pages/*.json` contient les 65 pages de contenu, avec `__` à la place de `/` dans le nom du fichier.
  - `menu.js` est la source unique des rubriques (menu, pied de page, plan du site, « Dans cette rubrique »). On y trouve aussi `OTHER_PAGES`, les 5 pages EN et les 5 pages DE.
  - `ui.js` contient les textes d'interface FR, EN et DE, ainsi que `langOf(pathname)`.
  - `reviews.js` contient les avis, `site.js` les coordonnées, `imageDims.json` les dimensions réelles des images.
- `src/pages/` : `Home.jsx` (accueil, yourte animée de la section « specs »), `ContentPage.jsx` (toutes les pages intérieures), `SitePlan.jsx`.
- `src/components/` :
  - `Chrome.jsx` : en-tête, pied de page, boutons devis, téléphone et thème ;
  - `Menu.jsx` : grand menu FR, menu EN/DE, menu mobile ;
  - `LangSwitch.jsx` : menu déroulant à drapeaux ;
  - `Plate.jsx` : image au format réel.
- `src/lib/` :
  - `smooth.jsx` : Lenis, `barHeight()`, défilement vers les ancres ;
  - `perf.js` : mode léger automatique ;
  - `lang.js` : `useLang()`.
- Styles dans `src/styles/` (`tokens.css` pour les couleurs et le thème sombre, `site.css` pour tout le reste ; c'est un gros fichier, y chercher avec Grep plutôt que le lire en entier).

## Règles propres à ce site

- **À chaque modification visible, donner le lien local** des pages concernées (http://127.0.0.1:4173/...) pour que Guillaume puisse vérifier lui-même. Pas seulement « c'est corrigé ». Si le serveur ne tourne pas, le lancer d'abord.

- Textes d'origine repris mot pour mot. Seule l'orthographe est corrigée, via `corrections.js`. Toute reformulation ou tout texte nouveau va dans `docs/reformulations.md`, et toute affirmation à justifier dans `docs/alertes-contenu.md`.
- Avis clients : jamais modifiés, coupés seulement avec […]. Aucune note calculée, jamais la mention « avis vérifiés ».
- Images toujours au format naturel : ni rognées, ni agrandies, sans effet de parallaxe qui zoome. Vérifier avec `npm run audit:images`.
- Ancres : la section arrive pile sous la barre (73 px à 1440, 65 px à 375). Vérifier avec `npm run audit:ancres`.
- Liens dans le texte : soulignement qui s'épaissit au survol, jamais de fond plein (illisible en thème sombre).
- Le fil d'Ariane se termine par la page courante.
- Performance : rester fluide sur un portable peu puissant (mesurer avec `audit:perf`, processeur ralenti ×6). Pas de flou animé.
- Pages intérieures (`ContentPage.jsx`), règles de la revue du 18 octobre :
  - un texte long reste en **une seule colonne pleine largeur**, jamais coupé en deux colonnes côte à côte ;
  - **deux photos** hors galerie s'affichent **l'une sous l'autre**, grandes (colonne de photos plus large que la colonne de texte) ;
  - pas de trait vert au-dessus des blocs de texte en colonnes ;
  - un titre de section seul reste proche de ce qui le suit ;
  - une section faite **uniquement de liens** est fondue sous la section précédente, en rangée compacte (`.cp-links`), jamais en bandeau pleine hauteur ;
  - **bandeaux de remplissage** (un titre court + une phrase d'accroche seuls dans une section, ex. « YOURTECO / Habitons léger… ») : supprimés, ils prennent de la place pour très peu d'information ;
  - **logo ou image en double** l'un sous l'autre : on garde un seul exemplaire ;
  - **plus de photos que de texte** : si le texte est court, il **suit les photos au défilement** (collant, `.is-follow`) ; s'il est trop haut pour rester collant, les photos en trop passent sous le texte dans sa colonne pour équilibrer les deux colonnes (`.is-balanced`). Jamais de grande bande vide à côté des photos ;
  - **blocs de texte en colonnes** : à quatre blocs ou plus, ils se rangent en **deux piles** de haut en bas (`.is-stacked`), pas en lignes qui laissent le dernier bloc seul au milieu ; un bloc **bien plus long que les autres** (plus de 1 500 caractères et plus de 2,5 fois la moyenne des autres) prend **toute la largeur** (`.is-full`), tout comme son court texte d'introduction s'il resterait seul sur sa ligne ;
  - **dernier bloc seul sur sa ligne** dans des blocs en colonnes : il prend toute la largeur (jamais centré avec du vide de chaque côté) ; s'il est fait de lignes courtes (coordonnées), elles se rangent en deux colonnes ;
  - **plusieurs titres qui n'ont chacun qu'un lien**, à la suite : une seule rangée compacte de colonnes (`.cp-linkset`), pas une pile de blocs espacés ;
  - un titre sans texte ni image : vérifier d'abord sur le site d'origine. Les textes sont parfois placés plus loin par la copie : on les remet sous leur titre dans le JSON plutôt que de supprimer le titre.
- Barre de menu : les liens sont en `inline-flex` centré (texte centré dans la pastille, flèche des liens externes sur la même ligne que le mot, y compris sur les pages EN et DE).
- Barre de menu : menu burger sous 1340 px. Vérifier qu'il n'y a pas de débordement à 320 px, en français et en allemand (les libellés allemands sont les plus longs).

## Pièges déjà rencontrés

- Bash sous Windows : un long heredoc Python échoue. Écrire le script dans un fichier `.py` et le lancer avec `PYTHONIOENCODING=utf8 python`. Préfixer par `MSYS_NO_PATHCONV=1` quand un argument commence par `/`.
- Pas de `sleep` long en avant-plan : attendre avec une boucle `until` ou lancer la commande en arrière-plan.
- Les captures d'écran remplissent vite le contexte : préférer les scripts qui mesurent, et faire une seule série de captures à la fin (1440 et 375).

## Avant une vraie livraison

Lire la liste dans `docs/suivi.md` : formulaire de devis réel, droits sur les contenus, connexion automatique `#auto=` et mots de passe de démonstration à retirer.
