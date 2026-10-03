import {
  LexicalEnrichmentSchema,
  LexicalEnrichmentPayload,
  EtymologyRootSchema,
} from './schema';
import { CURATED_LEXICON } from './curated-lexicon';
import { z } from 'zod';

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
// Built-in Intelligent Fallback Lexical Synthesizer
// ============================================================================
export function synthesizeLexicalFallback(
  rawTerm: string,
  contextSentence?: string,
  source?: string
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

  // Match suffixes & infer POS
  let partOfSpeech = 'noun';
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
    term.endsWith('ant')
  ) {
    partOfSpeech = 'adjective';
  } else if (term.endsWith('ize') || term.endsWith('ise') || term.endsWith('fy')) {
    partOfSpeech = 'verb';
  } else if (term.endsWith('ate')) {
    partOfSpeech = 'adjective';
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
      meaning: 'core semantic base',
      origin: 'Latin',
    });
  }

  const capitalizedTerm = rawTerm.charAt(0).toUpperCase() + rawTerm.slice(1);
  const primaryDefinition = `Pertaining to or embodying ${term}; characterized by refined intellectual or stylistic expression.`;
  const nuanceNote = `Denotes nuanced register with scholarly or formal elevation; emphasizes deliberate precision over colloquial approximation.`;
  const collocations = [
    `deep ${term}`,
    `${term} analysis`,
    `inherent ${term}`,
    `subtle ${term}`,
  ];

  const clozeSentences: string[] = [];
  if (contextSentence && contextSentence.trim()) {
    const regex = new RegExp(`\\b${escapeRegExp(term)}[a-z]*\\b`, 'i');
    if (regex.test(contextSentence)) {
      clozeSentences.push(contextSentence.replace(regex, (match) => `{{c1::${match}}}`));
    } else {
      clozeSentences.push(`The author emphasized the {{c1::${term}}} in the concluding monograph.`);
    }
  } else {
    clozeSentences.push(
      `The critical treatise examined the {{c1::${term}}} underlying modern institutional discourse.`,
      `Her appraisal revealed an unmistakable {{c1::${term}}} that distinguished the work from routine analysis.`
    );
  }

  const distinctionMatrix = {
    synonyms: [term, `${term}-adjacent`, 'counterpart'],
    nuanceComparison: `${capitalizedTerm} conveys high-register precision, distinguishing it from conventional near-synonyms by structural emphasis.`,
    contextRecommendations: [
      {
        word: term,
        recommendedRegister: 'Scholarly / Critical Prose',
        exampleSentence: `An incisive application of ${term} in peer-reviewed discourse.`,
      },
      {
        word: `${term}-equivalent`,
        recommendedRegister: 'General Literary',
        exampleSentence: `A broader colloquial phrasing in narrative prose.`,
      },
    ],
  };

  const payload: LexicalEnrichmentPayload = {
    term: rawTerm.trim(),
    part_of_speech: partOfSpeech,
    phonetic: `/${term}/`,
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
  };

  return LexicalEnrichmentSchema.parse(payload);
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ============================================================================
// Google Gemini API Ingestion
// ============================================================================
async function fetchGeminiEnrichment(
  term: string,
  contextSentence?: string,
  source?: string
): Promise<LexicalEnrichmentPayload | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your-gemini-api-key') return null;

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

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
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
      console.warn(`[Gemini API] Request returned status ${response.status}`);
      return null;
    }

    const json = await response.json();
    const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;

    const parsedJson = JSON.parse(rawText);
    return LexicalEnrichmentSchema.parse(parsedJson);
  } catch (err) {
    console.warn('[Gemini API] Request failed or timed out:', err);
    return null;
  }
}

// ============================================================================
// OpenAI API Ingestion
// ============================================================================
async function fetchOpenAIEnrichment(
  term: string,
  contextSentence?: string,
  source?: string
): Promise<LexicalEnrichmentPayload | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'your-openai-api-key') return null;

  const prompt = `You are an expert lexicographer. Return structured JSON for the vocabulary term "${term}".
${contextSentence ? `Context sentence: "${contextSentence}"` : ''}
${source ? `Source: "${source}"` : ''}

Include term, part_of_speech, phonetic, primary_definition, nuance_note, etymology (roots array, cognates array), collocations (array of 4 phrases), cloze_sentences (array of 2 sentences with {{c1::${term}}} masked), and distinction_matrix with 3 synonyms.`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

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

    const parsed = JSON.parse(rawContent);
    return LexicalEnrichmentSchema.parse(parsed);
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

  // 3. Fall back to built-in intelligent lexical synthesizer
  return synthesizeLexicalFallback(trimmed, contextSentence, source);
}
