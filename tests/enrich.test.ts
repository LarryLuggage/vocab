import { describe, it, expect } from 'vitest';
import { LexicalEnrichmentSchema, EtymologySchema } from '@/lib/llm/schema';
import { enrichWord, synthesizeLexicalFallback } from '@/lib/llm/enricher';

describe('Lexical Schema & Enrichment Engine (ING-02)', () => {
  it('validates a well-formed lexical schema payload', () => {
    const validData = {
      term: 'perspicacious',
      part_of_speech: 'adjective',
      phonetic: '/ˌpɜː.spɪˈkeɪ.ʃəs/',
      primary_definition: 'Having a ready insight into and understanding of things; perceptive.',
      nuance_note: 'Emphasizes penetrating insight rather than superficial cleverness.',
      etymology: {
        roots: [
          { morpheme: 'per-', meaning: 'through', origin: 'Latin' },
          { morpheme: 'specere', meaning: 'to look at', origin: 'Latin' },
        ],
        cognates: ['perspicuity', 'spectacle'],
      },
      collocations: ['perspicacious observer', 'perspicacious critique'],
      source_context: {
        sentence: 'Her perspicacious appraisal predicted market trends.',
        source: 'The Financial Times',
      },
      cloze_sentences: [
        'The {{c1::perspicacious}} critic identified the underlying metaphor.',
      ],
      distinction_matrix: {
        synonyms: ['perspicacious', 'astute', 'sagacious'],
        nuanceComparison: 'Perspicacious refers to vision penetration; astute to shrewdness.',
        contextRecommendations: [
          {
            word: 'perspicacious',
            recommendedRegister: 'Scholarly',
            exampleSentence: 'A perspicacious study of political philosophy.',
          },
        ],
      },
    };

    const parsed = LexicalEnrichmentSchema.safeParse(validData);
    expect(parsed.success).toBe(true);
  });

  it('rejects an invalid payload with missing required fields or empty cloze', () => {
    const invalidData = {
      term: '', // empty term should fail
      part_of_speech: 'noun',
      primary_definition: 'Something',
      etymology: { roots: [], cognates: [] },
      collocations: [],
      cloze_sentences: [], // empty cloze should fail
    };

    const parsed = LexicalEnrichmentSchema.safeParse(invalidData);
    expect(parsed.success).toBe(false);
  });

  it('enriches curated high-register word with rich morphemes and distinction matrix', async () => {
    const enriched = await enrichWord('perspicacious');

    expect(enriched.term).toBe('perspicacious');
    expect(enriched.part_of_speech).toBe('adjective');
    expect(enriched.primary_definition).toBeDefined();
    expect(enriched.nuance_note).toBeDefined();
    expect(enriched.etymology.roots.length).toBeGreaterThanOrEqual(2);
    expect(enriched.collocations.length).toBeGreaterThanOrEqual(3);
    expect(enriched.cloze_sentences.length).toBeGreaterThanOrEqual(1);
    expect(enriched.cloze_sentences[0]).toContain('{{c1::perspicacious}}');

    expect(enriched.distinction_matrix).toBeDefined();
    expect(enriched.distinction_matrix?.synonyms).toContain('perspicacious');
    expect(enriched.distinction_matrix?.contextRecommendations.length).toBeGreaterThanOrEqual(2);
  });

  it('integrates user context sentence into source_context and cloze drills', async () => {
    const userSentence = 'The attorney made an inchoate objection that the judge immediately overruled.';
    const enriched = await enrichWord('inchoate', userSentence, 'Courtroom Transcript');

    expect(enriched.source_context.sentence).toBe(userSentence);
    expect(enriched.source_context.source).toBe('Courtroom Transcript');
    expect(enriched.cloze_sentences.some((s) => s.includes('{{c1::inchoate}}'))).toBe(true);
  });

  it('synthesizes novel uncurated word using morphological knowledge base', async () => {
    const novelWord = 'antipathy';
    const fallback = synthesizeLexicalFallback(novelWord);

    expect(fallback.term).toBe('antipathy');
    expect(fallback.etymology.roots.length).toBeGreaterThan(0);
    // Should detect prefix anti- or root path
    const morphemes = fallback.etymology.roots.map((r) => r.morpheme);
    expect(morphemes.some((m) => m === 'anti-' || m === 'path')).toBe(true);
    expect(fallback.cloze_sentences.length).toBeGreaterThan(0);
    expect(fallback.cloze_sentences[0]).toContain('{{c1::antipathy}}');

    // Must strictly satisfy the Zod schema
    const validation = LexicalEnrichmentSchema.safeParse(fallback);
    expect(validation.success).toBe(true);
  });

  it('handles adjectives with -ous suffix and synthesizes proper part of speech', async () => {
    const word = 'tenacious';
    const fallback = synthesizeLexicalFallback(word);

    expect(fallback.part_of_speech).toBe('adjective');
    expect(fallback.cloze_sentences[0]).toContain('{{c1::tenacious}}');
    expect(LexicalEnrichmentSchema.safeParse(fallback).success).toBe(true);
  });
});
