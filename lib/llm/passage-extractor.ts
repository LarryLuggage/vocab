import { VocabCard } from '@/types/lexis';
import { CURATED_LEXICON } from './curated-lexicon';
import { detectLanguage, enrichWord } from './enricher';
import { parseZoteroCitation, ParsedZoteroCitation } from '@/lib/zotero-parser';
import { areTermsVariants } from '@/lib/db';
import { ALL_CURATED_PACKS } from '@/lib/db/thematic-packs';

export interface PassageCandidate {
  term: string;
  surfaceForm: string;
  part_of_speech: string;
  phonetic: string;
  language: 'en' | 'es';
  gender?: 'masculine' | 'feminine' | 'neuter' | 'invariable' | null;
  english_gloss?: string | null;
  primary_definition: string;
  nuance_note: string;
  etymology: {
    roots: Array<{ morpheme: string; meaning: string; origin: string }>;
    cognates: string[];
  };
  collocations: string[];
  cloze_sentences: string[];
  distinction_matrix?: VocabCard['distinction_matrix'];
  contextSentence: string;
  alreadyExists?: boolean;
  existingCardId?: string | null;
}

export interface PassageExtractionResult {
  candidates: PassageCandidate[];
  detectedLanguage: 'en' | 'es';
  parsedCitation: {
    author: string | null;
    source: string | null;
    year: string | null;
    page: string | null;
  };
  mode: 'gemini' | 'heuristic';
}

const COMMON_STOP_WORDS = new Set([
  // English common words >= 6 chars
  'through', 'between', 'because', 'without', 'against', 'nothing', 'another',
  'himself', 'herself', 'themselves', 'however', 'whether', 'already', 'always',
  'before', 'during', 'within', 'around', 'should', 'would', 'could', 'though',
  'although', 'having', 'making', 'become', 'became', 'something', 'everything',
  'anything', 'someone', 'everyone', 'modern', 'general', 'common', 'simple',
  'certain', 'different', 'various', 'several', 'important', 'particular',
  'history', 'historical', 'society', 'social', 'political', 'system', 'nature',
  'natural', 'human', 'people', 'person', 'moment', 'period', 'century', 'written',
  'writing', 'reading', 'thought', 'thoughts', 'meaning', 'example', 'question',
  'problem', 'process', 'present', 'future', 'further', 'towards', 'toward',
  'apperception', 'philosophy', 'philosophical', 'literature', 'literary',
  // Spanish common words >= 6 chars
  'porque', 'cuando', 'contra', 'durante', 'mediante', 'siempre', 'también',
  'además', 'aunque', 'mientras', 'nosotros', 'vosotros', 'aquello', 'aquella',
  'aquellos', 'aquellas', 'alguno', 'alguna', 'algunos', 'algunas', 'ninguno',
  'ninguna', 'hombre', 'hombres', 'tiempo', 'tiempos', 'mundo', 'pueblo',
  'ciudad', 'estado', 'historia', 'manera', 'propio', 'propia', 'mismo', 'misma',
  'fuerza', 'muerte', 'tierra', 'verdad', 'nombre', 'primero', 'primera',
  'grande', 'grandes', 'nuevos', 'nuevas', 'parece', 'habían', 'estaba', 'fueron',
]);

interface CuratedLookupEntry {
  term: string;
  language: 'en' | 'es';
  part_of_speech: string;
  phonetic: string;
  gender?: 'masculine' | 'feminine' | 'neuter' | null;
  english_gloss?: string | null;
  primary_definition: string;
  nuance_note: string;
  etymology: {
    roots: Array<{ morpheme: string; meaning: string; origin: string }>;
    cognates: string[];
  };
  collocations: string[];
  cloze_sentences: string[];
  distinction_matrix?: VocabCard['distinction_matrix'];
}

let cachedCuratedMap: Map<string, CuratedLookupEntry> | null = null;

