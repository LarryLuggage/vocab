# ADR-008: LLM Enrichment Hardening & Elimination of Tautological Templates

## Status
Accepted

## Context
When testing capture on a mobile device for an unseeded word ("Homuncular"), the application returned a circular, nonsensical definition: *"Pertaining to or embodying homuncular; characterized by refined intellectual or stylistic expression."*
Root cause analysis revealed that this was not an AI model hallucination:
1. The remote Gemini API call on Vercel failed (due to environment variable propagation or strict timeout/format mismatch).
2. The code silently caught the error and fell back to an internal heuristic template generator (`lib/llm/enricher.ts`), which formatted strings like `Pertaining to or embodying ${term}`.
3. The frontend displayed "Enriched in 1.12s", erroneously suggesting that the AI had produced the text.

## Decision
1. **Delete Tautological String Templates**:
   - Completely eradicate tautological templates (`Pertaining to or embodying ${term}`).
   - If AI is unreachable, query the public Free Dictionary API (`https://api.dictionaryapi.dev/api/v2/entries/en/`) to obtain real, verified Merriam-Webster/Oxford definitions, phonetics, and grammatical categories.
2. **Transparent Fallback Attribution**:
   - Explicitly flag fallback status (`is_fallback: true`, `enrichment_source: 'dictionary' | 'offline-stub'`).
   - If fallback is triggered, the UI displays an amber warning badge with a direct link to `/api/diagnostic` instead of falsely claiming successful AI enrichment.
3. **Hardened LLM Pipeline**:
   - Check all environment variable aliases (`GEMINI_API_KEY`, `GOOGLE_API_KEY`, `NEXT_PUBLIC_GEMINI_API_KEY`, `GOOGLE_AI_KEY`, `GEMINI_KEY`), trimming whitespace and quotes.
   - Robust JSON extraction (`extractJsonFromText`) stripping markdown code blocks (````json ... ````) and conversational text before parsing.
   - Resilient multi-model cascading: `gemini-3.8-flash` (current Google v1beta flagship) $\rightarrow$ `gemini-2.5-flash` $\rightarrow$ dynamic models from `ModelService.ListModels`.
   - Increased timeout from 4.0s to 7.5s to accommodate serverless cold starts.
4. **Diagnostic Route (`/api/diagnostic`)**:
   - Provide a live inspection endpoint returning sanitized environment key presence, active Vercel environment, and real-time connectivity probe results from Google Gemini.

## Consequences
- Impossible for the application to output circular pseudo-definitions.
- Instant, self-service observability for Vercel deployment environment variables.
- Resilient recovery across all standard Gemini JSON formatting variations.
