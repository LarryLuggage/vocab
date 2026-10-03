# ADR-005: Frontend UI Architecture & Multi-Modal Review Loop

## Status
Accepted

## Context
High-register vocabulary acquisition requires deliberate practice beyond binary flashcards. The user interface must support single-thumb mobile ergonomics for daily reviews while providing deep linguistic context (morphological roots, register nuances, cloze blanks) across both desktop and mobile PWA viewports.

## Decision
1. **Design System**: Warm editorial literary palette (`#fbf9f5` parchment, `#834832` terracotta, `#1c1917` ink) pairing Newsreader serif typography with Inter sans-serif for UI labels and JetBrains Mono for shortcuts/code.
2. **PWA Mobile Shell**: Bottom-docked thumb navigation bar for mobile (`/lexicon`, `/add`, `/review`) with live due badge counter.
3. **Three Active Modalities (`/review`)**:
   - `ACT-01 (Contextual Cloze Fill)`: Masked sentence drills with inline typing and instant lemma feedback.
   - `ACT-02 (Register & Distinction Matrix)`: Near-synonym discrimination matching tone and register.
   - `ACT-03 (Active Production Sandbox)`: User sentence construction with instant LLM usage inspection (`pass`, `awkward`, `incorrect_usage`).
4. **Ergonomic 4-Button FSRS Rating Bar**: Again, Hard, Good, Easy with dynamically computed interval previews (`+5m`, `+5d`, `+11d`, etc.) and keyboard shortcuts (`1`, `2`, `3`, `4`).
5. **Data Portability**: JSON export and Anki-compatible `.csv` export with formatted cloze front and rich styled HTML back.

## Consequences
- Highly responsive, distraction-free reading/writing companion.
- Complete data portability ensuring user autonomy over their lexicon.
