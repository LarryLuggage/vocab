# ADR-006: Single-User Personal OS Architectural Pivot

## Status
Accepted

## Context
Lexis Engine was originally conceived with standard multi-tenant SaaS assumptions (Supabase auth policies, user IDs). The user confirmed that the system is strictly a single-user private tool designed to augment their personal reading and writing workflow.

## Decision
1. **Eliminate Multi-User Friction**: Strip away login screens, session management, and tenant isolation overhead. The application directly opens to the user's personal lexicon.
2. **Private Token Ingestion API (`/api/ingest`)**: Secure external captures from the Chrome extension and iOS Shortcuts with a static secret token (`LEXIS_SECRET_TOKEN`) verified via `Authorization: Bearer <token>` or `x-lexis-token` header.
3. **Elevate Frictionless Capture to P0**: Build a native Manifest V3 Chrome Extension with sentence extraction and background enrichment.
4. **Enrich Source Context**: Add author, title, and URL metadata to captured words.

## Consequences
- Radically faster capture experience while reading.
- Simplified code path and zero maintenance overhead for user sessions.
- Clean and secure remote ingestion from any device.
