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
  origin: 'Latin' | 'Greek' | 'Arabic' | 'Catalan' | 'Spanish' | string;
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

// Spanish Morphological Knowledge Base (Arabic, Latin, Greek)
export const SPANISH_PREFIXES: MorphemeEntry[] = [
  { morpheme: 'al-', meaning: 'el / la (artículo determinado árabe)', origin: 'Arabic' },
  { morpheme: 'des-', meaning: 'privación / negación / inversión', origin: 'Latin' },
  { morpheme: 'in-', meaning: 'negación / privación', origin: 'Latin' },
  { morpheme: 'im-', meaning: 'negación / privación', origin: 'Latin' },
  { morpheme: 're-', meaning: 'repetición / intensificación', origin: 'Latin' },
  { morpheme: 'sobre-', meaning: 'por encima de / exceso (super)', origin: 'Latin' },
  { morpheme: 'ante-', meaning: 'delante / anterioridad', origin: 'Latin' },
  { morpheme: 'contra-', meaning: 'oposición / pugna', origin: 'Latin' },
  { morpheme: 'inter-', meaning: 'entre / recíproco', origin: 'Latin' },
  { morpheme: 'sub-', meaning: 'debajo de / inferioridad', origin: 'Latin' },
  { morpheme: 'trans-', meaning: 'al otro lado / a través', origin: 'Latin' },
  { morpheme: 'tras-', meaning: 'detrás / a través', origin: 'Latin' },
  { morpheme: 'pre-', meaning: 'anterioridad / antes de', origin: 'Latin' },
  { morpheme: 'pos-', meaning: 'posterioridad / después de', origin: 'Latin' },
  { morpheme: 'auto-', meaning: 'uno mismo / propio', origin: 'Greek' },
  { morpheme: 'a-', meaning: 'aproximación / dirección (ad)', origin: 'Latin' },
];

export const SPANISH_SUFFIXES: MorphemeEntry[] = [
  { morpheme: '-ción', meaning: 'acción y efecto', origin: 'Latin' },
  { morpheme: '-cion', meaning: 'acción y efecto', origin: 'Latin' },
  { morpheme: '-sión', meaning: 'acción y efecto', origin: 'Latin' },
  { morpheme: '-sion', meaning: 'acción y efecto', origin: 'Latin' },
  { morpheme: '-ecer', meaning: 'incoativo / proceso de llegar a ser', origin: 'Latin' },
  { morpheme: '-miento', meaning: 'acción o resultado del verbo', origin: 'Latin' },
  { morpheme: '-anza', meaning: 'cualidad o acción continuada', origin: 'Latin' },
  { morpheme: '-eza', meaning: 'cualidad abstracta', origin: 'Latin' },
  { morpheme: '-idad', meaning: 'cualidad o condición de ser', origin: 'Latin' },
  { morpheme: '-ado', meaning: 'participio pasivo / que ha recibido la acción', origin: 'Latin' },
  { morpheme: '-ada', meaning: 'participio pasivo / cualidad alcanzada', origin: 'Latin' },
  { morpheme: '-ido', meaning: 'participio / efecto de acción', origin: 'Latin' },
  { morpheme: '-ida', meaning: 'participio / efecto de acción', origin: 'Latin' },
  { morpheme: '-oso', meaning: 'abundancia o inclinación', origin: 'Latin' },
  { morpheme: '-osa', meaning: 'abundancia o inclinación', origin: 'Latin' },
  { morpheme: '-mente', meaning: 'de modo o manera', origin: 'Latin' },
  { morpheme: '-ivo', meaning: 'inclinación o capacidad activa', origin: 'Latin' },
  { morpheme: '-iva', meaning: 'inclinación o capacidad activa', origin: 'Latin' },
  { morpheme: '-al', meaning: 'relativo o perteneciente a', origin: 'Latin' },
  { morpheme: '-ar', meaning: 'infinitivo verbal / relativo a', origin: 'Latin' },
  { morpheme: '-er', meaning: 'infinitivo verbal', origin: 'Latin' },
  { morpheme: '-ir', meaning: 'infinitivo verbal', origin: 'Latin' },
];

