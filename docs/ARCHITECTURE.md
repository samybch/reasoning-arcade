# Architecture — XYZ

## X: modular React architecture

Static-exported Next.js App Router pages serve the bilingual learning prototype:
- `/` language landing page, `/fr/` and `/en/` localized homes
- `/[locale]/play/[game]/` for three games
- `/[locale]/practice/` for fixed timed mini-tests

Root layouts set the HTML `lang` attribute per language. All displayed content uses React text rendering rather than directly injecting HTML.

The engine in `src/engine/` handles deterministic question selection, per-skill adaptive progression and local browser storage.

## Y: single source of truth for original questions

`src/content/questions.json` holds 36 independent pilot questions. `src/content/catalog.ts` imports them as a typed catalog for build-time/static routes, and `scripts/validate-questions.mjs` validates structure and response conventions in CI. The former standalone demo is **archived** at `reference/preview.html` for visual comparison only and is not part of the deployed site.

The bank is **not** pedagogically approved yet. Community submissions require original content, FR/EN review and human editorial approval before a public release.

## Z: release controls

GitHub Actions validates the JSON schema, unit tests, TypeScript, Next.js static export and 5 Chromium browser flows including mobile viewports.

The site needs no accounts, server, database, analytics or paid API. Progress lives only in localStorage.

GitHub Pages deployment remains manual-only and is blocked from public activation pending a separate explicit final GO.