function getCuratedLookupMap(): Map<string, CuratedLookupEntry> {
  if (cachedCuratedMap) return cachedCuratedMap;
  const map = new Map<string, CuratedLookupEntry>();

  for (const [key, val] of Object.entries(CURATED_LEXICON)) {
    const cleanKey = key.toLowerCase().trim();
    map.set(cleanKey, {
      term: cleanKey,
      language: (val.language as 'en' | 'es') || 'en',
      part_of_speech: val.part_of_speech,
      phonetic: val.phonetic || '',
      gender: val.gender || null,
      english_gloss: val.english_gloss || null,
      primary_definition: val.primary_definition,
      nuance_note: val.nuance_note || '',
      etymology: val.etymology,
      collocations: val.collocations,
      cloze_sentences: val.cloze_sentences,
      distinction_matrix: val.distinction_matrix || null,
    });
  }

  for (const pack of ALL_CURATED_PACKS) {
    for (const card of pack.cards) {
      const key = card.term.toLowerCase().trim();
      if (!map.has(key)) {
        map.set(key, {
          term: card.term,
          language: (card.language as 'en' | 'es') || pack.language,
          part_of_speech: card.part_of_speech,
          phonetic: card.phonetic || '',
          gender: card.gender || null,
          english_gloss: card.english_gloss || null,
          primary_definition: card.primary_definition,
          nuance_note: card.nuance_note || '',
          etymology: card.etymology,
          collocations: card.collocations,
          cloze_sentences: card.cloze_sentences,
          distinction_matrix: card.distinction_matrix || null,
        });
      }
    }
  }

  cachedCuratedMap = map;
  return map;
}

function buildContextCloze(sentence: string, surfaceForm: string, canonicalTerm: string): string {
  const escapedSurface = surfaceForm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const surfaceRegex = new RegExp(`\\b${escapedSurface}\\b`, 'i');
  if (surfaceRegex.test(sentence)) {
    return sentence.replace(surfaceRegex, (m) => `{{c1::${m}}}`);
  }
  const escapedTerm = canonicalTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const termRegex = new RegExp(`\\b${escapedTerm}[a-zA-Záéíóúñü]*\\b`, 'i');
  if (termRegex.test(sentence)) {
    return sentence.replace(termRegex, (m) => `{{c1::${m}}}`);
  }
  return `${sentence} ({{c1::${canonicalTerm}}})`;
}

function scoreAcademicToken(token: string, lang: 'en' | 'es'): number {
  const lower = token.toLowerCase();
  if (lower.length < 6) return 0;
  if (COMMON_STOP_WORDS.has(lower)) return 0;

  let score = lower.length;

  // Classical & scholarly affix bonuses
  const scholarlyPatterns =
    lang === 'es'
      ? [
          /^des/, /^in/, /^im/, /^trans/, /^inter/, /^auto/, /^al/,
          /ción$/, /sión$/, /miento$/, /idad$/, /anza$/, /eza$/, /ismo$/, /ista$/, /ecer$/, /ático$/, /órico$/,
        ]
      : [
          /^epi/, /^apo/, /^syn/, /^sym/, /^ana/, /^kata/, /^cata/, /^meta/, /^para/, /^peri/, /^hyper/, /^hypo/,
          /^circum/, /^contra/, /^inter/, /^trans/, /^sub/, /^pre/, /^post/, /^ob/, /^per/,
          /ism$/, /ity$/, /tion$/, /sion$/, /acious$/, /itious$/, /sis$/, /osis$/, /esis$/, /phobia$/, /philia$/, /logy$/, /cracy$/, /nomy$/,
        ];

  for (const pat of scholarlyPatterns) {
    if (pat.test(lower)) score += 4;
  }

  return score;
}