// ============================================================================
// Language Detection (English vs Spanish)
// ============================================================================
export function detectLanguage(term: string, contextSentence?: string): 'en' | 'es' {
  const cleanTerm = term.trim().toLowerCase();

  // 1. Check curated lexicon first
  if (CURATED_LEXICON[cleanTerm]) {
    return (CURATED_LEXICON[cleanTerm].language as 'en' | 'es') || 'en';
  }

  // 2. Diacritics check on term: Spanish specific marks (ñ, á, é, í, ó, ú, ü, ¿, ¡)
  const spanishDiacritics = /[ñáéíóúü¿¡]/i;
  if (spanishDiacritics.test(cleanTerm)) {
    return 'es';
  }

  // 3. Spanish inverted punctuation or diacritics in context sentence
  if (contextSentence) {
    if (/[¿¡]/.test(contextSentence)) {
      return 'es';
    }
    const diacriticMatches = contextSentence.match(/[ñáéíóúü]/gi);
    if (diacriticMatches && diacriticMatches.length >= 1) {
      return 'es';
    }
  }

  // 4. Token-based stop word / lemma detection in context sentence
  if (contextSentence) {
    const spanishStopWords = new Set([
      'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del',
      'al', 'en', 'y', 'o', 'que', 'para', 'por', 'con', 'como', 'se',
      'su', 'sus', 'pero', 'mas', 'más', 'no', 'si', 'sí', 'este', 'esta',
      'estos', 'estas', 'ese', 'esa', 'esos', 'esas', 'aquel', 'aquella',
      'ser', 'estar', 'haber', 'tener', 'hacer', 'fue', 'era', 'habia',
      'había', 'sido', 'muy', 'sobre', 'entre', 'tras', 'sin', 'cuando',
      'donde', 'dónde', 'quien', 'quién', 'cual', 'cuál', 'lo', 'le', 'les',
      'me', 'te', 'nos'
    ]);
    const englishStopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'of', 'in', 'to', 'for', 'with',
      'on', 'at', 'by', 'from', 'is', 'was', 'are', 'were', 'be', 'been',
      'being', 'have', 'has', 'had', 'that', 'this', 'these', 'those', 'it',
      'its', 'as', 'he', 'she', 'they', 'we', 'i', 'you'
    ]);

    const words = contextSentence
      .toLowerCase()
      .replace(/[^a-záéíóúüñ]/gi, ' ')
      .split(/\s+/)
      .filter(Boolean);

    let esCount = 0;
    let enCount = 0;
    for (const w of words) {
      if (spanishStopWords.has(w)) esCount++;
      if (englishStopWords.has(w)) enCount++;
    }

    if (esCount >= 2 && esCount > enCount) {
      return 'es';
    }
  }

  // 5. Morphological clues in term for Spanish
  // Arabic al- prefix followed by at least 3 letters (e.g. alcázar, alféizar, aljibe, almohada, alquimia)
  if (/^al[b-df-hj-np-tv-z][a-záéíóúüñ]{3,}/i.test(cleanTerm)) {
    return 'es';
  }

  // Common Spanish-specific verb/noun endings
  if (
    cleanTerm.endsWith('ecer') ||
    cleanTerm.endsWith('cion') ||
    cleanTerm.endsWith('ción') ||
    cleanTerm.endsWith('miento') ||
    cleanTerm.endsWith('ieron') ||
    cleanTerm.endsWith('aron') ||
    cleanTerm.endsWith('aban') ||
    cleanTerm.endsWith('ando') ||
    cleanTerm.endsWith('iendo')
  ) {
    return 'es';
  }

  return 'en';
}

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

