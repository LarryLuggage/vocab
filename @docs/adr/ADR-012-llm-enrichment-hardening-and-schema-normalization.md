# ADR-012: LLM Enrichment Pipeline Hardening, Native Response Schema, and Defensive Normalization

## Status
Accepted. Extends ADR-003 and ADR-008.

## Context
During live production testing on Google Pixel 10 and web, word capture silently fell back to local offline synthesizers (producing generic or tautological definitions), despite `/api/diagnostic` reporting Gemini as "HEALTHY":
1. `/api/diagnostic` previously tested only a 4-token ping (`Respond with "pong"`), which succeeded in ~200ms on `gemini-3.8-flash`, masking generation failures on the real prompt.
2. The actual enrichment prompt requests a 500-token JSON schema covering morphological root trees, register nuances, collocations, cloze drills, and distinction matrices. Generating this payload on cold serverless invocations often requires 6–10 seconds. `fetchGeminiEnrichment` had an aggressive 7.5-second timeout, causing silent client aborts.
3. Once the primary attempt timed out, the code attempted to failover to `gemini-2.5-flash`, `gemini-2.0-flash`, `gemini-1.5-flash`, and `gemini-1.5-pro`—all of which Google has permanently decommissioned (returning HTTP 404).
4. Raw LLM output was fed directly into `LexicalEnrichmentSchema.parse(...)`. If Gemini returned minor field variations (e.g. `definition` instead of `primary_definition`, or `recommended_register` instead of `recommendedRegister`), Zod threw validation errors. These were caught in generic catch blocks and silently discarded, dropping the request into offline stub mode.
5. Vercel serverless routes lacked `export const maxDuration = 30;`, risking platform-level termination at 10s.

## Decision
1. **Google Native Structured Outputs (`responseSchema`)**:
   - Provide Gemini's native `responseSchema` in `generationConfig` to constrain model generation probabilities to the exact JSON structure at decode time.
2. **Defensive Lexical Normalizer (`normalizeLexicalPayload`)**:
   - Forgivingly map alternate field names (`definition` $\rightarrow$ `primary_definition`, `partOfSpeech` $\rightarrow$ `part_of_speech`).
   - Normalize snake_case variants in `distinction_matrix` (`nuance_comparison` $\rightarrow$ `nuanceComparison`, `context_recommendations` $\rightarrow$ `contextRecommendations`, `recommended_register` $\rightarrow$ `recommendedRegister`, `example_sentence` $\rightarrow$ `exampleSentence`).
   - Forgivingly parse string roots into structured `{ morpheme, meaning, origin }` objects.
   - Guarantee valid fallback structures for cloze sentences and distinction matrices if partially omitted.
3. **Execution Budget & Modern Model Priority**:
   - Increase request timeout from 7.5s to 15s.
   - Configure `export const maxDuration = 30;` on `/api/enrich`, `/api/cards`, `/api/ingest`, and `/api/diagnostic`.
   - Update candidate models to active Google models: `process.env.GEMINI_MODEL`, `gemini-3.8-flash`, `gemini-3.7-flash`, and `gemini-3.5-flash`. Prune all decommissioned 404 models.
4. **End-to-End Diagnostic Probing**:
   - `/api/diagnostic` now tests a real enrichment call (`probeGeminiEnrichment('perspicacious')`), reporting live latency, model used, sample definition, and root morphemes. It flags `GEMINI_ENRICHMENT_FAILED` if actual schema generation fails.
5. **UI Transparency**:
   - Quick Capture (`/add`) displays the actual `fallback_reason` in the fallback notice banner whenever fallback mode is engaged.

## Consequences
- AI enrichment reliably produces rich Greek/Latin etymology, collocations, cloze drills, and distinction matrices on `gemini-3.8-flash`.
- Eliminates silent failures and tautological fallback definitions.
- Full diagnostic transparency allows instant remote verification of real LLM generation.
