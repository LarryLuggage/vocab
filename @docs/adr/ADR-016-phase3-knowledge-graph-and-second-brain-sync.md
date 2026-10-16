# ADR-016: Phase 3 Knowledge Graph, Second-Brain Markdown Sync & Targeted Drills

## Status
Accepted. Extends ADR-001, ADR-004, ADR-005, ADR-013, and ADR-015.

## Context
With Phases 1 and 2 of Lexis Engine complete—alongside Dual-Language English/Spanish support (ADR-013) and the 100-term Philosophical & Literary Curriculum (ADR-015)—the platform needed to fulfill Phase 3 of the Product Requirement Document (`@spec.md` Section 5: *Knowledge Graph & Second-Brain Sync*):
1. **Etymological Constellation & Root Network Visualization (`GRAPH-01`)**: While `/lexicon` offered a flat card catalog and a grouped list of roots, users lacked an interactive visual knowledge graph showing how vocabulary words interconnect across Greek, Latin, and Andalusi Arabic roots and cognates.
2. **Obsidian & NotebookLM Second-Brain Export (`SYNC-01`)**: `/api/export` supported JSON and Anki CSV formats, but lacked a structured Markdown export with YAML frontmatter, `[[wikilinks]]`, and active production sentence logs required for Obsidian vaults and NotebookLM synthesis.
3. **Targeted Cluster, Word & Source Drills (`SRS-04`)**: Clicking "Practice Drill" on `/lexicon` previously opened `/review` at the front of the standard due queue rather than allowing targeted practice on a specific etymological root cluster (`/review?root=...`), individual card (`/review?cardId=...`), or reading source (`/review?source=...`), especially when those cards were scheduled for a future FSRS due date.

## Decision

### 1. Interactive SVG Morpheme Constellation (`components/MorphemeGraph.tsx`)
- Created a zero-dependency, responsive SVG network visualizer (`viewBox="0 0 860 540"`) rendered under the new **Root Network** (`viewMode === 'network'`) tab in `app/lexicon/page.tsx`.
- **Deterministic Multi-Ring Layout**:
  - Places Root Hub nodes in a balanced radial constellation color-coded by linguistic origin (`Greek` in sky blue, `Latin` in terracotta, `Árabe` in emerald).
  - Orbits single-root vocabulary cards around their parent hub and positions multi-root bridge words at the centroid between shared root hubs.
  - Renders dashed cognate edges between cards sharing explicit `etymology.cognates` entries.
- **Interactive Controls & Side-by-Side Inspector**:
  - Supports cluster filtering (`All Root Clusters` vs `Shared Roots (2+ Words)`), zoom (`+`, `-`, `Reset`), and click-and-drag panning.
  - Clicking a **Root Hub** highlights all connected derivatives and populates the Inspector Panel with root metadata, member cards, FSRS stability metrics, and a 1-click **"Drill This Root Cluster →"** CTA (`/review?root=<morpheme>`).
  - Clicking a **Word Node** highlights its parent root hubs, displays full lexical details and clickable root pills, and provides a 1-click **"Practice '<term>' Now →"** CTA (`/review?cardId=<id>`).

### 2. Second-Brain Markdown Serializer (`lib/export-markdown.ts` & `app/api/export/route.ts`)
- Added `listAllProductionLogs(userId)` in `lib/db/index.ts` to retrieve all user-authored sentences and LLM critiques from `production_logs` grouped by `card_id`.
- Created `formatLexiconAsMarkdown(cards, logsByCardId)` in `lib/export-markdown.ts`, generating a consolidated Markdown knowledge base containing:
  - **YAML Frontmatter**: `title`, `exported_at`, `total_cards`, `languages`, and `tags: [lexis-engine, second-brain, notebooklm, obsidian, vocabulary]`.
  - **Morphological Root Index**: Every root morpheme formatted as an Obsidian wikilink `[[morpheme]]` mapped to its derived `[[term]]` entries.
  - **Lexical Entries**: Complete lexicographical dossiers per card including IPA, POS, grammatical gender, FSRS stability/difficulty/reps, primary definition, English gloss anchor, connotative nuance, `[[root]]` and `[[cognate]]` wikilinks, collocations, distinction matrix, bibliographic citation, and validated `production_logs` sentences.
- Extended `GET /api/export` to support `?format=markdown` (and `?format=md`) with `Content-Type: text/markdown; charset=utf-8` and wired the **Export Markdown** button into the `app/lexicon/page.tsx` header.

### 3. Targeted Review Queue Filtering (`lib/db/index.ts`, `app/api/review/route.ts`, `app/review/page.tsx`)
- Introduced `ReviewQueueFilters` (`{ language?, cardId?, root?, source?, includeAll? }`) in `lib/db/index.ts` while maintaining full backward compatibility with string `language` arguments.
- When `cardId`, `root`, `source`, or `includeAll` is active, `getDueCards` bypasses the `due <= asOf` ceiling so users can drill any etymological cluster, reading source, or specific card on demand.
- Updated `app/review/page.tsx` to read `?cardId=`, `?root=`, and `?source=` URL search parameters, pass them to `/api/review`, and display a **Focused Drill Banner** with a 1-click **"Exit Focused Drill"** button to return to the standard FSRS due queue.

## Consequences
- Users can visually explore morphological constellations on `/lexicon` and jump directly into focused root-family or single-word practice sessions on `/review`.
- One-click Markdown export seamlessly feeds personal Obsidian vaults and Google NotebookLM notebooks with both curated definitions and the user's own validated production sentences.
- Zero external graph library dependencies added; Next.js production bundle remains lightweight (`133 kB` First Load JS on `/lexicon` and `/review`).
- All 12 Vitest test suites (111/111 tests) and `next build` pass with 0 errors.
