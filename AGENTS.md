<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Personal site invariants

- Static export for GitHub Pages; keep existing route families and annual diary anchors.
- `.private/` contains local source material. Production uses only public data; do not move private files or source images into public output.
- No invented financial, audience, customer, subscription or publishing results.
- Ordinary chat is not a diary. Existing automatic publishing authorization applies to explicit diary input; preview/private instructions override it.
- Source platform, content type and authorship are separate fields. Third-party research is not the author's original work.
- Read README.md and IMPLEMENTATION.md for the current workflow. Do not add or run tests unless requested by the user.
