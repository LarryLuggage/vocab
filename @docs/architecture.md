# Lexis Engine Architecture Document

## Overview
Lexis Engine is a high-register vocabulary acquisition system combining real-time LLM morphological/nuance enrichment, multi-modal active recall drills, and the Free Spaced Repetition Scheduler (`ts-fsrs`).

## System Layers
1. **Presentation Layer (Next.js 15 PWA)**:
   - Responsive design with bottom-anchored thumb controls for mobile.
   - Route `/add`: Fast ingest with autofocus, live enrichment preview, and deduplication warning.
   - Route `/review`: Multi-modal practice queue (`ACT-01` Cloze, `ACT-02` Distinction Matrix, `ACT-03` Active Production Sandbox).
   - Route `/lexicon`: Root morpheme exploration, mastery tier filtering, and Anki/JSON export.

2. **Application / API Layer**:
   - `POST /api/enrich`: Fast structured LLM generation with Zod validation.
   - `POST /api/validate-production`: LLM sentence evaluation for grammar, tone, and idiom.
   - `GET / POST /api/cards`: Vocab card CRUD and deduplication.
   - `GET / POST /api/review`: SRS queue retrieval and FSRS rating transition handler.

3. **Core Services**:
   - `lib/fsrs.ts`: FSRS 17-parameter DSR calculation and rating scheduling.
   - `lib/llm/`: Pluggable LLM provider (Gemini, OpenAI, Mock provider).
   - `lib/db/`: Supabase client with hybrid mock fallback for offline and local testing.

4. **Persistence Layer**:
   - PostgreSQL (Supabase) tables: `vocab_cards`, `srs_cards`, `production_logs`.
   - Indexed on `(user_id, due)` and `(user_id, term)`.
