# Roadmap (XYZ) — 2026-11-16

## X — Architecture and operations
- [x] Independent public GitHub repository and draft PR #1
- [x] Bilingual browser prototype with 36 original pilot items
- [x] Next.js static-export setup and first green GitHub Actions CI
- [x] Replace iframe shell with modular React home/game components
- [x] Separate adaptive engine and local progress storage modules
- [x] Commit npm lockfile and convert CI to npm ci
- [ ] Merge draft PR after content and release gate review

## Y — Educational gameplay
- [x] Separate TAGE MAGE / GMAT game selection
- [x] Game vs fixed timed mini-test behavior
- [x] Adaptive per-competency selection and explanations
- [x] Structural validation of 36 bilingual pilot questions
- [ ] Independently review answers, translations, difficulty and exam mapping
- [ ] Move pilot catalog out of embedded HTML into a typed content source
- [ ] Expand bank to >100 validated original items

## Z — Release assurance
- [x] Automated typecheck/build/test in GitHub CI
- [x] Keep Pages deployment manually triggered, not automatic
- [ ] Add Chromium end-to-end and keyboard/accessibility coverage
- [ ] Audit legal notices, trademarks, images and privacy
- [ ] Review mobile user experience and launch criteria
- [ ] Obtain a distinct explicit GO before publishing an end-user site

## User-facing progression
- [x] Display locally stored experimental skill levels and successes on the home screen, with account-free reset

## Next consolidation — 2026-11-16, XYZ
- [x] Squash-merge original 16-commit PR #1 into `main` (one history checkpoint)
- [x] Expand the pilot bank from 36 to 46 original FR/EN items, with more authentic categorization and applied data sufficiency
- [x] Make the homepage question counter reflect the catalog rather than a hard-coded number
- [x] Rotate fixed mini-test subsets between attempts without claiming exam-level adaptation
- [ ] Independent educational review of all 46 pilots, especially the ten new examples
- [ ] QA and squash-merge this stabilization lot into `main`
- [ ] Publish the live site only after explicit release authorization and legal/accessibility gates

## Third consolidated XYZ lot
- [x] Explicitly label six numerical sequences as non-official warm-up exercises
- [x] Preserve previous version-1 browser progress while retaining a bounded recent-question history
- [x] Improve timed-test stability under background tab throttling and review unanswered items
- [ ] Independent pedagogical approval of all 46 pilots (remaining blocker)

## Fourth consolidated XYZ — revision loop

- [x] Correct answers remove an item from the local review queue; wrong answers add it
- [x] At most 24 question IDs awaiting review, isolated by exam pathway
- [x] Bilingual account-free review route with hints, immediate correction and completion results
- [x] Existing progress v1 loads without migration or data loss
- [x] Tests cover queue limits, cross-track isolation, stale IDs and successful retry
- [ ] Independent expert/editorial check of all 46 question statements and translations
- [ ] Validate the entire draft PR in CI and squash-merge into `main`; keep Pages untriggered

## XYZ — pedagogical correction quality
- [x] All 16 TAGE MAGE / GMAT sufficiency questions receive a 3-step FR/EN explanation: statement (1), statement (2), verdict
- [x] Game mode reveals structured solutions after answer; exam mode defers all explanations until results
- [x] All exam review entries state the correct choice explicitly
- [ ] Independent reviewer approves the logical counterexamples and wording; all items remain pilots

## Fifth consolidated XYZ lot — answer quality
- [x] Structured answer-key proof flags for 16 original bilingual Data Sufficiency items
- [x] CI schema detects contradictory or mismatched A–E answer mappings
- [x] Issue forms for reporting incorrect/ambiguous original exercises (question ID and language only)
- [ ] Independent editorial review and final pilot approval of each question (issue #3)

## Next XYZ consolidation — structured Argument Lab explanations

- [x] Add original three-step French and English explanations for all 12 Argument Lab items
- [x] Reuse the existing `ReasoningBreakdown` component, choosing game-specific headings
- [x] Validate translation parity and test immediate versus deferred feedback
- [ ] Complete independent review of all 46 pilot exercises and refine difficulty calibration
- [ ] Squash-merge this focused QA-validated lot; keep GitHub Pages unpublished

## Consolidated XYZ — full pilot explanation coverage

- [x] Complete 46/46 original bilingual teaching breakdowns, three steps per question
- [x] Use one reusable component with headings that match each game mechanic
- [x] Test that explanations do not appear before timed sessions finish
- [x] Extend schema validation to require detailed FR/EN reasoning for every pilot item
- [ ] Independent editorial approval, difficulty calibration and user feedback still required

## XYZ — Quant Lab (consolidation batch)
- [x] Add a fourth reusable question game (Quant Lab) without backend or account
- [x] Provide 12 original FR/EN arithmetic/algebra/geometry word problems and three-stage worked solutions
- [x] Derive program coverage counts from the same canonical bank
- [x] Add arithmetic-key and responsive browser regression tests
- [ ] Independent external math/translation review of 58 pilot items
- [ ] Safely squash-merge the green CI branch; remove its merged branch when connector support becomes available

## XYZ — Learning quality and consolidation (post Quant Lab)
- [x] Fix persisted Quant Lab question IDs (`T-C` and `G-Q`) in both recent history and revision queue
- [x] Guarantee that mixed mini-tests exercise every currently available game, without claiming official exam weighting
- [x] Place unanswered questions from expired mini-tests in the existing local review queue, without counting fabricated attempts
- [x] Add regression tests for browser reload, category coverage, queue limits, and elapsed sessions
- [ ] Review pedagogical quality with real learners; no production website deployment before separate GO
