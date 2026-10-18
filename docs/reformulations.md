# Reformulations et liens rétablis (à valider par Yourteco)

Le message d'origine est conservé. Les textes corrects n'ont pas été modifiés ; les avis clients ne sont jamais retouchés.

## Boutons rétablis (absents de la première maquette)

116 boutons de l'original n'avaient pas été repris (deux types de boutons du constructeur de pages : « pp-button » et « uabb-button »). D'où des phrases sans suite, par exemple :

| Page | Phrase | Bouton rétabli |
|---|---|---|
| Services / Tarifs | « Voici ce qu'il faut savoir... » | Voir les tarifs pour la livraison de votre yourte |
| Avis | « cliquez ci-dessous pour découvrir nos services ! » | Services et tarifs Yourteco |
| Construire sa yourte | « Cliquez ci-dessous pour avancer dans votre projet… » | Gamme et tarifs de kits auto-construction |
| Construire sa yourte | « Consultez l'ensemble de notre catalogue en cliquant ci-dessous ! » | Accédez à la Boutique Yourteco ! |

31 boutons qui ouvraient une fenêtre de message (« Envoyer un message ») sont retirés : le formulaire de devis les remplace.

## Liens affichés en adresse brute → boutons

| Ancien affichage | Nouveau libellé |
|---|---|
| `https://www.franceindustrie.org/formulaire-kit-communication/` | Accéder au formulaire France Industrie |
| lien PDF « yourteco-fabricant-made-in-france » | Télécharger le document (PDF) |
| lien PDF (avis DDTM sur un STECAL) | Télécharger le document (PDF) |
| liens Boutique Yourteco (Protextil, Cleantextil) | Voir le produit sur la Boutique Yourteco |
| lien Wikipédia (perméthrine) | Lire l'article sur Wikipédia |
| lien Reporterre | Lire l'article de Reporterre |
| lien interne RT 2012 | titre de la page cible |
| lien YouTube (yourte ERP) | lecteur vidéo intégré |

## « Sujets connexes »

Les accroches se terminaient par « Ce qu'il faut savoir... », « Réponse... », « Réponse dans le lien suivant… » ou « Par ici, les conseils Yourteco ! ». Chaque accroche devient une carte avec un bouton « Lire l'article » ; ces fins de phrase, devenues redondantes, sont retirées à l'affichage. Le texte source n'est pas modifié.

## Libellés de boutons ajoutés par la maquette

- Mur d'avis : « Lire la suite » / « Réduire ».
- Thème : « Passer au thème sombre » / « Passer au thème clair ».

## Menu par rubriques (textes nouveaux, à valider)

Le menu, le pied de page, le plan du site et le bloc « Dans cette rubrique » utilisent des libellés courts ; les titres des pages ne changent pas. Liste complète dans `src/content/menu.js`.

Phrases d'introduction ajoutées sous chaque rubrique du grand menu et du plan du site :

| Rubrique | Introduction |
|---|---|
| Nos yourtes | Habitation, loisir, accueil du public : des yourtes en bois fabriquées dans notre atelier du Maine-et-Loire. |
| En détail | Chaque élément de la yourte, de la charpente aux fondations, et les équipements pour y vivre toute l'année. |
| Toiles & entretien | Des toiles acryliques étanches et perspirantes, faites sur mesure, et les gestes pour les faire durer. |
| Autoconstruction | Construire sa yourte soi-même avec un kit, des plans et l'accompagnement de nos chantiers. |
| Réglementation | Permis, lois, normes thermiques et sécurité : ce qu'il faut savoir avant d'installer une yourte. |
| Yourteco | Une entreprise artisanale française : nos services, notre histoire et l'avis de nos clients. |

Libellés qui diffèrent nettement du titre de la page :

| Page | Titre d'origine | Libellé du menu |
|---|---|---|
| choisir-sa-yourte | Sécurité et yourte contemporaine : ce qu'il faut savoir | Sécurité de la yourte |
| nos-skydome | Toono : définition et caractéristiques | Toono (couronne) |
| montage-yourte | Montage d'un plancher d'une yourte contemporaine | Montage du plancher |
| plan-de-yourte | Treillis d'une yourte contemporaine | Treillis |
| la-poetique-de-lespace | Photos de yourtes contemporaines | Galerie photos |
| chiffres | Services et tarifs du fabricant | Services et tarifs |