export async function fetchDictionaryFallback(
  term: string,
  timeoutMs: number = 3500
): Promise<DictionaryApiResponse | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
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
// ============================================================================
// Built-in Intelligent Fallback Lexical Synthesizer
// ============================================================================
export function synthesizeLexicalFallback(
  rawTerm: string,
  contextSentence?: string,
  source?: string,
  dictData?: DictionaryApiResponse | null,
  languageOverride?: 'en' | 'es'
): LexicalEnrichmentPayload {
  const term = rawTerm.trim().toLowerCase();
  const lang = languageOverride || detectLanguage(rawTerm, contextSentence);

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
      const regex = new RegExp(`\\b${escapeRegExp(term)}[a-záéíóúüñ]*\\b`, 'i');
      if (regex.test(contextSentence)) {
        const masked = contextSentence.replace(regex, (match) => `{{c1::${match}}}`);
        clozeSentences.unshift(masked);
      }
    }

    return LexicalEnrichmentSchema.parse({
      term: rawTerm.trim(),
      ...curated,
      language: curated.language || lang,
      gender: curated.gender || null,
      english_gloss: curated.english_gloss || null,
      source_context: sourceContext,
      cloze_sentences: clozeSentences,
      // Curated entries are only reached after live enrichment fails, so they are fallbacks.
      is_fallback: true,
      enrichment_source: 'curated',
      fallback_reason: 'Curated lexicon entry used because live AI enrichment was unavailable.',
    });
  }

  // 2. Spanish morphological synthesis
  if (lang === 'es') {
    const identifiedRoots: { morpheme: string; meaning: string; origin: string }[] = [];
    const identifiedCognates: string[] = [];

    // Match Spanish prefixes (Arabic al-, Latin des-, sobre-, etc.)
    for (const p of SPANISH_PREFIXES) {
      const rawPrefix = p.morpheme.replace('-', '');
      if (term.startsWith(rawPrefix) && term.length > rawPrefix.length + 2) {
        identifiedRoots.push(p);
        break;
      }
    }

    // Match root stems if present
    for (const r of COMMON_ROOTS) {
      if (term.includes(r.morpheme) && term.length >= r.morpheme.length) {
        identifiedRoots.push(r);
        identifiedCognates.push(`${r.morpheme}ico`, `${r.morpheme}ación`);
        break;
      }
    }

    // Infer Spanish Part of Speech from suffixes
    let partOfSpeech = 'noun';
    if (term.endsWith('mente')) {
      partOfSpeech = 'adverb';
    } else if (
      term.endsWith('ar') ||
      term.endsWith('er') ||
      term.endsWith('ir') ||
      term.endsWith('ecer') ||
      term.endsWith('izar')
    ) {
      partOfSpeech = 'verb';
    } else if (
      term.endsWith('oso') ||
      term.endsWith('osa') ||
      term.endsWith('ado') ||
      term.endsWith('ada') ||
      term.endsWith('ido') ||
      term.endsWith('ida') ||
      term.endsWith('ivo') ||
      term.endsWith('iva') ||
      term.endsWith('able') ||
      term.endsWith('ible') ||
      term.endsWith('al')
    ) {
      partOfSpeech = 'adjective';
    } else if (
      term.endsWith('ción') ||
      term.endsWith('cion') ||
      term.endsWith('sión') ||
      term.endsWith('sion') ||
      term.endsWith('miento') ||
      term.endsWith('anza') ||
      term.endsWith('eza') ||
      term.endsWith('idad') ||
      term.endsWith('ismo') ||
      term.endsWith('ista')
    ) {
      partOfSpeech = 'noun';
    }

    for (const s of SPANISH_SUFFIXES) {
      const rawSuffix = s.morpheme.replace('-', '');
      if (term.endsWith(rawSuffix) && term.length > rawSuffix.length + 2) {
        identifiedRoots.push(s);
        break;
      }
    }

    if (identifiedRoots.length === 0) {
      identifiedRoots.push({
        morpheme: term.slice(0, Math.min(5, term.length)),
        meaning: 'raíz léxica',
        origin: 'Latin / Greek / Arabic',
      });
    }

    // Infer grammatical gender for nouns
    let gender: 'masculine' | 'feminine' | null = null;
    if (partOfSpeech === 'noun') {
      if (
        term.endsWith('a') ||
        term.endsWith('ción') ||
        term.endsWith('cion') ||
        term.endsWith('sión') ||
        term.endsWith('sion') ||
        term.endsWith('dad') ||
        term.endsWith('tad') ||
        term.endsWith('tud') ||
        term.endsWith('anza') ||
        term.endsWith('eza')
      ) {
        gender = 'feminine';
      } else if (
        term.endsWith('o') ||
        term.endsWith('or') ||
        term.endsWith('ón') ||
        term.endsWith('on') ||
        term.endsWith('aje') ||
        term.endsWith('miento')
      ) {
        gender = 'masculine';
      }
    }

    const capitalizedTerm = rawTerm.charAt(0).toUpperCase() + rawTerm.slice(1);
    const rootSummary = identifiedRoots.map((r) => `${r.morpheme} (${r.meaning}, ${r.origin})`).join(', ');

    const primaryDefinition = `Término literario o culto de la lengua española (${partOfSpeech}) derivado de ${rootSummary}.`;
    const nuanceNote = `Generado por el sintetizador léxico morfológico para español culto. Raíces: ${rootSummary}.`;
    const englishGloss = `${capitalizedTerm} (Spanish literary ${partOfSpeech})`;

    const clozeSentences: string[] = [];
    if (contextSentence && contextSentence.trim()) {
      const regex = new RegExp(`\\b${escapeRegExp(term)}[a-záéíóúüñ]*\\b`, 'i');
      if (regex.test(contextSentence)) {
        clozeSentences.push(contextSentence.replace(regex, (match) => `{{c1::${match}}}`));
      } else {
        clozeSentences.push(`El texto clásico desplegó el término {{c1::${term}}} con singular precisión.`);
      }
    } else {
      clozeSentences.push(
        `La prosa del autor evocaba {{c1::${term}}} en el pasaje culminante.`,
        `El ensayo crítico examinó el alcance de {{c1::${term}}} en la literatura castellana.`
      );
    }

    const distinctionMatrix = {
      synonyms: [term, `${term} (equivalente)`],
      nuanceComparison: `${capitalizedTerm} denota elevación estilística y precisión en la prosa culta española.`,
      contextRecommendations: [
        {
          word: term,
          recommendedRegister: 'Prosa literaria culta',
          exampleSentence: `Un uso magistral de ${term} en la literatura contemporánea.`,
        },
      ],
    };

    const payload: LexicalEnrichmentPayload = {
      term: rawTerm.trim(),
      language: 'es',
      gender,
      english_gloss: englishGloss,
      part_of_speech: partOfSpeech,
      phonetic: `/${term}/`,
      primary_definition: primaryDefinition,
      nuance_note: nuanceNote,
      etymology: {
        roots: identifiedRoots,
        cognates: identifiedCognates.length > 0 ? identifiedCognates : [`${term}idad`],
      },
      collocations: [`${term} literario`, `uso de ${term}`, `${term} en prosa`],
      source_context: {
        sentence: contextSentence?.trim() || null,
        source: source?.trim() || null,
      },
      cloze_sentences: clozeSentences,
      distinction_matrix: distinctionMatrix,
      is_fallback: true,
      enrichment_source: 'offline-heuristic',
      fallback_reason: 'AI service offline / fallback mode (Spanish morphological analysis)',
    };

    return LexicalEnrichmentSchema.parse(payload);
  }

  // 3. Algorithmic morphological analysis for English
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
    language: 'en',
    gender: null,
    english_gloss: null,
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

