# Content quality gate — original 46-question typed JSON pilot bank

**Status 2026-11-16: NOT EDITORIALLY APPROVED FOR RELEASE.** Structural validation is automated; scientific calibration and bilingual editorial review remain pending.

## Current pilot allocation

| Track | Game | Count | Distinct IDs |
| --- | --- | ---: | --- |
| TAGE MAGE | Code Logic | 18 | T-L-01–18 |
| TAGE MAGE | Argument Lab | 6 | T-A-01–06 |
| TAGE MAGE | Enough Info? | 6 | T-D-01–06 |
| GMAT | Argument Lab | 6 | G-A-07–12 |
| GMAT | Enough Info? | 10 | G-D-07–16 |

The 46 items are available in both French and English, for 92 language versions.

## Preliminary check

- All 12 Code Logic items and 12 Data Sufficiency pilot items were inspected for answer-key consistency; no obvious conflicting answer found in that manual sample. This **is not** a full independent expert validation.
- The fixed A/B/C/D/E meanings used for sufficient information agree with published TAGE MAGE preparation descriptions. Verify against the active official exam guide before release.
- Critical Reasoning items are basic skill demonstrations, often much easier than full official exam questions. Do **not** call them equivalent to real exam items.
- The bank is too small for rigorous five-level difficulty calibration, and the adaptive model remains heuristic.
- No official question, exam mark, percentile or score equivalence is asserted.

## Required editorial review per question

1. Can the correct answer be proven? Could a distractor also be valid?
2. Is the solution explanation accurate, sufficiently detailed, and clear in both languages?
3. Do the French and English texts preserve the same problem, quantifiers, options and units?
4. Does the item actually train the advertised exam skill? Avoid misleading claims.
5. Is the reported difficulty reasonable relative to our internal pilot levels (not official scores)?
6. Is it original, with no prohibited reproduction, logos or unlicensed images?
7. Is its review recorded with an independent reviewer and decision?

## Evidence and references for the response conventions

- [TAGE MAGE official website](https://www.tagemage.fr/)
- [TAGE MAGE preparation extract — Conditions minimales, A–E meanings](https://www.editions-ellipses.fr/PDF/9782340103696_extrait.pdf)
- [GMAT content overview](https://www.mba.com/exams/gmat-exam/about/exam-content)

All 46 question statuses remain **pilot**, pending independent editorial sign-off.
\nCurrent GitHub tracking: [Issue #3 — pedagogical review](https://github.com/samybch/reasoning-arcade/issues/3).

## Source of truth

The active single source is `src/content/questions.json`. The old standalone design prototype is archived at `reference/preview.html` and is not part of the deployed site.

## Bilingual remediation — 2026-11-16

Six GMAT Critical Reasoning exercises (`G-A-07` through `G-A-12`) had English prompts, contexts and answer options under the French locale. These have been fully translated without changing answer indexes, the English originals or core logic. Automated checks now flag obviously untranslated English phrases and duplicate choices. This is a preliminary content improvement, not independent pedagogical certification.

## Traceable answer-key matrix

A 36-item answer-key and reasoning matrix was added in [QUESTION_REVIEW_MATRIX.md](QUESTION_REVIEW_MATRIX.md), with automated reference checks. This is **first-pass internal verification only**, not independent exam-level quality certification.

## 16 bilingual step-by-step sufficiency corrections (16 November 2026)

The 16 pilot data-sufficiency items now have structured FR/EN correction stages for (1) alone, (2) alone, and the combined A–E verdict. The text includes counterexamples for insufficient statements, which are more informative than a short answer-key explanation. Structural checks and two browser scenarios were added. This **does not** amount to independent pedagogical approval: keep all 46 items in `pilot` status until reviewed.
