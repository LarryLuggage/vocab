# ADR-002: Adoption of ts-fsrs for Spaced Repetition Scheduling

## Status
Accepted

## Context
Traditional spaced repetition implementations use Anki's legacy SuperMemo SM-2 algorithm, which assumes constant forgetting curves and crude heuristic multipliers. The Free Spaced Repetition Scheduler (FSRS) is based on modern cognitive science (DSR model: Difficulty, Stability, Retrievability) and consistently demonstrates higher retention accuracy and lower review fatigue.

## Decision
Integrate the official `ts-fsrs` library for all card scheduling.
- Track card states: `0: New`, `1: Learning`, `2: Review`, `3: Relearning`.
- Store parameters: `stability`, `difficulty`, `elapsed_days`, `scheduled_days`, `reps`, `lapses`, and `last_review`.
- Expose standard 4-button grading: Again (1), Hard (2), Good (3), Easy (4).
- Sort the review queue primarily by `due ASC`.

## Consequences
- Superior scheduling precision for users.
- Clean separation between card content (`vocab_cards`) and scheduling metrics (`srs_cards`).