export const fallbackEnrichWord = synthesizeLexicalFallback;

// ============================================================================
// Google Gemini API Ingestion & Defensive Normalizer
// ============================================================================

export const GEMINI_RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    term: { type: 'STRING' },
    language: { type: 'STRING' },
    gender: { type: 'STRING' },
    english_gloss: { type: 'STRING' },
    part_of_speech: { type: 'STRING' },
    phonetic: { type: 'STRING' },
    primary_definition: { type: 'STRING' },
    nuance_note: { type: 'STRING' },
    etymology: {
      type: 'OBJECT',
      properties: {
        roots: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              morpheme: { type: 'STRING' },
              meaning: { type: 'STRING' },
              origin: { type: 'STRING' },
            },
            required: ['morpheme', 'meaning', 'origin'],
          },
        },
        cognates: { type: 'ARRAY', items: { type: 'STRING' } },
      },
      required: ['roots', 'cognates'],
    },
    collocations: { type: 'ARRAY', items: { type: 'STRING' } },
    cloze_sentences: { type: 'ARRAY', items: { type: 'STRING' } },
    distinction_matrix: {
      type: 'OBJECT',
      properties: {
        synonyms: { type: 'ARRAY', items: { type: 'STRING' } },
        nuanceComparison: { type: 'STRING' },
        contextRecommendations: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              word: { type: 'STRING' },
              recommendedRegister: { type: 'STRING' },
              exampleSentence: { type: 'STRING' },
            },
            required: ['word', 'recommendedRegister', 'exampleSentence'],
          },
        },
      },
      required: ['synonyms', 'nuanceComparison', 'contextRecommendations'],
    },
  },
  required: [
    'term',
    'part_of_speech',
    'primary_definition',
    'nuance_note',
    'etymology',
    'collocations',
    'cloze_sentences',
    'distinction_matrix',
  ],
};

