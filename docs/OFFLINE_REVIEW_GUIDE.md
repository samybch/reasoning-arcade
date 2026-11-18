# Offline editorial workbook — no installation

## Goal

Let an independent reviewer examine all **94 original pilot questions** in French and English without installing Node.js, logging into the app, or publishing the website. The packet is one standalone HTML file.

## Obtain the file

1. Visit the [Reasoning Arcade GitHub Actions CI runs](https://github.com/samybch/reasoning-arcade/actions/workflows/ci.yml).
2. Open the latest **successful** run for the relevant source commit (a pull-request CI result may be used).
3. Under **Artifacts**, download **reasoning-arcade-offline-review**. GitHub may require you to sign in to download the artifact; using the HTML afterward does not require GitHub.
4. Unzip and open **reasoning-arcade-editorial-review.html** in Chrome, Firefox or Safari. You need **no internet** and **no installation** on that computer.
5. Alternative for developers: `npm run build:review-pack` creates `review-pack/reasoning-arcade-editorial-review.html`. This folder is ignored by Git.

## First private cohort (16 items across all ten games)

The workbook opens in **First private cohort**, showing 16 deliberately selected pilot questions covering the TAGE MAGE and GMAT pathways and all ten game types. Use the **Review scope / Périmètre de revue** dropdown to switch to **Entire catalog** (94 items). No source content is removed; switching views does not clear the choices or notes. The first-cohort IDs are pinned in `scripts/review-batch.mjs` and are not automatically approved.

The suggested sequence is: T-A-02, G-R-09, T-L-01, T-L-17, T-E-02, T-E-03, T-C-06, T-R-02, T-D-05, G-D-13, G-Q-04, G-A-09, G-T-03, G-M-03, G-I-02, G-P-02. It prioritizes the previously documented ambiguity risks and includes every game type. Reviewers may process fewer entries; recording a finding is optional and does not signify approval.

## Reviewer session (FR and EN side by side)

For each question, first answer independently without expanding **Reveal the answer**. Then compare the reference key, full correction, hint and three-stage explanation. Check all distractors, both languages, boundary assumptions and approximate time. Select one of: **Not reviewed**, **No issue spotted**, **Needs changes**, or **Uncertain**.

**No issue spotted is not an editorial approval.** Only a genuinely independent reviewer and maintainer can approve an item using the formal GitHub ledger procedure. Every item remains `pilot` until that separate approval.

Add evidence to the observations field: question ID, language, competing answer, counterexample or exact unclear phrase. Avoid real names, contact details, official exam accounts, or other personal information. The local file does not collect user performance or record a score.

## Save and resume

Click **Download review notes (JSON)** before leaving the page. The browser downloads your findings and notes **across all 94 questions**, including records temporarily hidden by the cohort filter, as a local file. The workbook deliberately has **no autosave** and no external network requests.

To continue, reopen the same HTML, choose **Import previous review notes (JSON)** and select your saved report. Import is accepted **only if its SHA-256 catalog hash matches the exact workbook's original question set**; this prevents mixing findings from different question editions. If there is a mismatch, use the older matching packet or manually reconcile the reports.

**Safe merge (rather than replacement):** imports populate only untouched questions. Identical existing records remain unchanged. If the import disagrees with an existing finding or note — including a question hidden by the 16-item filter — the imported record is **skipped** and its ID appears in the status message; the local text is preserved. Export your current notes before manually reconciling conflicting files. The worksheet **does not** automatically combine differing notes or overwrite one reviewer's conclusions with another's. Imports validate the entire file before applying any non-conflicting entries; invalid files change nothing.

The exported report is *not* imported directly into the official approval ledger. Share it voluntarily with the maintainer for triage, without including personal data. Nothing gets sent to the project automatically.

## Distribution and release control

The GitHub Actions artifact is a downloadable **review file**, not a GitHub Pages website. The repository and its pilot material may be publicly accessible on GitHub; the **website itself remains undeployed**. The offline workbook should be shared only with explicitly invited reviewers during this first round; do not describe the entire repository or materials as secret. GitHub retains the workflow artifact for **14 days**; rerunning CI generates a new copy if required.

The live website remains **NO-GO** pending legal, accessibility, data-privacy and independent content review. The workbook's `noindex` flag does not replace those controls.

## Acceptance checklist

- All 94 IDs appear exactly once, each with French and English; the default view contains exactly 16 IDs spanning all ten games.
- Answer keys are collapsed until explicitly opened.
- The browser works offline, without external fonts/scripts, accounts or analytics.
- Export/import works and rejects a mismatched catalog.
- The reviewer produces concrete findings rather than invented approval metadata.
- New findings become a tracked GitHub editorial task; the official question status remains `pilot` until independently signed off.

## Pré-audit à communiquer aux relecteurs (18 novembre 2026)

Le contrôle préparatoire des 16 questions de la première cohorte figure dans [COHORT16_EDITORIAL_PRECHECK_2026-11-18.md](COHORT16_EDITORIAL_PRECHECK_2026-11-18.md). Il décrit les calculs, les corrections de formulation et les objections résiduelles. **Le relecteur doit d'abord résoudre chaque question sans consulter ce rapport ni la réponse stockée**, puis confronter ses résultats à la matrice. Cette analyse assistée ne vaut pas validation indépendante ; aucune donnée de relecture n'est envoyée automatiquement.
