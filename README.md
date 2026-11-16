# Reasoning Arcade

**Free, independent, bilingual (FR/EN) logic games.** Original practice for the reasoning skills associated with TAGE MAGE and GMAT, with distinct study tracks and no registration.

**Status: draft MVP for internal review — not a certified exam practice service.** No affiliation with or endorsement by exam owners. Exam scores and official percentiles are never inferred.

## Features

- TAGE MAGE: Code Logic, Argument Lab, Enough Info?
- GMAT: Argument Lab, Enough Info? (Code Logic is not presented as a GMAT exam section)
- Game mode with local adaptive per-skill progression, hints and immediate explanation
- Timed mini-tests with results and deferred correction
- Static responsive Next.js React interface, with proper French and English routes
- 46 original pilot questions in both FR and EN, **not editorially approved for release**
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

Both `Enough Info?` (16 pilot questions) and `Argument Lab` (12 pilot questions) include original, bilingual, structured reasoning steps. Solutions appear only after answering in game/review mode or at the end of a timed mini-test. All 28 remain `pilot` content: the presence of steps is not independent editorial approval.
