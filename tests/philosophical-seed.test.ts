import { describe, it, expect } from 'vitest';
import { PHILOSOPHICAL_SEED_CARDS, getPhilosophicalSeedCards } from '@/lib/db/philosophical-seed-data';
import { CURATED_LEXICON } from '@/lib/llm/curated-lexicon';
import { LexicalEnrichmentSchema } from '@/lib/llm/schema';
import { enrichWord } from '@/lib/llm/enricher';

describe('100-Term Philosophical & Literary Curriculum Integrity', () => {
  it('exports exactly 100 unique philosophical cards', () => {
    expect(PHILOSOPHICAL_SEED_CARDS.length).toBe(100);

    const terms = PHILOSOPHICAL_SEED_CARDS.map(c => c.term.toLowerCase());
    const uniqueTerms = new Set(terms);
    expect(uniqueTerms.size).toBe(100);
  });

  it('assigns deterministic UUIDs and staggered FSRS scheduling batches', () => {
    // Check first card (Batch 0: due now/past)
    const first = PHILOSOPHICAL_SEED_CARDS[0];
    expect(first.id).toBe('00000000-0000-0000-0000-000000000001');
    expect(first.srs.card_id).toBe(first.id);
    expect(first.srs.scheduled_days).toBe(0);

    // Due date should be earlier than now
    const now = new Date();
    expect(new Date(first.srs.due).getTime()).toBeLessThan(now.getTime());

    // Check 10th card (Batch 0)
    const tenth = PHILOSOPHICAL_SEED_CARDS[9];
    expect(tenth.srs.scheduled_days).toBe(0);

    // Check 11th card (Batch 1: due in 1 day)
    const eleventh = PHILOSOPHICAL_SEED_CARDS[10];
    expect(eleventh.srs.scheduled_days).toBe(1);

    // Check last card (Batch 9: due in 9 days)
    const last = PHILOSOPHICAL_SEED_CARDS[99];
    expect(last.id).toBe('00000000-0000-0000-0000-000000000100');
    expect(last.srs.scheduled_days).toBe(9);
  });

  it('validates every card against LexicalEnrichmentSchema and strict quality constraints', () => {
    for (const card of PHILOSOPHICAL_SEED_CARDS) {
      // Validate schema
      const parseResult = LexicalEnrichmentSchema.safeParse({
        term: card.term,
        language: card.language || 'en',
        part_of_speech: card.part_of_speech,
        phonetic: card.phonetic,
        primary_definition: card.primary_definition,
        nuance_note: card.nuance_note,
        etymology: card.etymology,
        collocations: card.collocations,
        source_context: card.source_context,
        cloze_sentences: card.cloze_sentences,
        distinction_matrix: card.distinction_matrix,
      });

      expect(parseResult.success, `Card '${card.term}' failed schema validation`).toBe(true);

      // Verify etymology
      expect(card.etymology.roots.length).toBeGreaterThan(0);
      for (const root of card.etymology.roots) {
        expect(root.morpheme.length).toBeGreaterThan(0);
        expect(root.meaning.length).toBeGreaterThan(0);
        expect(root.origin.length).toBeGreaterThan(0);
      }

      // Verify collocations
      expect(card.collocations.length).toBeGreaterThanOrEqual(3);

      // Verify source context
      expect(card.source_context.sentence).toBeTruthy();
      expect(card.source_context.source).toBeTruthy();

      // Verify cloze sentences
      expect(card.cloze_sentences.length).toBe(2);
      for (const cloze of card.cloze_sentences) {
        expect(cloze).toContain('{{c1::');
        expect(cloze).toContain('}}');
      }

      // Verify distinction matrix
      expect(card.distinction_matrix).toBeDefined();
      expect(card.distinction_matrix?.synonyms.length).toBe(3);
      expect(card.distinction_matrix?.contextRecommendations.length).toBe(3);
    }
  });

  it('synchronizes all 100 terms into CURATED_LEXICON with dual-language support', () => {
    // 100 philosophical terms + 5 Spanish terms = at least 105 entries
    expect(Object.keys(CURATED_LEXICON).length).toBeGreaterThanOrEqual(105);

    // Verify key philosophical touchstones exist in CURATED_LEXICON
    const sampleTerms = ['aporia', 'episteme', 'hauntology', 'bricolage', 'différance', 'clinamen', 'liminality'];
    for (const term of sampleTerms) {
      expect(CURATED_LEXICON[term], `Term '${term}' not in CURATED_LEXICON`).toBeDefined();
      expect(CURATED_LEXICON[term].primary_definition.length).toBeGreaterThan(20);
    }

    // Verify Spanish terms are intact
    expect(CURATED_LEXICON['añoranza'].language).toBe('es');
    expect(CURATED_LEXICON['ojalá'].language).toBe('es');
  });

  it('enriches a novel capture of a curriculum term instantly with zero LLM API dependency', async () => {
    const res = await enrichWord('hauntology');
    expect(res.term).toBe('hauntology');
    expect(res.primary_definition).toContain('spectral');
    expect(res.etymology.roots.some(r => r.morpheme === 'hanter')).toBe(true);
    expect(res.cloze_sentences.length).toBe(2);
  });

  it('supports custom user ID mapping via getPhilosophicalSeedCards', () => {
    const customUser = '11111111-2222-3333-4444-555555555555';
    const mapped = getPhilosophicalSeedCards(customUser);
    expect(mapped.length).toBe(100);
    expect(mapped[0].user_id).toBe(customUser);
    expect(mapped[0].srs.user_id).toBe(customUser);
  });
});
