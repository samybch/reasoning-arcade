# XYZ — Pilot answer-key distribution audit (2026-11-17)

This is an **automated, descriptive audit**, not an independent educational review. Source: `src/content/questions.json` at the time of PR #29. All **94 questions remain pilots**, with editorial records pending. Letter distributions can be misleading for fixed-semantic response formats (such as Data Sufficiency): **never change a correct semantic answer simply to make the counts look balanced.**

## Answer-key patterns worth reviewing

| Track and game | Correct-answer frequency | Risk and recommended action |
|---|---|---|
| GMAT Enough Info? / Data Sufficiency (10 questions) | A 2, **B 0**, C 4, D 3, E 1 | A test-wise student never needs to choose B if they recognize the tiny bank; add *new, independently solved* statement-(2)-alone items after review, not relabel existing cases |
| TAGE MAGE Code Logic (18 questions) | A 0, B 4, C 7, D 5, E 2 | A never occurs; test answer-position diversity for newly contributed logic questions and independently challenge the claimed rules and distractors |
| TAGE MAGE Quant Lab (6 questions) | A 2, B 1, C 1, D 1, E 1 | No missing answer positions |
| GMAT Quant Lab (6 questions) | A 1, B 2, C 1, D 1, E 1 | No missing answer positions |
| TAGE MAGE Expression Lab (6 questions) | A 2, B 1, C 1, D 1, E 1 | No missing answer positions |

**Interpretation:** These are patterns in an intentionally small pilot bank, not evidence of question invalidity or official test equivalence. The ten GMAT Enough Info? items use A–E as *logical categories*, not interchangeable option text; moving the labels would be incorrect. Original Code Logic option ordering can be changed, but only after checking both FR/EN answers and corresponding editorial ledger keys, with separate test coverage.

## User-visible usability issue addressed in this batch

The landing page formerly displayed the total number of distinct games (10) irrespective of the selected track. However, it only presented **six playable cards in TAGE MAGE** and **eight in GMAT**. The headline counter is now computed from the very same filtered game list as the cards. A two-language Chromium test validates 6 → 8 → 6 when switching tracks, while the total of 94 pilot questions remains stable.

## Editorial and user-testing gates

1. Complete independent FR/EN review for correctness, ambiguity, option quality and original rights of **94/94** items; do not mark any approved automatically.
2. Add new questions that genuinely fill missing logical outcome categories, with independent proofs and reviewer sign-off; preserve the existing source of truth and the pending ledger.
3. Recruit voluntary, consent-based pilot users for keyboard, mobile, clarity, difficulty, and feedback tests **only after** the owner explicitly approves any public launch. Do not collect usage analytics, personal data or change local-only progress without separate agreement.
4. Keep the site unpublished, the CI green, and use one reviewable, squash-merged PR per coherent issue.

No public deployment, paid service, tracking or automatic editorial approval is part of this audit.