export function normalizeLexicalPayload(
  raw: any,
  targetTerm: string,
  detectedLang?: 'en' | 'es'
): LexicalEnrichmentPayload {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Raw enrichment data is not an object');
  }

  const term = (raw.term && typeof raw.term === 'string' && raw.term.trim()) || targetTerm.trim();
  const language: 'en' | 'es' =
    raw.language === 'es' || raw.language === 'en'
      ? raw.language
      : detectedLang || detectLanguage(term, raw.source_context?.sentence);

  let gender: 'masculine' | 'feminine' | 'neuter' | null = null;
  if (raw.gender === 'masculine' || raw.gender === 'feminine' || raw.gender === 'neuter') {
    gender = raw.gender;
  }

  const english_gloss =
    raw.english_gloss ||
    raw.englishGloss ||
    raw.gloss ||
    null;

  const part_of_speech =
    raw.part_of_speech ||
    raw.partOfSpeech ||
    raw.pos ||
    'noun';

  const primary_definition =
    raw.primary_definition ||
    raw.primaryDefinition ||
    raw.definition ||
    raw.meaning ||
    `A specialized term: ${term}`;

  const phonetic = raw.phonetic || raw.ipa || null;
  const nuance_note =
    raw.nuance_note ||
    raw.nuanceNote ||
    raw.nuance ||
    raw.connotation ||
    null;

  // Etymology roots & cognates
  const rawEtymology = raw.etymology || {};
  const rawRoots = Array.isArray(rawEtymology.roots) ? rawEtymology.roots : [];
  const roots: { morpheme: string; meaning: string; origin: string }[] = rawRoots.map((r: any) => {
    if (typeof r === 'string') {
      return { morpheme: r, meaning: 'root morpheme', origin: 'Latin/Greek' };
    }
    return {
      morpheme: String(r.morpheme || r.root || r.prefix || r.suffix || term),
      meaning: String(r.meaning || r.definition || r.translation || 'semantic root'),
      origin: String(r.origin || r.language || r.etymon || 'Latin / Greek'),
    };
  });

  const rawCognates = Array.isArray(rawEtymology.cognates) ? rawEtymology.cognates : [];
  const cognates = rawCognates.map((c: any) => String(c)).filter(Boolean);

  // Collocations
  const rawCollocations = Array.isArray(raw.collocations) ? raw.collocations : [];
  const collocations = rawCollocations.map((c: any) => String(c)).filter(Boolean);

  // Cloze sentences
  const rawCloze = Array.isArray(raw.cloze_sentences)
    ? raw.cloze_sentences
    : Array.isArray(raw.clozeSentences)
    ? raw.clozeSentences
    : Array.isArray(raw.cloze)
    ? raw.cloze
    : [];
  let cloze_sentences = rawCloze.map((s: any) => String(s)).filter(Boolean);
  if (cloze_sentences.length === 0) {
    cloze_sentences = [`The critical significance of the {{c1::${term}}} was evident.`];
  } else {
    // Ensure at least one cloze has the {{c1::...}} mask
    cloze_sentences = cloze_sentences.map((s: string) => {
      if (!s.includes('{{c1::')) {
        const regex = new RegExp(`\\b${escapeRegExp(term)}[a-záéíóúüñ]*\\b`, 'i');
        if (regex.test(s)) {
          return s.replace(regex, (m) => `{{c1::${m}}}`);
        }
      }
      return s;
    });
  }

  // Distinction matrix
  const rawMatrix = raw.distinction_matrix || raw.distinctionMatrix;
  let distinction_matrix = null;
  if (rawMatrix && typeof rawMatrix === 'object') {
    const rawSynonyms = Array.isArray(rawMatrix.synonyms) ? rawMatrix.synonyms : [];
    const synonyms = rawSynonyms.map((s: any) => String(s)).filter(Boolean);
    if (!synonyms.includes(term)) synonyms.unshift(term);

    const nuanceComparison =
      rawMatrix.nuanceComparison ||
      rawMatrix.nuance_comparison ||
      rawMatrix.comparison ||
      rawMatrix.nuance ||
      `${term} conveys elevated precision in literary or scholarly prose.`;

    const rawRecs = Array.isArray(rawMatrix.contextRecommendations)
      ? rawMatrix.contextRecommendations
      : Array.isArray(rawMatrix.context_recommendations)
      ? rawMatrix.context_recommendations
      : [];

    const contextRecommendations = rawRecs.map((rec: any) => ({
      word: String(rec.word || term),
      recommendedRegister: String(
        rec.recommendedRegister ||
        rec.recommended_register ||
        rec.register ||
        'Elevated / Formal'
      ),
      exampleSentence: String(
        rec.exampleSentence ||
        rec.example_sentence ||
        rec.example ||
        `An incisive use of ${rec.word || term}.`
      ),
    }));

    distinction_matrix = {
      synonyms: synonyms.length > 0 ? synonyms : [term, 'counterpart'],
      nuanceComparison,
      contextRecommendations:
        contextRecommendations.length > 0
          ? contextRecommendations
          : [
              {
                word: term,
                recommendedRegister: 'Elevated / Academic Prose',
                exampleSentence: `A precise application of ${term} in scholarly discourse.`,
              },
            ],
    };
  }

  const payload: LexicalEnrichmentPayload = {
    term,
    language,
    gender,
    english_gloss: english_gloss ? String(english_gloss) : null,
    part_of_speech: String(part_of_speech),
    phonetic: phonetic ? String(phonetic) : null,
    primary_definition: String(primary_definition),
    nuance_note: nuance_note ? String(nuance_note) : null,
    etymology: { roots, cognates },
    collocations,
    source_context: {
      sentence: raw.source_context?.sentence || null,
      source: raw.source_context?.source || null,
    },
    cloze_sentences,
    distinction_matrix,
    is_fallback: Boolean(raw.is_fallback),
    enrichment_source: raw.enrichment_source || 'gemini',
    fallback_reason: raw.fallback_reason || null,
  };

  return LexicalEnrichmentSchema.parse(payload);
}

export interface GeminiEnrichmentResponse {
  payload: LexicalEnrichmentPayload | null;
  error?: string;
  modelUsed?: string;
  rawText?: string;
  /** Last model attempted, including when every attempt failed. */
  model?: string;
  /** HTTP status, or a label such as TIMEOUT, EMPTY, PARSE, NO_KEY. */
  status?: string | number;
}

/**
 * gemini-3.8-flash thinks at "medium" by default. Thought tokens count against
 * the output budget and delay the first JSON token, so a short abort returns
 * nothing while a one-word ping still succeeds. "minimal" is rejected on 3.8.
 * 2.5 Flash uses thinkingBudget; 0 turns thinking off for that model only.
 */
