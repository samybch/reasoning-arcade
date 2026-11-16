# Offline editorial workbook — no installation

## Goal

Let an independent reviewer examine all **58 original pilot questions** in French and English without installing Node.js, logging into the app, or publishing the website. The packet is one standalone HTML file.

## Obtain the file

1. Visit the [Reasoning Arcade GitHub Actions CI runs](https://github.com/samybch/reasoning-arcade/actions/workflows/ci.yml).
2. Open the latest **successful** run for the relevant source commit (a pull-request CI result may be used).
3. Under **Artifacts**, download **reasoning-arcade-offline-review**. GitHub may require you to sign in to download the artifact; using the HTML afterward does not require GitHub.
4. Unzip and open **reasoning-arcade-editorial-review.html** in Chrome, Firefox or Safari. You need **no internet** and **no installation** on that computer.
5. Alternative for developers: `npm run build:review-pack` creates `review-pack/reasoning-arcade-editorial-review.html`. This folder is ignored by Git.

## Reviewer session (FR and EN side by side)

For each question, first answer independently without expanding **Reveal the answer**. Then compare the reference key, full correction, hint and three-stage explanation. Check all distractors, both languages, boundary assumptions and approximate time. Select one of: **Not reviewed**, **No issue spotted**, **Needs changes**, or **Uncertain**.

**No issue spotted is not an editorial approval.** Only a genuinely independent reviewer and maintainer can approve an item using the formal GitHub ledger procedure. Every item remains `pilot` until that separate approval.

Add evidence to the observations field: question ID, language, competing answer, counterexample or exact unclear phrase. Avoid real names, contact details, official exam accounts, or other personal information. The local file does not collect user performance or record a score.

## Save and resume

Click **Download review notes (JSON)** before leaving the page. The browser downloads your findings and notes as a local file. The workbook deliberately has **no autosave** and no external network requests.

To continue, reopen the same HTML, choose **Import previous review notes (JSON)** and select your saved report. Import is accepted **only if its SHA-256 catalog hash matches the exact workbook's original question set**; this prevents mixing findings from different question editions. If there is a mismatch, use the older matching packet or manually reconcile the reports.

The exported report is *not* imported directly into the official approval ledger. Share it voluntarily with the maintainer for triage, without including personal data. Nothing gets sent to the project automatically.

## Distribution and release control

The GitHub Actions artifact is a downloadable **review file**, not a GitHub Pages website. The repository is already public, so its pilot content should not be treated as confidential. GitHub retains the workflow artifact for **14 days**; rerunning CI generates a new copy if required.

The live website remains **NO-GO** pending legal, accessibility, data-privacy and independent content review. The workbook's `noindex` flag does not replace those controls.

## Acceptance checklist

- All 58 IDs appear exactly once, each with French and English.
- Answer keys are collapsed until explicitly opened.
- The browser works offline, without external fonts/scripts, accounts or analytics.
- Export/import works and rejects a mismatched catalog.
- The reviewer produces concrete findings rather than invented approval metadata.
- New findings become a tracked GitHub editorial task; the official question status remains `pilot` until independently signed off.