export async function extractPassageCandidates(
  passage: string,
  options?: {
    language?: 'auto' | 'en' | 'es';
    source?: string;
    author?: string;
    maxCandidates?: number;
  }
): Promise<PassageExtractionResult> {
  const maxCandidates = Math.min(Math.max(options?.maxCandidates || 8, 1), 15);
  const normalizedForZotero = passage.trim().replace(/([)）])\s*[.!?]+\s*$/, '$1');
  const zotero: ParsedZoteroCitation = parseZoteroCitation(normalizedForZotero);
  const cleanedPassage = zotero.cleanedSentence || passage.trim();

  const detectedLanguage: 'en' | 'es' =
    options?.language && options.language !== 'auto'
      ? options.language
      : detectLanguage('', cleanedPassage);

  const parsedCitation = {
    author: options?.author?.trim() || zotero.author || null,
    source: options?.source?.trim() || zotero.sourceTitle || null,
    year: zotero.year || null,
    page: zotero.page || null,
  };

  const citationStr = [parsedCitation.author, parsedCitation.source]
    .filter(Boolean)
    .join(' — ') || undefined;

  // Split passage into sentences
  const rawSentences = cleanedPassage
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const sentences = rawSentences.length > 0 ? rawSentences : [cleanedPassage];

  const curatedMap = getCuratedLookupMap();
  const curatedValues = Array.from(curatedMap.values());

  const selectedCandidates: PassageCandidate[] = [];
  const seenTerms = new Set<string>();

  // Pass 1: Scan sentences for exact or variant matches in our 190+ curated lexicon entries
  for (const sentence of sentences) {
    const tokens = sentence.match(/[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ-]{4,}/g) || [];
    for (const surfaceToken of tokens) {
      if (selectedCandidates.length >= maxCandidates) break;
      const lowerToken = surfaceToken.toLowerCase();
      if (COMMON_STOP_WORDS.has(lowerToken)) continue;

      let matchedEntry: CuratedLookupEntry | undefined = curatedMap.get(lowerToken);
      if (!matchedEntry) {
        matchedEntry = curatedValues.find(
          (entry) =>
            entry.language === detectedLanguage &&
            areTermsVariants(lowerToken, entry.term)
        );
      }

      if (matchedEntry) {
        const canonicalLower = matchedEntry.term.toLowerCase();
        if (seenTerms.has(canonicalLower)) continue;
        seenTerms.add(canonicalLower);

        const passageCloze = buildContextCloze(sentence, surfaceToken, matchedEntry.term);
        const mergedClozes = [
          passageCloze,
          ...matchedEntry.cloze_sentences.filter((c) => c !== passageCloze),
        ].slice(0, 3);

        selectedCandidates.push({
          term: matchedEntry.term,
          surfaceForm: surfaceToken,
          part_of_speech: matchedEntry.part_of_speech,
          phonetic: matchedEntry.phonetic,
          language: matchedEntry.language,
          gender: matchedEntry.gender || null,
          english_gloss: matchedEntry.english_gloss || null,
          primary_definition: matchedEntry.primary_definition,
          nuance_note: matchedEntry.nuance_note,
          etymology: matchedEntry.etymology,
          collocations: matchedEntry.collocations,
          cloze_sentences: mergedClozes,
          distinction_matrix: matchedEntry.distinction_matrix || null,
          contextSentence: sentence,
        });
      }
    }
  }

  // Pass 2: If fewer than maxCandidates found, score remaining high-register tokens and enrich them
  if (selectedCandidates.length < maxCandidates) {
    const scoredTokens: Array<{
      surfaceToken: string;
      lowerToken: string;
      sentence: string;
      score: number;
    }> = [];

    for (const sentence of sentences) {
      const tokens = sentence.match(/[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]{6,}/g) || [];
      for (const surfaceToken of tokens) {
        const lowerToken = surfaceToken.toLowerCase();
        if (seenTerms.has(lowerToken)) continue;
        if ( Array.from(seenTerms).some((t) => areTermsVariants(lowerToken, t)) ) continue;
        const score = scoreAcademicToken(surfaceToken, detectedLanguage);
        if (score > 0) {
          scoredTokens.push({ surfaceToken, lowerToken, sentence, score });
          seenTerms.add(lowerToken);
        }
      }
    }

    scoredTokens.sort((a, b) => b.score - a.score);
    const needed = maxCandidates - selectedCandidates.length;
    const topUnmatched = scoredTokens.slice(0, needed);

    for (const item of topUnmatched) {
      const enriched = await enrichWord(
        item.lowerToken,
        item.sentence,
        citationStr,
        detectedLanguage
      );
      const passageCloze = buildContextCloze(item.sentence, item.surfaceToken, enriched.term);
      const mergedClozes = [
        passageCloze,
        ...(enriched.cloze_sentences || []).filter((c) => c !== passageCloze),
      ].slice(0, 3);

      selectedCandidates.push({
        term: enriched.term,
        surfaceForm: item.surfaceToken,
        part_of_speech: enriched.part_of_speech,
        phonetic: enriched.phonetic || '',
        language: (enriched.language as 'en' | 'es') || detectedLanguage,
        gender: enriched.gender || null,
        english_gloss: enriched.english_gloss || null,
        primary_definition: enriched.primary_definition,
        nuance_note: enriched.nuance_note || '',
        etymology: enriched.etymology,
        collocations: enriched.collocations,
        cloze_sentences: mergedClozes,
        distinction_matrix: enriched.distinction_matrix || null,
        contextSentence: item.sentence,
      });
    }
  }

  return {
    candidates: selectedCandidates,
    detectedLanguage,
    parsedCitation,
    mode: 'heuristic',
  };
}
