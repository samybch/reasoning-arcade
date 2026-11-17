# Audit Argument Lab + Reading Lab — 17 novembre 2026

## Périmètre

**30 exercices pilotes** : 12 Argument Lab (6 TAGE MAGE + 6 GMAT) et 18 Reading Lab (9 + 9), répartis sur **six passages originaux bilingues**, avec trois questions par passage. Les 94 éléments du catalogue restent `pilot` et leurs décisions éditoriales `pending`.

## Ce qui est vérifié automatiquement

- Une **table d'ancrages pédagogiques FR/EN** documente, pour chacun des 30 exercices, un fragment du contexte faisant office de preuve et un fragment du choix de réponse prévu. La CI confirme que ces fragments demeurent présents après une modification de texte ou un déplacement de réponse.
- Les six groupes de lecture doivent chacun contenir exactement trois questions distinctes ayant **le même passage dans une même langue**. Les deux langues sont vérifiées.
- Deux questions d'inférence *nécessaire* (`T-A-03`, `G-A-10`) bénéficient en outre d'une **vérification indépendante sur modèles logiques finis** : les prémisses impliquent les conclusions dans chaque situation admissible énumérée. Ces modèles n'approuvent pas les autres distracteurs à eux seuls.
- Le document `EDITORIAL_REVIEW_PROTOCOL.md` est corrigé : il mentionnait encore 12 questions et quatre passages, au lieu de 18 questions et six passages.

Le contrôle des fragments est une **protection contre les dérives éditoriales**, **pas une preuve que la bonne réponse est la seule correcte**. Pour les questions évaluatives (renforcement, affaiblissement, intention, ton), l'importance relative des arguments est contextuelle et la revue humaine demeure indispensable. L'absence de contre-exemple sur un modèle logique fini ne vaut pas preuve absolue d'alignement pédagogique.

## Points de revue humaine prioritaires

1. **G-R-09** (GMAT / transparence de l'évaluation scientifique) : le choix B indique que deux systèmes « également transparents » peuvent protéger différemment l'identité des évaluateurs. Le passage montre clairement que *rapports publics* et *anonymat* peuvent coexister, mais n'explicite pas un exemple de deux systèmes de degré de transparence égal. Un relecteur doit examiner si le qualificatif « également » / « equally » est justifié ou inutilement exigeant. **Aucun changement de réponse ou d'énoncé n'a été effectué.**
2. **T-A-02** (généralisation d'un sondage) : vérifier si la représentativité de l'échantillon est réellement une *hypothèse nécessaire*, plutôt qu'une condition simplement favorable, au regard des possibles coïncidences de préférences.
3. **G-A-09** (formation et baisse des coûts) : préserver le comparatif strict **économies > coûts supplémentaires** ; l'égalité n'abaisse pas les coûts.
4. **T-R-01 à T-R-03, T-R-04 à T-R-06 et G-R-01 à G-R-06** : examiner attentivement l'attribution de causalité et distinguer information observée, hypothèse concurrente et recommandation de contrôle.
5. **T-R-07 à T-R-09 et G-R-07 à G-R-09** : contrôler la nuance entre faits, interprétations, confidentialité des auteurs/évaluateurs et qualité des justifications. Préserver les modalités (*peut*, *pourrait*, *may*, *might*) dans les traductions.

## Protocole de décision

Le relecteur doit tenter chaque question **sans consulter la réponse stockée**, confronter les cinq options au passage entier, vérifier FR et EN, documenter explicitement le raisonnement et tout contre-exemple. Les constats ci-dessus sont des **alertes à examiner**, pas des verdicts d'invalidité. Aucune approbation automatique, aucune correction silencieuse de clé et aucune publication publique n'est autorisée par cette PR.

Le dossier HTML de revue hors ligne existant demeure disponible via l'artefact de CI ; les annotations y sont exportables au format JSON mais ne modifient pas le registre d'approbations.
