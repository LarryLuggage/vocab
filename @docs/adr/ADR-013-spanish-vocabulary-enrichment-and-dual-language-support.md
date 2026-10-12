# ADR-013: Spanish Vocabulary Enrichment & Dual-Language Personal OS

## Status
Accepted. Extends ADR-001, ADR-003, ADR-005, and ADR-012.

## Context
Lexis Engine was originally tailored strictly for low-frequency English prose and Greek/Latin morphology. To support intellectual reading in high-register literary and philosophical Spanish (*Borges, García Márquez, Ortega y Gasset, Octavio Paz*), the platform required a comprehensive dual-language architecture. Spanish reading introduces several unique linguistic challenges:
1. **Inflected Verb Forms**: Readers highlight conjugated verbs in text (e.g. *sobrecogió*, *desahuciaban*). Indexing inflected forms creates fragmented duplicates; cards must normalize to the infinitive lemma (*sobrecoger*, *desahuciar*) while preserving the sighted context sentence in `source_context`.
2. **Grammatical Gender**: Nouns require explicit gender identification (`masculine` / `feminine`) and article pairing (`el` / `la`).
3. **Dual-Language Definition Model**: Monolingual RAE-style literary definitions in Spanish paired with an immediate 1-line English anchor/gloss for rapid mental anchoring.
4. **Rich Etymology Expansion**: In addition to Greco-Latin roots, Spanish incorporates substantial Andalusi Arabic etymology (e.g. *ojalá*, *almohada*, *aceite*) and indigenous loanwords.
5. **False Friends (Falsos Amigos)**: High-register Spanish contains deceptive cognates (e.g. *actualmente*, *sensible*, *pretender*) requiring explicit warnings in `nuance_note`.
6. **Active Recall & Diacritic Tolerance**: Cloze drills (`ACT-01`) must tolerate accent omission during keyboard input while reinforcing proper orthography; sentence validation (`ACT-03`) must evaluate the subjunctive mood (*subjuntivo*), *ser* vs *estar*, and gender agreement.

## Decision

1. **Database & Lexical Schema**:
   - Added migration `supabase/migrations/20261012_add_language_support.sql`:
     - Added `language VARCHAR(10) DEFAULT 'en' NOT NULL`.
     - Added `gender VARCHAR(20) DEFAULT NULL` (`'masculine' | 'feminine' | 'neuter'`).
     - Added `english_gloss TEXT DEFAULT NULL`.
     - Added index `idx_vocab_language` on `vocab_cards(user_id, language)`.
   - Updated `types/lexis.ts` and `lib/llm/schema.ts` to enforce `language`, `gender`, and `english_gloss`.

2. **Language Detection & Lemma Normalization**:
   - Created `lib/language.ts` providing heuristic and diacritic-based language detection (`detectLanguage`).
   - Enhanced `extractLemmaStem` and `areTermsVariants` in `lib/db/index.ts` to recognize Spanish verbal inflections (`-ar`, `-er`, `-ir`, `-ó`, `-aba`, `-ieron`, `-ando`, `-ido`, etc.).
   - Updated `enrichWord` in `lib/llm/enricher.ts` to accept explicit `languageOverride` or auto-detect language.

3. **Bilingual LLM Enrichment Engine (`lib/llm/enricher.ts`)**:
   - Specialized prompt for Spanish vocabulary generating:
     - Infinitive lemma extraction.
     - Grammatical gender detection for nouns.
     - Monolingual RAE-style literary definition + 1-sentence English gloss.
     - Etymological origins highlighting Andalusi Arabic (*Árabe*), Latin, and Greek roots.
     - False Friends alerts in `nuance_note`.
   - Updated `GEMINI_RESPONSE_SCHEMA` and `normalizeLexicalPayload` to parse `language`, `gender`, and `english_gloss`.
   - Added offline morphological fallback (`fallbackEnrichWord`) for Spanish words.
   - Seeded curated high-register Spanish terms in `lib/llm/curated-lexicon.ts` (*desahuciado*, *acontecer*, *añoranza*, *ojalá*, *sobrecoger*).

4. **Spanish Sentence Production Validator (`lib/llm/validator.ts`)**:
   - Enhanced tokenization to preserve Spanish diacritics and eñe (`/[^a-záéíóúüñ0-9\s-]/gi`).
   - Added deterministic and LLM validation rules for:
     - Subjunctive mood enforcement (e.g. *ojalá* triggering subjunctive).
     - Copula differentiation (*ser* vs *estar*).
     - Gender and number agreement.

5. **API & Data Layer Filtering**:
   - Updated `/api/cards`, `/api/review`, and `/api/enrich` to support `?language=` query filtering.
   - Preserved single-source-of-truth semantics in both Supabase client and local in-memory store.

6. **Frontend User Experience**:
   - **Quick Capture (`/add`)**: Added pill toggle `[ Auto | 🇬🇧 English | 🇪🇸 Español ]` with live dynamic language detection indicator; rich preview renders grammatical gender badge (`el`/`la`), English anchor box, and Arabic/Latin root tags.
   - **Lexicon Catalog (`/lexicon`)**: Added language filter tabs `[ All (N) | 🇬🇧 English (N) | 🇪🇸 Español (N) ]` with live card counts; displays language flag badge and gender indicator on cards.
   - **Active Practice (`/review`)**: Added queue filter pills `[ All (N) | 🇬🇧 English (N) | 🇪🇸 Español (N) ]`; diacritic-tolerant cloze checks; Spanish prompt and syntax inspection for the Production Sandbox; dynamic speech synthesis engine switching to `es-ES` for Spanish pronunciation.

## Consequences
- Lexis Engine operates as a unified dual-language personal vocabulary OS.
- Single unified review queue allows seamless mixed practice or language-isolated drill sessions.
- High-register Spanish literature and academic texts are fully supported with culturally authentic lexicographical standards.
- 100% test pass rate maintained (103/103 Vitest tests passing).
