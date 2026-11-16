# Architecture — XYZ

## X: React migration

The application is now rendered by static-exported Next.js App Router pages:
- `/fr/` and `/en/` provide language-specific home screens.
- `/[locale]/play/[game]/` loads one of three React game experiences.
- `/[locale]/practice/` provides a fixed mini-test queue.

Pure modules in `src/engine/` handle scoring, per-skill adaptive progression and client-side storage.

### Temporary bank migration bridge

`src/content/catalog.ts` extracts the 36-question JSON bank from `public/preview/index.html` **at build time**. This prevents bank divergence while the new React UI is being reviewed. The original standalone preview remains available for comparison only; no iframe is used by the main application.

**Next Y task:** move the single source of truth to a typed structured question catalog, and generate/archive the preview from it, rather than extracting from HTML.

No remote database, account, analytics, cookies, credentials or paid APIs are needed. User progress is stored in localStorage.

## Z: release control

GitHub Pages deployment is workflow_dispatch only. The public repo is not an authorization to release a website. Review translation, pedagogy, accessibility, copyright and legal notices before public GO.
