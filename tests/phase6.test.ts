import { describe, it, expect, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as extractPassageHandler } from '@/app/api/extract-passage/route';
import { POST as batchCardsHandler } from '@/app/api/cards/batch/route';
import {
  GET as getPacksHandler,
  POST as postPacksHandler,
} from '@/app/api/cards/packs/route';
import { GET as getCardByIdHandler } from '@/app/api/cards/[id]/route';
import { resetDbStore } from '@/lib/db';

describe('Phase 6 API Routes — Passage Extractor (ING-09) & Curated Pack Builder (CUR-03)', () => {
  beforeEach(() => {
    resetDbStore();
  });

  describe('POST /api/extract-passage', () => {
    it('returns 400 when passage is missing or too short', async () => {
      const req = new NextRequest('http://localhost:3000/api/extract-passage', {
        method: 'POST',
        body: JSON.stringify({ passage: 'too short' }),
      });
      const res = await extractPassageHandler(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBeDefined();
    });

    it('extracts English candidates, parses Zotero citation, and flags alreadyExists for seeded terms', async () => {
      const passage =
        'Homer’s account of the Shield of Achilles inaugurates the tradition of ekphrasis, while her perspicacious critique of Caravaggesque chiaroscuro exposed the pentimento beneath the canvas (James Heffernan, Museum of Words, 1993, p. 42).';

      const req = new NextRequest('http://localhost:3000/api/extract-passage', {
        method: 'POST',
        body: JSON.stringify({ passage }),
      });
      const res = await extractPassageHandler(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.detectedLanguage).toBe('en');
      expect(json.data.parsedCitation.author).toBe('James Heffernan');
      expect(json.data.parsedCitation.source).toBe('Museum of Words');
      expect(json.data.parsedCitation.year).toBe('1993');
      expect(json.data.parsedCitation.page).toBe('p. 42');

      const terms = json.data.candidates.map((c: any) => c.term);
      expect(terms).toContain('ekphrasis');
      expect(terms).toContain('perspicacious');
      expect(terms).toContain('chiaroscuro');
      expect(terms).toContain('pentimento');

      const perspicaciousCand = json.data.candidates.find(
        (c: any) => c.term === 'perspicacious'
      );
      expect(perspicaciousCand.alreadyExists).toBe(true);
      expect(perspicaciousCand.existingCardId).toBe(
        '00000000-0000-0000-0000-000000000001'
      );

      const ekphrasisCand = json.data.candidates.find(
        (c: any) => c.term === 'ekphrasis'
      );
      expect(ekphrasisCand.alreadyExists).toBe(false);
      expect(ekphrasisCand.cloze_sentences[0]).toContain('{{c1::ekphrasis}}');
    });

    it('extracts Spanish candidates and detects Spanish language automatically', async () => {
      const passage =
        'Valle-Inclán transformó la tragedia ibérica en un implacable esperpento, mientras la desmesura del trópico y la secreta alquimia de Melquíades poblaban aquel universo onírico.';

      const req = new NextRequest('http://localhost:3000/api/extract-passage', {
        method: 'POST',
        body: JSON.stringify({ passage }),
      });
      const res = await extractPassageHandler(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.detectedLanguage).toBe('es');

      const terms = json.data.candidates.map((c: any) => c.term);
      expect(terms).toContain('esperpento');
      expect(terms).toContain('desmesura');
      expect(terms).toContain('alquimia');
      expect(terms).toContain('onírico');

      const esperpento = json.data.candidates.find(
        (c: any) => c.term === 'esperpento'
      );
      expect(esperpento.language).toBe('es');
      expect(esperpento.gender).toBe('masculine');
      expect(esperpento.english_gloss).toBeTruthy();
    });
  });

  describe('POST /api/cards/batch', () => {
    it('batch-creates novel cards and merges sightings into existing cards in a single request', async () => {
      const req = new NextRequest('http://localhost:3000/api/cards/batch', {
        method: 'POST',
        body: JSON.stringify({
          items: [
            {
              term: 'ekphrasis',
              language: 'en',
              part_of_speech: 'noun',
              primary_definition:
                'A vivid verbal description of a visual work of art.',
              contextSentence:
                'Keats’s ode exemplifies Romantic ekphrasis at its zenith.',
              source: 'Museum of Words',
              author: 'James Heffernan',
            },
            {
              term: 'dirigisme',
              language: 'en',
              contextSentence:
                'Postwar industrial dirigisme steered national investment.',
              source: 'Modern Capitalism',
            },
            {
              term: 'perspicacious',
              language: 'en',
              contextSentence:
                'A second sighting of her perspicacious judgment in archival letters.',
              source: 'Collected Letters',
              author: 'E. V. Lucas',
            },
          ],
        }),
      });

      const res = await batchCardsHandler(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.createdCount).toBe(2);
      expect(json.mergedCount).toBe(1);
      expect(json.mergedIds).toContain('00000000-0000-0000-0000-000000000001');
      expect(json.data.map((c: any) => c.term)).toEqual(['ekphrasis', 'dirigisme']);

      // Verify existing card had its context sentence appended
      const cardReq = new NextRequest(
        'http://localhost:3000/api/cards/00000000-0000-0000-0000-000000000001'
      );
      const cardRes = await getCardByIdHandler(cardReq, {
        params: Promise.resolve({ id: '00000000-0000-0000-0000-000000000001' }),
      });
      const cardJson = await cardRes.json();
      expect(cardJson.data.source_context.sentence).toContain(
        'A second sighting of her perspicacious judgment in archival letters.'
      );
    });
  });

  describe('GET & POST /api/cards/packs', () => {
    it('lists all 6 curated & thematic packs with ownership counts via GET /api/cards/packs', async () => {
      const req = new NextRequest('http://localhost:3000/api/cards/packs');
      const res = await getPacksHandler(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.count).toBe(6);

      const packIds = json.data.map((p: any) => p.id);
      expect(packIds).toEqual([
        'en-philosophical',
        'es-literary',
        'aesthetics-poetics',
        'political-economy',
        'phenomenology-mind',
        'boom-realismo-magico',
      ]);

      const aesthetics = json.data.find((p: any) => p.id === 'aesthetics-poetics');
      expect(aesthetics.totalCards).toBe(10);
      expect(aesthetics.ownedCount).toBe(0);
      expect(aesthetics.remainingCount).toBe(10);
      expect(aesthetics.sampleTerms).toContain('ekphrasis');
    });

    it('previews and seeds thematic packs (aesthetics-poetics & boom-realismo-magico) idempotently', async () => {
      // 1. Preview aesthetics-poetics
      const previewReq = new NextRequest('http://localhost:3000/api/cards/packs', {
        method: 'POST',
        body: JSON.stringify({
          action: 'preview',
          packId: 'aesthetics-poetics',
        }),
      });
      const previewRes = await postPacksHandler(previewReq);
      expect(previewRes.status).toBe(200);
      const previewJson = await previewRes.json();
      expect(previewJson.action).toBe('preview');
      expect(previewJson.count).toBe(10);
      expect(previewJson.data.every((c: any) => c.alreadyOwned === false)).toBe(true);

      // 2. Seed aesthetics-poetics
      const seedReq = new NextRequest('http://localhost:3000/api/cards/packs', {
        method: 'POST',
        body: JSON.stringify({
          action: 'seed',
          packId: 'aesthetics-poetics',
        }),
      });
      const seedRes = await postPacksHandler(seedReq);
      expect(seedRes.status).toBe(200);
      const seedJson = await seedRes.json();
      expect(seedJson.seededCount).toBe(10);
      expect(seedJson.skippedCount).toBe(0);

      // 3. Seed boom-realismo-magico with selectedTerms subset
      const esSeedReq = new NextRequest('http://localhost:3000/api/cards/packs', {
        method: 'POST',
        body: JSON.stringify({
          action: 'seed',
          packId: 'boom-realismo-magico',
          selectedTerms: ['esperpento', 'desmesura', 'alquimia'],
        }),
      });
      const esSeedRes = await postPacksHandler(esSeedReq);
      expect(esSeedRes.status).toBe(200);
      const esSeedJson = await esSeedRes.json();
      expect(esSeedJson.seededCount).toBe(3);
      expect(esSeedJson.data.map((c: any) => c.term)).toEqual([
        'esperpento',
        'desmesura',
        'alquimia',
      ]);
    });

    it('previews and seeds a custom topic pack ("Stoic Ethics & Epistemology")', async () => {
      const previewReq = new NextRequest('http://localhost:3000/api/cards/packs', {
        method: 'POST',
        body: JSON.stringify({
          action: 'preview',
          topic: 'Stoic Ethics & Epistemology',
          language: 'en',
          count: 6,
        }),
      });
      const previewRes = await postPacksHandler(previewReq);
      expect(previewRes.status).toBe(200);
      const previewJson = await previewRes.json();
      expect(previewJson.success).toBe(true);
      expect(previewJson.count).toBe(6);
      expect(previewJson.title).toContain('Stoic Ethics & Epistemology');

      const seedReq = new NextRequest('http://localhost:3000/api/cards/packs', {
        method: 'POST',
        body: JSON.stringify({
          action: 'seed',
          topic: 'Stoic Ethics & Epistemology',
          language: 'en',
          count: 6,
        }),
      });
      const seedRes = await postPacksHandler(seedReq);
      expect(seedRes.status).toBe(200);
      const seedJson = await seedRes.json();
      expect(seedJson.success).toBe(true);
      expect(seedJson.seededCount).toBeGreaterThan(0);
    });
  });
});
