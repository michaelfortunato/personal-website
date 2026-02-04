# Refactor / Cleanup TODO (Multi-day)

This repo is actively being modernized (deps + tooling) while keeping the current
site behavior.

## Day 1 — Security + hygiene

- [x] Remove committed auth token from `.npmrc` (use `GSAP_AUTH_TOKEN` env var instead)
- [x] Ignore local env files (`.env`, `.envrc`) + nested build artifacts
- [ ] Rotate/revoke any secrets that were ever committed (GSAP token, OAuth secrets)
- [x] Add `.envrc.example` / `.env.example` with placeholders (no real secrets)

## Day 2 — Dependencies + tooling

- [x] Align Next + lint toolchain (upgrade to Next 16, ESLint 9, TS 5)
- [x] Remove unused legacy deps + dead code (`components/About/*`)
- [x] Run `npm audit fix` (0 vulnerabilities)
- [x] Pin Node via `.nvmrc` (match Vercel Node version)

## Day 3 — UI stack simplification (optional, but recommended)

- [x] Migrate off MUI (Tailwind + shadcn/ui for buttons/icons)
- [ ] Decide whether to keep Emotion (currently used for dynamic keyframes in grid + tagline)

## Day 4 — Blog cleanup

- [ ] Fix tag typing (`lib/posts.ts`) so it matches real tags used in posts
- [ ] Improve blog index cards (tags, “last updated”, excerpt)
- [ ] Normalize timestamps (ISO everywhere) and sort by date robustly

## Day 5 — Typst workflow (Rheo)

- [x] Add `content/typst/*` + `npm run rheo:build`
- [x] Add a sample post (`hello-rheo`) compiled to `public/typst/hello-rheo/html/index.html`
- [ ] Add `rheo:watch` helper for live preview (optional)
- [ ] Decide rendering strategy: iframe (current) vs. extracting/inlining HTML+CSS

## Handy commands

- `npm run lint`
- `npm run format:check`
- `npm run build`
- `npm run rheo:build -- hello-rheo`
