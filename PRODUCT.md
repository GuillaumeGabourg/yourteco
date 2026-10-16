# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + React + React Router + Framer Motion (`motion`) + Lenis, pré-rendu statique pour le SEO. Back office PocketBase + admin maison au thème du site (aperçu live PC/tablette/mobile). Choix validé par l'utilisateur dans le plan (v6).

## Users

- **Porteurs de projet d'habitat léger** : particuliers qui ont (ou cherchent) un terrain et veulent vivre en yourte, ouvrir un gîte/hébergement insolite, ou recevoir du public (ERP : collectivités, campings, hôtels, événementiel). Ils comparent, ont peur du piège administratif (permis, STECAL, RE2020) et de la qualité (isolation, durée de vie). Décision longue, budget élevé.
- **Autoconstructeurs et stagiaires** : personnes qui veulent construire leur yourte (kit + formation, stages de 3 à 4 semaines, chantiers participatifs).
- **Clients existants** : remplacement/réparation de toiles, Skydôme, isolants, produits d'entretien.
- **Éditeurs du back office** : l'équipe Yourteco (non technique) et le prestataire (mise à jour mensuelle des avis).

## Product Purpose

Site vitrine de Yourteco, fabricant français de yourtes contemporaines en bois (Daumeray, Maine-et-Loire). Son rôle : rassurer un acheteur d'habitat léger et transformer sa visite en **demande de devis qualifiée** (formulaire ou appel au 02 41 24 49 87). Succès = plus de demandes qualifiées, moins de questions de base au téléphone. Il s'agit d'une maquette de démonstration pour un prospect : envois non fonctionnels acceptés.

## Positioning

Fabricant (pas revendeur) qui conçoit, fabrique en atelier et installe des yourtes aux normes du bâtiment : calculs de structure, isolation jusqu'à 30 cm, conformité RE2020, accompagnement permis/STECAL, ERP. Deuxième moteur : la transmission (kits d'autoconstruction, stages). Accompagnement humain visible (le gérant répond à chaque avis).

## Operating Context

Visiteurs souvent sur mobile en phase de recherche, puis sur ordinateur pour comparer. Contenu existant riche (≈ 67 pages : modèles, réglementation, toiles, isolants, Skydôme, kits, location, EN/DE). Boutique séparée (yourteco-boutique.com), partenaire location YourtEvent.

## Capabilities and Constraints

- Textes repris mot pour mot du site actuel (orthographe corrigée uniquement). Ajouts signalés et à valider : bloc « étapes du projet », FAQ, formulaire de devis.
- Claims à faire valider par le client avant mise en ligne : « équipe de 12 » vs « une dizaine », « près de 20 ans », « premier fabricant », « Choix US », « certifiée », « label », « 100 % de permis acceptés », garantie 15 ans.
- Aucun prix ni délai publiés : ne pas en inventer.
- Avis : échantillon choisi, daté, avec lien vers tous les avis Google ; jamais de note calculée sur la sélection ni « avis vérifiés ».
- Langues : FR principal, EN et DE.

## Brand Commitments

Nom « Yourteco », logo existant, ton direct et engagé (éthique, écologie, habitat léger, made in France). Ne pas évoquer de label officiel.

## Evidence on Hand

- Photos réelles : `public/img/site/` (514 images du site actuel).
- Textes structurés : `src/content/pages/*.json` (scrapés du site).
- Avis Google : 4,9/5 sur 88 avis (relevé du 16/10/2026) ; 24 témoignages publiés sur le site ; Facebook 5,0 (13).
- Références : 8 yourtes ERP à Paris, Hôtel du Jeu de Paume (Versailles).
- Vidéo atelier YouTube `54tPZHlMY-Y`.
- Absent : prix, délais, chiffres de production, certifications officielles — ne pas fabriquer.

## Product Principles

1. Rassurer avant de séduire : chaque preuve (normes, isolation, garantie, permis) doit être visible sans lire un pavé.
2. Un seul geste principal : demander un devis (ou appeler).
3. Le vrai, rien que le vrai : contenus, photos et avis réels, ajouts toujours signalés.
4. Artisan, pas industriel : la matière, l'atelier et les personnes passent avant l'effet.

## Accessibility & Inclusion

Viser WCAG 2.1 AA (RGAA), respect de `prefers-reduced-motion`, cibles tactiles suffisantes, lisible sur mobile bas de gamme.
