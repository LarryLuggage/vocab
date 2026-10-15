import { describe, it, expect, vi, afterEach } from 'vitest';
import { LexicalEnrichmentSchema } from '@/lib/llm/schema';
import {
  enrichWord,
  detectLanguage,
  synthesizeLexicalFallback,
  fallbackEnrichWord,
  extractJsonFromText,
  getGeminiApiKey,
  normalizeLexicalPayload,
  fetchGeminiEnrichment,
  geminiModelsToTry,
  geminiGenerationConfig,
  geminiAttemptTimeoutMs,
  visibleGeminiModels,
  GEMINI_PRIMARY_TIMEOUT_MS,
  GEMINI_FALLBACK_TIMEOUT_MS,
  GEMINI_ENRICHMENT_BUDGET_MS,
  GEMINI_MAX_OUTPUT_TOKENS,
  GEMINI_DEFAULT_MODEL,
  GEMINI_FALLBACK_MODEL,
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
    if (!getGeminiApiKey()) {
      expect(enriched.is_fallback).toBe(true);
      expect(enriched.enrichment_source).toBe('curated');
    }
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

  describe('Gemini request budget and honest fallbacks', () => {
    const envKeys = [
      'GEMINI_API_KEY',
      'GOOGLE_API_KEY',
      'NEXT_PUBLIC_GEMINI_API_KEY',
      'GOOGLE_AI_KEY',
      'GEMINI_KEY',
      'GEMINI_MODEL',
    ] as const;
    let restoreEnv: (() => void) | null = null;

    afterEach(() => {
      restoreEnv?.();
      restoreEnv = null;
      vi.unstubAllGlobals();
      vi.restoreAllMocks();
    });

    it('labels a curated lexicon hit as a fallback', () => {
      const curated = synthesizeLexicalFallback('perspicacious');
      expect(curated.is_fallback).toBe(true);
      expect(curated.enrichment_source).toBe('curated');
      expect(curated.fallback_reason).toBeTruthy();
    });

    it('gives the primary model enough time for a structured reply and stays inside the route budget', () => {
      expect(GEMINI_PRIMARY_TIMEOUT_MS).toBeGreaterThan(6500);
      expect(GEMINI_FALLBACK_TIMEOUT_MS).toBeGreaterThan(0);
      expect(GEMINI_PRIMARY_TIMEOUT_MS + GEMINI_FALLBACK_TIMEOUT_MS).toBeLessThanOrEqual(
        GEMINI_ENRICHMENT_BUDGET_MS
      );
      expect(GEMINI_ENRICHMENT_BUDGET_MS).toBeLessThanOrEqual(20_000);
      expect(GEMINI_MAX_OUTPUT_TOKENS).toBeGreaterThanOrEqual(4096);
      expect(geminiAttemptTimeoutMs(0, 0)).toBe(GEMINI_PRIMARY_TIMEOUT_MS);
      expect(geminiAttemptTimeoutMs(1, GEMINI_PRIMARY_TIMEOUT_MS)).toBe(GEMINI_FALLBACK_TIMEOUT_MS);
      expect(geminiAttemptTimeoutMs(1, GEMINI_ENRICHMENT_BUDGET_MS)).toBe(0);
    });

    it('uses low thinking on Gemini 3 and disables thinking on Gemini 2.5', () => {
      const primary = geminiGenerationConfig(GEMINI_DEFAULT_MODEL);
      expect(primary.maxOutputTokens).toBe(GEMINI_MAX_OUTPUT_TOKENS);
      expect(primary.responseMimeType).toBe('application/json');
      expect(primary.thinkingConfig).toEqual({ thinkingLevel: 'low' });
      expect(JSON.stringify(primary)).not.toContain('minimal');

      const fallback = geminiGenerationConfig(GEMINI_FALLBACK_MODEL);
      expect(fallback.thinkingConfig).toEqual({ thinkingBudget: 0 });
      expect(fallback).not.toHaveProperty('thinkingConfig.thinkingLevel');
      expect(JSON.stringify(fallback)).not.toContain('thinkingLevel');
    });

    it('tries the configured model first and keeps a different fallback model', () => {
      expect(geminiModelsToTry(undefined)).toEqual([GEMINI_DEFAULT_MODEL, GEMINI_FALLBACK_MODEL]);
      expect(geminiModelsToTry('gemini-3.8-flash')).toEqual([
        'gemini-3.8-flash',
        GEMINI_FALLBACK_MODEL,
      ]);
      expect(geminiModelsToTry('gemini-2.5-flash')).toEqual([
        'gemini-2.5-flash',
        GEMINI_DEFAULT_MODEL,
      ]);
      expect(geminiModelsToTry('models/gemini-3.8-flash')).toEqual([
        'gemini-3.8-flash',
        GEMINI_FALLBACK_MODEL,
      ]);
    });

    it('does not hide the configured model when the catalog is long', () => {
      const catalog = Array.from({ length: 12 }, (_, i) => `gemini-old-${i}`);
      const visible = visibleGeminiModels(catalog, 'gemini-3.8-flash');
      expect(visible[0]).toBe('gemini-3.8-flash');
      expect(visible).toHaveLength(13);
      expect(visible).toContain('gemini-old-11');
      expect(visibleGeminiModels(['models/gemini-3.8-flash', 'gemini-2.5-flash'], 'gemini-3.8-flash')).toEqual([
        'gemini-3.8-flash',
        'gemini-2.5-flash',
      ]);
    });

    it('logs an empty Gemini reply and retries the fallback model', async () => {
      const previousEnv = Object.fromEntries(envKeys.map((key) => [key, process.env[key]]));
      restoreEnv = () => {
        for (const key of envKeys) {
          const previous = previousEnv[key];
          if (previous === undefined) delete process.env[key];
          else process.env[key] = previous;
        }
      };
      process.env.GEMINI_API_KEY = 'test-gemini-key-not-a-real-secret';
      delete process.env.GEMINI_MODEL;

      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const calls: { model: string; body: any }[] = [];

      vi.stubGlobal(
        'fetch',
        vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
          const url = String(input);
          const model = url.match(/models\/([^:]+):/)?.[1] || '';
          const body = JSON.parse(String(init?.body));
          calls.push({ model, body });
          if (model === 'gemini-3.8-flash') {
            return new Response(
              JSON.stringify({
                candidates: [{ finishReason: 'MAX_TOKENS', content: { parts: [] } }],
                usageMetadata: { thoughtsTokenCount: 8192 },
              }),
              { status: 200 }
            );
          }
          return new Response(
            JSON.stringify({
              candidates: [
                {
                  finishReason: 'STOP',
                  content: {
                    parts: [
                      {
                        text: JSON.stringify({
                          term: 'serendipity',
                          part_of_speech: 'noun',
                          primary_definition: 'The occurrence of happy accidents.',
                          nuance_note: 'A pleasant surprise rather than mere luck.',
                          etymology: {
                            roots: [{ morpheme: 'Serendip', meaning: 'Sri Lanka', origin: 'Arabic' }],
                            cognates: ['serendipitous'],
                          },
                          collocations: ['pure serendipity'],
                          cloze_sentences: ['It was pure {{c1::serendipity}}.'],
                          distinction_matrix: {
                            synonyms: ['serendipity', 'chance'],
                            nuanceComparison: 'Serendipity implies a happy discovery.',
                            contextRecommendations: [
                              {
                                word: 'serendipity',
                                recommendedRegister: 'Literary',
                                exampleSentence: 'By serendipity she found the letter.',
                              },
                            ],
                          },
                        }),
                      },
                    ],
                  },
                },
              ],
            }),
            { status: 200 }
          );
        })
      );

      const result = await fetchGeminiEnrichment('serendipity');

      expect(calls.map((call) => call.model)).toEqual(['gemini-3.8-flash', 'gemini-2.5-flash']);
      expect(calls[0].body.generationConfig.thinkingConfig).toEqual({ thinkingLevel: 'low' });
      expect(calls[0].body.generationConfig.maxOutputTokens).toBe(GEMINI_MAX_OUTPUT_TOKENS);
      expect(calls[1].body.generationConfig.thinkingConfig).toEqual({ thinkingBudget: 0 });
      expect(result.modelUsed).toBe('gemini-2.5-flash');
      expect(result.payload?.is_fallback).toBe(false);
      expect(result.payload?.enrichment_source).toBe('gemini');
      expect(result.payload?.primary_definition).toContain('happy accidents');

      const logged = errorSpy.mock.calls.map((args) => args.join(' ')).join('\n');
      expect(logged).toContain('[Gemini enrichment] model=gemini-3.8-flash status=EMPTY');
      expect(logged).toContain('finishReason=MAX_TOKENS');
      expect(logged).not.toContain('test-gemini-key-not-a-real-secret');
    });
  });
});
