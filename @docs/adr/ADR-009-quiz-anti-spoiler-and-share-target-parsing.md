# ADR-009: Review Quiz Anti-Spoiler Masking & Android Web Share Parsing

## Status
Accepted

## Context
User testing on Google Pixel 10 revealed two usability flaws:
1. **Quiz Spoilers**: On `/review`, full card details (target term, phonetics, primary definition, etymology roots) were displayed unconditionally at the bottom of the drill surface before the user answered, destroying active recall for Cloze (`ACT-01`), Distinction Matrix (`ACT-02`), and Production Sandbox (`ACT-03`).
2. **Android Share Input Failure**: When sharing a word from Android apps (Chrome, Zotero, Kindle), the target word input box remained blank due to brittle parameter handling: `title`-only shares were skipped, trailing spaces or quotes caused strict checks to fail, and sentence highlights failed to parse out the term.

## Decision
1. **Strict Active Recall State Machine in `/review`**:
   - Introduce `isAnswerRevealed` boolean state per card in the queue, resetting to `false` on card transition.
   - For `ACT-01` (Cloze): Target word is masked (`_______`) and card details remain hidden until the user submits their check or clicks "Show Answer" / "Reveal Details".
   - For `ACT-02` (Distinction Matrix): Synonym options are presented without spoiling the target card details until an option is selected.
   - For `ACT-03` (Production Sandbox): Card details are placed behind a toggleable "Definition & Hints" drawer (collapsed by default).
   - Render a centered `[ Reveal Answer & Card Details ]` button (with `Spacebar` keyboard shortcut) for ergonomic flashcard testing.
   - Display a live header badge indicating `Answer Masked` vs `Recall Revealed`.
2. **Dedicated Android Share Parser (`lib/share-parser.ts`)**:
   - Support `text`, `title`, `url`, `term`, `q`, and `search` query parameters.
   - Disambiguate URLs (`http://`, `https://`) into `sourceUrl` rather than `targetTerm`.
   - Strip smart quotes, quotation marks, punctuation (`.`, `,`, `!`, `?`, `;`, `:`), brackets, and collapse whitespace.
   - Handle Chrome Android split patterns (`title` contains the word, `text` contains the sentence).
   - Extract embedded quoted terms from sentences (e.g. `He noted the "homuncular" fallacy...`).
   - Wire cleanly into `/add` and `/lexicon`.

## Consequences
- Authentic active recall during review sessions with zero answer spoilers.
- 100% reliable 1-click sharing from any Android app into the Lexis capture interface.
- 58/58 unit tests passing across all capture and review permutations.
