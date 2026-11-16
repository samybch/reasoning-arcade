# Architecture

The first GitHub staging version uses a static single-file browser app at `public/preview/index.html`, embedded by a minimal Next.js App Router page. The active prototype contains inline bilingual question data and UI logic. It is NOT the final modular architecture.

Next steps: split content into versioned JSON/TypeScript question definitions, move adaptive logic and persistence to pure tested TypeScript functions, convert the UI into modular accessible React components, and enforce question validation in CI.

Hosting plan: static Next.js export with `basePath=/reasoning-arcade`. No backend, accounts, database or paid APIs. GitHub Pages deploy must remain manual until release approval.
