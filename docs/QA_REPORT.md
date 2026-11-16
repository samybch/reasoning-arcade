# QA and verification — XYZ (2026-11-16)

## X — verified
- First modular Next.js build after correction passed GitHub Actions: https://github.com/samybch/reasoning-arcade/actions/runs/43804518261
- Npm installation, question-structure validation, unit tests, TypeScript and `next build` succeeded.
- Main application no longer uses the preview iframe; the original HTML is retained as reference and the catalog is extracted on the server at build time.
- No user accounts, backend or analytics.

## Y — pending
- Independent editorial validation of the 36 pilot questions and their translations.
- Reliable psychometric calibration; no official score equivalence.
- Proper typed question-bank migration out of the embedded HTML reference.

## Z — pending
- Chromium integration checks on the static export, in progress in PR #1.
- Accessibility, cross-device QA, privacy/legal/brand review and terms of use.
- npm lockfile and npm ci (reproducible dependency graph).
- Pages has a manual-only deployment workflow and must not be activated before separate final release approval.

**Release gate: NO-GO for public site deployment.** The source repository remains public.
