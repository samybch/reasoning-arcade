# Code Logic — mathematical property audit (2026-11-17)

## Scope

All 18 TAGE MAGE Code Logic pilot questions were audited without changing source answers or editorial decisions:

| Content family | Count | Mechanical test |
|---|---:|---|
| Number-sequence warm-ups (T-L-01–06) | 6 | Independently compute the proposed next term from a simple recurrence, verify its presence exactly once among five FR/EN options |
| Numeric categories (T-L-07–12, T-L-14–16, T-L-18) | 10 | Independently evaluate the specified property on every example and every answer; require exactly one option to qualify in both languages |
| Geometric categories (T-L-13, T-L-17) | 2 | Check structural regularity and 180° rotational symmetry against curated geometric models; verify bilingual option order |

Tests: `tests/code-logic-property-audit.test.mjs`. This is an automated finite/structural audit, not an outside human review.

## Essential mathematical limitation

**A finite sequence does not uniquely determine its next term without specifying a rule family.** For any function `p(n)` fitting four observed terms at indices 0–3, the function `p(n) + k·n(n−1)(n−2)(n−3)/24` fits those same four terms but changes the fifth term by `k`.

The regression test explicitly constructs an alternative fifth term from the distractors for **each of the six numerical sequences**. This does not mean the intended elementary pattern is arithmetically incorrect. It means an item is not a logically unique deduction unless the prompt constrains the family of allowed rules or an editorial convention establishes preference for the simplest pattern.

**Recommendation:** retain these six items as *warm-up puzzles* (already marked `warmup`), never present them as uniquely provable formal deductions, and ask an independent reviewer whether to append an explicit “simplest consistent elementary rule” framing. No question was automatically rewritten or approved.

## What remains outside the tests

Geometric invariants rely on a curated interpretation of French and English shape labels, so independent pedagogical reviewers must inspect the precise wording. Numeric classifiers test the *intended rule* and only the given distractors, not the absence of every imaginable alternative classification of six examples. Reviewers must still challenge ambiguity, suitability for TAGE MAGE, difficulty, originality, rights, and translation quality.

All **94 catalogue items remain pilot** and all ledger decisions remain pending. There is no public deployment or user-data collection.

## Suivi ciblé du 18 novembre 2026 — T-L-01

Le premier échauffement numérique T-L-01 précise désormais **la famille de règles permise** : un multiplicateur constant entre deux termes successifs. La conclusion 32 est alors déterminée parmi les choix affichés. La preuve d'ambiguïté ci-dessus reste pertinente pour des **termes pris seuls**, ainsi que pour les cinq autres échauffements dont l'énoncé ne précise pas le modèle de continuation. L'exercice reste `pilot` et nécessite une validation externe sur sa difficulté et sa pertinence.
