# QA report — 2026-11-16

## Verified

- Original standalone HTML preview: interactive navigation, corrections, mini-exam, language switch and mobile viewport exercised in Chromium in the creation environment.
- GitHub Actions CI on commit `0a8eacc5586cef235fc840d6a7cd7880590f64b9`: successful npm installation, static smoke tests, TypeScript typecheck and Next.js production static build. Run: https://github.com/samybch/reasoning-arcade/actions/runs/43800665302
- 36 pilot exercises exist in the single-file browser bank. FR/EN structure checks are strengthened in the follow-up commit.

## Not verified — blockers for public service

- Editorial validation of correctness and translation of all 36 questions.
- Full end-to-end browser and accessibility tests on the Next.js-exported artifact.
- Legal/trademark compliance and public privacy notices.
- Versioned npm lockfile (not yet generated locally).
- Real GitHub Pages deployment and functional links on the published basePath.

**Release decision: NO-GO.** The repository can be public while the actual site remains unpublished.
