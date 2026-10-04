import {
  LexicalEnrichmentSchema,
  LexicalEnrichmentPayload,
} from './schema';
import { CURATED_LEXICON } from './curated-lexicon';

// ============================================================================
// Common Morphological Knowledge Base (Greek & Latin)
// ============================================================================
interface MorphemeEntry {
  morpheme: string;
  meaning: string;
  origin: 'Latin' | 'Greek';
}

const COMMON_PREFIXES: MorphemeEntry[] = [
  { morpheme: 'ante-', meaning: 'before / prior', origin: 'Latin' },
  { morpheme: 'anti-', meaning: 'against / opposed to', origin: 'Greek' },
  { morpheme: 'auto-', meaning: 'self / same', origin: 'Greek' },
  { morpheme: 'circum-', meaning: 'around / about', origin: 'Latin' },
  { morpheme: 'contra-', meaning: 'against / contrary', origin: 'Latin' },
  { morpheme: 'de-', meaning: 'down / away / undo', origin: 'Latin' },
  { morpheme: 'dia-', meaning: 'through / across', origin: 'Greek' },
  { morpheme: 'dis-', meaning: 'apart / negation', origin: 'Latin' },
  { morpheme: 'dys-', meaning: 'bad / abnormal / impaired', origin: 'Greek' },
  { morpheme: 'epi-', meaning: 'upon / above / in addition', origin: 'Greek' },
  { morpheme: 'eu-', meaning: 'good / well / pleasant', origin: 'Greek' },
  { morpheme: 'ex-', meaning: 'out of / from / former', origin: 'Latin' },
  { morpheme: 'hyper-', meaning: 'excessive / beyond', origin: 'Greek' },
  { morpheme: 'hypo-', meaning: 'under / deficient', origin: 'Greek' },
  { morpheme: 'inter-', meaning: 'between / among', origin: 'Latin' },
  { morpheme: 'intra-', meaning: 'within / inside', origin: 'Latin' },
  { morpheme: 'macro-', meaning: 'large / long', origin: 'Greek' },
  { morpheme: 'micro-', meaning: 'small / minute', origin: 'Greek' },
  { morpheme: 'mono-', meaning: 'one / single', origin: 'Greek' },
  { morpheme: 'omni-', meaning: 'all / universally', origin: 'Latin' },
  { morpheme: 'pan-', meaning: 'all / whole', origin: 'Greek' },
  { morpheme: 'peri-', meaning: 'around / enclosing', origin: 'Greek' },
  { morpheme: 'poly-', meaning: 'many / multi', origin: 'Greek' },
  { morpheme: 'post-', meaning: 'after / subsequent', origin: 'Latin' },
  { morpheme: 'pre-', meaning: 'before / in advance', origin: 'Latin' },
  { morpheme: 'pro-', meaning: 'forward / in favor of', origin: 'Latin' },
  { morpheme: 'proto-', meaning: 'first / original', origin: 'Greek' },
  { morpheme: 'pseudo-', meaning: 'false / deceptive', origin: 'Greek' },
  { morpheme: 'retro-', meaning: 'backward / behind', origin: 'Latin' },
  { morpheme: 'sub-', meaning: 'under / below / lesser', origin: 'Latin' },
  { morpheme: 'syn-', meaning: 'together / with', origin: 'Greek' },
  { morpheme: 'trans-', meaning: 'across / beyond', origin: 'Latin' },
  { morpheme: 'ultra-', meaning: 'beyond / extreme', origin: 'Latin' },
];

