# ADR-014: Serverless Production Resilience & Next.js App Router Contracts

## Status
Accepted. Extends ADR-011 and ADR-012.

## Context
During deployment and testing on Vercel's serverless infrastructure, two critical operational issues emerged:
1. **Next.js 15 Route Handler Type Strictness**:
   - In Next.js 15, route handlers (`app/api/.../route.ts`) enforce strict TypeScript signatures for HTTP method exports.
   - An optional argument signature such as `export async function GET(req?: Request)` causes Next.js's production type-checking stage (`Linting and checking validity of types...`) to fail with:
     ```
     Type error: Route "app/api/.../route.ts" has an invalid "GET" export:
     Type "Request | undefined" is not assignable to type "Request".
     ```
   - This caused production builds on commits `6099143` to fail with exit code 1.
2. **Serverless Function 10-Second Ceiling (Hobby Tier)**:
   - On Vercel Hobby accounts, serverless execution is strictly hard-capped at 10 seconds. Declaring `export const maxDuration = 30;` in code does not bypass the platform-level 10s ceiling.
   - Any API route performing external health checks or LLM calls that lack bounded abort signals risks timing out with HTTP 504 `FUNCTION_INVOCATION_TIMEOUT`.
   - Specifically, `/api/diagnostic` and `/api/enrich` had candidate model probes and external fetches that could exceed 10 seconds under network latency.

## Decision

1. **Strict Route Handler Signatures**:
   - Enforce exact `req: Request` signatures across all route handlers in `app/api/**/route.ts`.
   - Validate route signatures locally prior to any push using `next build`.

2. **Sub-3s Bounded External Probes**:
   - Bound all individual external fetch calls in `/api/diagnostic` with strict 2500ms abort signals:
     - Google Gemini candidate model probes: `AbortSignal.timeout(3500)`
     - Google Generative Language models list: `AbortSignal.timeout(2500)`
     - Public Dictionary API probe: `AbortSignal.timeout(2500)`
   - Wrap Supabase database connectivity probes with a 3000ms `Promise.race` rejection timer so slow database connections never block the health check.
   - Decouple full Gemini LLM generation from the default health check: make full enrichment probing opt-in via `?enrichment=true`, allowing the default `/api/diagnostic` endpoint to respond in < 1.5 seconds.

3. **Defensive LLM Client Timeouts**:
   - Cap `fetchGeminiEnrichment` in `lib/llm/enricher.ts` to 6500ms. If Gemini does not respond within 6.5s, immediately fall back to the offline morphological synthesizer or curated lexicon, ensuring the `/api/enrich` response always arrives before Vercel's 10s limit.

4. **Git Integration Documentation**:
   - Verified that CLI deployments (`vercel --prod`) deploy directly, while automated commit deployments require connecting the repository (`LarryLuggage/vocab`) in Vercel Project Settings -> Git.

## Consequences
- Production deployments compile with 0 TypeScript/Next.js build errors.
- `/api/diagnostic` returns `HEALTHY` in ~1.2s without 504 gateway timeouts.
- Both English and Spanish vocabulary enrichments execute reliably within serverless limits.
- Complete 103/103 Vitest test suite passing.
