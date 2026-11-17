# Résolution ciblée des ambiguïtés verbales — 17 novembre 2026

## Changements effectués (sans requalification éditoriale)

**T-A-02** — Le libellé initial « Quelle hypothèse est nécessaire à cette généralisation ? » pouvait transformer une **question de qualité méthodologique** en assertion de nécessité logique universelle. Il demande maintenant « Quel point faut-il vérifier en priorité avant de généraliser les résultats de ce sondage à toute la ville ? ». La version anglaise et les trois étapes d'explication sont harmonisées. La réponse D reste celle qui attire l'attention sur la représentativité des seuls abonnés interrogés ; le corrigé ne prétend plus que la représentativité est déjà démontrée.

**G-R-09** — Le choix B initial introduisait deux systèmes « également transparents » / « equally open », une comparaison non explicitement établie par le passage. Le nouveau choix B indique directement que des **rapports d'évaluation publics peuvent coexister avec l'anonymat des évaluateurs**, ce que le passage affirme sans hypothèse supplémentaire. Les deux explications FR/EN sont alignées. Le passage source commun aux trois questions du groupe reste strictement inchangé.

## Contrôles et limites

Le test `tests/verbal-clarity-regression.test.mjs` vérifie les nouvelles formulations FR/EN, les deux clés inchangées, les cinq propositions, les trois étapes de raisonnement et le maintien des décisions `pending` dans le registre. L'audit d'ancrages verbaux existant a été actualisé pour G-R-09.

Ces corrections sont des **améliorations éditoriales candidates** : une relecture indépendante doit encore résoudre les questions sans consulter les clés, challenger les distracteurs et confirmer l'absence de toute ambiguïté. Aucun reviewer fictif, aucune approbation automatique, aucun score officiel ou publication publique n'est introduit.

## Revue de démonstration privée

Le dossier de revue hors ligne généré par GitHub Actions reste le canal de préparation conseillé, car il affiche tous les exercices en FR/EN et permet d'exporter des remarques sans collecter de données personnelles. Il ne doit pas être confondu avec une mise en ligne publique ou une autorisation de diffusion du site.
