# Quant Lab — audit indépendant des calculs (17 novembre 2026)

## Périmètre et approche XYZ

Les **12 exercices Quant Lab** (6 TAGE MAGE, 6 GMAT) disposent désormais de tests qui recalculent leurs résultats **sans consulter leurs clés de réponse ni les explications rédigées**. La vérification porte sur les cinq propositions de chaque langue (FR et EN), les doublons numériques, les contraintes de domaine et les unités attendues.

| Sujet | Identifiants | Contrôles mathématiques |
|---|---|---|
| Pourcentages successifs et ventes | T-C-01, T-C-05 | Pourcentage appliqué au bon stock ou nouveau prix ; entier de billets et montant en euros |
| Débits et temps | T-C-02, G-Q-02 | Somme des débits, conversion heures → minutes, trois machines sur 18 minutes |
| Algèbre et systèmes | T-C-03, G-Q-03, G-Q-05 | Conditions simultanées ; solutions entières à deux chiffres, système réel et paire d'entiers pairs consécutifs |
| Géométrie | T-C-04 | Périmètre vs aire, longueur, largeur et m² |
| Probabilités | T-C-06 | Tirages sans remise, valeur rationnelle dans [0,1] |
| Moyennes pondérées | G-Q-01, G-Q-04 | Poids des effectifs ou du CA, milliers d'euros vs marge en % |
| Coûts et point mort | G-Q-06 | Marge contributive unitaire, couverture exacte des coûts fixes et nombre entier d'unités |

## Critères de réussite

Pour chaque exercice, le test `tests/quant-independent-audit.test.mjs` calcule un résultat à partir de paramètres explicitement reproduits du texte de l'énoncé. Il vérifie la présence d'**une seule proposition mathématiquement équivalente**, à l'indice de la clé du catalogue, dans les deux langues. Il cherche également les collisions numériques éventuelles entre propositions, par exemple quand une fraction serait équivalente à un autre format numérique.

Quelques cas sont contrôlés par **énumération de solutions admissibles** plutôt que par simple répétition de la formule de la correction. Les unités et le domaine sont soumis à des assertions séparées.

## Réserves importantes

Cet audit automatique contrôle les résultats mathématiques des **données actuellement écrites**. Il ne constitue pas une approbation éditoriale indépendante : il faut encore vérifier la compréhension des énoncés, les ambiguïtés, le vocabulaire français et anglais, la difficulté réelle, la pertinence pour chaque examen, l'originalité et les distracteurs. Aucun item n'est transféré automatiquement en statut `reviewed` ; l'ensemble des **94 items du catalogue demeure `pilot`**, avec validation humaine requise.

Les tests existants continuent de contrôler la structure du contenu et les interactions navigateur. Pas d'ajout de dépendance, de stockage distant ou de diffusion publique.
