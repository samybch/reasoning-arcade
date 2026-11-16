# Reasoning Arcade

Independent, free, bilingual (FR/EN) logic games inspired by the reasoning skills tested in TAGE MAGE and GMAT.

**Status: working MVP preview in a draft pull request — not a validated exam preparation service.** No claim of affiliation or score equivalence with either exam.

## Try the prototype

The single-file application is in [public/preview/index.html](public/preview/index.html). Open it in a browser without installing anything, or run `npm run dev` to see it through the Next.js prototype shell.

The current preview includes Code Logic (TAGE MAGE only), Argument Lab, Enough Info?, exam choice, FR/EN toggle, game sessions and timed mini-tests, answer explanations, and local browser progress.

## Architecture and limitations

- `src/app/page.tsx` is a **temporary Next.js static shell** embedding the standalone preview. Replacing the monolithic preview with the modular TypeScript implementation is the next engineering step.
- Progress lives in localStorage and is not synchronized.
- The question bank has 36 original **pilot** items. Their pedagogical validity, difficulty and translations require editorial review before public launch.
- Adaptive difficulty is an experimental rule-based heuristic, **not** an official psychometric model.
- The GitHub Pages workflow is manual-only until QA and legal review are complete.
- No site publication, official scores, registration service, or production exam simulation is claimed.

## Development

Requires Node.js 22+.

```bash
npm install
npm run dev
npm test
npm run typecheck
npm run build
```

**Note:** The first dependency install and Next.js build have not yet been validated in the creation environment because npm registry access was unavailable. GitHub Actions is intended to perform this validation.

## Contributions

Read [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/QUESTION_STANDARDS.md](docs/QUESTION_STANDARDS.md). Suggest original exercises via the GitHub issue form; contributions require review. Never copy questions from paid or official exam materials.

## Licenses and disclaimer

Code: MIT. Original educational content: CC BY-SA 4.0; see [LICENSE-CONTENT.md](LICENSE-CONTENT.md).

TAGE MAGE and GMAT are trademarks of their respective owners. This is an independent learning experiment and is not affiliated with, endorsed by or certified by those owners.
