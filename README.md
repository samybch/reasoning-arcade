# Reasoning Arcade

**Free, independent, bilingual (FR/EN) logic games.** Original practice for the reasoning skills associated with TAGE MAGE and GMAT, with distinct study tracks and no registration.

**Status: draft MVP for internal review — not a certified exam practice service.** No affiliation with or endorsement by exam owners. Exam scores and official percentiles are never inferred.

## Features

- TAGE MAGE: Code Logic, Argument Lab, Enough Info?
- GMAT: Argument Lab, Enough Info? (Code Logic is not presented as a GMAT exam section)
- Game mode with local adaptive per-skill progression, hints and immediate explanation
- Timed mini-tests with results and deferred correction
- Static responsive Next.js React interface, with proper French and English routes
- 36 original pilot questions in both FR and EN, **not editorially approved for release**
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
