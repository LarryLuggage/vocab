# ADR-015: 100-Term Philosophical & Literary Curriculum Seeding and Dual-Delivery Infrastructure

## Status
Accepted. Extends ADR-001, ADR-004, ADR-010, and ADR-013.

## Context
Lexis Engine was conceived as a personal vocabulary operating system for high-register readers of philosophy, critical theory, and literary prose (PRD Section 2.1). However, upon deployment:
1. The backend database only contained 5 hard-coded sample cards (`perspicacious`, `solipsism`, `inchoate`, `apocryphal`, `susurrus`) initialized inside the in-memory mock store (`lib/db/seed-data.ts`).
2. There was no repeatable mechanism or SQL migration to seed an active remote Supabase PostgreSQL database. When a user initialized Supabase with migration scripts, their lexicon started empty (0 cards).
3. The user requested a robust base layer of **100 curated philosophical and literary terms** (poetic devices, critical theory, metaphysics, semiotics, rhetoric, and aesthetics) to commence daily learning immediately.

## Decision

### 1. 100-Term Scholarly Curriculum
We constructed a rigorous, fully enriched 100-term curriculum across five distinct intellectual domains:
- **Cluster 1: Epistemology, Ontology & Metaphysics (20 terms)**:
  *aporia*, *episteme*, *haecceity*, *anamnesis*, *teleology*, *incommensurable*, *solipsism*, *qualia*, *monad*, *noumenon*, *ontology*, *eschatology*, *demiurge*, *antinomy*, *hypostasis*, *immanence*, *transcendence*, *dialectic*, *noetic*, *aletheia*.
- **Cluster 2: Critical Theory, Post-Structuralism & Politics (20 terms)**:
  *simulacrum*, *interpellation*, *hegemony*, *panopticon*, *hauntology*, *bricolage*, *parrhesia*, *deterritorialization*, *rhizome*, *biopolitics*, *habitus*, *reification*, *alienation*, *hyperreality*, *subaltern*, *governmentality*, *dispositif*, *abjection*, *heterotopia*, *jouissance*.
- **Cluster 3: Literary Criticism, Semiotics & Narrative Theory (20 terms)**:
  *hermeneutics*, *palimpsest*, *polyphony*, *clinamen*, *defamiliarization*, *anomie*, *diegesis*, *mimesis*, *heteroglossia*, *chronotope*, *fabula*, *syuzhet*, *intertextuality*, *paratext*, *metalepsis*, *semiotics*, *différance*, *anagnorisis*, *hamartia*, *verisimilitude*.
- **Cluster 4: Poetics, Rhetoric & Stylistic Devices (20 terms)**:
  *chiasmus*, *synecdoche*, *metonymy*, *catachresis*, *elegiac*, *apotheosis*, *liminality*, *catharsis*, *bathos*, *anaphora*, *litotes*, *zeugma*, *aposiopesis*, *prolepsis*, *periphrasis*, *apostrophe*, *hypallage*, *synesthesia*, *enjambment*, *susurrus*.
- **Cluster 5: Aesthetics, Existentialism & Moral Philosophy (20 terms)**:
  *sublime*, *ressentiment*, *angst*, *ennui*, *eudaimonia*, *ataraxia*, *dasein*, *kenosis*, *nihilism*, *perspicacious*, *inchoate*, *apocryphal*, *obfuscate*, *ephemeral*, *hubris*, *peripeteia*, *solipsistic*, *phenomenological*, *thaumazein*, *hermetic*.

Every term includes:
- Exact part of speech and IPA phonetic guide
- Nuance notes distinguishing subtle connotative distinctions
- Etymological breakdown (roots, meanings, language of origin, and cognates)
- 4 high-register collocations
- Authentic historical or literary citation (Aristotle, Plato, Kant, Hegel, Nietzsche, Benjamin, Foucault, Derrida, Baudrillard, Bakhtin, Shklovsky, etc.)
- 2 cloze test sentences with `{{c1::<term>}}` markers
- Distinction matrix (3 close synonyms, nuance contrast, and register recommendations)

### 2. Staggered FSRS Spaced-Repetition Scheduling
Scheduling 100 new cards on the same day would overwhelm the user with a 100-card backlog on day 1. 
The 100 cards are distributed into 10 batches of 10 cards across a 10-day initial learning curve:
- **Batch 0 (Terms 1–10)**: Due immediately (`scheduled_days: 0`, `due <= now`) for the user's initial review session.
- **Batches 1–9 (Terms 11–100)**: Due on days $+1, +2, \dots, +9$ respectively (`scheduled_days: 1..9`).

### 3. Dual-Delivery Architecture
To support all development and production environments, we established:
1. **`lib/db/philosophical-seed-data.ts`**:
   - A statically typed module exporting `PHILOSOPHICAL_SEED_CARDS: CardWithSrs[]` with deterministic UUIDs (`00000000-0000-0000-0000-000000000001` through `...0100`).
   - Helper function `getPhilosophicalSeedCards(userId)` for mapping to arbitrary user UUIDs.
2. **`supabase/seed.sql`**:
   - Pure, idempotent PostgreSQL script utilizing `ON CONFLICT (id) DO UPDATE` for `vocab_cards` and `ON CONFLICT (card_id) DO UPDATE` for `srs_cards`.
   - Formatted with standard PostgreSQL `ARRAY[...]` literals and JSONB casting.
   - Compatible with 1-click execution in Supabase Dashboard SQL Editor or via `supabase db reset / seed`.
3. **CLI Seed Runner (`scripts/seed.mjs` & `pnpm db:seed`)**:
   - Standalone script that loads `.env.local`, detects Supabase credentials, and batch-upserts the 100 cards into PostgreSQL.
   - Provides clear CLI instructions when credentials are not yet present.
4. **Lexicon Synchrony (`lib/llm/curated-lexicon.ts`)**:
   - Merged the 100 terms into `CURATED_LEXICON` alongside existing curated Spanish terms.
   - Any capture of these 100 words via `/add`, Chrome extension, or Zotero resolves in $<10\text{ms}$ with zero LLM API cost.

### 4. Preservation of Test Invariants
- `createSampleCards()` in `lib/db/seed-data.ts` remains the dedicated 5-card test fixture to preserve isolated test execution in `tests/db.test.ts` and `tests/api.test.ts`.
- Added `tests/philosophical-seed.test.ts` validating that all 100 cards strictly conform to `LexicalEnrichmentSchema`, contain valid cloze formatting, non-empty etymological roots, and valid FSRS schedules.
- All 12 Vitest suites (109 tests) and `next build` compile with 100% success.

## Consequences
- The database can be populated into Supabase via `pnpm db:seed` or running `supabase/seed.sql`.
- Users start with a rich, curated foundation of 100 core philosophical and literary concepts.
- Review queue starts gracefully with 10 cards due today, introducing 10 new cards daily over the first 10 days.
- Zero regressions across existing test suites and API routes.
