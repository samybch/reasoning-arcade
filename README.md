# Reasoning Arcade

**Free, independent, bilingual (FR/EN) logic games.** Original practice for the reasoning skills associated with TAGE MAGE and GMAT, with distinct study tracks and no registration.

**Status: draft MVP for internal review — not a certified exam practice service.** No affiliation with or endorsement by exam owners. Exam scores and official percentiles are never inferred.

## Features

- TAGE MAGE: Code Logic, Argument Lab, Enough Info?, **Quant Lab (Calcul)**, **Reading Lab (Compréhension de textes)**, **Expression Lab (Expression)**
- GMAT: Argument Lab, Enough Info?, **Quant Lab (Quantitative Reasoning)**, **Reading Lab (Reading Comprehension)**; Code Logic is not presented as a GMAT exam section
- Game mode with local adaptive per-skill progression, hints and immediate explanation
- Timed mini-tests with results and deferred correction
- Static responsive Next.js React interface, with proper French and English routes
- 82 original pilot questions in both FR and EN, **not editorially approved for release**
- Community submissions via GitHub issues and PRs, subject to checks and human review

## Source structure

- `src/content/questions.json`: **single source of truth** for the pilot question catalog
- `src/engine/`: adaptive selection, scoring and local progress storage
- `src/components/`: React UI for home, games, results
- `src/app/`: statically generated Next.js routes
- `scripts/validate-questions.mjs`: bilingual schema and allocation validator
- `e2e/`: Chromium browser tests, including a mobile viewport
- `reference/preview.html`: archived standalone visual design prototype, not deployed

## Development

Node.js 22+ required.

```bash
npm ci
npm run validate:questions
npm test
npm run typecheck
npm run dev
# Or build and test static output:
NEXT_PUBLIC_BASE_PATH=/reasoning-arcade npm run build
mkdir -p .site/reasoning-arcade && cp -r out/. .site/reasoning-arcade/
npx playwright install chromium
npm run test:e2e
```

GitHub Actions performs the checks remotely; no paid service or backend is required. The committed `package-lock.json` pins dependency versions and CI uses `npm ci` for reproducible installs.

## Contributing and roadmap

See [CONTRIBUTING.md](CONTRIBUTING.md), [docs/QUESTION_STANDARDS.md](docs/QUESTION_STANDARDS.md), and [docs/ROADMAP.md](docs/ROADMAP.md). Questions must be independently created, have exactly one valid answer, and provide accurate explanations in FR/EN.

## Licenses and legal status

Code under MIT; original question content under CC BY-SA 4.0, see [LICENSE-CONTENT.md](LICENSE-CONTENT.md). TAGE MAGE and GMAT are trademarks owned by their respective entities. This repository is independently developed.

**No public site launch is authorized by the existence of the GitHub repository.** GitHub Pages deployment is manual-only and needs distinct approval after educational, legal and accessibility verification.

## Development policy (XYZ)

Use `main` as the sole source of truth. Create **one short-lived topic branch at a time**, require green CI, then **squash-merge** into `main` to avoid accumulating competing release versions. A code merge is **not** a site deployment: `deploy.yml` remains manual-only. Never modify question statuses from `pilot` to `reviewed` without independent editorial approval.

## Local progress and timing improvements (XYZ)
- Stores a bounded list of the last 16 question IDs to reduce immediate repeats in game mode; existing `v1` progress continues to load.
- Timed mini-tests use elapsed monotonic time, so background browser throttling does not artificially extend a deadline.
- Unanswered timed questions are counted against the fixed test total, and shown with explanations in the final review.
- Six introductory TAGE numerical sequences have explicit `warmup` classification.
- The bilingual coverage page discloses exactly which official skill areas are still absent; this does not constitute exam certification.

### Review mistaken answers locally

Players may revisit mistakes from either exam pathway with **Review my mistakes / Revoir mes erreurs**. Incorrectly answered question IDs are stored in a bounded queue (up to 24) on the same device and removed after a correct retry. No user account, server synchronization, tracking or third-party analytics is required. Individual questions remain editorial `pilot` exercises; successful review does not imply official exam readiness.

## Detailed pedagogical corrections

All **82 original pilot exercises**—18 Code Logic, 12 Argument Lab, 16 Enough Info?, 12 Quant Lab and 18 Reading Lab and 6 Expression Lab—include three original, bilingual steps explaining the reasoning. Solutions appear only after answering in game/review mode or at the end of a timed mini-test. All 82 remain `pilot` content: the presence of steps is not independent editorial approval.

**Quant Lab** includes 12 original pilot word problems with five choices, bilingual hints and three-stage corrections. This extends skill practice into TAGE MAGE Calcul and current GMAT Quantitative Reasoning but does not constitute a complete exam simulation.

## Practice quality and persistence (XYZ)

- Mixed six-question mini-tests sample all question-game categories currently available in the chosen exam track (six for TAGE MAGE; four for GMAT), without implying an official section weighting or scoring method.
- Browser progress keeps a bounded history for every question ID, including the new `T-C-xx` and `G-Q-xx` Quant Lab identifiers, across page reloads.
- When the mini-test time limit expires, unanswered question IDs are added to the **local revision queue**, without counting them as attempted answers. The existing progress storage format (`v1`) is unchanged.

## Editorial review and realistic pilot timing (XYZ)

Each of the **82 pilot questions** now has a distinct pending-review record in [the editorial review ledger](docs/editorial-review-ledger.json), with a targeted point for human scrutiny. See [the independent review procedure](docs/EDITORIAL_REVIEW_PROTOCOL.md) for bilingual checks, numerical counterexamples and approval rules. Machine checks do **not** replace independent review.

Timed mini-tests use the sum of the selected questions' **estimated pilot solving times**, rather than imposing the same 80-second allowance for all puzzles. Those estimates have not been calibrated to official TAGE MAGE or GMAT section durations.

## Offline bilingual review (no installation or public website)

After the `CI / test` job succeeds, open that GitHub Actions run and download the `reasoning-arcade-offline-review` artifact. Unzip it and open `reasoning-arcade-editorial-review.html` in a browser. This **self-contained HTML file** displays all 82 pilot questions side by side in FR/EN. It hides answer keys until the reviewer expands each solution, records preliminary observations, and exports/imports a local JSON feedback file. **No JavaScript packages, account on the reviewing computer, network connection or hosted site are required to open it.** Alternatively, run `npm run build:review-pack` on a developer machine.

The export contains review findings only, **not** independent approvals. See [the offline review guide](docs/OFFLINE_REVIEW_GUIDE.md) and [the editorial protocol](docs/EDITORIAL_REVIEW_PROTOCOL.md). The original public-source licensing remains unchanged; this is a QA worksheet, not a public release.

## Expression Lab
Six original bilingual pilot items for the French-language TAGE MAGE Expression skill area: two language correction, two faithful reformulation, and two discourse coherence. The EN route translates instructions and explains the French language examples; it is not an English-language version of the official Expression section. Original pilot exercises are not a simulation of the official 15-item exam sub-test.

## Reading Lab
Six original FR/EN passages support 18 pilot questions on main idea, evidence, inference, author purpose, viewpoint comparison, synthesis, argument structure and tone. They are included in the 82-question offline editorial workbook; none is independently approved.