const COMMON_ROOTS: MorphemeEntry[] = [
  { morpheme: 'chron', meaning: 'time', origin: 'Greek' },
  { morpheme: 'path', meaning: 'feeling / suffering / disease', origin: 'Greek' },
  { morpheme: 'dict', meaning: 'to say / declare', origin: 'Latin' },
  { morpheme: 'phil', meaning: 'love / affinity', origin: 'Greek' },
  { morpheme: 'bio', meaning: 'life', origin: 'Greek' },
  { morpheme: 'log', meaning: 'word / reason / study', origin: 'Greek' },
  { morpheme: 'morph', meaning: 'form / shape / structure', origin: 'Greek' },
  { morpheme: 'graph', meaning: 'to write / record', origin: 'Greek' },
  { morpheme: 'voc', meaning: 'voice / to call', origin: 'Latin' },
  { morpheme: 'vis', meaning: 'to see / look', origin: 'Latin' },
  { morpheme: 'aud', meaning: 'to hear', origin: 'Latin' },
  { morpheme: 'corp', meaning: 'body', origin: 'Latin' },
  { morpheme: 'gen', meaning: 'birth / origin / kind', origin: 'Greek' },
  { morpheme: 'cogn', meaning: 'to know / learn', origin: 'Latin' },
  { morpheme: 'cred', meaning: 'to believe / trust', origin: 'Latin' },
  { morpheme: 'luc', meaning: 'light / clear', origin: 'Latin' },
  { morpheme: 'ver', meaning: 'truth / real', origin: 'Latin' },
  { morpheme: 'fer', meaning: 'to bear / carry', origin: 'Latin' },
  { morpheme: 'tract', meaning: 'to pull / draw', origin: 'Latin' },
  { morpheme: 'duc', meaning: 'to lead / guide', origin: 'Latin' },
  { morpheme: 'scrib', meaning: 'to write', origin: 'Latin' },
  { morpheme: 'spec', meaning: 'to look / observe', origin: 'Latin' },
  { morpheme: 'tang', meaning: 'to touch', origin: 'Latin' },
  { morpheme: 'flu', meaning: 'to flow', origin: 'Latin' },
  { morpheme: 'cur', meaning: 'to run / course', origin: 'Latin' },
  { morpheme: 'mit', meaning: 'to send / let go', origin: 'Latin' },
  { morpheme: 'port', meaning: 'to carry', origin: 'Latin' },
  { morpheme: 'ten', meaning: 'to hold / keep', origin: 'Latin' },
  { morpheme: 'pon', meaning: 'to put / place', origin: 'Latin' },
  { morpheme: 'cap', meaning: 'to take / seize', origin: 'Latin' },
  { morpheme: 'ced', meaning: 'to go / yield', origin: 'Latin' },
  { morpheme: 'pend', meaning: 'to hang / weigh', origin: 'Latin' },
  { morpheme: 'struct', meaning: 'to build / arrange', origin: 'Latin' },
  { morpheme: 'jur', meaning: 'law / right / swear', origin: 'Latin' },
  { morpheme: 'bell', meaning: 'war / conflict', origin: 'Latin' },
  { morpheme: 'pac', meaning: 'peace', origin: 'Latin' },
  { morpheme: 'bene', meaning: 'good / well', origin: 'Latin' },
  { morpheme: 'mal', meaning: 'bad / evil', origin: 'Latin' },
];

const COMMON_SUFFIXES: MorphemeEntry[] = [
  { morpheme: '-ous', meaning: 'full of / possessing quality of', origin: 'Latin' },
  { morpheme: '-ic', meaning: 'pertaining to / of nature of', origin: 'Greek' },
  { morpheme: '-tion', meaning: 'action / process / state of', origin: 'Latin' },
  { morpheme: '-ism', meaning: 'doctrine / philosophical system / condition', origin: 'Greek' },
  { morpheme: '-ist', meaning: 'adherent / practitioner', origin: 'Greek' },
  { morpheme: '-ity', meaning: 'state / quality of being', origin: 'Latin' },
  { morpheme: '-ness', meaning: 'state / condition of', origin: 'Latin' },
  { morpheme: '-ate', meaning: 'characterized by / to actuate', origin: 'Latin' },
  { morpheme: '-ive', meaning: 'tending to / performing', origin: 'Latin' },
  { morpheme: '-able', meaning: 'capable of being / worthy of', origin: 'Latin' },
  { morpheme: '-ly', meaning: 'in manner of', origin: 'Latin' },
  { morpheme: '-ize', meaning: 'to make / conform to', origin: 'Greek' },
  { morpheme: '-itude', meaning: 'condition / state of', origin: 'Latin' },
];

