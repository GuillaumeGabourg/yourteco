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
