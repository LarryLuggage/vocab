# ADR-017: Card Lifecycle Inspector Drawer, 1-Click Re-Enrichment, Bibliographic Explorer & Global `⌘K`

## Status
Accepted. Extends ADR-004, ADR-005, ADR-008, ADR-012, and ADR-016.

## Context
Following the completion of Phase 3 (Knowledge Graph, Second-Brain Markdown Sync & Targeted Drills in ADR-016), an architectural audit of Lexis Engine identified three high-impact lifecycle and UX gaps:
1. **Unexposed Card Lifecycle Operations (`LEX-01`)**: While `app/api/cards/[id]/route.ts` and `lib/db/index.ts` implemented `GET`, `PATCH`, `DELETE`, and `getProductionLogs(cardId)`, `app/lexicon/page.tsx` lacked a UI surface to inspect a card's full dossier, view historical user sentences from `production_logs` (`ACT-03`), edit card fields, delete cards, or re-run AI enrichment on cards that were originally captured via dictionary/offline fallbacks (`is_fallback: true`).
2. **Bibliographic Source / Author Exploration (`LEX-02`)**: `@spec.md` Section 2.2.3 specifies searching and exploring the personal library by reading source and author. Although Zotero and `/add` captured `source_context` (`author`, `source`, `page`, `sentence`), `/lexicon` did not group cards by reading source or match author/source metadata in instant search.
3. **Global `⌘K` Quick Capture Hotkey (`NAV-01`)**: `components/Navbar.tsx` displayed a `⌘K` badge on the Quick Capture button (`@spec.md` Section 2.2.1), but lacked a global keyboard listener.

## Decision

### 1. Enriched Card Detail & 1-Click Re-Enrichment API (`app/api/cards/[id]/route.ts`)
- **`GET /api/cards/[id]`**: Now fetches `productionLogs = await getProductionLogs(id)` alongside the card and returns `{ success: true, data: card, productionLogs }`.
- **`PATCH /api/cards/[id]`**:
  - **Re-Enrichment Mode (`{ reenrich: true }`)**: Invokes `enrichWord(existing.term, existing.source_context?.sentence || undefined, existing.language)` and updates lexical fields (`primary_definition`, `nuance_note`, `etymology`, `collocations`, `cloze_sentences`, `distinction_matrix`, `is_fallback`, `enrichment_source`) while strictly preserving the user's `existing.source_context` (quote, author, book, page) and FSRS scheduling history (`srs`).
  - **Field Edit Mode**: Updates editable card fields (`primary_definition`, `english_gloss`, `nuance_note`, `part_of_speech`, `phonetic`, `source_context`) and returns the full `CardWithSrs` payload.

### 2. Card Inspector Slide-Over Drawer (`components/CardInspectorDrawer.tsx`)
- Created an accessible slide-over inspector drawer mounted in `app/lexicon/page.tsx` (opened via each card's **"Inspect / Edit"** action or `?inspect=<cardId>` URL parameter):
  - Renders complete FSRS telemetry (`State`, `Stability`, `Difficulty`, `Reps`, `Lapses`, `Due` status), pronunciation synthesis, and all lexical fields including `distinction_matrix` and highlighted `cloze_sentences`.
  - Surfaces a prominent **"Re-Enrich with AI"** callout banner for `is_fallback: true` cards (and a header action button for any card).
  - Displays the card's **Active Production History (`ACT-03`)** from `productionLogs` with `Pass` / `Awkward` / `Incorrect` evaluation badges and LLM critiques.
  - Provides inline editing (`PATCH /api/cards/[id]`) and a 2-step delete confirmation (`DELETE /api/cards/[id]`).

### 3. Bibliographic Source Explorer & Search (`app/lexicon/page.tsx` & `lib/db/index.ts`)
- Extended both `LocalVocabStore.list` (`lib/db/index.ts`) and client-side filtering in `app/lexicon/page.tsx` to match `source_context.author`, `source_context.source`, and `source_context.sentence`.
- Added the **Sources** (`viewMode === 'sources'`, deep-linkable via `/lexicon?view=sources`) tab on `/lexicon`, grouping vocabulary cards by **Author — Book/Article Title** with a 1-click **"Drill This Source →"** button (`/review?source=...`).
- Added compact bibliographic citation blocks to cards in the Catalog view.

### 4. Global `⌘K` / `Ctrl+K` Listener (`components/Navbar.tsx`)
- Attached a global `keydown` listener in `components/Navbar.tsx` for `(e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'` that navigates directly to `/add` (or focuses and selects `#term-input` when already on `/add`).

## Consequences
- Users have full lifecycle control over every card in their lexicon—inspecting past production sentences, editing definitions or citations, deleting entries, and upgrading fallback cards in 1 click without losing FSRS progress or bibliographic context.
- Readers can browse and drill their vocabulary directly by book or author (e.g., *Aristotle*, *Kant*, *Foucault*).
- All 12 Vitest suites (121/121 tests) and `next build` pass with 0 errors.
