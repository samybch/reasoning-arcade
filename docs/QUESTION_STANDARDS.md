# Question standards

1. Only independently authored exercises. Do not reproduce official, licensed or paywalled exam questions.
2. Every item identifies track, game, competency and difficulty, and is translated into French and English.
3. There must be exactly one correct answer under the stated conditions.
4. Provide a clear explanation and why plausible distractors are wrong.
5. Data Sufficiency needs verified track-specific response mapping and nonambiguous quantifiers.
6. Editorial review is mandatory before publishing any new item.
7. Explanations must not claim a score-equivalent or official difficulty.
8. Label experimental, synthetic, and reviewed content explicitly.

## Sufficiency correction requirements

For every `enough-info` item, include `reviewSteps` in **both** translations, with exactly three detailed paragraphs. Step 1 tests statement (1) alone, step 2 tests statement (2) alone, and step 3 gives the correct A–E verdict, with counterexamples whenever insufficiency is claimed. These steps are part of the pedagogical content and must be reviewed for correctness and FR/EN equivalence. They are only exposed after an answer in game/review mode or at the end of a timed mini-test.

The standard A–E logic is documented by [GMAC's official sample questions](https://www.mba.com/exams/gmat-exam/about/sample-questions) and TAGE MAGE preparatory references; exercise wording is original and is not an official question reproduction.

## Critical-reasoning correction requirements

All `argument-lab` items now also require three bilingual `reviewSteps`: identify the claim or logical premise; examine the relevant evidence, assumption or alternative explanation; and state why the selected answer follows without overclaiming certainty. The headings adapt to the game, using the same reusable React component as sufficiency explanations.

A three-step explanation is a **teaching aid**, not evidence of official examination fidelity or independently certified correctness. Human editorial validation remains mandatory.

## Code Logic correction requirements

Every `code-logic` question now requires three original stages in FR and EN: identify a candidate rule, verify it against the examples, then explain the selected option. The same reusable `ReasoningBreakdown` interface shows the method only after an answer, or after the timed session ends.

**All 58 pilot items have structured steps, but none is independently certified as exam-equivalent or editorially approved.** Reviewers must still challenge possible alternative patterns, inconsistent illustrations, and the uniqueness of the answer.

## Quant Lab editorial checklist

For `quant-lab` items use IDs `T-C-XX` (TAGE MAGE Calcul) or `G-Q-XX` (GMAT Quantitative Problem Solving), five answer choices indexed 0–4, and three detailed FR/EN solution steps. Confirm the correct answer by an **independent arithmetic calculation**, test distractors, and verify that the prompt does not rely on a calculator or missing contextual assumptions. These are original pilot exercises, never official exam items.

## Mandatory review ledger

Each question ID must also appear **exactly once** in `docs/editorial-review-ledger.json` with a matching answer key and review focus. Source status `reviewed` requires a corresponding `approved` decision, accountable reviewer and date; and vice versa. A CI pass does not imply reviewer approval. Follow `docs/EDITORIAL_REVIEW_PROTOCOL.md`. A new question with no ledger entry must fail CI rather than silently bypass the editorial gate.