// ============================================================================
// Helper Utilities: API Key Detection & Robust JSON Extraction
// ============================================================================
export function getGeminiApiKey(): string | null {
  const envKeys = [
    process.env.GEMINI_API_KEY,
    process.env.GOOGLE_API_KEY,
    process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    process.env.GOOGLE_AI_KEY,
    process.env.GEMINI_KEY,
  ];

  for (const raw of envKeys) {
    if (raw && typeof raw === 'string') {
      const trimmed = raw.trim().replace(/^["']|["']$/g, '');
      if (trimmed && !trimmed.startsWith('your-') && trimmed.length > 5) {
        return trimmed;
      }
    }
  }
  return null;
}

export function extractJsonFromText(rawText: string): any {
  if (!rawText || typeof rawText !== 'string') return null;
  let text = rawText.trim();

  // Strip markdown code fences if wrapped in ```json ... ``` or ``` ... ```
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }

  // Find boundaries of outer JSON object
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    text = text.slice(start, end + 1);
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ============================================================================
// Public Real Dictionary Fallback (Free Dictionary API)
// ============================================================================
export interface DictionaryApiResponse {
  partOfSpeech: string;
  phonetic: string | null;
  definition: string;
  example?: string;
  synonyms: string[];
}

export async function fetchDictionaryFallback(term: string): Promise<DictionaryApiResponse | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(term.toLowerCase().trim())}`,
      { signal: controller.signal }
    );
    clearTimeout(timer);
    if (!res.ok) return null;

    const list = await res.json();
    if (!Array.isArray(list) || list.length === 0) return null;

    const first = list[0];
    const phonetic = first.phonetic || first.phonetics?.find((p: any) => p?.text)?.text || null;
    const meaning = first.meanings?.[0];
    const partOfSpeech = meaning?.partOfSpeech || 'noun';
    const defItem = meaning?.definitions?.[0];
    const definition = defItem?.definition;
    if (!definition) return null;

    const example = defItem?.example;
    const synonyms = Array.isArray(meaning?.synonyms) ? meaning.synonyms.slice(0, 3) : [];

    return {
      partOfSpeech,
      phonetic,
      definition,
      example,
      synonyms,
    };
  } catch {
    return null;
  }
}

// ============================================================================
// Built-in Intelligent Fallback Lexical Synthesizer
// ============================================================================
export function synthesizeLexicalFallback(
  rawTerm: string,
  contextSentence?: string,
  source?: string,
  dictData?: DictionaryApiResponse | null
): LexicalEnrichmentPayload {
  const term = rawTerm.trim().toLowerCase();

  // 1. Check curated high-register database
  if (CURATED_LEXICON[term]) {
    const curated = CURATED_LEXICON[term];
    const clozeSentences = [...curated.cloze_sentences];

    let sourceContext = {
      sentence: curated.source_context?.sentence || null,
      source: curated.source_context?.source || null,
    };

    if (contextSentence && contextSentence.trim()) {
      sourceContext = {
        sentence: contextSentence.trim(),
        source: source?.trim() || 'User Ingestion',
      };
      // Mask context sentence for cloze
      const regex = new RegExp(`\\b${escapeRegExp(term)}[a-z]*\\b`, 'i');
      if (regex.test(contextSentence)) {
        const masked = contextSentence.replace(regex, (match) => `{{c1::${match}}}`);
        clozeSentences.unshift(masked);
      }
    }

    return LexicalEnrichmentSchema.parse({
      term: rawTerm.trim(),
      ...curated,
      source_context: sourceContext,
      cloze_sentences: clozeSentences,
      is_fallback: false,
      enrichment_source: 'curated',
    });
  }

  // 2. Algorithmic morphological analysis
  const identifiedRoots: { morpheme: string; meaning: string; origin: string }[] = [];
  const identifiedCognates: string[] = [];

  // Match prefixes
  for (const p of COMMON_PREFIXES) {
    const rawPrefix = p.morpheme.replace('-', '');
    if (term.startsWith(rawPrefix) && term.length > rawPrefix.length + 2) {
      identifiedRoots.push(p);
      break;
    }
  }

  // Match root stems
  for (const r of COMMON_ROOTS) {
    if (term.includes(r.morpheme) && term.length >= r.morpheme.length) {
      identifiedRoots.push(r);
      identifiedCognates.push(`${r.morpheme}ic`, `${r.morpheme}ation`);
      break;
    }
  }

  // Match suffixes & infer POS (or prefer real dictionary POS)
  let partOfSpeech = dictData?.partOfSpeech || 'noun';
  if (!dictData?.partOfSpeech) {
    if (term.endsWith('ly')) {
      partOfSpeech = 'adverb';
    } else if (
      term.endsWith('ous') ||
      term.endsWith('ic') ||
      term.endsWith('al') ||
      term.endsWith('ive') ||
      term.endsWith('able') ||
      term.endsWith('ible') ||
      term.endsWith('ent') ||
      term.endsWith('ant') ||
      term.endsWith('ar')
    ) {
      partOfSpeech = 'adjective';
    } else if (term.endsWith('ize') || term.endsWith('ise') || term.endsWith('fy')) {
      partOfSpeech = 'verb';
    } else if (term.endsWith('ate')) {
      partOfSpeech = 'adjective';
    }
  }

  for (const s of COMMON_SUFFIXES) {
    const rawSuffix = s.morpheme.replace('-', '');
    if (term.endsWith(rawSuffix) && term.length > rawSuffix.length + 2) {
      identifiedRoots.push(s);
      break;
    }
  }

  if (identifiedRoots.length === 0) {
    identifiedRoots.push({
      morpheme: term.slice(0, Math.min(5, term.length)),
      meaning: 'root morpheme',
      origin: 'Latin / Greek',
    });
  }

  const capitalizedTerm = rawTerm.charAt(0).toUpperCase() + rawTerm.slice(1);

  // REAL DEFINITIONS: If dictionary returned data, use verified dictionary definition!
  let primaryDefinition: string;
  let nuanceNote: string;
  let isFallback = true;
  let enrichmentSource = 'dictionary';
  let fallbackReason = 'AI service offline / fallback mode';

  if (dictData?.definition) {
    primaryDefinition = dictData.definition;
    nuanceNote = `Retrieved from dictionary fallback while AI service is reconnecting. Conveys nuanced academic register.`;
    enrichmentSource = 'dictionary';
  } else if (identifiedRoots.length > 0 && identifiedRoots[0].meaning !== 'root morpheme') {
    const rootSummary = identifiedRoots.map((r) => `${r.morpheme} (${r.meaning})`).join(', ');
    primaryDefinition = `A literary or scholarly ${partOfSpeech} derived from ${rootSummary}. (AI service was unreachable — check GEMINI_API_KEY).`;
    nuanceNote = `Identified morphological roots: ${rootSummary}.`;
    enrichmentSource = 'offline-heuristic';
  } else {
    primaryDefinition = `A specialized literary or academic term. (AI service was unreachable — verify GEMINI_API_KEY in Vercel settings).`;
    nuanceNote = `Captured in fallback mode. Verify GEMINI_API_KEY on Vercel to enable full etymological analysis.`;
    enrichmentSource = 'offline-stub';
  }

  const collocations = dictData?.synonyms && dictData.synonyms.length > 0
    ? dictData.synonyms.map((s) => `${term} / ${s}`)
    : [`${term} context`, `scholarly ${term}`, `nuanced ${term}`];

  const clozeSentences: string[] = [];
  if (contextSentence && contextSentence.trim()) {
    const regex = new RegExp(`\\b${escapeRegExp(term)}[a-z]*\\b`, 'i');
    if (regex.test(contextSentence)) {
      clozeSentences.push(contextSentence.replace(regex, (match) => `{{c1::${match}}}`));
    } else {
      clozeSentences.push(`The author deployed the concept of {{c1::${term}}} in the concluding monograph.`);
    }
  } else if (dictData?.example) {
    const regex = new RegExp(`\\b${escapeRegExp(term)}[a-z]*\\b`, 'i');
    if (regex.test(dictData.example)) {
      clozeSentences.push(dictData.example.replace(regex, (match) => `{{c1::${match}}}`));
    } else {
      clozeSentences.push(dictData.example);
    }
  } else {
    clozeSentences.push(
      `The critical treatise examined the {{c1::${term}}} underlying modern discourse.`,
      `Her appraisal revealed an unmistakable {{c1::${term}}} that characterized the work.`
    );
  }

  const distinctionMatrix = {
    synonyms: [term, ...(dictData?.synonyms || ['counterpart'])],
    nuanceComparison: `${capitalizedTerm} denotes elevated precision in literary or scholarly prose.`,
    contextRecommendations: [
      {
        word: term,
        recommendedRegister: 'Scholarly / Critical Prose',
        exampleSentence: `An incisive application of ${term} in peer-reviewed discourse.`,
      },
    ],
  };

  const payload: LexicalEnrichmentPayload = {
    term: rawTerm.trim(),
    part_of_speech: partOfSpeech,
    phonetic: dictData?.phonetic || `/${term}/`,
    primary_definition: primaryDefinition,
    nuance_note: nuanceNote,
    etymology: {
      roots: identifiedRoots,
      cognates: identifiedCognates.length > 0 ? identifiedCognates : [`${term}ity`],
    },
    collocations,
    source_context: {
      sentence: contextSentence?.trim() || null,
      source: source?.trim() || null,
    },
    cloze_sentences: clozeSentences,
    distinction_matrix: distinctionMatrix,
    is_fallback: isFallback,
    enrichment_source: enrichmentSource,
    fallback_reason: fallbackReason,
  };

  return LexicalEnrichmentSchema.parse(payload);
}

// ============================================================================
// Google Gemini API Ingestion
// ============================================================================
async function fetchGeminiEnrichment(
  term: string,
  contextSentence?: string,
  source?: string
): Promise<LexicalEnrichmentPayload | null> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    console.warn('[Gemini API] No valid API key found in environment.');
    return null;
  }

  const prompt = `You are a world-class lexicographer and etymologist. Analyze the target vocabulary word "${term}".
${contextSentence ? `Context sentence provided by user: "${contextSentence}"` : ''}
${source ? `Source: "${source}"` : ''}

Return a valid JSON object matching this schema:
{
  "term": "${term}",
  "part_of_speech": "noun | verb | adjective | adverb",
  "phonetic": "IPA phonetic transcription (e.g. /.../)",
  "primary_definition": "Crisp, rigorous definition",
  "nuance_note": "Connotative nuances, tone, register distinctions vs near-synonyms",
  "etymology": {
    "roots": [
      { "morpheme": "morpheme string", "meaning": "meaning string", "origin": "Latin | Greek | etc." }
    ],
    "cognates": ["cognate1", "cognate2"]
  },
  "collocations": ["common high-register phrase 1", "phrase 2", "phrase 3", "phrase 4"],
  "source_context": {
    "sentence": ${contextSentence ? JSON.stringify(contextSentence) : 'null'},
    "source": ${source ? JSON.stringify(source) : 'null'}
  },
  "cloze_sentences": [
    "High-register sentence with {{c1::${term}}} masked",
    "Second sentence with {{c1::${term}}} masked"
  ],
  "distinction_matrix": {
    "synonyms": ["${term}", "synonym2", "synonym3"],
    "nuanceComparison": "Comparative explanation of differences between these 3 words",
    "contextRecommendations": [
      { "word": "${term}", "recommendedRegister": "register", "exampleSentence": "sentence" },
      { "word": "synonym2", "recommendedRegister": "register", "exampleSentence": "sentence" },
      { "word": "synonym3", "recommendedRegister": "register", "exampleSentence": "sentence" }
    ]
  }
}
Respond with ONLY raw JSON.`;

  const candidateModels = [
    process.env.GEMINI_MODEL,
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-1.5-pro',
  ].filter(Boolean) as string[];
  const modelsToTry = Array.from(new Set(candidateModels));

  for (const model of modelsToTry) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7500);

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        }),
      });
      clearTimeout(timeout);

      if (!response.ok) {
        const errorBody = await response.text().catch(() => '');
        console.warn(`[Gemini API] Model ${model} returned HTTP ${response.status}:`, errorBody);
        continue;
      }

      const json = await response.json();
      const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) continue;

      const parsedJson = extractJsonFromText(rawText);
      if (!parsedJson) continue;

      return LexicalEnrichmentSchema.parse({
        ...parsedJson,
        is_fallback: false,
        enrichment_source: 'gemini',
      });
    } catch (err: any) {
      console.warn(`[Gemini API] Request with model ${model} failed:`, err?.message || err);
    }
  }

  return null;
}

// ============================================================================
// OpenAI API Ingestion
// ============================================================================
async function fetchOpenAIEnrichment(
  term: string,
  contextSentence?: string,
  source?: string
): Promise<LexicalEnrichmentPayload | null> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey || apiKey === 'your-openai-api-key') return null;

  const prompt = `You are an expert lexicographer. Return structured JSON for the vocabulary term "${term}".
${contextSentence ? `Context sentence: "${contextSentence}"` : ''}
${source ? `Source: "${source}"` : ''}

Include term, part_of_speech, phonetic, primary_definition, nuance_note, etymology (roots array, cognates array), collocations (array of 4 phrases), cloze_sentences (array of 2 sentences with {{c1::${term}}} masked), and distinction_matrix with 3 synonyms.`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        temperature: 0.2,
        messages: [
          {
            role: 'system',
            content: 'You output only strict JSON matching the requested lexical schema.',
          },
          { role: 'user', content: prompt },
        ],
      }),
    });
    clearTimeout(timeout);

    if (!response.ok) return null;
    const json = await response.json();
    const rawContent = json.choices?.[0]?.message?.content;
    if (!rawContent) return null;

    const parsed = extractJsonFromText(rawContent);
    if (!parsed) return null;

    return LexicalEnrichmentSchema.parse({
      ...parsed,
      is_fallback: false,
      enrichment_source: 'openai',
    });
  } catch (err) {
    console.warn('[OpenAI API] Request failed or timed out:', err);
    return null;
  }
}

// ============================================================================
// Main Public Enricher Function (ING-02)
// ============================================================================
export async function enrichWord(
  term: string,
  contextSentence?: string,
  source?: string
): Promise<LexicalEnrichmentPayload> {
  const trimmed = term.trim();
  if (!trimmed) {
    throw new Error('Term cannot be empty');
  }

  // 1. Try Gemini
  const geminiResult = await fetchGeminiEnrichment(trimmed, contextSentence, source);
  if (geminiResult) return geminiResult;

  // 2. Try OpenAI
  const openAiResult = await fetchOpenAIEnrichment(trimmed, contextSentence, source);
  if (openAiResult) return openAiResult;

  // 3. Try Public Dictionary API for real definition
  const dictData = await fetchDictionaryFallback(trimmed);

  // 4. Fall back to intelligent lexical synthesizer (with verified dictionary data if available)
  return synthesizeLexicalFallback(trimmed, contextSentence, source, dictData);
}
