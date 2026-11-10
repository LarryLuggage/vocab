import { describe, it, expect, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import {
  normalizeCardLanguage,
  parseReviewLanguageParam,
  computeLanguageQueueCounts,
  filterAndOrderReviewQueue,
  pruneRatedCardsFromQueue,
  deferCardToEndOfQueue,
  toggleEnglishSpanishTrack,
  cycleReviewLanguageTrack,
  REVIEW_LANGUAGE_STORAGE_KEY,
  REVIEW_SPANISH_AUTO_GLOSS_STORAGE_KEY,
  REVIEW_MIXED_ORDER_STORAGE_KEY,
} from '@/lib/review-queue';
import { CardWithSrs } from '@/types/lexis';
import { resetDbStore, createCard, DEFAULT_USER_ID } from '@/lib/db';
import { GET as getReviewHandler } from '@/app/api/review/route';

function makeMockCard(
  id: string,
  term: string,
  language: 'en' | 'es' | undefined,
  dueOffsetMs: number = 0
): CardWithSrs {
  const now = Date.now();
  return {
    id,
    user_id: DEFAULT_USER_ID,
    term,
    language,
    part_of_speech: 'noun',
    primary_definition: `Definition for ${term}`,
    etymology: { roots: [], cognates: [] },
    collocations: [],
    source_context: { sentence: null, source: null },
    cloze_sentences: [],
    created_at: new Date(now - 86400000).toISOString(),
    srs: {
      card_id: id,
      user_id: DEFAULT_USER_ID,
      due: new Date(now + dueOffsetMs).toISOString(),
      stability: 2.5,
      difficulty: 5.0,
      elapsed_days: 1,
      scheduled_days: 1,
      reps: 1,
      lapses: 0,
      state: 2,
      last_review: new Date(now - 86400000).toISOString(),
    },
  };
}

describe('Review Language Track Toggle & Queue Partitioning (lib/review-queue.ts)', () => {
  const sampleQueue: CardWithSrs[] = [
    makeMockCard('en-1', 'perspicacious', 'en', -4000),
    makeMockCard('es-1', 'desasosiego', 'es', -3000),
    makeMockCard('en-2', 'inchoate', undefined, -2000),
    makeMockCard('es-2', 'añoranza', 'es', -1000),
    makeMockCard('en-3', 'solipsism', 'en', 0),
  ];

  describe('1. normalizeCardLanguage & parseReviewLanguageParam', () => {
    it('exports expected storage keys', () => {
      expect(REVIEW_LANGUAGE_STORAGE_KEY).toBe('lexis_review_language_preference');
      expect(REVIEW_SPANISH_AUTO_GLOSS_STORAGE_KEY).toBe('lexis_review_spanish_auto_gloss');
      expect(REVIEW_MIXED_ORDER_STORAGE_KEY).toBe('lexis_review_mixed_order');
    });

    it('normalizes card language to "es" or defaults to "en"', () => {
      expect(normalizeCardLanguage({ language: 'es' })).toBe('es');
      expect(normalizeCardLanguage({ language: 'en' })).toBe('en');
      expect(normalizeCardLanguage({ language: undefined })).toBe('en');
      expect(normalizeCardLanguage({ language: '  ES ' as any })).toBe('es');
    });

    it('parses valid language query parameters case-insensitively and returns null for invalid values', () => {
      expect(parseReviewLanguageParam('en')).toBe('en');
      expect(parseReviewLanguageParam('EN')).toBe('en');
      expect(parseReviewLanguageParam('english')).toBe('en');
      expect(parseReviewLanguageParam(' English ')).toBe('en');

      expect(parseReviewLanguageParam('es')).toBe('es');
      expect(parseReviewLanguageParam('ES')).toBe('es');
      expect(parseReviewLanguageParam('spanish')).toBe('es');
      expect(parseReviewLanguageParam('espanol')).toBe('es');
      expect(parseReviewLanguageParam('español')).toBe('es');

      expect(parseReviewLanguageParam('all')).toBe('all');
      expect(parseReviewLanguageParam('ALL')).toBe('all');
      expect(parseReviewLanguageParam('mixed')).toBe('all');

      expect(parseReviewLanguageParam('')).toBeNull();
      expect(parseReviewLanguageParam('   ')).toBeNull();
      expect(parseReviewLanguageParam(null)).toBeNull();
      expect(parseReviewLanguageParam(undefined)).toBeNull();
      expect(parseReviewLanguageParam('fr')).toBeNull();
    });
  });

  describe('2. computeLanguageQueueCounts', () => {
    it('computes accurate totalDue, enDue, and esDue counts for mixed cards', () => {
      const counts = computeLanguageQueueCounts(sampleQueue);
      expect(counts).toEqual({
        totalDue: 5,
        enDue: 3,
        esDue: 2,
      });
    });

    it('returns zeroes for an empty queue', () => {
      expect(computeLanguageQueueCounts([])).toEqual({
        totalDue: 0,
        enDue: 0,
        esDue: 0,
      });
    });
  });

  describe('3. filterAndOrderReviewQueue', () => {
    it('filters strictly to English cards when track is "en" without mutating input', () => {
      const copy = [...sampleQueue];
      const enQueue = filterAndOrderReviewQueue(sampleQueue, 'en');
      expect(enQueue.map((c) => c.id)).toEqual(['en-1', 'en-2', 'en-3']);
      expect(sampleQueue).toEqual(copy);
    });

    it('filters strictly to Spanish cards when track is "es" without mutating input', () => {
      const esQueue = filterAndOrderReviewQueue(sampleQueue, 'es');
      expect(esQueue.map((c) => c.id)).toEqual(['es-1', 'es-2']);
    });

    it('preserves due order when track is "all" and mixedOrder is "due" (default)', () => {
      const allDue = filterAndOrderReviewQueue(sampleQueue, 'all');
      expect(allDue.map((c) => c.id)).toEqual(['en-1', 'es-1', 'en-2', 'es-2', 'en-3']);
      expect(allDue).not.toBe(sampleQueue);
    });

    it('groups English cards before Spanish cards when track is "all" and mixedOrder is "en-first"', () => {
      const enFirst = filterAndOrderReviewQueue(sampleQueue, 'all', 'en-first');
      expect(enFirst.map((c) => c.id)).toEqual(['en-1', 'en-2', 'en-3', 'es-1', 'es-2']);
    });

    it('groups Spanish cards before English cards when track is "all" and mixedOrder is "es-first"', () => {
      const esFirst = filterAndOrderReviewQueue(sampleQueue, 'all', 'es-first');
      expect(esFirst.map((c) => c.id)).toEqual(['es-1', 'es-2', 'en-1', 'en-2', 'en-3']);
    });
  });

  describe('4. pruneRatedCardsFromQueue', () => {
    it('removes rated cards across track switches so rated cards never resurface mid-session', () => {
      const ratedIds = ['en-1', 'es-1'];
      const prunedPool = pruneRatedCardsFromQueue(sampleQueue, ratedIds);

      expect(prunedPool.map((c) => c.id)).toEqual(['en-2', 'es-2', 'en-3']);
      expect(filterAndOrderReviewQueue(prunedPool, 'en').map((c) => c.id)).toEqual([
        'en-2',
        'en-3',
      ]);
      expect(filterAndOrderReviewQueue(prunedPool, 'es').map((c) => c.id)).toEqual(['es-2']);
      expect(filterAndOrderReviewQueue(prunedPool, 'all').map((c) => c.id)).toEqual([
        'en-2',
        'es-2',
        'en-3',
      ]);
    });

    it('returns a shallow copy when ratedCardIds is empty', () => {
      const result = pruneRatedCardsFromQueue(sampleQueue, []);
      expect(result).toEqual(sampleQueue);
      expect(result).not.toBe(sampleQueue);
    });
  });

  describe('5. deferCardToEndOfQueue', () => {
    it('moves a deferred Spanish card to the end of the queue while preserving other cards', () => {
      const deferred = deferCardToEndOfQueue(sampleQueue, 'es-1');
      expect(deferred.map((c) => c.id)).toEqual(['en-1', 'en-2', 'es-2', 'en-3', 'es-1']);
      // Also verify within the Spanish-only filtered view that es-1 is now after es-2
      const esView = filterAndOrderReviewQueue(deferred, 'es');
      expect(esView.map((c) => c.id)).toEqual(['es-2', 'es-1']);
    });

    it('returns a copy unchanged when cardId is not found or already at the end', () => {
      const notFound = deferCardToEndOfQueue(sampleQueue, 'non-existent');
      expect(notFound.map((c) => c.id)).toEqual(['en-1', 'es-1', 'en-2', 'es-2', 'en-3']);
      expect(notFound).not.toBe(sampleQueue);

      const alreadyLast = deferCardToEndOfQueue(sampleQueue, 'en-3');
      expect(alreadyLast.map((c) => c.id)).toEqual(['en-1', 'es-1', 'en-2', 'es-2', 'en-3']);
      expect(alreadyLast).not.toBe(sampleQueue);
    });
  });

  describe('6. toggleEnglishSpanishTrack & cycleReviewLanguageTrack', () => {
    it('toggles directly between English and Spanish tracks via toggleEnglishSpanishTrack', () => {
      expect(toggleEnglishSpanishTrack('en')).toBe('es');
      expect(toggleEnglishSpanishTrack('es')).toBe('en');
      expect(toggleEnglishSpanishTrack('all')).toBe('en');
    });

    it('cycles en -> es -> all -> en via cycleReviewLanguageTrack', () => {
      expect(cycleReviewLanguageTrack('en')).toBe('es');
      expect(cycleReviewLanguageTrack('es')).toBe('all');
      expect(cycleReviewLanguageTrack('all')).toBe('en');
    });
  });

  describe('7. GET /api/review language filtering and counts metadata', () => {
    beforeEach(() => {
      resetDbStore();
    });

    it('returns counts: { totalDue, enDue, esDue } alongside filtered data for language=en and language=es', async () => {
      await createCard({
        user_id: DEFAULT_USER_ID,
        term: 'desasosiego',
        language: 'es',
        gender: 'masculine',
        english_gloss: 'restlessness, existential unease',
        part_of_speech: 'noun',
        primary_definition: 'Inquietud interior profunda.',
        etymology: { roots: [], cognates: [] },
        collocations: ['hondo desasosiego'],
        source_context: { sentence: 'Sentía un hondo desasosiego.', source: 'Pessoa' },
        cloze_sentences: ['Sentía un hondo {{c1::desasosiego}}.'],
      });

      await createCard({
        user_id: DEFAULT_USER_ID,
        term: 'añoranza',
        language: 'es',
        gender: 'feminine',
        english_gloss: 'wistful longing, nostalgia',
        part_of_speech: 'noun',
        primary_definition: 'Sentimiento de tristeza o ternura al recordar algo ausente.',
        etymology: { roots: [], cognates: [] },
        collocations: ['dulce añoranza'],
        source_context: { sentence: 'Evocó con añoranza su infancia.', source: 'Machado' },
        cloze_sentences: ['Evocó con {{c1::añoranza}} su infancia.'],
      });

      // Default seed has 3 due English cards; we added 2 due Spanish cards => totalDue: 5, enDue: 3, esDue: 2
      const enReq = new NextRequest('http://localhost:3000/api/review?language=en');
      const enRes = await getReviewHandler(enReq);
      expect(enRes.status).toBe(200);
      const enJson = await enRes.json();
      expect(enJson.success).toBe(true);
      expect(enJson.count).toBe(3);
      expect(enJson.filter.language).toBe('en');
      expect(enJson.counts).toEqual({
        totalDue: 5,
        enDue: 3,
        esDue: 2,
      });
      expect(enJson.data.every((c: CardWithSrs) => normalizeCardLanguage(c) === 'en')).toBe(true);

      const esReq = new NextRequest('http://localhost:3000/api/review?language=es');
      const esRes = await getReviewHandler(esReq);
      expect(esRes.status).toBe(200);
      const esJson = await esRes.json();
      expect(esJson.success).toBe(true);
      expect(esJson.count).toBe(2);
      expect(esJson.filter.language).toBe('es');
      expect(esJson.counts).toEqual({
        totalDue: 5,
        enDue: 3,
        esDue: 2,
      });
      expect(esJson.data.every((c: CardWithSrs) => normalizeCardLanguage(c) === 'es')).toBe(true);
    });
  });
});
