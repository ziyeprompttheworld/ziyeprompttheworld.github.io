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
- [x] 6. Build, inspect representative UI, independent code review, fix material findings, publish only public assets and save deployment result.

## Progress

2026-10-25: plan saved. Native implementation selected to continue user-authorized work without another approval loop.
2026-10-25: first production build succeeded (25 routes before RSS/import additions). Real external reference imported as a research card. Local raw annual view merges same-day entries into 207 dated/undated nodes, with 1,034 images after excluding the 2025 entry. Public release uses six edited date sections and public media only. Service gaps and historical migration are explicitly documented in README.

## Review and release evidence

2026-10-25: fresh read-only review of f193dc6 completed. No current private-source publication path found. Fixed replacement/idempotency by persisting public segment identities and comparing current replacement state; historical corrections now record actual update events and link to stable dates from homepage/RSS. Date-of-record remains separate from update time.

Review regrading: Escape/search and stuck movement affect basic museum control; source ownership labels and featured counts affect truthful presentation; the Shanghai import date affects the explicit timezone rule. Treated these as release-relevant and fixed them in the same pass, along with the two Important diary findings. No deferred review findings. No tests added/run per developer constraint; final production build passed (27 static routes including aliases and data endpoints; 17 sitemap pages; 6 public content items).

Parent inspected desktop home/list, 390px archive and diary navigation, actual picture layout, and rendered WebGL ticket/map. Reference homepage uses a narrower 672px outer container than content/reading pages. Private marker and local image host strings were absent from generated output when searched; private source remains ignored by Git.

Rulings: raw historical material remains local-only until edited; public video pages show actual covers/topics with playback pending; email/AI/traffic services remain explicitly unavailable. These are documented first-release boundaries, not represented as completed integrations. Original reference route families map to personalized replacement pages. Historical factual provenance was checked only against supplied source records and series metadata; no claim of a full historical audit.

First deployment: GitHub Actions run 40113613144 succeeded (build + deploy), Pages build_type=workflow, https://ziyeprompttheworld.github.io/ . Parent opened live home and annual article. Public annual HTML has six edited date nodes and one selected image; complete raw data is not in the deployed site. Final UI adjustment opens the first directory stage immediately.
