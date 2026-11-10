import { describe, it, expect, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import {
  resetDbStore,
  createCard,
  listCards,
  logProductionAttempt,
  listAllProductionLogsWithCards,
  DEFAULT_USER_ID,
} from '@/lib/db';
import {
  findCrossLingualCognates,
  normalizeRootMorpheme,
} from '@/lib/cognates';
import { polishUserProseFallback } from '@/lib/llm/prose-polisher';
import { POST as polishProseHandler } from '@/app/api/polish-prose/route';
import { GET as getProductionLogsHandler } from '@/app/api/production-logs/route';

describe('Phase 7 — Cross-Lingual Cognate Bridge, Prose Polisher (ACT-05) & Production Portfolio', () => {
  beforeEach(() => {
    resetDbStore();
  });

  describe('Cross-Lingual Cognate & Etymological Bridge (lib/cognates.ts)', () => {
    it('normalizes classical Latin/Greek root morphemes into comparable stems', () => {
      expect(normalizeRootMorpheme('specere')).toBe('spec');
      expect(normalizeRootMorpheme('spectare')).toBe('spect');
      expect(normalizeRootMorpheme('solus')).toBe('sol');
      expect(normalizeRootMorpheme('aporía')).toBe('apor');
      expect(normalizeRootMorpheme('-acious')).toBe('acious');
      expect(normalizeRootMorpheme('kryptein')).toBe('krypt');
    });

    it('finds cross-lingual cognates first and same-language root siblings second', async () => {
      const aporiaEn = await createCard({
        user_id: DEFAULT_USER_ID,
        term: 'aporia',
        language: 'en',
        part_of_speech: 'noun',
        primary_definition: 'An irresolvable internal contradiction or logical disjunction in a text or theory.',
        etymology: {
          roots: [
            { morpheme: 'a-', meaning: 'without', origin: 'Greek' },
            { morpheme: 'poros', meaning: 'passage / way through', origin: 'Greek' },
          ],
          cognates: ['aporía', 'aporetic', 'pore'],
        },
        collocations: ['philosophical aporia', 'structural aporia'],
        source_context: { sentence: 'The dialogue ends in an aporia.', source: 'Plato' },
        cloze_sentences: ['The dialogue ends in an {{c1::aporia}}.'],
      });

      const aporiaEs = await createCard({
        user_id: DEFAULT_USER_ID,
        term: 'aporía',
        language: 'es',
        gender: 'feminine',
        english_gloss: 'aporia, philosophical impasse',
        part_of_speech: 'noun',
        primary_definition: 'Paradoja o dificultad lógica insuperable.',
        etymology: {
          roots: [
            { morpheme: 'a-', meaning: 'sin', origin: 'Greek' },
            { morpheme: 'poros', meaning: 'paso / salida', origin: 'Greek' },
          ],
          cognates: ['aporia', 'aporético'],
        },
        collocations: ['aporía filosófica'],
        source_context: { sentence: 'Cayó en una aporía.', source: 'Ensayos' },
        cloze_sentences: ['Cayó en una {{c1::aporía}}.'],
      });

      const porousEn = await createCard({
        user_id: DEFAULT_USER_ID,
        term: 'aporetic',
        language: 'en',
        part_of_speech: 'adjective',
        primary_definition: 'Characterized by doubt or philosophical impasse.',
        etymology: {
          roots: [
            { morpheme: 'poros', meaning: 'passage / way through', origin: 'Greek' },
          ],
          cognates: ['aporia'],
        },
        collocations: ['aporetic dialogue'],
        source_context: { sentence: 'An aporetic conclusion.', source: 'Notes' },
        cloze_sentences: ['An {{c1::aporetic}} conclusion.'],
      });

      const allCards = await listCards({ userId: DEFAULT_USER_ID });
      const matches = findCrossLingualCognates(aporiaEn, allCards, 6);

      expect(matches.length).toBeGreaterThanOrEqual(2);
      // Cross-lingual match ('aporía') must be ranked before same-language match ('aporetic')
      expect(matches[0].card.id).toBe(aporiaEs.id);
      expect(matches[0].relationType).toBe('cross-lingual');
      expect(matches[0].sharedRoot?.morpheme).toBe('poros');

      const sameLangMatch = matches.find((m) => m.card.id === porousEn.id);
      expect(sameLangMatch).toBeDefined();
      expect(sameLangMatch?.relationType).toBe('same-language-root');
    });
  });

  describe('Prose Polisher (ACT-05) — Heuristic & API Route', () => {
    it('polishes an English draft using seeded lexicon cards and replaces trigger phrases', async () => {
      const cards = await listCards({ userId: DEFAULT_USER_ID });
      const draft =
        'Her critique of the political crisis was very sharp, even though the movement remained in an unformed state and its founding legend was probably fake.';

      const result = polishUserProseFallback({
        draft,
        cards,
        language: 'en',
        maxSuggestions: 3,
      });

      expect(result.detectedLanguage).toBe('en');
      expect(result.mode).toBe('heuristic');
      expect(result.suggestions.length).toBeGreaterThanOrEqual(2);

      const suggestedTerms = result.suggestions.map((s) => s.term);
      expect(suggestedTerms).toContain('perspicacious');
      expect(suggestedTerms).toContain('inchoate');
      expect(result.elevatedDraft.toLowerCase()).toContain('perspicacious');
      expect(result.elevatedDraft.toLowerCase()).toContain('inchoate');
    });

    it('polishes a Spanish draft and weaves Spanish lexicon cards naturally', async () => {
      await createCard({
        user_id: DEFAULT_USER_ID,
        term: 'desasosiego',
        language: 'es',
        gender: 'masculine',
        english_gloss: 'restlessness, existential unease',
        part_of_speech: 'noun',
        primary_definition: 'Falta de sosiego; inquietud interior profunda.',
        etymology: {
          roots: [{ morpheme: 'sessicare', meaning: 'asentar / calmar', origin: 'Latin' }],
          cognates: ['sosiego'],
        },
        collocations: ['hondo desasosiego', 'libro del desasosiego'],
        source_context: { sentence: 'Sentía un hondo desasosiego.', source: 'Pessoa' },
        cloze_sentences: ['Sentía un hondo {{c1::desasosiego}}.'],
      });

      await createCard({
        user_id: DEFAULT_USER_ID,
        term: 'quimera',
        language: 'es',
        gender: 'feminine',
        english_gloss: 'chimera, impossible illusion',
        part_of_speech: 'noun',
        primary_definition: 'Aquello que se propone a la imaginación como posible o verdadero, no siéndolo.',
        etymology: {
          roots: [{ morpheme: 'chimaira', meaning: 'monstruo mítico', origin: 'Greek' }],
          cognates: ['quimérico'],
        },
        collocations: ['vana quimera', 'perseguir una quimera'],
        source_context: { sentence: 'Aquella utopía era una quimera.', source: 'Cervantes' },
        cloze_sentences: ['Aquella utopía era una {{c1::quimera}}.'],
      });

      const req = new NextRequest('http://localhost:3000/api/polish-prose', {
        method: 'POST',
        body: JSON.stringify({
          draft:
            'El poeta caminaba por la ciudad con una gran inquietud mientras perseguía un sueño imposible en la noche.',
          language: 'auto',
        }),
      });

      const res = await polishProseHandler(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.detectedLanguage).toBe('es');
      expect(json.data.suggestions.length).toBeGreaterThanOrEqual(2);

      const terms = json.data.suggestions.map((s: any) => s.term);
      expect(terms).toContain('desasosiego');
      expect(terms).toContain('quimera');
      expect(json.data.elevatedDraft.toLowerCase()).toContain('desasosiego');
      expect(json.data.elevatedDraft.toLowerCase()).toContain('quimera');
    });

    it('commits polished prose to production_logs in Mode A and returns 400 on empty draft in Mode B', async () => {
      const emptyReq = new NextRequest('http://localhost:3000/api/polish-prose', {
        method: 'POST',
        body: JSON.stringify({ draft: '   ' }),
      });
      const emptyRes = await polishProseHandler(emptyReq);
      expect(emptyRes.status).toBe(400);

      const commitReq = new NextRequest('http://localhost:3000/api/polish-prose', {
        method: 'POST',
        body: JSON.stringify({
          commitCardIds: [
            '00000000-0000-0000-0000-000000000001',
            '00000000-0000-0000-0000-000000000003',
          ],
          committedDraft:
            'Her perspicacious appraisal illuminated the inchoate rebellion before it crystallized.',
        }),
      });
      const commitRes = await polishProseHandler(commitReq);
      expect(commitRes.status).toBe(200);
      const commitJson = await commitRes.json();
      expect(commitJson.success).toBe(true);
      expect(commitJson.committedCount).toBe(2);

      const logsWithCards = await listAllProductionLogsWithCards(DEFAULT_USER_ID, 20);
      expect(logsWithCards.length).toBe(2);
      expect(logsWithCards[0].evaluation_status).toBe('pass');
      expect(logsWithCards[0].card?.term).toBeDefined();
    });
  });

  describe('Production Portfolio API (GET /api/production-logs)', () => {
    it('returns flattened production logs enriched with card metadata and filters by language and status', async () => {
      const esCard = await createCard({
        user_id: DEFAULT_USER_ID,
        term: 'añoranza',
        language: 'es',
        gender: 'feminine',
        english_gloss: 'longing, nostalgia',
        part_of_speech: 'noun',
        primary_definition: 'Sentimiento de pena por la lejanía o ausencia de algo querido.',
        etymology: {
          roots: [{ morpheme: 'ignorare', meaning: 'echar de menos', origin: 'Latin' }],
          cognates: ['añorar'],
        },
        collocations: ['profunda añoranza'],
        source_context: { sentence: 'La añoranza del mar.', source: 'Alberti' },
        cloze_sentences: ['La {{c1::añoranza}} del mar.'],
      });

      await logProductionAttempt(
        '00000000-0000-0000-0000-000000000001',
        'A perspicacious observer saw through the rhetoric immediately.',
        'pass',
        'Superb usage.'
      );
      await logProductionAttempt(
        '00000000-0000-0000-0000-000000000002',
        'He was solipsism.',
        'incorrect_usage',
        'Part of speech error.'
      );
      await logProductionAttempt(
        esCard.id,
        'La profunda añoranza del exiliado impregnaba cada verso.',
        'pass',
        'Excelente concordancia.'
      );

      const allReq = new NextRequest('http://localhost:3000/api/production-logs');
      const allRes = await getProductionLogsHandler(allReq);
      expect(allRes.status).toBe(200);
      const allJson = await allRes.json();
      expect(allJson.count).toBe(3);
      expect(allJson.data[0].card).toBeTruthy();

      const esPassReq = new NextRequest(
        'http://localhost:3000/api/production-logs?language=es&status=pass'
      );
      const esPassRes = await getProductionLogsHandler(esPassReq);
      const esPassJson = await esPassRes.json();
      expect(esPassJson.count).toBe(1);
      expect(esPassJson.data[0].card.term).toBe('añoranza');
      expect(esPassJson.data[0].card.language).toBe('es');

      const enIncorrectReq = new NextRequest(
        'http://localhost:3000/api/production-logs?language=en&status=incorrect_usage'
      );
      const enIncorrectRes = await getProductionLogsHandler(enIncorrectReq);
      const enIncorrectJson = await enIncorrectRes.json();
      expect(enIncorrectJson.count).toBe(1);
      expect(enIncorrectJson.data[0].card.term).toBe('solipsism');
    });
  });
});
