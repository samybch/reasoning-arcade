# XYZ — Independent finite-world checks for Data Sufficiency (2026-11-17)

## Scope and method

The source contains **16 Data Sufficiency / Enough Info? pilot questions** (6 TAGE MAGE and 10 GMAT). The executable `tests/sufficiency-witnesses.test.mjs` models each question with explicitly constructed possible worlds, two independent statement predicates, and the target answer.

For each statement used alone, and the two statements together:

- **Insufficient:** the test requires at least two feasible worlds that satisfy the same available statement(s) but give *different target answers*. This is a constructive counterexample showing why the given information cannot determine an answer.
- **Sufficient:** the test checks that all modeled worlds consistent with the statement(s) agree. This is an important automated sanity check, **not a universal mathematical proof** because the number of worlds is finite.
- The resulting A–E logical classification must agree with the source answer key and proof flags. The test does not use the answer key to generate the examples.

The models cover equations, signs, parity, multiple variables, median versus mean, conversion rates, subscription renewal products, and the distinction between a positive spread and identical measurements. Fractions, negative numbers, counterfactual business data, and yes/no outcomes are represented where relevant.

## Interpretation and limits

Passing CI establishes that the sample worlds contain counterexamples for every claimed case of insufficiency, and that no contrary outcome was found among sample worlds for claims of sufficiency. **It does not independently approve any item**, establish the mathematical truth of its full unrestricted domain, verify all French/English distractors, demonstrate official exam alignment, or prove the absence of alternative interpretations.

Human reviewers must still examine each wording assumption and supply a general proof for claims of sufficiency, challenge the exact interpretation of the statement conditions, and separately check all translations, explanations, and timing. The existing `docs/editorial-review-ledger.json` remains the source of pending/approved decisions: **all 94 entries stay pending** until an actual independent review.

## Next editorial priority

The ten GMAT Data Sufficiency pilot items contain no correct B outcome (statement (2) alone). This is not an error in the existing keys and should **not** be fixed by relabeling the answers. If new items are contributed, independently validate genuine statement-(2)-only examples while preserving a balanced mix of reasoning skills. Continue with voluntary usability testing only after separate owner authorization for any public site.

No paid tools, tracking, new deployment, or external data transmission are introduced by this QA step.