## Interface en anglais et en allemand (nouveau, à valider)

Sur les pages anglaises et allemandes, le menu liste les 5 pages de la langue ; bandeau, boutons et pied de page sont traduits (fichier `src/content/ui.js`).

| Français | English | Deutsch |
|---|---|---|
| Demander un devis / Devis | Request a quote / Quote | Angebot anfordern / Angebot |
| Voir la boutique Yourteco / Boutique | Visit the Yourteco shop / Shop | Zum Yourteco-Shop / Shop |
| Yourteco, votre fabricant de yourtes | Yourteco, your yurt manufacturer | Yourteco, Ihr Jurtenhersteller |
| Yourteco est un fabricant de yourtes contemporaines français localisé dans le Maine-et-Loire. Nous construisons dans toute la France et à l'étranger. | Yourteco is a French manufacturer of contemporary yurts based in Maine-et-Loire. We build throughout France and abroad. | Yourteco ist ein französischer Hersteller moderner Jurten mit Sitz im Département Maine-et-Loire. Wir bauen in ganz Frankreich und im Ausland. |
| Nous trouver / Autres liens | Find us / Our pages | So finden Sie uns / Unsere Seiten |
| Vos transactions bancaires sur la Boutique Yourteco sont protégées par le référent Stripe. | Your payments on the Yourteco Shop are secured by Stripe. | Ihre Zahlungen im Yourteco-Shop sind durch Stripe geschützt. |
| Thème clair ou sombre | Light or dark theme | Helles oder dunkles Design |

Numéro de téléphone au format international (+33 2 41 24 49 87) sur les pages anglaises et allemandes.
À trancher : le bouton « Quote / Angebot » mène au formulaire de devis de l'accueil, qui est en français.

Texte retiré de la page `/modele/` (à votre demande) : « Visualisez quelques réalisations de Yourteco (extérieurs et intérieurs) en consultant le menu général de ce site Internet ! » (dernière section, seule sur sa ligne).

