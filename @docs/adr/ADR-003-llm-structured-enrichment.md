# ADR-003: LLM Structured Output Pipeline & Resilience

## Status
Accepted

## Context
Ingestion of vocabulary words requires deep parsing: roots, cognates, nuance notes, collocations, cloze sentences, and distinction matrices. Returning unstructured prose or unvalidated JSON leads to UI crashes and parsing failures. The pipeline must also meet the non-functional requirement of latency $\le 2.5$ seconds.

## Decision
1. Implement strict Zod schemas (`LexicalEnrichmentSchema` and `ProductionEvaluationSchema`).
2. Implement an LLM adapter abstraction that supports structured output (e.g. Gemini 2.5 Flash, OpenAI Structured Outputs) with JSON schema guarantees.
3. Include an intelligent mock fallback provider for unit testing, offline scenarios, and rapid automated testing.
4. Add deduplication checks on lemma/word prior to enrichment to avoid duplicate database entries.

## Consequences
- Guaranteed runtime type safety across all frontend and backend boundaries.
- Resilient error handling and seamless offline or sandboxed testing.
