# XYZ pedagogical first-pass audit — 2026-11-17

**Scope:** 70 original bilingual pilot questions; static answer-key and format sampling, quantitative key distribution, official exam syllabus comparison, and risk-focused inspection. **This is not independent editorial approval. All 70 remain `pilot`, with ledger decisions `pending`.**

## Measured catalogue distribution

| Game | Questions | Declared difficulty (levels 1–5) | Average pilot seconds |
|---|---:|---|---:|
| Code Logic | 18 | 3 / 5 / 4 / 4 / 2 | 95 |
| Argument Lab | 12 | 2 / 4 / 4 / 2 / 0 | 125 |
| Enough Info? | 16 | 3 / 4 / 5 / 4 / 0 | 132 |
| Quant Lab | 12 | 0 / 5 / 5 / 2 / 0 | 121 |
| Reading Lab | 12 | 0 / 4 / 6 / 2 / 0 | 136 |

Difficulty ratings and solve times are author estimates, not empirically calibrated or official exam scales.

## Finding P1 — predictive Quant Lab key position (fixed in the accompanying code PR)

Before the correction, 12/12 quantitative answer keys were at C (8) or D (4). This creates a test-taking shortcut unrelated to reasoning. The PR reorders the *same five options* for each quantitative item in both languages, preserving the original correct numerical result and all solution steps. New A–E distribution across the 12 questions is **3 / 3 / 2 / 2 / 2**, with all five positions represented in each track's six-question bank. Source `correctAnswer`, pending reference keys in the editorial ledger, and independent arithmetic regression tests are synchronized. This does **not** constitute checking the actual mathematics independently by a human.

## Finding P2 — narrow Reading Lab content diversity (open)

All four current reading passages mainly test causal attribution, comparison controls, and alternative explanations. These are valuable skills, but the sample is narrow. Before increasing the catalogue, independently assess coverage of factual synthesis, competing viewpoints, author tone, argument structure, and the distinction between supported inference and speculation. Do not create quasi-official claims from these 12 items.

## Finding P2 — introductory questions and uncalibrated difficulty (open)

Six numerical sequence questions are correctly labeled `warmup`. Other items may also be easier than actual exam conditions; the claimed 1–5 difficulty and timer estimates are not validated by learner observations. Run an opt-in pilot and collect question ID, estimated difficulty, time-to-answer bands and ambiguity reports without transmitting local progress by default.

## Finding P2 — partial official syllabus coverage (open)

Official GMAT has Quantitative Reasoning (problem solving), Verbal Reasoning (reading comprehension and critical reasoning) and Data Insights (Data Sufficiency **plus** Multi-Source Reasoning, Table Analysis, Graphics Interpretation and Two-Part Analysis). The latter four formats are not implemented. Official TAGE MAGE includes Compréhension, Calcul, Raisonnement / Argumentation, Conditions minimales, Expression and Logique; the **Expression** sub-test is not implemented. Sources checked 2026-11-17:

- https://www.mba.com/exams/gmat-exam/about/exam-content
- https://www.tagemage.fr/page/sous-tests

The site should continue to describe itself as *skill practice*, not a full official exam simulator.

## Risk-focused manual spot check (not sign-off)

- `T-L-12`: triangular numbers lead to 45; challenge alternate rules in an independent review.
- `T-L-16`: reverse-digit primality leads to 79; ask a reviewer to verify each rejected reversal.
- `T-L-17`: center symmetry makes the nonrectangular parallelogram plausible; confirm geometric terminology in FR/EN.
- `G-A-09`: total cost reduction strictly requires turnover savings greater than added training expense, not equal.
- `G-D-13` to `G-D-16`: the supplied sufficiency reasoning appears internally consistent on first reading, but all positive/zero boundary cases and counterexamples require independent checks.
- Reading Lab: all 12 indexed keys should be challenged against each complete passage, all 48 distractors and the FR/EN translations.

## Gates before public release

- [ ] Independent FR/EN correctness, distractor, ambiguity, rights and difficulty review of 70 items, recorded per question
- [ ] Human review of the updated quantitative option order and answer keys
- [ ] Controlled mobile and desktop usability testing, including accessibility checks
- [ ] Official taxonomy/claims review before exam mapping publication
- [ ] Legal/privacy/trademark release gates and explicit owner's public-launch approval

The code-quality CI must pass before this batch is squash-merged into `main`. The GitHub Pages workflow must not be invoked.

## Reading Lab follow-up — 2026-11-17

Six additional original bilingual pilot items were added on two new passages: museum interpretation and scholarly peer review. This broadens viewpoint comparison, argument structure, synthesis, and author tone beyond the initial causal-inference emphasis. The original audit statistics above are a historical 70-question snapshot and must not be represented as post-expansion totals. All added items remain unreviewed pilots.
