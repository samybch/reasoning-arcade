# Contributing / Contribuer

Thanks for supporting this independent free bilingual learning project. Merci de participer !

## Submit original questions

1. Open the GitHub "Original question / Exercice original" issue form.
2. Include the exam path, game, original question in both French and English, five choices (or two statements for sufficiency), a uniquely correct answer, a clear explanation, and a difficulty estimate.
3. Make sure **you own** the content and agree to publish it under CC BY-SA 4.0.
4. Never copy official exam questions, proprietary training exercises, protected charts, trademarks or copyrighted illustrations.
5. Every exercise stays **pilot / under review** until editorial approval. Maintainers incorporate reviewed submissions into the bank in a later PR.

## Code changes

- Fork and open a focused PR to `main`.
- Run `npm run validate:questions`, `npm test`, `npm run typecheck` and `npm run build`.
- Keep FR/EN parity, accessible keyboard control and responsive layouts.
- Do not add trackers, paid APIs, accounts, secret keys or server collection without an explicit architecture decision.
- Code contributions use MIT; original questions use CC BY-SA 4.0.

## Review policy

Automated tests validate **structure only**. Maintainers must also verify that questions are original, mathematically correct, unambiguous, properly translated, and relevant to the correct exam category.

The reviewed question catalog is maintained in `src/content/questions.json`. Propose new content through GitHub issues or a focused pull request. All new items must pass automated checks and human editorial review.

## Classification for new questions

Set `alignment` to `warmup` only for a clearly identified introductory exercise (currently simple TAGE MAGE numerical sequences); other questions use `skill-practice`. Even `skill-practice` means **targeted original practice**, not official format matching or certification. Every new question must include its status and alignment, and the coverage page must remain truthful.

## Question-quality reports

Each original pilot question offers a link to the GitHub `question-feedback.yml` issue form. It identifies only the question ID and selected language in the URL; GitHub login is required to submit. Review reports for ambiguity, incorrect keys, misleading wording, translation, accessibility or incorrect exam categorization, and log the editorial decision. Do not request users' test results, personal information or proprietary exam content.