export const GEMINI_DEFAULT_MODEL = 'gemini-3.8-flash';
export const GEMINI_FALLBACK_MODEL = 'gemini-2.5-flash';
export const GEMINI_MAX_OUTPUT_TOKENS = 8192;
export const GEMINI_PRIMARY_TIMEOUT_MS = 15_000;
export const GEMINI_FALLBACK_TIMEOUT_MS = 5_000;
/** All Gemini attempts together stay under the route maxDuration of 30s. */
export const GEMINI_ENRICHMENT_BUDGET_MS = 20_000;

export function geminiModelsToTry(configuredModel?: string | null): string[] {
  const primary = (configuredModel?.trim() || GEMINI_DEFAULT_MODEL).replace(/^models\//, '');
  const fallback =
    primary === GEMINI_FALLBACK_MODEL ? GEMINI_DEFAULT_MODEL : GEMINI_FALLBACK_MODEL;
  return primary === fallback ? [primary] : [primary, fallback];
}

export function geminiAttemptTimeoutMs(attemptIndex: number, elapsedMs: number): number {
  const desired = attemptIndex === 0 ? GEMINI_PRIMARY_TIMEOUT_MS : GEMINI_FALLBACK_TIMEOUT_MS;
  const remaining = GEMINI_ENRICHMENT_BUDGET_MS - elapsedMs;
  return Math.max(0, Math.min(desired, remaining));
}

export function geminiGenerationConfig(model: string): {
  responseMimeType: 'application/json';
  temperature: number;
  maxOutputTokens: number;
  responseSchema: typeof GEMINI_RESPONSE_SCHEMA;
  thinkingConfig?: { thinkingLevel: 'low' } | { thinkingBudget: 0 };
} {
  const config = {
    responseMimeType: 'application/json' as const,
    temperature: 0.2,
    maxOutputTokens: GEMINI_MAX_OUTPUT_TOKENS,
    responseSchema: GEMINI_RESPONSE_SCHEMA,
  };
  if (model.startsWith('gemini-3')) {
    return { ...config, thinkingConfig: { thinkingLevel: 'low' } };
  }
  if (model.startsWith('gemini-2.5')) {
    return { ...config, thinkingConfig: { thinkingBudget: 0 } };
  }
  return config;
}

/** Keep the configured model visible even when Google returns a long catalog. */
export function visibleGeminiModels(available: string[], configuredModel?: string | null): string[] {
  const seen = new Set<string>();
  const ordered: string[] = [];
  const push = (name?: string | null) => {
    const trimmed = name?.replace(/^models\//, '').trim();
    if (!trimmed || seen.has(trimmed)) return;
    seen.add(trimmed);
    ordered.push(trimmed);
  };
  push(configuredModel);
  for (const name of available) push(name);
  return ordered;
}

export function redactForLog(text: string): string {
  return text
    .replace(/key=[^&\s"']+/gi, 'key=[REDACTED]')
    .replace(/AIza[0-9A-Za-z\-_]{10,}/g, '[REDACTED_KEY]')
    .replace(/Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi, 'Bearer [REDACTED]');
}

export function logGeminiFailure(model: string, status: string | number, errorText: string): void {
  const safe = redactForLog(errorText).replace(/\s+/g, ' ').slice(0, 500);
  console.error(`[Gemini enrichment] model=${model} status=${status} error=${safe}`);
}

export function logEnrichmentFallback(
  source: string,
  model: string,
  status: string | number,
  errorText: string
): void {
  const safe = redactForLog(errorText).replace(/\s+/g, ' ').slice(0, 500);
  console.error(
    `[enrichWord fallback] source=${source} model=${model} status=${status} error=${safe}`
  );
}

function isAbortError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const name = 'name' in err ? String((err as { name?: string }).name) : '';
  const message = 'message' in err ? String((err as { message?: string }).message) : String(err);
  return name === 'AbortError' || name === 'TimeoutError' || /aborted|timeout/i.test(message);
}

function readGeminiCandidate(json: any): {
  text: string | null;
  finishReason: string | null;
  thoughtsTokenCount: number | null;
  blockReason: string | null;
} {
  const candidate = json?.candidates?.[0];
  const parts = Array.isArray(candidate?.content?.parts) ? candidate.content.parts : [];
  const text = parts
    .filter((part: any) => part && typeof part.text === 'string' && part.thought !== true)
    .map((part: any) => part.text)
    .join('')
    .trim();
  const thoughtsTokenCount =
    json?.usageMetadata?.thoughtsTokenCount ??
    json?.usageMetadata?.thoughts_token_count ??
    null;
  return {
    text: text || null,
    finishReason: candidate?.finishReason || candidate?.finish_reason || null,
    thoughtsTokenCount,
    blockReason: json?.promptFeedback?.blockReason || json?.promptFeedback?.block_reason || null,
  };
}

export async function fetchGeminiEnrichment(
  term: string,
  contextSentence?: string,
  source?: string,
  languageOverride?: 'en' | 'es'
): Promise<GeminiEnrichmentResponse> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    const error = 'No valid GEMINI_API_KEY found in server environment.';
    logGeminiFailure('none', 'NO_KEY', error);
    return {
      payload: null,
      error,
      status: 'NO_KEY',
      model: 'none',
    };
  }

  const lang = languageOverride || detectLanguage(term, contextSentence);

  const prompt =
    lang === 'es'
      ? `You are a world-class lexicographer and philologist specialized in the Royal Spanish Academy (Real Academia Española - RAE) and high-register Hispanic literature.
Analyze the target Spanish vocabulary term: "${term}".
${contextSentence ? `Context sentence provided by user: "${contextSentence}"` : ''}
${source ? `Source: "${source}"` : ''}

Crucial Spanish linguistic guidelines:
1. Infinitive Lemma: If "${term}" is a conjugated verb (e.g. "sobrecogió"), extract the infinitive lemma as the term ("sobrecoger"), while preserving the user's sentence in source_context.
2. Grammatical Gender: If the word is a noun, identify grammatical gender as "masculine" or "feminine" (null for verbs/adjectives/adverbs unless used substantively).
3. Primary Definition & Gloss: Output a monolingual RAE-style Spanish definition for primary_definition, and provide a concise 1-sentence English translation anchor in english_gloss.
4. Etymology: Identify Arabic (e.g. Andalusi Arabic), Latin, or Greek root morphemes and historical origins.
5. Nuance & Falsos Amigos: In nuance_note, capture register, literary connotations, and highlight False Friends (falsos amigos) with English when relevant.
6. Collocations & Cloze: Provide high-register Spanish collocations, 2 cloze sentences in literary Spanish (with {{c1::...}} masked), and a distinction matrix comparing 3 near-synonyms in literary Spanish.
7. Language: Set language to "es".`
      : `You are a world-class lexicographer and etymologist. Analyze the target vocabulary word "${term}".
${contextSentence ? `Context sentence provided by user: "${contextSentence}"` : ''}
${source ? `Source: "${source}"` : ''}

Provide a deep etymological breakdown (morphemes, Greek/Latin origins), connotative register nuances, high-register collocations, 2 cloze sentences (with {{c1::${term}}} masked), and a distinction matrix with 3 near-synonyms.`;

  const modelsToTry = geminiModelsToTry(process.env.GEMINI_MODEL);
  const startedAt = Date.now();

  let lastError = 'No models available';
  let lastStatus: string | number = 'NONE';
  let lastModel = 'none';

  for (let attempt = 0; attempt < modelsToTry.length; attempt++) {
    const model = modelsToTry[attempt];
    const elapsed = Date.now() - startedAt;
    const timeoutMs = geminiAttemptTimeoutMs(attempt, elapsed);
    lastModel = model;

    if (timeoutMs < 500) {
      lastStatus = 'SKIPPED';
      lastError = `Model ${model} skipped because the ${GEMINI_ENRICHMENT_BUDGET_MS}ms Gemini budget was already used.`;
      logGeminiFailure(model, lastStatus, lastError);
      break;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: geminiGenerationConfig(model),
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text().catch(() => '');
        lastStatus = response.status;
        lastError = `Model ${model} returned HTTP ${response.status}: ${errorBody.substring(0, 300)}`;
        logGeminiFailure(model, lastStatus, lastError);
        continue;
      }

      const json = await response.json();
      const candidate = readGeminiCandidate(json);
      if (!candidate.text) {
        lastStatus = 'EMPTY';
        lastError =
          `Model ${model} returned empty candidate parts ` +
          `(finishReason=${candidate.finishReason || 'unknown'}, ` +
          `thoughtsTokenCount=${candidate.thoughtsTokenCount ?? 'n/a'}, ` +
          `blockReason=${candidate.blockReason || 'none'}).`;
        logGeminiFailure(model, lastStatus, lastError);
        continue;
      }

      const parsedJson = extractJsonFromText(candidate.text);
      if (!parsedJson) {
        lastStatus = 'PARSE';
        lastError = `Model ${model} response could not be parsed as JSON: ${candidate.text.substring(0, 200)}`;
        logGeminiFailure(model, lastStatus, lastError);
        continue;
      }

      const normalized = normalizeLexicalPayload(
        {
          ...parsedJson,
          language: parsedJson.language || lang,
          source_context: {
            sentence: contextSentence?.trim() || parsedJson.source_context?.sentence || null,
            source: source?.trim() || parsedJson.source_context?.source || null,
          },
          is_fallback: false,
          enrichment_source: 'gemini',
        },
        parsedJson.term || term,
        lang
      );

      return {
        payload: normalized,
        modelUsed: model,
        model,
        status: response.status,
        rawText: candidate.text.substring(0, 300),
      };
    } catch (err: any) {
      const aborted = isAbortError(err) || controller.signal.aborted;
      lastStatus = aborted ? 'TIMEOUT' : 'EXCEPTION';
      lastError = aborted
        ? `Model ${model} timed out after ${timeoutMs}ms`
        : `Model ${model} exception: ${err?.message || String(err)}`;
      logGeminiFailure(model, lastStatus, lastError);
    } finally {
      clearTimeout(timer);
    }
  }

  return { payload: null, error: lastError, status: lastStatus, model: lastModel };
}

