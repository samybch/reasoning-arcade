# XYZ — final public-release gate

**Status: HOLD.** The open-source GitHub repository is public; the end-user website is not deployed. A working draft PR does **not** authorize a production-site release.

## X — Engineering
- [x] Static Next.js export with correct repo basePath
- [x] Versioned lockfile and `npm ci`
- [x] Local browser progress, no accounts or paid APIs
- [ ] Cross-browser coverage (currently Chromium only)
- [ ] Review dependency alerts and pin or update responsibly

## Y — Pedagogy and claims
- [x] 36 original FR/EN pilot items with first-pass answer-key matrix
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
