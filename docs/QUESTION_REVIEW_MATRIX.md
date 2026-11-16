# Pilot question reasoning audit — 2026-11-16

**Scope:** 36 original pilot questions. This is an **assistant-led initial reasoning/key consistency review**, not an independent subject-expert review or an official-exam calibration. All questions remain in `pilot` editorial status.

The tables document the expected key and essential reasoning for future contributors. They are also backed by `tests/answer-keys.test.mjs`, which catches changes to known answer locations or meanings. A passing test **does not prove** that a question has exactly one logically valid answer under every interpretation.

## Code Logic: numerical answers

| ID | Correct answer | First-pass rationale |
|---|---:|---|
| `T-L-01` | 32 | Each term doubles |
| `T-L-02` | 25 | Consecutive perfect squares |
| `T-L-03` | 21 | Constant difference +4 |
| `T-L-04` | 27 | Odd increments +3, +5, +7, +9 |
| `T-L-05` | 30 | Even increments +4, +6, +8, +10 |
| `T-L-06` | 1 | Each term divided by 3 |
| `T-L-07` | 48 | Only candidate divisible by 6 |
| `T-L-08` | 64 | Only candidate that is a perfect square |
| `T-L-09` | 75 | Only candidate is odd multiple of 5 |
| `T-L-10` | 60 | Only candidate divisible by 4 but not 8 |
| `T-L-11` | 29 | Only candidate is prime |
| `T-L-12` | 45 | Next triangular number |

## Argument Lab: selected option

| ID | Correct option | First-pass rationale |
|---|:---:|---|
| `T-A-01` | B | An alternative cause of increased park visitors |
| `T-A-02` | D | Representative sample is necessary for generalization |
| `T-A-03` | C | Club members who are students speak Spanish |
| `T-A-04` | E | Correlation does not establish causation |
| `T-A-05` | A | Holding test conditions constant reduces confounding |
| `T-A-06` | D | App non-users are missing from the premise |
| `G-A-07` | A | Fewer late-delivery complaints support causal mechanism |
| `G-A-08` | C | Automation is a competing productivity explanation |
| `G-A-09` | D | Training costs must be lower than the savings for total costs to decline |
| `G-A-10` | B | Holding permit logically implies completed training |
| `G-A-11` | E | Subway closure is a competing explanation |
| `G-A-12` | C | One cool, dry location cannot prove performance in every climate |

## Enough Info?: sufficiency class

A = statement (1) alone; B = statement (2) alone; C = both together only; D = either independently; E = insufficient even together. Response conventions must still be checked against current official guides before an exam-faithful release.

| ID | Class | First-pass rationale |
|---|:---:|---|
| `T-D-01` | A | Statement (1) fixes x=8; (2) does not |
| `T-D-02` | B | Statement (2) fixes x=8; (1) does not |
| `T-D-03` | C | x=6 only from the two simultaneous constraints |
| `T-D-04` | D | Each separately fixes x=5 given x>0 |
| `T-D-05` | E | Together n can be 5,6,7; parity varies |
| `T-D-06` | B | Statement (2) fixes x=-2; (1) does not |
| `G-D-07` | D | Each separately fixes x=7 given x>0 |
| `G-D-08` | A | The sign of x^3 determines x's sign |
| `G-D-09` | C | n=8 and p=5 are both needed for cost 40 |
| `G-D-10` | C | x²=9 and x<0 together fix x=-3 |
| `G-D-11` | D | Divisible by 6 or 9 each implies divisible by 3 |
| `G-D-12` | E | Even together 0<x<2 leaves the question open |

## Editorial release requirements

- Independent FR/EN reading: grammar, scientific correctness, distractors and quantifiers.
- Confirm the two exams' exact current specifications, category mapping and sufficiency answer convention.
- Verify difficulty and timing with a realistic sample of learners; scores must remain labelled **non-official**.
- Confirm originality and CC BY-SA 4.0 attribution per contributor.
- Record reviewer, date, disposition and changes in issue #3; move questions from `pilot` to `reviewed` only with approval.

**Risk:** Many current items are introductory and not comparable to official GMAT/TAGE MAGE question difficulty; especially avoid advertising them as a mock exam.
