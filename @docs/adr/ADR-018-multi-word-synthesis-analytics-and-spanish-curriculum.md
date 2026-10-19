# ADR-018: Multi-Word Synthesis Studio (`ACT-04`), FSRS 14-Day Retention Analytics (`SRS-05`), and Curated 25-Term Spanish Literary Curriculum (`CUR-02`)

**Status:** Accepted  
**Date:** 2026-10-19  
**Deciders:** Lead Agentic Architect, User  

---

## Context

With Tier 1 (`ADR-016`: Morpheme Network Graph, Second-Brain Markdown Export, and Targeted Drills) and Tier 2 (`ADR-017`: Card Lifecycle Inspector Drawer, AI Re-Enrichment, Bibliographic Source Explorer, and Global `⌘K` Quick Capture) complete, the final tier of our roadmap focuses on elevating active production from isolated single-sentence drills to multi-concept synthesis, surfacing FSRS v5 memory dynamics visually, and establishing bilingual parity with a curated Spanish literary and philosophical curriculum:

1. **Multi-Concept Active Synthesis (`ACT-04`)**: While `ACT-03` tests single-word sentence composition, genuine intellectual mastery requires weaving multiple high-register concepts together into a cohesive paragraph or complex argument without artificial forcing.
2. **FSRS v5 Memory Telemetry & Workload Forecasting (`SRS-05`)**: Every card tracks `stability` ($S$), `difficulty` ($D$), `reps`, `lapses`, and `due`, yet users lacked a macro-level view of their upcoming 14-day review workload, maturity distribution, and high-difficulty "leech" items.
3. **Bilingual Curriculum Parity (`CUR-02`)**: While English had a 100-term Philosophical & Literary Seed Curriculum (`ADR-015`), the Spanish track (`🇪🇸 ES`) only had 5 curated entries in `lib/llm/curated-lexicon.ts` and no 1-click curriculum loader on `/lexicon`.

---

## Decision

### 1. `ACT-04`: Multi-Word Synthesis Studio ("Paragraph Weave")
- Extended `ProductionValidationResult` in `types/lexis.ts` with `termsDetected?: string[]` and `missingTerms?: string[]`.
- Implemented `validateSynthesisFallback` and `validateSynthesisPassage` in `lib/llm/validator.ts` (and client wrapper in `lib/production-validator.ts`), supporting both heuristic morphological stem detection (across English and Spanish inflections/accents) and Gemini LLM evaluation of conceptual cohesion across 2–3 target words.
- Extended `POST /api/validate-production` (`app/api/validate-production/route.ts`) to accept `{ terms: string[], userSentence: string, cardIds?: string[] }` and log the synthesis attempt against every participating card in `production_logs`.
- Added the 4th active practice tab (`ACT-04: Synthesis Weave`) on `/review` (`app/review/page.tsx`) with a 2-word / 3-word weave selector, live client-side word-detection chips (`✓ Woven` vs `○ Pending`), synthesis verification feedback, and a reference drawer.

### 2. FSRS 14-Day Retention Forecast & Memory Analytics (`SRS-05`)
- Created `components/RetentionAnalytics.tsx` and mounted it under the new `Analytics` view mode (`?view=analytics`) on `/lexicon` (`app/lexicon/page.tsx`).
- Computes and renders:
  - **Summary KPI Strip**: Mean Stability ($S$ in days), Mean Difficulty ($D$ on `0.0–10.0` scale), Retention Maturity (`Mature S ≥ 21d` vs `Young Review` vs `Learning/New`), and Total Active Reps & Lapses.
  - **14-Day Review Workload Forecast**: Stacked daily bar chart (`Today` through `+13d`) broken down by English (`🇬🇧 EN`) and Spanish (`🇪🇸 ES`) queues.
  - **Mastery & Stability Distribution Bar**: Segmented visual breakdown across FSRS states.
  - **High-Difficulty & Leech Watchlist**: Surfaces cards with `lapses >= 1` or high difficulty (`D >= 6.0`) with 1-click **Inspect** (`CardInspectorDrawer`) and **Drill Now** (`/review?cardId=...`) actions.

### 3. Curated 25-Term High-Register Spanish Literary & Philosophical Seed Pack (`CUR-02`)
- Created `lib/db/spanish-seed-data.ts` exporting `SPANISH_LITERARY_SEED_CARDS` (`25` C1/C2 literary and philosophical Spanish terms including *desasosiego*, *zozobra*, *albedrío*, *enajenación*, *entelequia*, *quimera*, *ubicuidad*, *devenir*, *hastío*, *inefable*, *cavilación*, *sosiego*, *exégesis*, *azogue*, *semblanza*, *palimpsesto*, *aporía*, *inmanencia*, *efímero*, *verosimilitud*, plus *desahuciado*, *acontecer*, *añoranza*, *ojalá*, *sobrecoger*) with authentic literary citations (*Borges, Ortega y Gasset, Unamuno, Octavio Paz, Cortázar, Sor Juana Inés de la Cruz, Alfonso Reyes, María Zambrano*), Latin/Greek/Andalusi Arabic roots, and staggered FSRS scheduling.
- Merged `SPANISH_LITERARY_SEED_CARDS` into `CURATED_LEXICON` in `lib/llm/curated-lexicon.ts` for zero-latency offline enrichment.
- Created `POST /api/cards/seed` (`app/api/cards/seed/route.ts`) to idempotently seed `'es-literary'`, `'en-philosophical'`, or `'all'` into the active store without duplicating existing terms, and wired 1-click seed buttons into `/lexicon`.

---

## Consequences

- **Positive**: Users can now practice multi-word rhetorical synthesis (`ACT-04`), inspect their 14-day FSRS memory forecast and leech watchlist (`SRS-05`), and load a rich 25-word Spanish literary/philosophical curriculum (`CUR-02`) with one click.
- **Negative / Trade-offs**: Multi-word synthesis logs an entry per participating card in `production_logs`, slightly increasing log volume in exchange for complete per-card production history inside `CardInspectorDrawer`.