Page « Toile de yourte sur mesure » (`/les-toiles-de-yourtes/nos-toiles-de-yourtes-sur-mesure/`), section « Confiez-nous la réalisation de votre toile » : les trois étapes sont présentées en étapes numérotées. Les chiffres « 1 », « 2 », « 3 » collés au début des phrases deviennent des pastilles numérotées, la flèche « ⭣ » de l'étape 2 est retirée (le sélecteur de couleurs est maintenant à côté du texte), et un bouton « Devis » (vers le formulaire de l'accueil) accompagne l'étape 3. Les titres « Toits » et « Murs » deviennent les libellés du sélecteur de coloris d'origine (12 couleurs, noms d'origine), qui n'avait pas été repris à la copie.

Nouvelle page `/devis/` (demande de devis) : titre « Demander un devis », titre de l'onglet « Demander un devis de yourte contemporaine | Yourteco » et description « Demandez un devis pour votre yourte contemporaine en bois : habitation, loisir, ERP ou kit d'autoconstruction. Yourteco, fabricant dans le Maine-et-Loire. ». Le reste (texte sur le prix, coordonnées, formulaire) est celui du bas de l'accueil.

Pages de devis traduites `/quote/` (anglais) et `/angebot/` (allemand) : tout le formulaire (libellés, choix, messages d'erreur, texte de consentement, message de confirmation), le titre, la description, le texte sur le prix et le lien « en savoir plus » sont de nouvelles traductions, dans `src/content/devisText.js`, à faire valider. Le texte sur le prix renvoie vers la page « Buying a yurt » / « Jurte kaufen ». En anglais et en allemand, le code postal (3 à 10 lettres ou chiffres) et le téléphone (indicatif de pays) suivent des règles internationales, pas les règles françaises.

## 14 pages reprises du site d'origine (octobre 2026, à valider)

Les 2 articles du blog `/promotion-toiles-de-yourtes/` et `/auto-construction-yourte/` sont repris aussi ; les liens vers les pages « pièce jointe » WordPress de leurs photos sont retirés (la photo reste sans lien). Libellés de menu nouveaux : « Promotion sur les toiles », « Témoignages de chantiers ». Pages `/nos-photos/`, `/yourte-rt-2012/`, `/3d/`, `/blog/`, `/choisir-sa-toile-de-yourte/`, `/chapiteau-yourte-erp-diam-11-60-m/`, `/dome-yourte/`, `/nos-partenaires/`, `/photo-des-chantiers-participatifs/`, `/presse-medias-radio-journal-article-de-presse/`, `/une-yourte-ecole/`, `/yourte-en-bois/`. Textes, titres d'onglet, descriptions et images repris du site d'origine, mot pour mot. Extraction refaisable avec `outils/extraction/extraire-pages.py`. Ce qui diffère de l'original :

| Page | Changement | Pourquoi |
|---|---|---|
| Menu | Libellés courts nouveaux : « Réalisations » (groupe), « Galeries photos », « Yourtes en bois (Gandonnière) », « Planète Sauvage », « Yourte école », « Dôme de yourte », « Dix critères de choix », « Photos de chantiers », « RT 2012 et permis », « Modélisation 3D », « Presse », « Blog », « Partenaires » | Rattachement des pages aux rubriques (choisi avec Guillaume) |
| `/3d/` | Deux contenus externes (modèle 3D Sketchfab, vue Google Street View) affichés seulement après un clic, avec les textes nouveaux « Afficher le contenu » et « Hébergé par … : l'affichage charge leur site. ». Titres de ces deux cadres : « Modèle 3D d'une yourte Yourteco » et « Aperçu Google Street View de Yourteco » | Aucun cookie tiers avant accord, et titres obligatoires pour l'accessibilité. Sur l'original, les deux cadres se chargent d'emblée. |
| `/3d/` | Formulaire « Demande d'informations » et bloc « Appelez-nous ! » non repris | Le formulaire de devis et le bandeau du bas les remplacent (même règle que sur les autres pages) |
| `/nos-partenaires/` | Les 8 partenaires (logo, nom, description) sont présentés en cartes cliquables, au lieu d'une pile de boutiques. Logos YourtEvent et Yourt&Co réduits à 500 px de large. Le nom de chaque partenaire garde le lien du logo. | Les logos de 50 px de large étaient perdus dans de grands vides |
| `/presse-…/` | Le lien vers l'émission Radio G (« Ecoutez l'emission (23mn) ») n'est plus un lien : le fichier `.mp3` renvoie une erreur 404 sur le site d'origine. L'adresse YouTube du reportage France 3 devient un lecteur vidéo. Le second titre de niveau 1 (« C'est rigolo, c'est comme un champignon… ») passe en titre de niveau 3, et le titre de niveau 6 « Une yourte sur mesure » en niveau 3. | Un seul H1 par page, hiérarchie des titres valide |
| `/presse-…/` | Texte alternatif ajouté aux 4 logos de journaux cliquables, vides dans l'original : « Les Nouvelles de Sablé », « Ouest-France », « Courrier de l'Ouest », « Radio G » | Un lien sans texte est illisible pour un lecteur d'écran |
| `/presse-…/` | Logos Ouest-France, Courrier de l'Ouest et Radio G remplacés par des versions plus grandes (600 px, 600 px et 488 px) : les logos de l'original (80 et 120 px) restaient minuscules. Sources : Wikimedia Commons (Ouest-France, Courrier de l'Ouest) et le site de Radio G. Le logo des Nouvelles de Sablé (260 px) est gardé : introuvable en plus grand, le site `lesnouvellesdesable.fr` ne répond plus | Logos de marque : droit d'usage à faire confirmer par chaque média |
| `/blog/` | Les 22 extraits sont repris avec leur titre, leur texte et un bouton « Lire la suite » (le texte du bouton est celui du site d'origine). | Voir le suivi : 2 extraits mènent à des articles non repris |
| `/nos-photos/`, `/photo-des-chantiers-participatifs/` | Galeries reprises à pleine taille (les miniatures 150 px de l'original sont remplacées par les photos complètes liées) | Images au format naturel, jamais agrandies |
| Orthographe (`corrections.js`) | « Google StreeView » devient « Google StreetView » ; « » Se taire en classe… » devient « « Se taire en classe… » (guillemet ouvrant) | Fautes de frappe de l'original |

Les descriptions (balise méta) sont celles de l'original, fautes comprises (par exemple « Bretage » sur `/une-yourte-ecole/`).
