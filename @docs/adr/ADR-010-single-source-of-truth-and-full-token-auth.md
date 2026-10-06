# ADR-010: Server as Single Source of Truth, Fail-Loud Persistence, and Token Auth on Every Route

## Status
Accepted. Supersedes the in-memory fallback in ADR-001/ADR-004 and the ingest-only auth in ADR-006.

## Context
A review found that the app kept two lexicons that never met:
1. `/add`, `/review`, `/lexicon` and the navbar read and wrote browser `localStorage`. `/add` also POSTed `{ card, srs }` to `/api/cards`, which requires a top-level `term`, so every save returned 400 behind a fire-and-forget `.catch(() => {})`.
2. The Chrome extension and Zotero wrote to the server via `/api/ingest`, so those words never appeared in `/review`. The Pixel and the desktop each had their own lexicon.
3. Every `lib/db` function fell back to an in-memory store on any Supabase error. On Vercel that store vanishes on cold start while the API reports success. The init migration also lacked the `distinction_matrix` column that every insert includes.
4. Only `/api/ingest` checked a token, and that token defaulted to a value committed in the repo. Delete, export, enrichment and diagnostics were open to anyone with the URL.

## Decision
1. **Server is the only store.** Pages read and write only through `lib/api-client.ts` (`apiFetch`), which throws on non-2xx. `lib/sample-data.ts` (localStorage) and `lib/enrichment-fallback.ts` (silent client-side enrichment) are removed. `/review` persists each rating through `POST /api/review` and advances only after it is saved.
2. **Persistence fails loudly.** With Supabase configured, query errors throw `DbError`, and routes return them as 500s that the UI shows. A card whose schedule row fails to insert is rolled back. Without Supabase, the in-memory store serves dev and tests only. It is refused when `NODE_ENV=production` unless `LEXIS_ALLOW_MEMORY_STORE=true`.
3. **Service-role access only.** The server uses `SUPABASE_SERVICE_ROLE_KEY`; the anon key is ignored. Migration `20261005_align_schema_with_app.sql` adds `distinction_matrix` and enrichment-provenance columns (`is_fallback`, `enrichment_source`, `fallback_reason`). It also drops the `auth.uid()` policies, which never matched anything, and leaves RLS enabled with no policies, so the anon key can access nothing.
4. **One gate for everything.** `middleware.ts` protects every page and API route with `LEXIS_SECRET_TOKEN`. Remote clients send `Authorization: Bearer` or `x-lexis-token`. The web UI exchanges the token once at `/unlock` for an httpOnly cookie that holds a SHA-256 of the token, so rotating the token signs every browser out. There is no default token. Until the app is confirmed working, auth is opt-in: with `LEXIS_SECRET_TOKEN` unset, the middleware lets every request through (open mode); setting it turns the gate on with no code change. The `?token=` query parameter is removed so tokens don't end up in URLs and logs. `/unlock`, `/api/session`, `manifest.json` and icons stay public for PWA install.

## Consequences
- A word captured anywhere (extension, Zotero, Pixel share sheet, web) appears in one lexicon and one review queue on every device.
- Storage failures surface immediately instead of silently losing data.
- Deployment requires `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`, plus applying the new migration.
- While `LEXIS_SECRET_TOKEN` is unset, the deployment is open to anyone with the URL (read, export, delete, LLM quota). Setting it is the intended follow-up.
- The app needs the network to work. Offline capture, if wanted, should be built as a write queue that syncs to the server, not as a parallel local database.
