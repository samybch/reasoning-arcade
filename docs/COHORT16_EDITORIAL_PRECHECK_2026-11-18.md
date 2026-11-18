# Pré-audit pédagogique de la première cohorte (16 exercices) — 18 novembre 2026

**Nature du travail : pré-audit documentaire et contrôles automatisés, non revue humaine indépendante.** La source reste `src/content/questions.json`. Les 94 questions sont toujours `pilot`, les 94 décisions du registre `pending`, aucun relecteur externe n'a approuvé d'exercice. Une correction de code ou de formulation n'est **pas** une autorisation de publication.

## X — Problèmes effectivement traités

1. **T-L-01 (suite)** : quatre nombres isolés admettent une infinité de prolongements. Le prompt FR/EN impose maintenant explicitement **le même multiplicateur** entre deux termes successifs. Les rapports observés valent 2, 2, 2 et conduisent à 32 ; il s'agit d'un échauffement guidé, non d'un test formel d'unicité de toutes les suites.
2. **T-E-02 (expression)** : la proposition B utilisant `malgré que` était contestable comme distracteur supposé absolument erroné. L'Académie française recommande d'éviter ce sens concessif, tandis que l'OQLF en relève l'usage courant ; une recommandation de registre n'établit donc pas une faute universelle. B emploie désormais `Malgré l'enquête soit limitée`, construction préposition + proposition finie sans `que`, au lieu de faire reposer l'unicité sur `malgré que`. Les 5 choix français restent identiques dans les interfaces FR/EN.
3. **G-A-09 (coûts)** : l'hypothèse « autres catégories de coûts inchangées » est ajoutée explicitement en FR/EN. Si `Δ coût total = coût formation − économies de rotation`, la baisse stricte requiert `économies > coût formation` ; l'égalité ne suffit pas. Les coûts autres que ces deux postes ne sont pas supposés avoir varié en secret.
4. **G-T-03 (tableau)** : le relevé est désormais explicitement un **instantané d'expéditions**, dont une partie des colis est encore en transit. « Retards » et « À l'heure » portent sur les colis déjà livrés ; le dénominateur de la seconde affirmation est **l'ensemble des colis expédiés**. Les clés de vérité restent `YYN`, sans modifier aucune ligne chiffrée.

Les quatre clés de référence restent inchangées : T-L-01 `2`, T-E-02 `0`, G-A-09 `3`, G-T-03 `YYN`. Toutes les corrections sont traduites et restent soumises à validation pédagogique externe.

## Y — Tableau de preuves et questions restant ouvertes

| ID | Vérification factuelle / logique ciblée | À faire vérifier indépendamment |
|---|---|---|
| T-A-02 | D demande une **vérification méthodologique** de représentativité ; aucune hypothèse universellement nécessaire n'est affirmée | Pertinence de D par rapport aux 4 distracteurs dans les deux langues |
| G-R-09 | Le passage décrit expressément la publication des rapports avec anonymat des évaluateurs : B est textuellement étayée | Nuances de modalité et interprétation de chaque distracteur |
| T-L-01 | Multiplicateur constant 2 → 32 (C) ; condition désormais dans la question | Difficulté pertinente d'un exercice très guidé |
| T-L-17 | Une rotation de 180° laisse invariants les exemples ; le parallélogramme D conserve cette propriété ; triangle et polygones réguliers impairs non | Exactitude des noms de figures et exhaustivité des alternatives |
| T-E-02 | `bien que` + subjonctif, accord `résultats méritent`, complément `mériter de` ; distracteur contesté remplacé | Relecture linguistique des cinq phrases et du niveau de langue |
| T-E-03 | « quelques » et « certains » expriment une quantité non chiffrée ; « aucun » interdit toute annulation : E respecte l'information existentielle et la négation | Sens pragmatique de « quelques » versus « certains » ; portée exacte |
| T-C-06 | Sans remise : `(4/9) × (3/8) = 1/6` ; réponse A présente une valeur unique | Clarté des probabilités conditionnelles et des distracteurs |
| T-R-02 | Visites du soir en hausse et de jour en baisse : possible déplacement d'horaires (D), **non prouvé** | Ne pas transformer une possibilité en causalité démontrée |
| T-D-05 | Individuellement insuffisantes, et ensemble `n ∈ {5,6,7}` ; la parité varie donc : E | Conventions de réponse TAGE et clarté de la question FR |
| G-D-13 | Trois montants >100 rendent la médiane >100. Une moyenne >100 n'est pas suffisante : [1,2,3,4,1000] et [101,102,103,104,105] produisent des médianes opposées | Vérification de l'ordre des quantificateurs et exemples positifs distincts |
| G-Q-04 | Marge pondérée : `0,6×20 % + 0,4×35 % = 26 %` (E) | Ne pas substituer la moyenne non pondérée |
| G-A-09 | Sous coûts restants constants, une baisse stricte demande économies > coût ajouté (D) | Vérifier l'énoncé d'hypothèse nécessaire, pas une simple option souhaitable |
| G-T-03 | Restes en transit A/B/C/D/E = **16/24/5/23/12** ; taux de retard expédiés A=4/80=5 %, E=3/60=5 % ; D a 140 expéditions >120 de B ; D a 110 livraisons dans les délais >85 de C. Clé `YYN` | Compréhension « expédié » versus « livré » ; format Table Analysis |
| G-M-03 | South observé : 60/80=75 % ; projeté 72/80=90 % : E ne présente pas une projection comme un fait | Distinguer causalité prouvée et prévision dans les cinq choix |
| G-I-02 | Q4/Q2 = 60/30 = **200 % du niveau**, soit +100 % seulement ; Q3−Q1 = 45−20 = 25 milliers. Paire C/A | Bien distinguer pourcentage d'un niveau et hausse en pourcentage |
| G-P-02 | `8n−240=0` → 30 ; `8n−240=160` → 50. Paire C/E | Vérifier unités et correction de la matrice à deux réponses |

**Portée :** les calculs indépendants vérifient des cas déterminés et les textes sont lus par un assistant. Cela ne démontre pas à lui seul la singularité pédagogique de toutes les réponses, ni une difficulté similaire à l'examen réel. Ne pas enregistrer `reviewed` / `approved` à partir de ce tableau.

## Z — Protections et procédure de décision

- Nouveau test `tests/first-cohort-semantics.test.mjs` : 16 items toujours en attente, multiplication explicite, syntaxe non contestée, hypothèse coûts constants, partition des colis et clé recalculée `YYN` sur les données. Les tests existants couvrent les autres calculs et la cohérence FR/EN.
- Une seule branche/PR XYZ, validation CI complète, puis squash merge si verte. **Aucun déploiement GitHub Pages**.
- Le fichier HTML de relecture hors ligne (CI `reasoning-arcade-offline-review`) reste le support pour les **vrais relecteurs**. Ils doivent résoudre chaque énoncé avant d'ouvrir la réponse, commenter les cinq alternatives, exporter leurs notes et consigner les preuves dans [l'issue #3](https://github.com/samybch/reasoning-arcade/issues/3) sans données personnelles.
- La décision signée `approved`, avec relecteur et date, ne peut être prise qu'après contrôle réel par une personne indépendante et une PR éditoriale vérifiée. Les 78 autres questions ne sont pas considérées comme validées non plus.

## Références de cadrage (ne pas reproduire de questions officielles)

- Académie française, dictionnaire, entrée « malgré » : https://www.dictionnaire-academie.fr/article/A9M0342
- Office québécois de la langue française, emploi de « malgré que » : https://vitrinelinguistique.oqlf.gouv.qc.ca/22935/la-syntaxe/les-conjonctions/emploi-de-la-conjonction-malgre-que
- GMAC / mba.com, structure actuelle et programmes de compétences : https://www.mba.com/exams/gmat-exam/about/exam-content
- FNEGE / TAGE MAGE, présentation des sous-tests : https://www.tagemage.fr/page/sous-tests

Les références d'organismes d'examen servent uniquement à comparer les **familles de compétences** et les conventions ; aucune affiliation, certification ni équivalence de score ne sont revendiquées.
