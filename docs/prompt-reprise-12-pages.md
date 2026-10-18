# Prompt pour la reprise des 12 pages manquantes

À coller dans une nouvelle conversation sur le projet Yourteco, en partant de la branche `master` à jour.

```text
Contexte : on travaille sur la maquette de refonte de yourteco.com (dossier C:\Users\desig\Documents\Yourteco, React + Vite). Pars de la branche `master` à jour (`git pull`), crée une nouvelle branche pour ce travail. Lis d'abord `CLAUDE.md`, `PRODUCT.md` et `docs/suivi.md`, puis `docs/revue-pages.md`. Le serveur local se lance avec `npm run dev` (http://127.0.0.1:4173), ne pas le relancer s'il tourne déjà.

État du site : la revue des 67 pages est terminée et publiée (https://guillaumegabourg.github.io/yourteco/). `npm run audit:liens` liste les liens internes qui ne mènent à aucune page de la maquette : il en reste 12.

Mission : reprendre dans la maquette les 12 pages du site d'origine (https://www.yourteco.com) qui existent en ligne mais n'avaient pas été extraites, avec les mêmes adresses que sur le site d'origine :

1. /nos-photos/ (Galeries photos de yourtes contemporaines), liée depuis 3 pages : « D'autres photos de yourtes Yourteco »
2. /yourte-rt-2012/ (Réglementation Thermique 2012 sur yourte d'habitation), liée depuis 2 pages
3. /3d/ (Modélisation 3D pour visualiser l'aménagement d'une yourte), liée depuis « Yourte RT 2012 »
4. /blog/ (Le Blog de Yourteco), liée depuis « Entretien avec le gérant »
5. /choisir-sa-toile-de-yourte/ (Dix critères de sélection pour une toile de yourte), liée depuis « Comment choisir sa toile »
6. /chapiteau-yourte-erp-diam-11-60-m/ (Yourtes mongoles dans le parc animalier Planète Sauvage), liée depuis « Fabrication de yourtes contemporaines »
7. /dome-yourte/ (Dôme yourte contemporaine), liée depuis la même page
8. /nos-partenaires/ (Partenaires de la société Yourteco), liée depuis « Entretien avec le gérant »
9. /photo-des-chantiers-participatifs/ (Photos de chantiers participatifs Yourteco), liée depuis « Chantiers participatifs »
10. /presse-medias-radio-journal-article-de-presse/ (La presse évoque le fabricant de yourtes Yourteco), liée depuis « Entretien avec le gérant »
11. /une-yourte-ecole/ (Une yourte école à Rheu en Bretagne), liée depuis « Fabrication de yourtes contemporaines »
12. /yourte-en-bois/ (Yourtes en bois : exemples de la Ferme de la Gandonnière), liée depuis la même page

Marche à suivre :
- Avant d'écrire du code, regarde comment sont faites les pages existantes : `src/content/pages/*.json` (le nom de fichier remplace `/` par `__`), les blocs (heading, text, list, image, button, video, steps…), `src/content/menu.js`, `imageDims.json`, `imageVariants.json`, `images.json` (correspondance fichier local -> adresse d'origine). Les images vont dans `public/img/site/` en `.webp` (une version `.800.webp` pour les grandes), avec leurs dimensions réelles dans `imageDims.json` et `imageVariants.json`.
- Extraire chaque page depuis le site d'origine : titre de l'onglet, description, H1, tous les textes mot pour mot (seule l'orthographe est corrigée par `corrections.js`), les images, les liens. Les liens internes de ces pages vers d'autres pages doivent mener à des pages qui existent dans la maquette (`npm run audit:liens`) ; sinon, me le signaler avant de décider.
- Ne rien inventer. Tout texte nouveau va dans `docs/reformulations.md`, toute affirmation à justifier dans `docs/alertes-contenu.md`. Avis clients jamais modifiés.
- Où placer ces pages dans le menu : me poser la question avant de décider (rubrique du grand menu, plan du site, « Dans cette rubrique »). Une page non rattachée à une rubrique reste accessible par ses liens.
- Le blog et la presse sont des pages de liste : me dire d'abord combien d'articles elles contiennent et ce que tu proposes (reprendre la liste seule, ou aussi les articles).
- Respecter les règles de mise en page du `CLAUDE.md` (texte long en une colonne pleine largeur, deux photos l'une sous l'autre, aucune bande vide à côté des photos, blocs seuls en pleine largeur, pas de bandeau de remplissage).
- À chaque modification visible, me donner le lien local des pages concernées (http://127.0.0.1:4173/...).
- Quand les pages sont faites : `npm run audit` (liens, pages, axe, ancres, photos, alignement). Résultat attendu : 0 lien cassé. Mettre à jour `docs/suivi.md` et `docs/revue-pages.md` (les nouvelles pages s'ajoutent à la suite de la liste de revue, à relire par lots de 10).
- Ne pas déployer ni faire de git push sans mon accord explicite. Proposer le message de commit en français et attendre mon accord.

Pour finir : résumé de ce qui a changé (pages créées, liens réglés), de ce qui n'est pas fait ou n'a pas pu être vérifié.
```
