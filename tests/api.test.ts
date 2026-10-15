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
import { resolveDiagnosticStatus } from '@/lib/diagnostic-status';
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

    it('enriches Spanish term when language is specified in request body', async () => {
      const req = new NextRequest('http://localhost:3000/api/enrich', {
        method: 'POST',
        body: JSON.stringify({ term: 'añoranza', language: 'es' }),
      });
      const res = await enrichHandler(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.term).toBe('añoranza');
      expect(json.data.language).toBe('es');
      expect(json.data.gender).toBe('feminine');
      expect(json.card.language).toBe('es');
      expect(json.card.gender).toBe('feminine');
      expect(json.card.english_gloss).toBeDefined();
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

    it('creates a new Spanish card with language, gender, and english_gloss', async () => {
      const req = new NextRequest('http://localhost:3000/api/cards', {
        method: 'POST',
        body: JSON.stringify({ term: 'ojalá', language: 'es' }),
      });
      const res = await postCardHandler(req);
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.term).toBe('ojalá');
      expect(json.data.language).toBe('es');
      expect(json.data.english_gloss).toBeDefined();
    });

    it('filters cards by language in GET /api/cards?language=es', async () => {
      const createReq = new NextRequest('http://localhost:3000/api/cards', {
        method: 'POST',
        body: JSON.stringify({ term: 'ojalá', language: 'es' }),
      });
      await postCardHandler(createReq);

      const esReq = new NextRequest('http://localhost:3000/api/cards?language=es');
      const esRes = await getCardsHandler(esReq);
      expect(esRes.status).toBe(200);
      const esJson = await esRes.json();
      expect(esJson.success).toBe(true);
      expect(esJson.count).toBe(1);
      expect(esJson.data[0].term).toBe('ojalá');
      expect(esJson.data[0].language).toBe('es');

      const enReq = new NextRequest('http://localhost:3000/api/cards?language=en');
      const enRes = await getCardsHandler(enReq);
      expect(enRes.status).toBe(200);
      const enJson = await enRes.json();
      expect(enJson.count).toBe(5);
      expect(enJson.data.every((c: any) => c.language === 'en')).toBe(true);
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

    it('filters review queue by language in GET /api/review?language=es', async () => {
      // Create a Spanish card
      const createReq = new NextRequest('http://localhost:3000/api/cards', {
        method: 'POST',
        body: JSON.stringify({ term: 'desahuciado', language: 'es' }),
      });
      await postCardHandler(createReq);

      // Query Spanish due cards
      const esReq = new NextRequest('http://localhost:3000/api/review?language=es');
      const esRes = await getReviewHandler(esReq);
      expect(esRes.status).toBe(200);
      const esJson = await esRes.json();
      expect(esJson.success).toBe(true);
      expect(esJson.count).toBe(1);
      expect(esJson.data[0].term).toBe('desahuciado');
      expect(esJson.data[0].language).toBe('es');

      // Query English due cards
      const enReq = new NextRequest('http://localhost:3000/api/review?language=en');
      const enRes = await getReviewHandler(enReq);
      expect(enRes.status).toBe(200);
      const enJson = await enRes.json();
      expect(enJson.count).toBe(3);
      expect(enJson.data.every((c: any) => c.language === 'en')).toBe(true);
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
      const req = new Request('http://localhost:3000/api/diagnostic');
      const res = await diagnosticHandler(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.timestamp).toBeDefined();
      expect(json.environment).toBeDefined();
      expect(json.supabaseProbe).toBeDefined();
      expect(json.geminiProbe).toBeDefined();
      expect(json.dictionaryFallbackProbe).toBeDefined();
      expect(json.guidance).toBeDefined();
      expect(json.enrichmentProbe.tested).toBe(false);
      expect(json.enrichmentProbe.success).not.toBe(true);
      expect(json.status).not.toBe('HEALTHY');
    });

    it('does not report enrichment as healthy when the generation test was skipped', () => {
      const skipped = resolveDiagnosticStatus({
        supabaseSuccess: true,
        supabaseStatus: 'HEALTHY',
        hasGeminiKey: true,
        pingSuccess: true,
        enrichmentTested: false,
        enrichmentSuccess: false,
      });
      expect(skipped.status).toBe('ENRICHMENT_UNTESTED');
      expect(skipped.guidance).toContain('/api/diagnostic?enrichment=true');

      const failed = resolveDiagnosticStatus({
        supabaseSuccess: true,
        supabaseStatus: 'HEALTHY',
        hasGeminiKey: true,
        pingSuccess: true,
        enrichmentTested: true,
        enrichmentSuccess: false,
        enrichmentError: 'timed out',
      });
      expect(failed.status).toBe('GEMINI_ENRICHMENT_FAILED');

      const healthy = resolveDiagnosticStatus({
        supabaseSuccess: true,
        supabaseStatus: 'HEALTHY',
        hasGeminiKey: true,
        pingSuccess: true,
        enrichmentTested: true,
        enrichmentSuccess: true,
      });
      expect(healthy.status).toBe('HEALTHY');
    });
  });
});
