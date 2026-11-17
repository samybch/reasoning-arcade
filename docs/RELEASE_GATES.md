# XYZ — final public-release gate

**Status: HOLD.** The open-source GitHub repository is public; the end-user website is not deployed. A working draft PR does **not** authorize a production-site release.

## X — Engineering
- [x] Static Next.js export with correct repo basePath
- [x] Versioned lockfile and `npm ci`
- [x] Local browser progress, no accounts or paid APIs
- [ ] Cross-browser coverage (currently Chromium only)
- [ ] Review dependency alerts and pin or update responsibly

## Y — Pedagogy and claims
- [x] 76 original FR/EN pilot items with first-pass answer-key matrix
- [x] Key-regression tests and a structural validator that allows new contributions
- [ ] Independent French/English correctness review and approval for every item (issue #3)
- [ ] Verify official exam taxonomy and current answer conventions in authoritative materials
- [ ] Calibrate difficulty and timing with users; avoid official-score equivalence
- [ ] Record contributor credits and licensing before publishing new content

## Z — UX, privacy, rights, release
- [x] Keyboard-accessible buttons, visible focus, skip-to-content link, labeled progress bar
- [x] 390px mobile regression scenario and bilingual privacy-information page
- [x] Manual-only GitHub Pages deployment workflow
- [ ] Accessibility testing beyond smoke flows: screen readers, color contrast, reduced motion, 320px layout
- [ ] Legal notices with a verified responsible publisher, hosting information and contact route
- [ ] Document the localStorage legal basis/consent analysis and host HTTP log data processing
- [ ] Trademark, original text and graphics, license/attribution audit
- [ ] Verify all routes and navigation on GitHub Pages before announcing a launch
- [ ] Separate **explicit final public-launch authorization**

Until the list is cleared, keep the Pages workflow untriggered, keep a `noindex` directive in the preview and describe the exercises as **pilot learning content**.

## Coverage disclosure
- [x] User-facing FR/EN program coverage page shows missing official sections and current pilot totals
- [x] Links to official FNEGE/GMAC descriptions; no unofficial score equivalence
- [ ] Recheck official changes periodically and before publicly advertising syllabus alignment

## Practice revision quality
- [x] Local-only, bounded queue of previously missed items with FR/EN dedicated practice route
- [x] Question is removed from that queue after a correct retry
- [ ] Evaluate learning outcomes and exercise difficulty with actual volunteer learners, without collecting personal data by default

## Community question feedback
- [x] Question-specific GitHub issue-report links and template; external navigation is voluntary
- [x] No browser progress or chosen answers transmitted in feedback links
- [ ] Define response times and report moderation before actively inviting public learner traffic

## Quantitative learning expansion
- [x] New bilingual Quant Lab available on both exam pathways, six original pilot problems per track
- [x] Math answer keys checked by executable arithmetic invariants and per-item FR/EN correction steps
- [ ] Independent expert review of quantitative item difficulty, ambiguity and alignment before any official-syllabus claims

## Traceable question review / timer
- [x] 58/58 pilot review records with accountable reviewer/date fields that cannot be marked approved in CI without matching content status
- [x] Separate documented independent review protocol and focused risk questions, including counterexample checks
- [x] Show timer budgets derived from draft question estimates with explicit non-official disclaimer
- [ ] Actual independent reviewer decisions and evidence for all source questions before public exam-preparation claims

## Offline review readiness
- [x] Build a single-file FR/EN offline workbook with every question and a hidden reference solution
- [x] Enable local JSON observations export/import, catalog SHA-256 match and no automatic remote transmission
- [x] Attach the workbook as a downloadable GitHub Actions artifact after successful CI (without deploying GitHub Pages)
- [ ] Collect actual independent reviewer reports, triage genuine ambiguities and record accountable approvals

## Reading Lab
- [x] Six original reading passages, eighteen pilot questions and bilingual worked stages
- [x] Eighteen pending ledger records and inclusion in the offline reviewer workbook
- [ ] Independent external FR/EN correctness review, ambiguity checks and rights signoff
