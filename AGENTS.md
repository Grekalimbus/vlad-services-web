<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## PrimeFixPros — Mandatory Development Rules

### 1. Single Source of Truth
- Production Cloudflare D1 is the only authoritative source of CMS-managed business content.
- Cloudflare R2 stores CMS-uploaded images.
- Local development and production must use the same authoritative D1/R2.
- Never create local CMS copies, snapshots, duplicate databases, mock business data, or fallback content stores.
- Never embed CMS business content into builds or use stale caches.
- Missing CMS values display `—` publicly and `Not filled` in admin. Database failures must surface as errors, never silently fall back.

### 2. Content Ownership
- CMS-managed titles, subtitles, descriptions, prices, services, cards, icons, galleries, contacts, and editable SEO fields must come from D1.
- Never hardcode CMS-managed content in React components, configuration, or default objects.
- Static UI labels, technical constants, and existing legal policy text may remain in code.
- Reviews are not editable through admin. Preserve existing Google, Yelp, Angi, and BBB integrations and their current sources unless explicitly requested otherwise.

### 3. Existing Content Changes
- Always identify the current data source before editing content.
- Change CMS-managed text and images in D1, never by overriding them in code.
- Never overwrite client-edited CMS values during builds, migrations, or deployments.
- Preserve all unrelated CMS fields and media references.

### 4. New Fields and Features
- Inspect the existing CMS structure, public component, and admin editor first.
- New CMS-managed fields and repeatable cards must work in both the public site and admin editor.
- Store new business content in authoritative D1, never in hardcoded defaults.
- Use targeted, non-destructive updates for new fields or initial content.
- Preserve existing content, ordering, and functionality.
- Do not introduce alternative data sources or fallback mechanisms.

### 5. Deployment and Safety
- Never reset, reseed, or replace production CMS content.
- Code deployment must never overwrite D1/R2 data.
- Never push, deploy, modify production data, or change Cloudflare configuration without explicit approval for that action.
- Local development must reflect authoritative CMS data without manual synchronization.

### 6. Regression Protection
- Verify affected public pages and admin functionality after changes.
- Ensure CMS updates are reflected correctly and existing client content is preserved.
- Preserve existing design, routes, SEO, forms, analytics, review integrations, and legal pages unless explicitly requested.
- Verify that CMS images and icons use their intended R2 references.
- Never introduce hardcoded CMS values, stale fallbacks, or duplicate content sources.
- Make only changes required by the task. Report blockers rather than bypassing these rules.