export async function probeGeminiEnrichment(
  apiKey?: string | null,
  testTerm: string = 'perspicacious'
) {
  const key = apiKey || getGeminiApiKey();
  if (!key) {
    return {
      tested: false,
      success: false,
      message: 'No Gemini API key available to test enrichment.',
    };
  }

  const startTime = Date.now();
  const res = await fetchGeminiEnrichment(testTerm);
  const latencyMs = Date.now() - startTime;

  if (res.payload) {
    return {
      tested: true,
      success: true,
      latencyMs,
      modelUsed: res.modelUsed,
      source: 'gemini',
      sampleTerm: res.payload.term,
      sampleDefinition: res.payload.primary_definition,
      rootsSample: res.payload.etymology?.roots?.map((r) => `${r.morpheme} (${r.meaning})`) || [],
      error: null,
    };
  }

  return {
    tested: true,
    success: false,
    latencyMs,
    error: res.error || 'Gemini enrichment failed without explicit error.',
  };
}

// ============================================================================
// OpenAI API Ingestion
// ============================================================================
async function fetchOpenAIEnrichment(
  term: string,
  contextSentence?: string,
  source?: string,
  timeoutMs: number = 6000
): Promise<LexicalEnrichmentPayload | null> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey || apiKey === 'your-openai-api-key') return null;

  const prompt = `You are an expert lexicographer. Return structured JSON for the vocabulary term "${term}".
${contextSentence ? `Context sentence: "${contextSentence}"` : ''}
${source ? `Source: "${source}"` : ''}

Include term, part_of_speech, phonetic, primary_definition, nuance_note, etymology (roots array, cognates array), collocations (array of 4 phrases), cloze_sentences (array of 2 sentences with {{c1::${term}}} masked), and distinction_matrix with 3 synonyms.`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

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

    return normalizeLexicalPayload(
      {
        ...parsed,
        source_context: {
          sentence: contextSentence?.trim() || parsed.source_context?.sentence || null,
          source: source?.trim() || parsed.source_context?.source || null,
        },
        is_fallback: false,
        enrichment_source: 'openai',
      },
      term
    );
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
  source?: string,
  languageOverride?: 'en' | 'es'
): Promise<LexicalEnrichmentPayload> {
  const trimmed = term.trim();
  if (!trimmed) {
    throw new Error('Term cannot be empty');
  }

  const lang = languageOverride || detectLanguage(trimmed, contextSentence);
  const startedAt = Date.now();

  // 1. Try Gemini. Attempts share a 20s budget so a labeled fallback can still return inside maxDuration.
  const geminiRes = await fetchGeminiEnrichment(trimmed, contextSentence, source, lang);
  if (geminiRes.payload) {
    return geminiRes.payload;
  }

  const geminiModel = geminiRes.model || 'none';
  const geminiStatus = geminiRes.status ?? 'FAILED';
  const geminiError = geminiRes.error || 'Gemini enrichment failed without an error message.';
  const failureReason = `Gemini: ${geminiError}`;

  // 2. Try OpenAI (only for English) when Gemini failed quickly enough to leave time.
  const elapsedAfterGemini = Date.now() - startedAt;
  if (lang === 'en' && elapsedAfterGemini < 18_000) {
    const openAiBudget = Math.min(6000, Math.max(1500, 27_000 - elapsedAfterGemini));
    const openAiResult = await fetchOpenAIEnrichment(trimmed, contextSentence, source, openAiBudget);
    if (openAiResult) {
      logEnrichmentFallback('openai', geminiModel, geminiStatus, geminiError);
      return openAiResult;
    }
  }

  // 3. Try Public Dictionary API for real definition (English only)
  let dictData: DictionaryApiResponse | null = null;
  if (lang === 'en') {
    const dictBudget = Math.min(3500, Math.max(0, 28_000 - (Date.now() - startedAt)));
    if (dictBudget > 500) {
      dictData = await fetchDictionaryFallback(trimmed, dictBudget);
    }
  }

  // 4. Fall back to curated lexicon or the morphological synthesizer.
  const fallback = synthesizeLexicalFallback(trimmed, contextSentence, source, dictData, lang);
  fallback.fallback_reason = failureReason;
  logEnrichmentFallback(
    fallback.enrichment_source || 'fallback',
    geminiModel,
    geminiStatus,
    geminiError
  );
  return fallback;
}
