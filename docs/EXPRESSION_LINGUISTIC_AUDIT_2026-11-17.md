# Expression Lab — audit linguistique ciblé (17 novembre 2026)

## Périmètre et prudence

Les **six questions TAGE MAGE Expression Lab** disposent maintenant d'un contrôle automatisé spécifique (`tests/expression-linguistic-audit.test.mjs`). Les cinq choix sont rédigés en **français**, même dans l'interface anglaise : le parcours EN fournit un guidage pédagogique, mais ne transforme pas l'exercice en test officiel d'anglais.

| Exercice | Type de contrôle | Point de vigilance indépendant |
|---|---|---|
| T-E-01 | Accord du participe passé avec COD antéposé `données` (féminin pluriel) et accord `confirment` avec le sujet | S'assurer que la formulation n'admet aucune variante incorrectement rejetée |
| T-E-02 | `bien que` + subjonctif `soit`, sujet pluriel `résultats méritent`, construction `mériter de` | **« Malgré que »** peut faire l'objet de discussions d'usage et de registre ; évaluer s'il faut expliciter « français écrit standard soigné » plutôt que prétendre à une interdiction universelle |
| T-E-03 | Conservation des quantificateurs « quelques / certains » et de la négation « aucun » | Le test énumère les ensembles finis possibles d'ateliers ; faire vérifier l'usage exact de « quelques » selon le contexte |
| T-E-04 | Possibilité conditionnelle « n'exclut pas » ≠ décision ou garantie | Vérifier les modalités et la portée du `si` dans FR/EN |
| T-E-05 | La hausse relative des dépenses plus rapide que celle des ventes ne garantit **ni** amélioration **ni** diminution du résultat | Deux exemples numériques donnent des évolutions opposées du résultat avec les mêmes taux de croissance (+10 % ventes, +20 % dépenses). Le résultat dépend des montants initiaux |
| T-E-06 | `Néanmoins` introduit une réserve après un bénéfice exposé | Une transition plus libre pourrait être acceptable dans un autre ensemble de propositions : ce test compare uniquement les cinq choix actuels |

## Portée des tests

Chaque question possède exactement cinq propositions françaises identiques dans les deux interfaces ; des prédicats **liés aux cinq options actuelles** détectent un changement accidentel de sens ou de clé. Le test de T-E-03 utilise une table de vérité finie ; le test de T-E-05 construit deux contre-exemples arithmétiques. Ces vérifications fournissent des éléments de preuve limités : **elles ne constituent ni un parseur général du français ni une certification linguistique ou pédagogique**.

**Aucun contenu ni statut de question n'est modifié.** Les six décisions restent `pending` dans le registre éditorial. Avant approbation, demander une relecture française indépendante, une lecture des indications en anglais et une confirmation documentée des distracteurs, de l'originalité et de la difficulté.

## Bilan catalogue

Après cet audit, **94/94 exercices possèdent un contrôle thématique spécifique** dans le dépôt. C'est une **couverture de tests**, non un nombre de questions approuvées. La publication publique reste interdite sans feu vert distinct et revue humaine effective.
