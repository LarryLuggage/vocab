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
import { POST as seedCardsHandler } from '@/app/api/cards/seed/route';
import { resolveDiagnosticStatus } from '@/lib/diagnostic-status';
import { resetDbStore } from '@/lib/db';
import { extractClozeToken } from '@/lib/utils';

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
    it('gets a single card by id with productionLogs array', async () => {
      const listReq = new NextRequest('http://localhost:3000/api/cards');
      const listRes = await getCardsHandler(listReq);
      const listJson = await listRes.json();
      const targetCard = listJson.data.find((c: any) => c.term === 'perspicacious')!;

      const prodReq = new NextRequest('http://localhost:3000/api/validate-production', {
        method: 'POST',
        body: JSON.stringify({
          term: targetCard.term,
          cardId: targetCard.id,
          userSentence: 'Her perspicacious critique uncovered the latent flaw.',
        }),
      });
      await validateProductionHandler(prodReq);

      const req = new NextRequest(`http://localhost:3000/api/cards/${targetCard.id}`);
      const res = await getCardByIdHandler(req, { params: Promise.resolve({ id: targetCard.id }) });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.data.id).toBe(targetCard.id);
      expect(Array.isArray(json.productionLogs)).toBe(true);
      expect(json.productionLogs.length).toBe(1);
      expect(json.productionLogs[0].user_sentence).toBe(
        'Her perspicacious critique uncovered the latent flaw.'
      );
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

    it('patches editable fields while preserving srs scheduling data', async () => {
      const listReq = new NextRequest('http://localhost:3000/api/cards');
      const listRes = await getCardsHandler(listReq);
      const listJson = await listRes.json();
      const targetCard = listJson.data[0];

      const req = new NextRequest(`http://localhost:3000/api/cards/${targetCard.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          primary_definition: 'Updated scholarly definition for lexical inspection.',
          nuance_note: 'Refined stylistic nuance note.',
          source_context: {
            sentence: 'Curated citation from primary manuscript.',
            source: 'Codex Sinaiticus',
            author: 'Anonymous Scribe',
          },
        }),
      });
      const res = await patchCardHandler(req, {
        params: Promise.resolve({ id: targetCard.id }),
      });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.primary_definition).toBe(
        'Updated scholarly definition for lexical inspection.'
      );
      expect(json.data.nuance_note).toBe('Refined stylistic nuance note.');
      expect(json.data.source_context.source).toBe('Codex Sinaiticus');
      expect(json.data.source_context.author).toBe('Anonymous Scribe');
      expect(json.data.srs).toBeDefined();
      expect(json.data.srs.reps).toBe(targetCard.srs.reps);
    });

    it('re-enriches a fallback card via PATCH { reenrich: true } while preserving source_context and srs', async () => {
      const listReq = new NextRequest('http://localhost:3000/api/cards');
      const listRes = await getCardsHandler(listReq);
      const listJson = await listRes.json();
      const targetCard = listJson.data.find((c: any) => c.term === 'perspicacious')!;

      // Simulate a stub/fallback state on the card first
      const degradeReq = new NextRequest(`http://localhost:3000/api/cards/${targetCard.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          primary_definition: 'Temporary stub definition',
          is_fallback: true,
          enrichment_source: 'local_stub',
          source_context: {
            sentence: 'Preserved original context sentence.',
            source: 'Collected Essays',
            author: 'M. Montaigne',
          },
        }),
      });
      await patchCardHandler(degradeReq, { params: Promise.resolve({ id: targetCard.id }) });

      const reenrichReq = new NextRequest(`http://localhost:3000/api/cards/${targetCard.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ reenrich: true }),
      });
      const res = await patchCardHandler(reenrichReq, {
        params: Promise.resolve({ id: targetCard.id }),
      });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.reenriched).toBe(true);
      expect(json.data.primary_definition).not.toBe('Temporary stub definition');
      expect(json.data.etymology.roots.length).toBeGreaterThan(0);
      expect(json.data.source_context.sentence).toBe('Preserved original context sentence.');
      expect(json.data.source_context.source).toBe('Collected Essays');
      expect(json.data.source_context.author).toBe('M. Montaigne');
      expect(json.data.srs).toBeDefined();
      expect(json.data.srs.reps).toBe(targetCard.srs.reps);
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

    it('supports targeted review by root, cardId, and source even when cards are due in the future', async () => {
      // 'apocryphal' (00000000-0000-0000-0000-000000000004) is due tomorrow, so not in default queue
      const rootReq = new NextRequest('http://localhost:3000/api/review?root=kryptein');
      const rootRes = await getReviewHandler(rootReq);
      expect(rootRes.status).toBe(200);
      const rootJson = await rootRes.json();
      expect(rootJson.success).toBe(true);
      expect(rootJson.filter.root).toBe('kryptein');
      expect(rootJson.count).toBe(1);
      expect(rootJson.data[0].term).toBe('apocryphal');

      // 'susurrus' (00000000-0000-0000-0000-000000000005) is due in 5 days
      const cardIdReq = new NextRequest(
        'http://localhost:3000/api/review?cardId=00000000-0000-0000-0000-000000000005'
      );
      const cardIdRes = await getReviewHandler(cardIdReq);
      expect(cardIdRes.status).toBe(200);
      const cardIdJson = await cardIdRes.json();
      expect(cardIdJson.filter.cardId).toBe('00000000-0000-0000-0000-000000000005');
      expect(cardIdJson.count).toBe(1);
      expect(cardIdJson.data[0].term).toBe('susurrus');

      // Filter by reading source ('Atlantic Review' -> susurrus)
      const sourceReq = new NextRequest(
        'http://localhost:3000/api/review?source=Atlantic%20Review'
      );
      const sourceRes = await getReviewHandler(sourceReq);
      expect(sourceRes.status).toBe(200);
      const sourceJson = await sourceRes.json();
      expect(sourceJson.filter.source).toBe('Atlantic Review');
      expect(sourceJson.count).toBe(1);
      expect(sourceJson.data[0].term).toBe('susurrus');
    });

    it('grades multiple cards in a single batch POST /api/review request via cardIds', async () => {
      const reviewReq = new NextRequest('http://localhost:3000/api/review');
      const reviewRes = await getReviewHandler(reviewReq);
      const reviewJson = await reviewRes.json();
      const card1 = reviewJson.data[0];
      const card2 = reviewJson.data[1];

      const postReq = new NextRequest('http://localhost:3000/api/review', {
        method: 'POST',
        body: JSON.stringify({
          cardIds: [card1.id, card2.id],
          rating: 3,
        }),
      });
      const postRes = await postReviewHandler(postReq);
      expect(postRes.status).toBe(200);
      const json = await postRes.json();
      expect(json.success).toBe(true);
      expect(json.batchCount).toBe(2);
      expect(json.batchResults).toHaveLength(2);
      expect(json.batchResults[0].updatedSrs.reps).toBe(card1.srs.reps + 1);
      expect(json.batchResults[1].updatedSrs.reps).toBe(card2.srs.reps + 1);
    });
  });

  describe('extractClozeToken utility', () => {
    it('normalizes Anki-style and plain cloze markers into clean target tokens', () => {
      expect(extractClozeToken('{{c1::epistemology}}')).toBe('epistemology');
      expect(extractClozeToken('{{c2::desengaño::hint}}')).toBe('desengaño');
      expect(extractClozeToken('{{weltanschauung}}')).toBe('weltanschauung');
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

    it('validates multi-word synthesis passage (ACT-04) and logs attempts across multiple cardIds', async () => {
      const listReq = new NextRequest('http://localhost:3000/api/cards');
      const listRes = await getCardsHandler(listReq);
      const listJson = await listRes.json();
      const cardA = listJson.data.find((c: any) => c.term === 'perspicacious')!;
      const cardB = listJson.data.find((c: any) => c.term === 'inchoate')!;

      const req = new NextRequest('http://localhost:3000/api/validate-production', {
        method: 'POST',
        body: JSON.stringify({
          terms: [cardA.term, cardB.term],
          cardIds: [cardA.id, cardB.id],
          userSentence:
            'A perspicacious critic readily recognized the philosophical promise latent within those inchoate drafts.',
        }),
      });

      const res = await validateProductionHandler(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.evaluationStatus).toBe('pass');
      expect(json.data.termsDetected).toEqual(['perspicacious', 'inchoate']);
      expect(json.data.missingTerms).toEqual([]);
      expect(json.logsCount).toBe(2);
    });
  });

  describe('POST /api/cards/seed', () => {
    it('seeds the 25-term Spanish literary & philosophical pack idempotently (CUR-02)', async () => {
      const seedReq1 = new NextRequest('http://localhost:3000/api/cards/seed', {
        method: 'POST',
        body: JSON.stringify({ pack: 'es-literary' }),
      });
      const res1 = await seedCardsHandler(seedReq1);
      expect(res1.status).toBe(200);
      const json1 = await res1.json();
      expect(json1.success).toBe(true);
      expect(json1.pack).toBe('es-literary');
      expect(json1.added).toBe(25);
      expect(json1.seededCount).toBe(25);
      expect(json1.skipped).toBe(0);
      expect(json1.skippedCount).toBe(0);
      expect(json1.total).toBe(30); // 5 initial English cards + 25 Spanish cards

      // Second invocation should add 0 duplicates
      const seedReq2 = new NextRequest('http://localhost:3000/api/cards/seed', {
        method: 'POST',
        body: JSON.stringify({ pack: 'es-literary' }),
      });
      const res2 = await seedCardsHandler(seedReq2);
      expect(res2.status).toBe(200);
      const json2 = await res2.json();
      expect(json2.success).toBe(true);
      expect(json2.added).toBe(0);
      expect(json2.seededCount).toBe(0);
      expect(json2.skipped).toBe(25);
      expect(json2.skippedCount).toBe(25);
      expect(json2.total).toBe(30);

      // Verify all 25 Spanish cards are retrievable via GET /api/cards?language=es
      const esReq = new NextRequest('http://localhost:3000/api/cards?language=es');
      const esRes = await getCardsHandler(esReq);
      const esJson = await esRes.json();
      expect(esJson.count).toBe(25);
    });

    it('supports pack="es" and pack="all" with single-batch bulkCreateCards and idempotency', async () => {
      const esSeedReq = new NextRequest('http://localhost:3000/api/cards/seed', {
        method: 'POST',
        body: JSON.stringify({ pack: 'es' }),
      });
      const esRes = await seedCardsHandler(esSeedReq);
      expect(esRes.status).toBe(200);
      const esJson = await esRes.json();
      expect(esJson.seededCount).toBe(25);
      expect(esJson.skippedCount).toBe(0);

      // Now seed 'all' (25 Spanish + 100 English philosophical, 5 of which overlap initial sample terms)
      const allSeedReq = new NextRequest('http://localhost:3000/api/cards/seed', {
        method: 'POST',
        body: JSON.stringify({ pack: 'all' }),
      });
      const allRes = await seedCardsHandler(allSeedReq);
      expect(allRes.status).toBe(200);
      const allJson = await allRes.json();
      expect(allJson.success).toBe(true);
      expect(allJson.totalAvailableInPack).toBe(125);
      expect(allJson.seededCount).toBeGreaterThan(0);
      expect(allJson.skippedCount).toBeGreaterThanOrEqual(25);

      // Second 'all' run is completely idempotent
      const allSeedReq2 = new NextRequest('http://localhost:3000/api/cards/seed', {
        method: 'POST',
        body: JSON.stringify({ pack: 'all' }),
      });
      const allRes2 = await seedCardsHandler(allSeedReq2);
      const allJson2 = await allRes2.json();
      expect(allJson2.seededCount).toBe(0);
      expect(allJson2.skippedCount).toBe(125);
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

    it('exports cards in Second-Brain Markdown format with YAML frontmatter, wikilinks, and production logs', async () => {
      // Log a production sentence first so it appears in the Markdown export
      const prodReq = new NextRequest('http://localhost:3000/api/validate-production', {
        method: 'POST',
        body: JSON.stringify({
          term: 'perspicacious',
          cardId: '00000000-0000-0000-0000-000000000001',
          userSentence: 'Her perspicacious synthesis illuminated the archival fragments.',
        }),
      });
      await validateProductionHandler(prodReq);

      const req = new NextRequest('http://localhost:3000/api/export?format=markdown');
      const res = await exportHandler(req);
      expect(res.status).toBe(200);
      expect(res.headers.get('Content-Type')).toContain('text/markdown');
      expect(res.headers.get('Content-Disposition')).toContain('lexis_second_brain_');

      const mdText = await res.text();
      expect(mdText).toContain('---');
      expect(mdText).toContain(
        'title: "Lexis Engine — Personal Vocabulary & Etymology Knowledge Base"'
      );
      expect(mdText).toContain('## Morphological Root Index');
      expect(mdText).toContain('[[perspicacious]]');
      expect(mdText).toContain('[[specere]]');
      expect(mdText).toContain('### perspicacious');
      expect(mdText).toContain('Active Production Log:');
      expect(mdText).toContain(
        'Her perspicacious synthesis illuminated the archival fragments.'
      );
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
