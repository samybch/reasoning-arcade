# QA and verification — XYZ (2026-11-16)

## X — verified
- First modular Next.js build after correction passed GitHub Actions: https://github.com/samybch/reasoning-arcade/actions/runs/43804518261
- Npm installation, question-structure validation, unit tests, TypeScript and `next build` succeeded.
- Main application uses typed React components, and the standalone preview has been archived under `reference/preview.html`. The active question bank is `src/content/questions.json`.
- No user accounts, backend or analytics.

## Y — pending
- Independent editorial validation of the 36 pilot questions and their translations.
- Reliable psychometric calibration; no official score equivalence.
- Question-bank migration into standalone JSON completed; independent editorial review still outstanding.

## Z — pending
- Chromium integration checks on the static export, in progress in PR #1.
- Accessibility, cross-device QA, privacy/legal/brand review and terms of use.
- npm lockfile versioned and npm ci configured; green CI confirmation pending.
- Pages has a manual-only deployment workflow and must not be activated before separate final release approval.

**Release gate: NO-GO for public site deployment.** The source repository remains public.

## XYZ — Focused session scoring regression (2026-11-17)

A focused game with fewer than five available items previously displayed a five-question denominator and could understate success (e.g. 3/5 instead of 3/3). Session size is now capped at the number of unique items in the selected exam/game bank, without changing six-question mixed mini-tests or the adaptive selection logic. An automated browser scenario solves all three Table Lab items, asserts `Question 1/3` through `3/3`, then checks `3/3 correct answers` and `100%` on the result screen. This verifies technical scoring only, not independent editorial correctness. No deployment was authorized.
