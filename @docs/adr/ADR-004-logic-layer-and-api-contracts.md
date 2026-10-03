# ADR-004: Logic Layer, Fallback Architecture, and API Contracts

## Status
Accepted

## Context
Lexis Engine requires deterministic, high-speed vocabulary enrichment, FSRS spaced repetition scheduling, production validation, and CRUD operations that operate seamlessly both with external LLM/Supabase credentials and in a fully offline/sandboxed development environment.

## Decision
1. **Hybrid Data Layer (`lib/db/index.ts`)**:
   - Implemented dynamic Supabase client verification with an in-memory persistent singleton fallback.
   - Pre-seeded with 5 high-register items (`perspicacious`, `solipsism`, `inchoate`, `apocryphal`, `susurrus`) configured with realistic FSRS scheduling states.
   - Lemma & suffix stripping stemmer (`areTermsVariants`, `extractLemmaStem`) ensuring variant deduplication (ING-04).
   - Review scheduling integration with `ts-fsrs` (SRS-01, SRS-02) via `scheduleCardWithRating` and `getSchedulePreviews`.

2. **Strict Zod Schemas (`lib/llm/schema.ts`)**:
   - `LexicalEnrichmentSchema` validating root morphemes, register nuances, collocations, cloze drills, and distinction matrices.
   - `ProductionEvaluationSchema` validating active recall sentence production status (`pass`, `incorrect_usage`, `awkward`), constructive feedback, and register identification.

3. **Multi-tiered Enrichment & Validation (`lib/llm/enricher.ts`, `lib/llm/validator.ts`)**:
   - Primary: Gemini API with structured JSON output.
   - Secondary: OpenAI API with JSON mode.
   - Resilient Fallback: Built-in morphological knowledge base (Greek/Latin roots and affixes) and curated high-register dictionary.
   - Production validation inspects lexical presence, syntactic part-of-speech agreement, depth, and register.

4. **REST API Contracts (`app/api/*`)**:
   - `POST /api/enrich`: Fast lexical payload enrichment.
   - `GET / POST /api/cards`: Searchable card catalog and deduplication-guarded ingestion (returns 409 Conflict with variant info if duplicate exists, or appends context on demand).
   - `GET / PATCH / DELETE /api/cards/[id]`: Card management and context sentence appending.
   - `GET / POST /api/review`: SRS due queue (`due <= now()`) and rating submission with interval previews.
   - `POST /api/validate-production`: Sentence production validation and attempt logging.
   - `GET /api/export`: Multi-format export supporting JSON and Anki-compatible CSV.

## Consequences
- Guaranteed zero-configuration startup: test suites and UI run immediately without environment variables.
- Resilient error handling prevents UI disruptions if third-party APIs experience downtime or quota exhaustion.
