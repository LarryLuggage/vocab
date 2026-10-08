# ADR-011: Production Resilience, Public Diagnostic Health Probing, and Schema Alignment

## Status
Accepted. Extends ADR-010.

## Context
Following the merge of PR #1 (ADR-010), the live deployment on Vercel became unreachable with HTTP 500 errors across all routes:
1. The native Vercel/Supabase integration only populates `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_ANON_KEY`. It does not automatically configure `SUPABASE_SERVICE_ROLE_KEY`.
2. Under ADR-010's fail-loud policy, `lib/db/index.ts` strictly refuses the in-memory fallback in production (`NODE_ENV === 'production'`) unless `LEXIS_ALLOW_MEMORY_STORE === 'true'`, resulting in an unhandled database exception when the service role key is absent.
3. The diagnostic endpoint `/api/diagnostic` was gated behind `middleware.ts` auth when `LEXIS_SECRET_TOKEN` was present, preventing direct inspection of deployment health from mobile or browser without prior authentication.
4. The diagnostic endpoint did not actively probe Supabase connectivity, service-role credential validity, or column schema alignment (`distinction_matrix`).

## Decision
1. **Public Diagnostic Health Probing**:
   - `/api/diagnostic` is whitelisted in `middleware.ts` both at the matcher level and inside the middleware handler.
   - All secret keys are strictly masked (showing at most initial and trailing prefixes) to preserve security while giving operators full visibility.
2. **Deep Supabase Diagnostic Probe**:
   - `/api/diagnostic` now actively checks `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`, and `LEXIS_ALLOW_MEMORY_STORE`.
   - When configured, it executes a live query against `vocab_cards` selecting `id, term, distinction_matrix`.
   - It surfaces precise error categories: `MISSING_SERVICE_ROLE_KEY`, `MIGRATION_PENDING`, `TABLES_MISSING`, `CONNECTION_ERROR`, or `HEALTHY`.
3. **Fail-Safe Preview Flag**:
   - Setting `LEXIS_ALLOW_MEMORY_STORE=true` allows preview and staging environments to operate smoothly in-memory without throwing errors if Supabase is temporarily unreachable or undergoing configuration.
4. **Test Suite Hygiene**:
   - `vitest.config.ts` explicitly excludes `.claude/**` and external worktrees, ensuring test suite passes cleanly across all environments.

## Consequences
- Operators and users can immediately diagnose any production deployment issues by hitting `/api/diagnostic` directly.
- Clear guidance is returned specifying exact remediation steps (e.g., adding `SUPABASE_SERVICE_ROLE_KEY` or running migration `20261005_align_schema_with_app.sql`).
- The database remains strictly protected with service-role security and fail-loud guarantees for data integrity.
