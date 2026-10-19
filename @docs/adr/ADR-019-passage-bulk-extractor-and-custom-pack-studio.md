# ADR-019: Reader Passage & Book Highlight Bulk Extractor (`ING-09`) and Custom Pack Studio & Topic Generator (`CUR-03`)

**Status:** Accepted  
**Date:** 2026-10-19  
**Deciders:** Lead Agentic Architect, User  

---

## Context

With Phases 1 through 5.1 complete (`ADR-001` through `ADR-018`), Lexis Engine supports single-word capture (`/add`, Chrome Extension, Android Web Share Target, Zotero script), four active practice modalities (`ACT-01` through `ACT-04`), FSRS 14-day retention forecasting (`SRS-05`), and two fixed curriculum packs (`100 Philosophical EN` and `25 Spanish Literary ES`). Two major next-horizon workflows remained:

1. **Long-Form Passage & Highlight Batch Ingestion (`ING-09`)**: Scholars and high-register readers frequently finish an essay, article, or book chapter with multiple highlighted passages or Kindle/Readwise/Zotero export blocks. Entering words one by one in `/add` introduces unnecessary friction when a single passage contains 5–10 C1/C2 candidate concepts.
2. **Thematic & Custom Topic Curriculum Generation (`CUR-03`)**: Beyond the core 100 English philosophical and 25 Spanish literary packs, learners studying specific intellectual domains (e.g., *Aesthetics & Poetics*, *Political Economy & Critical Theory*, *Phenomenology & Mind*, *Boom Latinoamericano & Realismo Mágico*, or custom syllabi such as *Stoic Ethics*) need a way to preview, customize, and batch-seed domain-specific packs on demand.

---

## Decision

### 1. Reader Passage & Book Highlight Bulk Extractor (`ING-09`)
- **`lib/llm/passage-extractor.ts` & `POST /api/extract-passage`**:
  - Segments pasted long-form text or multi-highlight blocks into contextual sentences and parses embedded academic/book citations via `parseZoteroAnnotation`.
  - Uses a dual-engine extraction pipeline:
    1. **Gemini 2.5 Flash Structured Extraction** (when `GEMINI_API_KEY` is configured) to identify up to `maxCandidates` C1/C2 headwords, lemmatize surface inflections, extract exact passage sentences, and synthesize morphological roots, nuances, and cloze drills.
    2. **Deterministic Offline / Fallback Lexical Analyzer** that cross-references tokens against all curated lexicons (`CURATED_LEXICON`, `PHILOSOPHICAL_SEED_CARDS`, `SPANISH_LITERARY_SEED_CARDS`, `THEMATIC_PACKS`) and Greek/Latin/Arabic morphological affixes via `enrichWord`.
  - Cross-checks extracted candidates against the user's current lexicon to flag whether each word will create a **New Card** or **Append a Literary Sighting** to an existing card.
- **`POST /api/cards/batch` (`app/api/cards/batch/route.ts`)**:
  - Processes selected passage candidates in bulk: novel words are inserted in a single batch via `bulkCreateCards`, while existing words have their new passage sentence and citation appended via `buildAppendedContext` + `updateCardContent`.
- **`/add?mode=passage` (`app/add/page.tsx`)**:
  - Adds a top-level mode switcher between **Single Word Capture** and **Passage & Highlight Extractor (Bulk)** with 1-click sample passages (`🇬🇧 EN` / `🇪🇸 ES`), candidate review checkboxes, and batch ingestion.

### 2. Custom Curated Pack Studio & Topic Generator (`CUR-03`)
- **`lib/db/thematic-packs.ts`**:
  - Adds 4 new deeply curated 10-card C1/C2 domain packs (`40` new cards total, expanding the built-in curated library from `125` to `165` cards across `6` packs):
    1. `aesthetics-poetics` (*Aesthetics, Art & Poetics*, `🇬🇧 EN`)
    2. `political-economy` (*Political Economy & Critical Theory*, `🇬🇧 EN`)
    3. `phenomenology-mind` (*Phenomenology & Philosophy of Mind*, `🇬🇧 EN`)
    4. `boom-realismo-magico` (*Boom Latinoamericano & Realismo Mágico*, `🇪🇸 ES`)
- **`lib/llm/pack-generator.ts` & `GET / POST /api/cards/packs`**:
  - `GET /api/cards/packs` returns all 6 curated & thematic packs with real-time lexicon ownership counts (`ownedCount`, `remainingCount`).
  - `POST /api/cards/packs` supports `action: 'preview'` and `action: 'seed'` for both preset `packId`s and freeform custom `topic` prompts in English or Spanish.
- **`components/CustomPackModal.tsx` & `app/lexicon/page.tsx`**:
  - Mounts the **Pack Studio & Custom Topics** modal on `/lexicon` (also accessible via `/lexicon?packStudio=open`) with ownership progress bars, word-level preview checklists, and a Custom AI Topic Generator tab.

---

## Consequences

- **Positive**: Transforms `/add` into both a precision single-word capture tool and a bulk passage/highlight harvester (`ING-09`), while expanding `/lexicon` with 4 new thematic domain packs and an on-demand Custom Topic Generator (`CUR-03`) backed by single-batch `bulkCreateCards` persistence.
- **Negative / Trade-offs**: In offline/fallback mode without a live `GEMINI_API_KEY`, custom topic generation draws from the 165-card curated & thematic corpus and morphological heuristics rather than open-ended LLM synthesis.
