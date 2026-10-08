import { describe, it, expect, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as enrichHandler } from '@/app/api/enrich/route';
import { GET as getCardsHandler, POST as postCardHandler } from '@/app/api/cards/route';
import {
  GET as getCardByIdHandler,
  PATCH as patchCardHandler,
  DELETE as deleteCardHandler,
} from '@/app/api/cards/[id]/route';
import { GET as getReviewHandler, POST as postReviewHandler } from '@/app/api/review/route';
import { POST as validateProductionHandler } from '@/app/api/validate-production/route';
import { GET as exportHandler } from '@/app/api/export/route';
import { GET as diagnosticHandler } from '@/app/api/diagnostic/route';
import { resetDbStore } from '@/lib/db';

describe('Lexis Engine API Route Handlers', () => {
  beforeEach(() => {
    resetDbStore();
  });

  describe('POST /api/enrich', () => {
    it('returns 400 when term is missing', async () => {
      const req = new NextRequest('http://localhost:3000/api/enrich', {
        method: 'POST',
        body: JSON.stringify({}),
      });
      const res = await enrichHandler(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBeDefined();
    });

    it('returns enriched lexical payload for valid term', async () => {
      const req = new NextRequest('http://localhost:3000/api/enrich', {
        method: 'POST',
        body: JSON.stringify({ term: 'perspicacious' }),
      });
      const res = await enrichHandler(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.term).toBe('perspicacious');
      expect(json.data.part_of_speech).toBe('adjective');
      expect(json.data.etymology.roots.length).toBeGreaterThan(0);
    });
  });

  describe('GET & POST /api/cards', () => {
    it('lists seeded cards via GET', async () => {
      const req = new NextRequest('http://localhost:3000/api/cards');
      const res = await getCardsHandler(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.count).toBe(5);
    });

    it('returns 409 conflict when ingesting a duplicate word or lemma', async () => {
      const req = new NextRequest('http://localhost:3000/api/cards', {
        method: 'POST',
        body: JSON.stringify({ term: 'perspicacity' }),
      });
      const res = await postCardHandler(req);
      expect(res.status).toBe(409);
      const json = await res.json();
      expect(json.duplicate).toBe(true);
      expect(json.existingCard.term).toBe('perspicacious');
    });

    it('appends context sentence when appendContext is true on duplicate', async () => {
      const req = new NextRequest('http://localhost:3000/api/cards', {
        method: 'POST',
        body: JSON.stringify({
          term: 'perspicacity',
          appendContext: true,
          contextSentence: 'A sentence demonstrating keen perspicacity.',
        }),
      });
      const res = await postCardHandler(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.appended).toBe(true);
      expect(json.data.source_context.sentence).toContain(
        'A sentence demonstrating keen perspicacity.'
      );
    });

    it('creates a new card with auto-enrichment when term is novel', async () => {
      const req = new NextRequest('http://localhost:3000/api/cards', {
        method: 'POST',
        body: JSON.stringify({ term: 'obfuscate' }),
      });
      const res = await postCardHandler(req);
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.term).toBe('obfuscate');
      expect(json.data.srs).toBeDefined();
    });
  });

  describe('GET, PATCH, DELETE /api/cards/[id]', () => {
    it('gets a single card by id', async () => {
      const listReq = new NextRequest('http://localhost:3000/api/cards');
      const listRes = await getCardsHandler(listReq);
      const listJson = await listRes.json();
      const firstId = listJson.data[0].id;

      const req = new NextRequest(`http://localhost:3000/api/cards/${firstId}`);
      const res = await getCardByIdHandler(req, { params: Promise.resolve({ id: firstId }) });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.data.id).toBe(firstId);
    });

    it('returns 404 for non-existent card', async () => {
      const req = new NextRequest('http://localhost:3000/api/cards/invalid-id');
      const res = await getCardByIdHandler(req, {
        params: Promise.resolve({ id: 'invalid-id' }),
      });
      expect(res.status).toBe(404);
    });

    it('patches a card by appending context sentence', async () => {
      const listReq = new NextRequest('http://localhost:3000/api/cards');
      const listRes = await getCardsHandler(listReq);
      const listJson = await listRes.json();
      const firstId = listJson.data[0].id;

      const req = new NextRequest(`http://localhost:3000/api/cards/${firstId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          sentence: 'Additional literary excerpt.',
          source: 'Anthology',
        }),
      });
      const res = await patchCardHandler(req, { params: Promise.resolve({ id: firstId }) });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.data.source_context.sentence).toContain('Additional literary excerpt.');
    });

    it('deletes a card by id', async () => {
      const listReq = new NextRequest('http://localhost:3000/api/cards');
      const listRes = await getCardsHandler(listReq);
      const listJson = await listRes.json();
      const firstId = listJson.data[0].id;

      const req = new NextRequest(`http://localhost:3000/api/cards/${firstId}`, {
        method: 'DELETE',
      });
      const res = await deleteCardHandler(req, { params: Promise.resolve({ id: firstId }) });
      expect(res.status).toBe(200);

      // Verify deletion
      const verifyReq = new NextRequest(`http://localhost:3000/api/cards/${firstId}`);
      const verifyRes = await getCardByIdHandler(verifyReq, {
        params: Promise.resolve({ id: firstId }),
      });
      expect(verifyRes.status).toBe(404);
    });
  });

  describe('GET & POST /api/review', () => {
    it('retrieves due cards queue', async () => {
      const req = new NextRequest('http://localhost:3000/api/review?includePreviews=true');
      const res = await getReviewHandler(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.count).toBe(3);
      expect(json.data[0].schedulePreviews).toBeDefined();
      expect(json.data[0].schedulePreviews.length).toBe(4);
    });

    it('submits rating and updates FSRS state', async () => {
      const reviewReq = new NextRequest('http://localhost:3000/api/review');
      const reviewRes = await getReviewHandler(reviewReq);
      const reviewJson = await reviewRes.json();
      const dueCard = reviewJson.data[0];

      const postReq = new NextRequest('http://localhost:3000/api/review', {
        method: 'POST',
        body: JSON.stringify({
          cardId: dueCard.id,
          rating: 3, // Good
        }),
      });
      const postRes = await postReviewHandler(postReq);
      expect(postRes.status).toBe(200);
      const json = await postRes.json();
      expect(json.success).toBe(true);
      expect(json.card.srs.reps).toBeGreaterThan(dueCard.srs.reps);
      expect(json.schedulePreviews).toBeDefined();
    });
  });

  describe('POST /api/validate-production', () => {
    it('validates production sentence and logs attempt', async () => {
      const listReq = new NextRequest('http://localhost:3000/api/cards');
      const listRes = await getCardsHandler(listReq);
      const listJson = await listRes.json();
      const targetCard = listJson.data.find((c: any) => c.term === 'perspicacious')!;

      const req = new NextRequest('http://localhost:3000/api/validate-production', {
        method: 'POST',
        body: JSON.stringify({
          term: targetCard.term,
          cardId: targetCard.id,
          userSentence: 'The scholar offered a perspicacious commentary on the treatise.',
        }),
      });

      const res = await validateProductionHandler(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.evaluationStatus).toBe('pass');
      expect(json.log).not.toBeNull();
      expect(json.log.card_id).toBe(targetCard.id);
    });
  });

  describe('GET /api/export', () => {
    it('exports cards in JSON format', async () => {
      const req = new NextRequest('http://localhost:3000/api/export?format=json');
      const res = await exportHandler(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.cards.length).toBe(5);
    });

    it('exports cards in Anki-compatible CSV format', async () => {
      const req = new NextRequest('http://localhost:3000/api/export?format=anki');
      const res = await exportHandler(req);
      expect(res.status).toBe(200);
      expect(res.headers.get('Content-Type')).toContain('text/csv');
      const csvText = await res.text();
      expect(csvText).toContain('Term,Part of Speech');
      expect(csvText).toContain('"perspicacious"');
      expect(csvText).toContain('"solipsism"');
    });
  });

  describe('GET /api/diagnostic', () => {
    it('returns diagnostic inspection payload including environment and supabase probe', async () => {
      const res = await diagnosticHandler();
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.timestamp).toBeDefined();
      expect(json.environment).toBeDefined();
      expect(json.supabaseProbe).toBeDefined();
      expect(json.geminiProbe).toBeDefined();
      expect(json.dictionaryFallbackProbe).toBeDefined();
      expect(json.guidance).toBeDefined();
    });
  });
});
