# ADR-001: Next.js App Router Architecture and Hybrid Persistence

## Status
Accepted

## Context
Lexis Engine requires real-time responsive web interfaces (desktop + mobile PWA) along with low-latency server-side API routes for LLM enrichment and Supabase data operations. During initial development and test environments, developers and automated CI pipelines may run without active Supabase credentials.

## Decision
1. Adopt Next.js 15+ App Router with TypeScript and Tailwind CSS.
2. Structure the data access layer in `lib/db/` to support direct Supabase PostgreSQL operations when configured, while seamlessly falling back to a deterministic local in-memory store when credentials are absent or in unit test mode.
3. Provide database migration scripts in `supabase/migrations/` matching the PostgreSQL schema specified in PRD Section 4.2.

## Consequences
- Fast development velocity with zero configuration barrier for new developers and automated test suites.
- Production deployments can immediately connect to managed Supabase by providing `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
