import { LexicalEnrichmentPayload } from './schema';
import { PHILOSOPHICAL_SEED_CARDS } from '@/lib/db/philosophical-seed-data';
import { SPANISH_LITERARY_SEED_CARDS } from '@/lib/db/spanish-seed-data';

export type CuratedLexiconEntry = Omit<LexicalEnrichmentPayload, 'term' | 'language'> & {
  language?: 'en' | 'es';
  gender?: 'masculine' | 'feminine' | 'neuter' | null;
  english_gloss?: string | null;
};

// ============================================================================
// Curated 25 High-Register Spanish Literary & Philosophical Entries (CUR-02)
// ============================================================================
const SPANISH_CURATED_ENTRIES: Record<string, CuratedLexiconEntry> = {};

for (const card of SPANISH_LITERARY_SEED_CARDS) {
  const entry: CuratedLexiconEntry = {
    language: 'es',
    gender: card.gender ?? null,
    english_gloss: card.english_gloss ?? null,
    part_of_speech: card.part_of_speech,
    phonetic: card.phonetic || '',
    primary_definition: card.primary_definition,
    nuance_note: card.nuance_note || '',
    etymology: card.etymology,
    collocations: card.collocations,
    source_context: {
      sentence: card.source_context.sentence,
      source: card.source_context.source,
      author: card.source_context.author || null,
    },
    cloze_sentences: card.cloze_sentences,
    distinction_matrix: card.distinction_matrix || {
      synonyms: [card.term],
      nuanceComparison: '',
      contextRecommendations: [],
    },
  };

  const termLower = card.term.toLowerCase();
  SPANISH_CURATED_ENTRIES[termLower] = entry;
  // Also index accent-normalized key so lookups without accents resolve cleanly
  const normalized = termLower.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (normalized !== termLower && !SPANISH_CURATED_ENTRIES[normalized]) {
    SPANISH_CURATED_ENTRIES[normalized] = entry;
  }
}

// ============================================================================
// Curated 100 Philosophical & Literary Foundational Entries
// ============================================================================
const PHILOSOPHICAL_ENTRIES: Record<string, CuratedLexiconEntry> = {};

for (const card of PHILOSOPHICAL_SEED_CARDS) {
  PHILOSOPHICAL_ENTRIES[card.term.toLowerCase()] = {
    language: 'en',
    gender: null,
    english_gloss: null,
    part_of_speech: card.part_of_speech,
    phonetic: card.phonetic || '',
    primary_definition: card.primary_definition,
    nuance_note: card.nuance_note || '',
    etymology: card.etymology,
    collocations: card.collocations,
    source_context: {
      sentence: card.source_context.sentence,
      source: card.source_context.source,
      author: card.source_context.author || null,
    },
    cloze_sentences: card.cloze_sentences,
    distinction_matrix: card.distinction_matrix || {
      synonyms: [card.term],
      nuanceComparison: '',
      contextRecommendations: [],
    },
  };
}

export const CURATED_LEXICON: Record<string, CuratedLexiconEntry> = {
  ...PHILOSOPHICAL_ENTRIES,
  ...SPANISH_CURATED_ENTRIES,
};

