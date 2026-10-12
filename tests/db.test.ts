import { describe, it, expect, beforeEach } from 'vitest';
import {
  listCards,
  getCardById,
  findCardByTerm,
  areTermsVariants,
  createCard,
  updateCard,
  appendContextSentence,
  deleteCard,
  getDueCards,
  recordReview,
  logProductionAttempt,
  getProductionLogs,
  resetDbStore,
} from '@/lib/db';
import { DEFAULT_USER_ID } from '@/lib/db/seed-data';

describe('Lexis Hybrid Database & Repository Layer', () => {
  beforeEach(() => {
    resetDbStore();
  });

  describe('Pre-seeded vocabulary & CRUD operations', () => {
    it('initializes with 5 rich sample cards', async () => {
      const cards = await listCards();
      expect(cards.length).toBe(5);

      const terms = cards.map((c) => c.term);
      expect(terms).toContain('perspicacious');
      expect(terms).toContain('solipsism');
      expect(terms).toContain('inchoate');
      expect(terms).toContain('apocryphal');
      expect(terms).toContain('susurrus');
    });

    it('filters cards by search term and part of speech', async () => {
      const adjectiveCards = await listCards({ pos: 'adjective' });
      expect(adjectiveCards.length).toBeGreaterThan(0);
      adjectiveCards.forEach((c) => expect(c.part_of_speech).toBe('adjective'));

      const searchResults = await listCards({ search: 'whisper' });
      expect(searchResults.some((c) => c.term === 'susurrus')).toBe(true);
    });

    it('retrieves a card by ID with its FSRS state', async () => {
      const all = await listCards();
      const first = all[0];
      const fetched = await getCardById(first.id);

      expect(fetched).not.toBeNull();
      expect(fetched?.id).toBe(first.id);
      expect(fetched?.srs).toBeDefined();
      expect(fetched?.srs.card_id).toBe(first.id);
    });

    it('creates a new card and initializes default SRS state', async () => {
      const newCard = await createCard({
        term: 'obfuscate',
        part_of_speech: 'verb',
        primary_definition: 'To make obscure or unclear.',
        etymology: { roots: [], cognates: [] },
        collocations: ['obfuscate the truth'],
        source_context: { sentence: null, source: null },
        cloze_sentences: ['They sought to {{c1::obfuscate}} the findings.'],
        user_id: DEFAULT_USER_ID,
      });

      expect(newCard.id).toBeDefined();
      expect(newCard.term).toBe('obfuscate');
      expect(newCard.srs.state).toBe(0); // New
      expect(newCard.srs.reps).toBe(0);

      const all = await listCards();
      expect(all.length).toBe(6);
    });

    it('updates card properties', async () => {
      const all = await listCards();
      const target = all[0];

      const updated = await updateCard(target.id, {
        nuance_note: 'Updated nuance note for testing.',
      });

      expect(updated?.nuance_note).toBe('Updated nuance note for testing.');
      const fetched = await getCardById(target.id);
      expect(fetched?.nuance_note).toBe('Updated nuance note for testing.');
    });

    it('appends context sentence to existing card (ING-04 workflow)', async () => {
      const all = await listCards();
      const target = all.find((c) => c.term === 'perspicacious')!;

      const updated = await appendContextSentence(
        target.id,
        'A newly encountered sentence in literary nonfiction.',
        'Literary Review'
      );

      expect(updated?.source_context.sentence).toContain(
        'A newly encountered sentence in literary nonfiction.'
      );
      expect(updated?.source_context.source).toBe('Literary Review');
    });

    it('deletes card and cleans up SRS records', async () => {
      const all = await listCards();
      const target = all[0];

      const success = await deleteCard(target.id);
      expect(success).toBe(true);

      const fetched = await getCardById(target.id);
      expect(fetched).toBeNull();

      const remaining = await listCards();
      expect(remaining.length).toBe(4);
    });
  });

  describe('Deduplication & Variant/Lemma Detection (ING-04)', () => {
    it('detects exact matches ignoring case and whitespace', async () => {
      const card = await findCardByTerm('  Perspicacious  ');
      expect(card).not.toBeNull();
      expect(card?.term).toBe('perspicacious');
    });

    it('detects morphological variants and lemma derivatives', async () => {
      expect(areTermsVariants('perspicacity', 'perspicacious')).toBe(true);
      expect(areTermsVariants('solipsistic', 'solipsism')).toBe(true);
      expect(areTermsVariants('inchoately', 'inchoate')).toBe(true);
      expect(areTermsVariants('apocryphally', 'apocryphal')).toBe(true);
      expect(areTermsVariants('completely_unrelated', 'perspicacious')).toBe(false);

      const variantMatch = await findCardByTerm('perspicacity');
      expect(variantMatch).not.toBeNull();
      expect(variantMatch?.term).toBe('perspicacious');
    });
  });

  describe('SRS Queue Management & FSRS Review Handler (SRS-01, SRS-03)', () => {
    it('filters due queue where due <= asOf time', async () => {
      const now = new Date();
      const dueCards = await getDueCards(DEFAULT_USER_ID, now);

      // In seed data: perspicacious, solipsism, inchoate are due now or in past;
      // apocryphal (1 day future) and susurrus (5 days future) are not.
      expect(dueCards.length).toBe(3);
      const terms = dueCards.map((c) => c.term);
      expect(terms).toContain('perspicacious');
      expect(terms).toContain('solipsism');
      expect(terms).toContain('inchoate');
      expect(terms).not.toContain('apocryphal');
      expect(terms).not.toContain('susurrus');

      // Verify sorted by due ascending
      for (let i = 0; i < dueCards.length - 1; i++) {
        const curDue = new Date(dueCards[i].srs.due).getTime();
        const nextDue = new Date(dueCards[i + 1].srs.due).getTime();
        expect(curDue).toBeLessThanOrEqual(nextDue);
      }
    });

    it('processes review rating submission and updates FSRS state', async () => {
      const all = await listCards();
      const card = all.find((c) => c.term === 'inchoate')!;
      expect(card.srs.reps).toBe(0);

      const reviewTime = new Date();
      const result = await recordReview(card.id, 3, reviewTime); // 3 = Good

      expect(result).not.toBeNull();
      expect(result?.card.srs.reps).toBe(1);
      expect(result?.card.srs.stability).toBeGreaterThan(0);
      expect(new Date(result!.card.srs.due).getTime()).toBeGreaterThan(reviewTime.getTime());

      // Verify changes persisted
      const fetched = await getCardById(card.id);
      expect(fetched?.srs.reps).toBe(1);
    });
  });

  describe('Production Attempts Logging (PRD 4.2)', () => {
    it('logs production attempts and queries logs for card', async () => {
      const all = await listCards();
      const card = all[0];

      const log = await logProductionAttempt(
        card.id,
        'A beautifully crafted sentence using perspicacious.',
        'pass',
        'Excellent high-register usage.'
      );

      expect(log.id).toBeDefined();
      expect(log.card_id).toBe(card.id);
      expect(log.evaluation_status).toBe('pass');

      const logs = await getProductionLogs(card.id);
      expect(logs.length).toBe(1);
      expect(logs[0].user_sentence).toContain('perspicacious');
    });
  });

  describe('Spanish Language & Dual-Language Support', () => {
    it('recognizes Spanish verb inflections and lemma derivatives', () => {
      expect(areTermsVariants('sobrecogió', 'sobrecoger')).toBe(true);
      expect(areTermsVariants('aconteció', 'acontecer')).toBe(true);
      expect(areTermsVariants('desahuciada', 'desahuciado')).toBe(true);
      expect(areTermsVariants('añoranzas', 'añoranza')).toBe(true);
    });

    it('filters cards by language in listCards', async () => {
      const enCards = await listCards({ language: 'en' });
      expect(enCards.length).toBe(5);

      const esCardsInitial = await listCards({ language: 'es' });
      expect(esCardsInitial.length).toBe(0);

      // Create a Spanish card
      await createCard({
        term: 'añoranza',
        language: 'es',
        gender: 'feminine',
        english_gloss: 'wistful yearning, nostalgia',
        part_of_speech: 'noun',
        primary_definition: 'Sentimiento de pena por una dicha ausente.',
        etymology: { roots: [], cognates: [] },
        collocations: ['profunda añoranza'],
        source_context: { sentence: null, source: null },
        cloze_sentences: ['Sentía {{c1::añoranza}}.'],
        user_id: DEFAULT_USER_ID,
      });

      const esCardsAfter = await listCards({ language: 'es' });
      expect(esCardsAfter.length).toBe(1);
      expect(esCardsAfter[0].term).toBe('añoranza');
      expect(esCardsAfter[0].language).toBe('es');
      expect(esCardsAfter[0].gender).toBe('feminine');
      expect(esCardsAfter[0].english_gloss).toBe('wistful yearning, nostalgia');
    });

    it('filters due cards queue by language', async () => {
      const now = new Date();
      const dueEn = await getDueCards(DEFAULT_USER_ID, now, 'en');
      expect(dueEn.length).toBe(3);

      const dueEs = await getDueCards(DEFAULT_USER_ID, now, 'es');
      expect(dueEs.length).toBe(0);

      // Create an overdue Spanish card
      const pastTime = new Date(now.getTime() - 3600000).toISOString();
      await createCard(
        {
          term: 'ojalá',
          language: 'es',
          part_of_speech: 'interjection',
          primary_definition: 'Denota vivo deseo.',
          etymology: { roots: [], cognates: [] },
          collocations: ['ojalá llueva'],
          source_context: { sentence: null, source: null },
          cloze_sentences: ['{{c1::Ojalá}} fuera así.'],
          user_id: DEFAULT_USER_ID,
        },
        {
          due: pastTime,
        }
      );

      const dueEsAfter = await getDueCards(DEFAULT_USER_ID, now, 'es');
      expect(dueEsAfter.length).toBe(1);
      expect(dueEsAfter[0].term).toBe('ojalá');
      expect(dueEsAfter[0].language).toBe('es');
    });
  });
});
