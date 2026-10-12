import { describe, it, expect } from 'vitest';
import { LexicalEnrichmentSchema } from '@/lib/llm/schema';
import {
  enrichWord,
  detectLanguage,
  synthesizeLexicalFallback,
  fallbackEnrichWord,
  extractJsonFromText,
  getGeminiApiKey,
  normalizeLexicalPayload,
} from '@/lib/llm/enricher';

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

  it('rejects an invalid payload with missing required fields', () => {
    const invalidData = {
      term: '', // empty term should fail
      part_of_speech: 'noun',
      primary_definition: 'Something',
      etymology: { roots: [], cognates: [] },
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

  it('synthesizes novel uncurated word using morphological knowledge base without tautologies', async () => {
    const novelWord = 'antipathy';
    const fallback = synthesizeLexicalFallback(novelWord);

    expect(fallback.term).toBe('antipathy');
    expect(fallback.etymology.roots.length).toBeGreaterThan(0);
    // Should detect prefix anti- or root path
    const morphemes = fallback.etymology.roots.map((r) => r.morpheme);
    expect(morphemes.some((m) => m === 'anti-' || m === 'path')).toBe(true);
    expect(fallback.cloze_sentences.length).toBeGreaterThan(0);
    expect(fallback.cloze_sentences[0]).toContain('{{c1::antipathy}}');

    // Never produces the removed tautological template "Pertaining to or embodying..."
    expect(fallback.primary_definition).not.toContain('Pertaining to or embodying');
    expect(fallback.is_fallback).toBe(true);

    // Must strictly satisfy the Zod schema
    const validation = LexicalEnrichmentSchema.safeParse(fallback);
    expect(validation.success).toBe(true);
  });

  it('handles adjectives with -ar and -ous suffix and synthesizes proper part of speech', async () => {
    const word = 'tenacious';
    const fallback = synthesizeLexicalFallback(word);

    expect(fallback.part_of_speech).toBe('adjective');
    expect(fallback.cloze_sentences[0]).toContain('{{c1::tenacious}}');
    expect(fallback.primary_definition).not.toContain('Pertaining to or embodying');
    expect(LexicalEnrichmentSchema.safeParse(fallback).success).toBe(true);
  });

  it('correctly extracts JSON from raw strings with markdown fences and conversational framing', () => {
    const fencedMarkdown = '```json\n{\n  "term": "homuncular",\n  "part_of_speech": "adjective"\n}\n```';
    const parsedFenced = extractJsonFromText(fencedMarkdown);
    expect(parsedFenced).toEqual({ term: 'homuncular', part_of_speech: 'adjective' });

    const framedText = 'Here is the JSON you requested:\n{\n  "term": "inchoate",\n  "valid": true\n}\nHope this helps!';
    const parsedFramed = extractJsonFromText(framedText);
    expect(parsedFramed).toEqual({ term: 'inchoate', valid: true });
  });

  it('incorporates real dictionary payload when available in synthesizeLexicalFallback', () => {
    const dictData = {
      partOfSpeech: 'adjective',
      phonetic: '/həˈmʌŋkjʊlə/',
      definition: 'Of or resembling a homunculus; miniature, tiny.',
      example: 'The homuncular figure stood quietly on the shelf.',
      synonyms: ['miniature', 'diminutive'],
    };

    const fallback = synthesizeLexicalFallback('homuncular', undefined, undefined, dictData);
    expect(fallback.primary_definition).toBe('Of or resembling a homunculus; miniature, tiny.');
    expect(fallback.part_of_speech).toBe('adjective');
    expect(fallback.phonetic).toBe('/həˈmʌŋkjʊlə/');
    expect(fallback.is_fallback).toBe(true);
    expect(fallback.enrichment_source).toBe('dictionary');
    expect(fallback.primary_definition).not.toContain('Pertaining to or embodying');
  });

  describe('normalizeLexicalPayload (Defensive Schema Handling)', () => {
    it('normalizes alternate field names (definition, partOfSpeech) from LLMs', () => {
      const rawLlmOutput = {
        term: 'epistemology',
        partOfSpeech: 'noun',
        definition: 'The philosophical theory of knowledge and justified belief.',
        nuance: 'Distinguished from ontology or methodology.',
        etymology: {
          roots: ['episteme (knowledge, Greek)', 'logos (study, Greek)'],
          cognates: ['epistemic'],
        },
        collocations: ['epistemological framework', 'virtue epistemology'],
        distinctionMatrix: {
          synonyms: ['epistemology', 'gnoseology'],
          nuance_comparison: 'Epistemology is the standard philosophical term in Anglo-American discourse.',
          context_recommendations: [
            {
              word: 'epistemology',
              recommended_register: 'Philosophical Prose',
              example_sentence: 'His critique exposed the flaws of Cartesian epistemology.',
            },
          ],
        },
      };

      const normalized = normalizeLexicalPayload(rawLlmOutput, 'epistemology');
      expect(normalized.term).toBe('epistemology');
      expect(normalized.part_of_speech).toBe('noun');
      expect(normalized.primary_definition).toBe('The philosophical theory of knowledge and justified belief.');
      expect(normalized.nuance_note).toBe('Distinguished from ontology or methodology.');
      expect(normalized.etymology.roots.length).toBe(2);
      expect(normalized.distinction_matrix?.contextRecommendations[0].recommendedRegister).toBe('Philosophical Prose');
      expect(normalized.distinction_matrix?.contextRecommendations[0].exampleSentence).toContain('Cartesian epistemology');
      expect(LexicalEnrichmentSchema.safeParse(normalized).success).toBe(true);
    });

    it('handles completely minimal or missing subfields gracefully', () => {
      const bareBones = {
        term: 'lucid',
        definition: 'Expressed clearly; easy to understand.',
      };

      const normalized = normalizeLexicalPayload(bareBones, 'lucid');
      expect(normalized.term).toBe('lucid');
      expect(normalized.primary_definition).toBe('Expressed clearly; easy to understand.');
      expect(normalized.part_of_speech).toBe('noun'); // default
      expect(normalized.cloze_sentences.length).toBeGreaterThan(0);
      expect(LexicalEnrichmentSchema.safeParse(normalized).success).toBe(true);
    });

    it('parses Spanish language, gender, and english_gloss', () => {
      const spanishRaw = {
        term: 'añoranza',
        language: 'es',
        gender: 'feminine',
        english_gloss: 'wistful yearning, nostalgia',
        part_of_speech: 'noun',
        primary_definition: 'Sentimiento de pena o melancolía por una ausencia.',
        nuance_note: 'Registro lírico.',
        etymology: {
          roots: [{ morpheme: 'gnorare', meaning: 'conocer', origin: 'Latin' }],
          cognates: ['añorar'],
        },
        collocations: ['profunda añoranza'],
        cloze_sentences: ['Sentía una gran {{c1::añoranza}}.'],
        distinction_matrix: {
          synonyms: ['añoranza', 'nostalgia'],
          nuanceComparison: 'Añoranza es más íntima y punzante.',
          contextRecommendations: [
            { word: 'añoranza', recommendedRegister: 'Lírico', exampleSentence: 'Dulce añoranza.' },
          ],
        },
      };

      const normalized = normalizeLexicalPayload(spanishRaw, 'añoranza');
      expect(normalized.language).toBe('es');
      expect(normalized.gender).toBe('feminine');
      expect(normalized.english_gloss).toBe('wistful yearning, nostalgia');
      expect(normalized.part_of_speech).toBe('noun');
      expect(LexicalEnrichmentSchema.safeParse(normalized).success).toBe(true);
    });
  });

  describe('Bilingual Spanish Lexicon & Detection', () => {
    it('accurately detects language for English and Spanish words and contexts', () => {
      expect(detectLanguage('ojalá')).toBe('es');
      expect(detectLanguage('añoranza')).toBe('es');
      expect(detectLanguage('desahuciado')).toBe('es');
      expect(detectLanguage('acontecer')).toBe('es');
      expect(detectLanguage('sobrecoger')).toBe('es');
      expect(detectLanguage('sobrecogió', 'El silencio sobrecogió a toda la aldea')).toBe('es');
      expect(detectLanguage('perspicacious')).toBe('en');
      expect(detectLanguage('solipsism')).toBe('en');
    });

    it('enriches curated Spanish terms with RAE definition, Arabic/Latin morphemes, gender, and gloss', async () => {
      // 1. ojalá (Arabic origin)
      const ojala = await enrichWord('ojalá');
      expect(ojala.language).toBe('es');
      expect(ojala.english_gloss).toBeDefined();
      expect(ojala.primary_definition).toContain('subjuntivo');
      expect(ojala.etymology.roots.some((r) => r.origin.toLowerCase().includes('arabic'))).toBe(true);
      expect(ojala.cloze_sentences.some((s) => s.includes('ojalá'))).toBe(true);

      // 2. añoranza (Feminine noun, Latin notus/gnorare)
      const anoranza = await enrichWord('añoranza');
      expect(anoranza.language).toBe('es');
      expect(anoranza.gender).toBe('feminine');
      expect(anoranza.english_gloss).toBeDefined();
      expect(anoranza.etymology.roots.some((r) => r.morpheme.includes('gnorare') || r.morpheme.includes('notus'))).toBe(true);
      expect(anoranza.distinction_matrix?.synonyms).toContain('añoranza');
      expect(anoranza.distinction_matrix?.synonyms).toContain('nostalgia');

      // 3. desahuciado (Masculine adjective, Latin roots)
      const desahuciado = await enrichWord('desahuciado');
      expect(desahuciado.language).toBe('es');
      expect(desahuciado.gender).toBe('masculine');
      expect(desahuciado.english_gloss).toBeDefined();
      expect(desahuciado.distinction_matrix?.synonyms).toContain('desahuciado');
      expect(desahuciado.distinction_matrix?.synonyms).toContain('moribundo');

      // 4. acontecer (Verb, Latin roots)
      const acontecer = await enrichWord('acontecer');
      expect(acontecer.language).toBe('es');
      expect(acontecer.part_of_speech).toBe('verb');
      expect(acontecer.english_gloss).toBeDefined();

      // 5. sobrecoger (Verb)
      const sobrecoger = await enrichWord('sobrecoger');
      expect(sobrecoger.language).toBe('es');
      expect(sobrecoger.part_of_speech).toBe('verb');
    });

    it('synthesizes novel uncurated Spanish terms using Spanish morphological rules (Arabic al-, suffixes)', () => {
      // Arabic prefix al-
      const aljibe = fallbackEnrichWord('aljibe');
      expect(aljibe.language).toBe('es');
      expect(aljibe.etymology.roots[0].origin).toBe('Arabic');
      expect(aljibe.is_fallback).toBe(true);
      expect(aljibe.english_gloss).toBeDefined();
      expect(LexicalEnrichmentSchema.safeParse(aljibe).success).toBe(true);

      // Verb ending in -ecer
      const favorecer = fallbackEnrichWord('favorecer');
      expect(favorecer.language).toBe('es');
      expect(favorecer.part_of_speech).toBe('verb');
      expect(favorecer.etymology.roots.some((r) => r.morpheme === '-ecer')).toBe(true);

      // Feminine noun ending in -ción
      const abnegacion = fallbackEnrichWord('abnegación');
      expect(abnegacion.language).toBe('es');
      expect(abnegacion.part_of_speech).toBe('noun');
      expect(abnegacion.gender).toBe('feminine');
      expect(abnegacion.etymology.roots.some((r) => r.morpheme === '-ción')).toBe(true);
    });
  });
});
