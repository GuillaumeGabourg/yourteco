# Méthode : mener un projet de site avec Claude Code

L'idée de base : **la conversation est jetable, les fichiers sont la mémoire du projet**. Tout ce qui doit durer (décisions, règles, état du projet, outils de test) va dans un fichier du projet. Une session sert à faire un chantier, puis on la ferme.

## Étape 0 : préparer le dossier (une fois)

1. Créer le dossier du projet et ouvrir une session dessus.
2. Premier message : « initialise le dépôt git ». Avoir un commit à chaque étape permet de revenir en arrière.
3. Le `CLAUDE.md` global (règles de mise en page, ancres) s'applique déjà à tous les sites. Rien à refaire.

## Étape 1 : session « cadrage »

**But :** comprendre le client et décider, sans écrire de code.

- Passer en **mode plan**, puis écrire par exemple : « Analyse le site actuel, la cible, la concurrence. Propose un plan de refonte. »
- Corriger le plan autant de fois que nécessaire. C'est l'étape où changer d'avis ne coûte rien.
- À la fin, demander : « écris PRODUCT.md, docs/suivi.md avec les jalons, et l'inventaire des pages ».
- **Fermer la session.** Tout ce qui compte est maintenant dans des fichiers.

## Étape 2 : session « fondations »

**But :** poser le socle technique et les outils, avant le design.

- Récupération des contenus et des photos du site d'origine.
- Mise en place de la pile technique et du gabarit des pages.
- **Les scripts d'audit dans le projet dès le premier jour** (`outils/audit/`, `npm run audit`). On peut repartir de ceux de Yourteco.
- Le **`CLAUDE.md` du projet** : commandes, organisation du code, règles propres au client.
- Faire un commit, puis fermer la session.

## Étape 3 : une session par chantier (le cœur du travail)

Un chantier est un ensemble cohérent : « l'accueil », « le menu », « les traductions », « le back office ».

**Message d'ouverture type :**

> Chantier : traductions EN/DE.
> Problèmes : les menus et le pied de page restent en français [capture].
> Attendu : tout traduit, drapeaux dans la barre.
> Contraintes : ne pas toucher aux pages FR.

**Pendant le chantier :**

- **Regrouper les retours dans un seul message**, avec les captures. Cinq retours d'un coup coûtent bien moins cher que cinq allers-retours.
- Un retour sur le chantier en cours est un ajustement : l'envoyer quand on veut.
- **Un sujet sans rapport se garde pour une autre session.** Le noter, ou demander d'ouvrir une session pour ce sujet.
- Pour voir le résultat : « montre en local ».

**Pour finir un chantier, une phrase suffit :**

> « Lance les audits, mets à jour docs/suivi.md et fais le commit. »

Fermer ensuite la session. Le chantier suivant démarre dans une session neuve.

## Étape 4 : vérification avant de montrer au client

- `npm run audit` : pages, accessibilité, ancres, images, alignement. Claude en lit les résultats, en une ligne chacun.
- Une seule série de captures, à 1440 et 375 px, pour l'œil humain.
- Le contrôle automatique ne remplace pas le jugement : c'est mon regard qui valide le rendu.

## Étape 5 : publication

- Toujours sur demande explicite : « publie sur GitHub Pages ».
- Claude publie, puis vérifie le site en ligne.
- Les points à faire valider par le client restent dans `docs/` : je les lui transmets.

## Plusieurs chantiers en même temps

Deux chantiers indépendants peuvent avancer en parallèle, chacun dans sa session. Par exemple, le back office d'un côté et des corrections du site public de l'autre. Il suffit de demander : « lance le back office dans une session séparée ». Chaque session travaille dans sa propre copie (une branche), et on les fusionne ensuite.

## Quand compacter, quand changer de session

| Situation | À faire |
|---|---|
| Chantier fini | Nouvelle session (pas de compactage) |
| Contexte vers 70–80 % en plein chantier | Compacter, en disant ce qu'il faut garder : `/compact garde les mesures du logo et les fichiers modifiés` |
| Contexte à 40 % | Rien, continuer |
| Claude semble oublier une décision ancienne | Elle doit être écrite dans `CLAUDE.md` ou `docs/suivi.md` : demander de l'ajouter |
| Une règle est répétée pour la deuxième fois | « Ajoute cette règle à CLAUDE.md » (ou à la mémoire si elle vaut pour tous les sites) |

Le compactage remplace l'historique par un résumé : les décisions sont gardées, les détails sont perdus (extraits de code exacts, raisons d'un réglage, messages d'erreur). Chaque compactage ajoute une perte. C'est pourquoi il vaut mieux finir un chantier et changer de session.

## Ce qui remplit le contexte

- **Les captures d'écran**, qui pèsent lourd : en faire peu, plutôt à la fin.
- **Les gros fichiers lus en entier** : il vaut mieux y chercher un passage précis.
- **Les longs résultats de tests** : les scripts n'affichent qu'une ligne de synthèse, et le détail est écrit dans un fichier.
- **Les retours en arrière sur un même sujet** : décrire clairement l'attendu dès le premier message.

## Les fichiers et leur rôle

| Fichier | Contenu | Mis à jour |
|---|---|---|
| `~/.claude/CLAUDE.md` | Mes règles pour tous les sites | Sur demande |
| `CLAUDE.md` du projet | Comment travailler sur ce projet | Quand quelque chose change |
| `PRODUCT.md` | Le client, la cible, les contraintes | Après le cadrage |
| `docs/suivi.md` | Fait / à faire / en attente | À chaque fin de chantier |
| `docs/reformulations.md`, `docs/alertes-contenu.md` | Ce que le client doit valider | Au fil de l'eau |
| `outils/audit/` | Les vérifications automatiques | Quand une règle s'ajoute |
