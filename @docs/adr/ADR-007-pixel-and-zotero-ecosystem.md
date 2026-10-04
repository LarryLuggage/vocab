# ADR-007: Google Pixel 10 Web Share Target & Zotero Academic Ecosystem

## Status
Accepted

## Context
The user's primary mobile device is a Google Pixel 10 (Android) and their scholarly reading workflow relies heavily on Zotero (desktop and mobile reader). Standard iOS Shortcut-only models fail to support Android native workflows, and generic capture fails to extract critical scholarly bibliographic context (author, book/paper title, publication year, page numbers).

## Decision
1. **W3C Web Share Target API on Pixel 10**:
   - Register Lexis Engine into Android's system-level Share Sheet via `manifest.json` (`share_target` action pointing to `/add` with `GET` parameters for `text`, `title`, and `url`).
   - Allows instant capture directly from Zotero Android, Chrome, Kindle, or PDF viewers by highlighting text and tapping "Share -> Lexis".
2. **Deterministic Academic Citation Parser (`lib/zotero-parser.ts`)**:
   - Parse parenthetical and author-date academic citations copied from Zotero (e.g. `"inchoate" (Adorno, Negative Dialectics, p. 112)` or `(Williams, 1985, pp. 24-25)`).
   - Automatically separate the target term/sentence from the citation metadata (`author`, `title`, `page`).
3. **Zotero 7 Desktop Integration Script**:
   - Provide a native JavaScript action script (`@docs/zotero-setup.md`) that integrates with Zotero 7 desktop, querying selected annotation text and paper item metadata to dispatch captures to `/api/ingest`.

## Consequences
- Frictionless capture on Android without requiring an APK or native app store distribution.
- Bibliographic provenance is preserved automatically across academic reading workflows.
- Full parity between desktop and mobile scholarly reading workflows.
