# Points à faire valider par Yourteco

Maquette locale, non publiée. Textes repris du site actuel ; seule l'orthographe est corrigée à l'affichage.

## Affirmations à confirmer ou justifier avant mise en ligne

| Affirmation | Où | Pourquoi la vérifier |
|---|---|---|
| « notre équipe de 12 passionnés » | Accueil | Une autre page du site parle d'« une dizaine de salariés » |
| « près de 20 ans d'expérience » | Accueil | Association en 2007, SARL vers 2013 |
| « premier fabricant à équiper ses yourtes de membranes… » | Accueil | Superlatif à pouvoir prouver |
| « Bois du Nord de forte section (Choix US) » | Accueil | Terme technique à confirmer |
| « conception éco-responsable certifiée » | Accueil | Quelle certification ? |
| « yourte made in France labellisée Yourteco » | Accueil (prix) | Pas de label officiel connu |
| « garanties constructeur allant jusqu'à 15 ans » | Accueil | Conditions de garantie à afficher |
| « 100 % d'acceptation de permis de construire » | Page permis | Affirmation forte, à justifier |
| « au prix le plus juste » | Accueil | Formule commerciale, à garder avec prudence |

## Ajouts proposés (absents du site actuel)

- Bloc « Votre projet, étape par étape » (accueil) — rédigé uniquement avec des éléments déjà publiés.
- Formulaire de devis qualifié (accueil, `#devis`) — envoi simulé dans la maquette.
- Section d'avis « échantillon mensuel » avec mention légale et lien vers la fiche Google.
- Fourchettes du champ « budget indicatif » du formulaire et durée de conservation « 3 ans au plus » : à valider.

## Corrections d'orthographe appliquées

Voir `src/content/corrections.js` (fabication → fabrication, traditionelles → traditionnelles, veritable → véritable, haut de gammes → haut de gamme, constitue → constituent, résistantes → résistants, bien étendu → bien entendu, passionnées → passionnés, entreprenariat → entrepreneuriat…). Les avis clients ne sont jamais corrigés.

## Avis

- Note Google relevée le 16 octobre 2026 : 4,9/5 sur 88 avis.
- Dates des avis Google approximées depuis « il y a N mois » : à vérifier lors de la première mise à jour mensuelle.
- Reprise du texte d'avis Google en production : passer par l'API Google Places ou obtenir l'accord écrit des auteurs.

## Images cassées sur le site actuel

- `interieur-zome-serre.jpg` (page Zome-serre) et `Yourte_Maine_et_loire_copie-1.jpg` (page Montage) renvoient une erreur 404 sur yourteco.com : retirées de la maquette, à fournir par Yourteco.
- 117 images de l'original font moins de 500 px de large (logos, badges, schémas) : affichées à leur taille réelle, sans agrandissement flou. Demander les originaux en haute définition.

## Témoignages EN/DE à vérifier

- Pages `testimonials` et `kundenstimmen` : 4 témoignages attribués à des campings nommés (« Les Étoiles du Verdon », « Wilderness Retreat », « Green Valley », « Oasis Zen ») sans date ni auteur. Ils n'existent pas sur la page française. Si ce sont des exemples rédigés, ils ne doivent pas être présentés comme de vrais avis (art. L121-4 du Code de la consommation) : faire confirmer leur authenticité ou les retirer.
- Page Avis (FR) : textes des clients reproduits tels quels, jamais corrigés.

## 12 pages reprises du site d'origine (octobre 2026)

- **Presse (`/presse-medias-radio-journal-article-de-presse/`)** : articles de BRUDED, du Parisien, de France 3, de L'Alsace, d'Ouest-France, du Courrier de l'Ouest, des Nouvelles de Sablé et un résumé France Culture, reproduits en entier avec leurs photos et leurs logos. À faire confirmer : droit de reproduction auprès de chaque titre, ou remplacer par un extrait et un lien. Même chose pour les photos (Ouest-France, Courrier de l'Ouest).
- **Presse : données personnelles** : numéros de téléphone de personnes (élues de Plounéour-Brignogan-Plages, animateurs de Bouchemaine, « Mayourte, Marion Lusseau », mobile personnel de Nicolas Chailloux dans l'article du Courrier de l'Ouest) et chiffres de financement public (59 K€, 30 k€, 28 k€, 12 k€). Textes d'origine non modifiés : à faire valider ou retirer avant mise en ligne.
- **Presse : liens morts** : l'enregistrement Radio G (`/wp-content/mp3/yourteco_radio-g-angers.mp3`) n'existe plus sur le site d'origine. Demander le fichier à Yourteco.
- **`/yourte-rt-2012/`** : « permis de construire validé par la D.T.T. en avril 2013 », « première réalisation de yourte RT 2012 » : affirmations anciennes (2013), à confirmer ou dater.
- **`/dome-yourte/`** : « Temps de montage : 15 minutes » et « Très faible encombrement » (structure réalisée par Germain Coguic, toile par Yourteco), à confirmer.
- **`/chapiteau-yourte-erp-diam-11-60-m/`** : « 11.60 m de diamètre pour 100 m² au sol », « normes ERP » : surfaces et conformité à confirmer.
- **`/nos-partenaires/`** : liens vers `mayourte.net` (site en `http`, non chiffré), `yurtao.canalblog.com`, `autourdelayourte.unblog.fr`, `nouvel-er.com` : vérifier que ces sites existent encore.
- **Blog** : les extraits ne portent pas de date. `/promotion-toiles-de-yourtes/` annonce une « remise de 20 % » sur les toiles (promotion ancienne, à retirer ou dater).
