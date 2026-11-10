# ADR-020: Writing Revision & Register Coach (`ACT-05`), Global `⌘K` Command Palette, Writing Portfolio & Cross-Lingual Cognate Bridge

**Status:** Accepted  
**Date:** 2026-10-30  
**Deciders:** Lead Agentic Architect, User  

---

## Context

With Phases 1 through 6 complete (`ADR-001` through `ADR-019`), Lexis Engine provides frictionless vocabulary capture, deep morphological enrichment, FSRS scheduling, four active practice modalities (`ACT-01` through `ACT-04`), 14-day retention forecasting, bulk passage extraction (`ING-09`), and thematic pack generation (`CUR-03`).

To close the loop between **passive/active vocabulary drills** and **real-world long-form writing**, and to unify navigation across the growing suite of studios, four capabilities were prioritized for Phase 7:

1. **Writing Revision & Register Coach (`ACT-05: Prose Polisher`)**: Writers drafting essays, articles, or reflections in English or Spanish need a way to infuse words from their *own* personal Lexis library into their drafts—replacing flat, generic phrasing with precise C1/C2 headwords they have captured and studied.
2. **Chronological Active Production & Synthesis Portfolio**: Sentences composed in `ACT-03`, multi-word synthesis weaves from `ACT-04`, and elevated essay revisions from `ACT-05` were previously only viewable card-by-card inside `CardInspectorDrawer`. A unified chronological journal with language/status filters and Markdown export turns `production_logs` into a durable writing portfolio.
3. **True Global `⌘K` / `Ctrl+K` Command Palette & Instant Lexicon Search**: Pressing `⌘K` previously redirected straight to `/add`. Upgrading `⌘K` into a keyboard-first modal Command Palette allows instant fuzzy search across headwords, definitions, roots, and authors, 1-keystroke studio jumping, and instant word capture from anywhere in the app.
4. **Cross-Lingual Etymological Cognate & Root Sibling Bridge**: Because Lexis Engine is a dual-language (`🇬🇧 EN` / `🇪🇸 ES`) operating system grounded in Greek, Latin, and Arabic morphology, inspecting a card should surface its cross-lingual cognates and root siblings already present in the user's lexicon.

---

## Decision

### 1. Writing Revision & Register Coach (`ACT-05: Prose Polisher`)
- **`lib/llm/prose-polisher.ts` & `POST /api/polish-prose` (`app/api/polish-prose/route.ts`)**:
  - Accepts `{ draft, language }` and inspects the user's personal lexicon (`getAllCardsWithSrs`).
  - **Dual-Engine Architecture**:
    1. **Gemini 2.5 Flash Structured Revision** (`mode: 'gemini'`) when `GEMINI_API_KEY` is configured: identifies flat phrases in the user's draft that can be elevated using specific headwords from the user's lexicon, returning an `elevatedDraft`, `registerDetected`, `editorialSummary`, and structured `ProsePolishSuggestion[]`.
    2. **Deterministic Lexical Coach (`mode: 'heuristic'`)**: scans the draft against synonym distinction matrices, concept keyword maps, and morphological registers in the user's lexicon to propose concrete substitutions and produce an elevated rewrite offline.
  - Also supports committing a polished revision (`{ commitCardIds, committedDraft }`) directly into `production_logs` via `logProduction`.

### 2. Chronological Writing Portfolio (`components/WritingPortfolio.tsx` & `GET /api/production-logs`)
- **`getAllProductionLogsWithCards` (`lib/db/index.ts`) & `GET /api/production-logs`**:
  - Returns all logged production entries joined with their parent card metadata (`id`, `term`, `language`, `part_of_speech`, `primary_definition`, `phonetic`) sorted newest-first.
- **`components/WritingPortfolio.tsx` (`/lexicon?view=portfolio`)**:
  - Combines the **Prose Polisher (`ACT-05`)** studio and the **Chronological Production & Synthesis Archive** with language (`All`, `🇬🇧 EN`, `🇪🇸 ES`) and status (`All`, `✓ Pass`, `Needs Polish`) filters, clickable headword badges that open `CardInspectorDrawer`, and 1-click **Export Writing Portfolio (`.md`)**.

### 3. Global `⌘K` Command Palette (`components/CommandPaletteModal.tsx` & `components/Navbar.tsx`)
- Replaces the old `/add` redirect on `⌘K` / `Ctrl+K` with a full keyboard-navigable (`↑` / `↓` / `Enter` / `Escape`) modal mounted in `Navbar.tsx`, paired with a clickable **`Search / Command (⌘K)`** button in the top header.
- Provides live lexicon search (up to 6 matches with `Inspect Dossier` and `Drill Now` actions), an instant **`✨ Capture & Enrich "<query>" in Quick Capture →`** action routing to `/add?term=...`, and 6 studio navigation commands.

### 4. Cross-Lingual Cognate & Root Sibling Bridge (`lib/cognates.ts` & `components/CardInspectorDrawer.tsx`)
- **`findCrossLingualCognates(targetCard, allCards, maxResults)`**:
  - Computes normalized Latin, Greek, and Arabic morpheme overlaps as well as explicit `etymology.cognates` cross-references across `allCards`.
  - Prioritizes `'cross-lingual'` matches (`🇬🇧 EN` ↔ `🇪🇸 ES`) ahead of `'same-language-root'` siblings.
- **`components/CardInspectorDrawer.tsx`**:
  - Renders the **"Cross-Lingual & Root Siblings in Your Lexicon"** section where clicking any sibling card pivots the drawer directly to that entry (`onSelectCard`).

---

## Consequences

- **Positive**: Completes the full intellectual lifecycle from *in-reading capture* $\rightarrow$ *etymological & cross-lingual linking* $\rightarrow$ *spaced-repetition recall* $\rightarrow$ *essay-level prose revision and portfolio export*.
- **Negative / Trade-offs**: Client-side command palette caching fetches `/api/cards` when opened and refreshes on `CARDS_UPDATED_EVENT`, which is instantaneous for personal lexicons up to several thousand cards.
