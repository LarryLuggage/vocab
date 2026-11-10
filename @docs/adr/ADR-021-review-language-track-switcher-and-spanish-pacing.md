# ADR-021: Review Language Track Switcher (`🇬🇧 English` ⇄ `🇪🇸 Español`), Stateful Queue Pruning & Spanish Pacing Assist

**Status:** Accepted  
**Date:** 2026-11-10  
**Deciders:** Lead Agentic Architect, User  

---

## Context

In daily FSRS review sessions on `/review`, Spanish vocabulary exercises (`🇪🇸 ES`) present higher cognitive friction (inflected verb forms, grammatical gender, RAE-style definitions, and active Spanish sentence production) compared to English (`🇬🇧 EN`) vocabulary drills. Four limitations in the prior implementation slowed down review velocity:

1. **Non-Persistent Language Track**: `selectedLanguage` reset to `'all'` on every page load without `localStorage` persistence or `?language=en|es|all` URL support.
2. **Stateless Queue Reset on Track Switch**: Rating a card advanced `currentIndex` without pruning the graded card from `rawQueue`. Toggling between English and Spanish mid-session reset `currentIndex` to `0` and re-presented already-graded cards.
3. **Opaque Cross-Track Completion**: Finishing one language track displayed the generic session conclusion screen without surfacing remaining due cards in the other language or offering a 1-click switch.
4. **All-or-Nothing Answer Masking on Spanish Cards**: Spanish cloze drills (`ACT-01`) hid the `english_gloss` anchor until the user surrendered (`Show Answer`), penalizing recall when only a lightweight English anchor was needed.

---

## Decision

### 1. Pure Review Queue & Language Track Engine (`lib/review-queue.ts`)
- Extracted deterministic, pure helpers for queue partitioning and session state:
  - `normalizeCardLanguage` and `parseReviewLanguageParam` (`?language=en|es|all`).
  - `computeLanguageQueueCounts` returning `{ totalDue, enDue, esDue }` (also surfaced in `GET /api/review` under `counts`).
  - `filterAndOrderReviewQueue(cards, track, mixedOrder)` supporting isolated `'en'` and `'es'` tracks as well as `'all'` with `'en-first'`, `'es-first'`, or `'due'` ordering.
  - `pruneRatedCardsFromQueue(cards, ratedCardIds)` removing graded cards immediately from `rawQueue` so mid-session track toggling never replays completed cards.
  - `deferCardToEndOfQueue(cards, cardId)` allowing users to push a slow card to the end of the active queue.
  - `toggleEnglishSpanishTrack` and `cycleReviewLanguageTrack` for 1-keystroke track switching.

### 2. Prominent Language Track Switcher & Spanish Pacing Controls (`app/review/page.tsx`)
- **Language Track Switcher Bar**: Top-level segmented control (`🇬🇧 English Only`, `🇪🇸 Español Only`, `🌐 All Languages`) with live remaining badges, a **`Toggle EN ⇄ ES [L]`** button/hotkey, and an **`Order: 🇬🇧 English First`** toggle in Mixed mode.
- **URL & `localStorage` Sync**: Syncs active track with `?language=` query parameter and `localStorage` (`lexis_review_language_preference`).
- **Spanish Pacing & Assist Toolbar**: Displayed on Spanish cards with:
  - **`English Gloss Hint [H]`**: Reveals `card.english_gloss` and grammatical gender without revealing the Spanish target word or penalizing recall.
  - **`Auto-Gloss ES`**: Persistent toggle (`lexis_review_spanish_auto_gloss`) to automatically display the English gloss on Spanish drills.
  - **`Switch to 🇬🇧 English (N)`**: 1-click escape hatch to switch to the English-only queue.
- **Defer Card (`⏭ Defer Card`)**: Moves the current card to the tail of the review queue.
- **Cross-Track Completion Bridge**: When finishing all cards in one language while due cards remain in the other language, renders a 1-click bridge card to continue into the remaining language track.

### 3. Command Palette Integration (`components/CommandPaletteModal.tsx`)
- Added `Review English Queue Only (/review?language=en)` and `Review Spanish Queue Only (/review?language=es)` studio navigation commands to `⌘K`.

---

## Consequences

- **Positive**: Learners can isolate fast-paced English review sessions from intensive Spanish drills, toggle tracks at any time via UI or `[L]` hotkey without losing session state, prioritize English cards first in mixed sessions, and use non-penalizing English gloss hints (`[H]`) to maintain Spanish review velocity.
- **Verification**: 159/159 Vitest tests passing across 15 test suites (`tests/review-language-toggle.test.ts` adds 17 unit and API tests).
