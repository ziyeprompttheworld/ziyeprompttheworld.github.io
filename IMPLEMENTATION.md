# Personal Site Implementation Plan

> For agentic workers: use executing-plans; implement in this session. User has approved the design and asked to start.

**Goal:** A complete personal site in the reference site's visual language, with annual diaries, three core themes, research import and static publication.
**Architecture:** Next.js static export. Server-rendered content plus small interactive modules; local-only private source kept outside public assets. Service-backed features expose honest unavailable states.
**Tech Stack:** Next.js 16, React 19, TypeScript, CSS, Three.js.
**Spec:** ../../../specs/0006-personal-site-full-replica-design.md

## Global Constraints

- One article per diary year, stable date anchors.
- Follow reference typography, width, spacing and responsive structure.
- No invented money, audience, availability or publication data.
- No private raw inputs in Git or production output.
- User has not requested tests: no added test suite; build and inspect actual UI.
- User chose GitHub Pages; do not replace hosting with Sites/Workers.

## Review Focus

Private content publication; stable date anchors and same-day aggregation; query filters on static hosting; unavailable services; 3D keyboard lifecycle and mobile fallback.

## Tasks

- [x] 1. Foundation and source model: package.json, next.config.ts, src/lib/content.ts, public assets, curated annual content; build uses public data only.
- [x] 2. Reference components: globals.css, shared shell, typography, rows, filters, article card, directory and image viewer. Routes / and /content/ and /content/[slug]/.
- [x] 3. Full site modules: /projects/, /progress/, /strategy/, /research/, /tools/, /requests/, /newsletter/ and detail; aliases map reference routes to replacements.
- [x] 4. Museum: dynamic Three.js scene, ticket, movement, map, search, readable exhibit overlay; no invented online count or AI API.
- [x] 5. Workflows: link importer, append-by-date diary command, RSS/sitemap, GitHub Actions, usage rules. Preserve author/source/date and dedup imports.
- [ ] 6. Build, inspect representative UI, independent code review, fix material findings, publish only public assets and save deployment result.

## Progress

2026-10-25: plan saved. Native implementation selected to continue user-authorized work without another approval loop.
2026-10-25: first production build succeeded (25 routes before RSS/import additions). Real external reference imported as a research card. Local raw annual view merges same-day entries into 207 dated/undated nodes, with 1,034 images after excluding the 2025 entry. Public release uses six edited date sections and public media only. Service gaps and historical migration are explicitly documented in README.
