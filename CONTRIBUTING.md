# Contributing / Contribuer

Thank you for improving this independent learning project. Merci de participer !

## Offer a new question

1. Open the **Propose a question** GitHub issue template or fork the repository and open a pull request.
2. Include a **new original question**, FR + EN translations, one uniquely correct answer, a clear independent explanation, a helpful hint, a plausible estimated time and a difficulty level 1–5.
3. The entire exercise must be yours to contribute under **CC BY-SA 4.0**. Do **not** copy, paraphrase too closely, or upload official practice questions, commercial exercise books, copyrighted charts, logos or questions from paid training platforms.
4. Set `status: 'pilot'`; only a maintainer can approve material for a future reviewed release.
5. Run `npm run validate:questions && npm test` before opening your PR. Do not share personal information or credentials.

## Code changes

- Use one focused branch per change; open a PR against `main`.
- Keep the zero-backend, no-account, local-first MVP intact unless there is a reviewed architecture decision.
- Keep accessibility, FR/EN parity, automated tests and mobile layouts.
- No secrets, analytics, paid APIs, or external user tracking.
- No claims of official exam endorsement or score prediction.
- Contributions to code are submitted under MIT; original question content under CC BY-SA 4.0.

## Review policy

Automated validation checks *structure*, not pedagogical correctness. Maintainers check originality, response ambiguity, answer correctness, explanation quality, taxonomy, translations and potential IP issues. Revisions may be requested before merge. Maintainer reviews are a human gate; a passing CI does not mean a question is correct.