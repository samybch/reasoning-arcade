# Consolidation XYZ — couverture des audits pédagogiques pilotes (17 novembre 2026)

**Statut : 94 exercices pilotes / 94 en attente de validation humaine indépendante.** Les tests de CI vérifient des propriétés ciblées ; ils ne valident ni l'alignement officiel à un examen ni l'absence générale d'ambiguïté. Aucune mise en ligne publique n'est autorisée.

| Groupe | Exercices | Audit automatisé ou manuel préparatoire | Limites |
|---|---:|---|---|
| Data Sufficiency / Enough Info? | 16 | Modèles de mondes possibles : contre-exemples à l'insuffisance, compatibilité logique des clés | Monde fini ; les cas suffisants nécessitent une preuve générale |
| Code Logic | 18 | Règles numériques et géométriques indépendantes sur les exemples et options | Six suites à continuation non unique hors convention de simplicité |
| Quant Lab | 12 | Recalculs indépendants, unités, réponses équivalentes, contraintes entières | Nécessité de relire contexte, clarté et distracteurs |
| Argument Lab + Reading Lab | 30 | Ancrages FR/EN preuve/réponse, cohérence des six textes, deux tests de déduction logique | L'ancrage textuel ne démontre pas à lui seul l'unicité de la meilleure réponse |
| Table Lab / Multi-Source Lab / Graph Lab / Two-Part Lab | 12 | Recalculs des 3 × 3 assertions/couples, des observations, du budget temporaire et des projections, dans les deux langues | Les ancrages de source des questions Multi-Source et les deux langues nécessitent une lecture indépendante |
| Expression Lab | 6 | Validation structurelle, trois étapes d'explication et tests existants | **Audit linguistique indépendant spécifique restant à faire** |
| **TOTAL** | **94** | **88 couverts par un audit thématique ciblé + 6 à auditer spécifiquement** | **Aucun approuvé automatiquement** |

## Data Insights — résultats et risques du contrôle ciblé

Les données originales des 12 exercices servent aux calculs des tests dans `tests/data-insights-independent-audit.test.mjs`.

- **G-T-01–03 / Table Lab :** recalcul des trois affirmations par question à partir des lignes chiffrées, vérification de la médiane, des taux, des maxima et des conditions strictes ; attention au ratio de West égal **exactement à 25 %** (il ne satisfait pas « strictement inférieur »).
- **G-M-01–03 / Multi-Source :** North 92/100 = 92 %, South 60/80 = 75 %, Remote 34/40 = 85 %. South passerait à **90 % projetés** (72/80), sans preuve observée de l'effet. Avec logiciel, coût prévu de **3 400 € sur trois mois avec aide**, puis **3 600 € sans aide**, au-dessus du plafond de 3 500 €. L'aide est temporaire, non acquise au-delà.
- **G-I-01–03 / Graph Lab :** recalcul du maximum (D=80), de l'écart (20), du rapport de niveaux Q4/Q2 (200 %), de la hausse absolue Q3–Q1 (25), de l'agrégation N+W (95) et du compte strictement supérieur à 45 (2 zones).
- **G-P-01–03 / Two-Part :** les paires attendues sont respectivement **80/40 heures**, **30/50 unités** et **72/32 commandes** ; toutes les bonnes réponses doivent être trouvées ensemble.

Ces contrôles sont des **tests de cohérence sur un jeu de données déterminé**. Ils ne constituent pas une garantie générale que les libellés des cinq options, les raisonnements de tous les distracteurs, la méthode de notation et les traductions ont été évalués de façon indépendante.

## File prioritaire de revue humaine

1. **G-R-09 :** expliquer « également transparents » / « equally open » à partir du seul passage ; vérifier que l'inférence ne va pas au-delà des prémisses.
2. **T-A-02 :** distinguer la nécessité logique de la représentativité de la simple justification méthodologique d'une généralisation.
3. **G-A-09 :** confirmer que l'hypothèse essentielle exige économies strictement supérieures au coût ajouté.
4. **T-L-01–06 :** décider si le statut « échauffement, règle élémentaire la plus simple » rend l'ambiguïté inhérente aux suites acceptable.
5. **G-T-03 :** relire la définition de « livrés à l'heure » comme *sous-ensemble* des colis et éviter de supposer que « late + on time = total » lorsque les valeurs ne l'impliquent pas.
6. **G-M-02–03 :** vérifier la nuance coûts *prévus*, aide *temporaire*, efficacité *non démontrée* en FR et EN.
7. **G-I-02 :** ne pas confondre « 200 % **du niveau** de Q2 » et « hausse **de 200 %** ».
8. **Six questions Expression Lab :** audit séparé du français, des présupposés, de la modalité et des traductions pédagogiques en anglais.
9. **Toutes les 94 fiches :** résoudre indépendamment, contredire les distracteurs, vérifier les droits, la difficulté et le niveau de l'examen avant toute approbation.

## Processus

Utiliser le fichier HTML de revue hors connexion généré par la CI, exporter les remarques JSON avec l'empreinte du catalogue, demander une revue humaine et n'intégrer une décision dans le registre éditorial que dans une PR révisée avec preuves, relecteur et date. Les rapports automatiques restent **distincts** des décisions humaines `approved`. Garder les cycles XYZ sur une branche courte et une seule PR fusionnée en squash lorsque toute la CI est verte ; aucune publication publique, aucune télémétrie ni dépenses.
