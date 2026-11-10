import { CardWithSrs, CognateMatch, EtymologyRoot } from '@/types/lexis';
import { areTermsVariants } from '@/lib/db';
import { normalizeDiacritics } from '@/lib/language';

const GENERIC_SUFFIX_STEMS = new Set([
  'ism',
  'ist',
  'ate',
  'ous',
  'acious',
  'ic',
  'ical',
  'tion',
  'sion',
  'ity',
  'ness',
  'able',
  'ible',
  'ment',
  'ado',
  'ada',
  'ido',
  'ida',
  'ecer',
  'izar',
  'cion',
  'dad',
  'tad',
  'anza',
  'eza',
  'miento',
  'oso',
  'osa',
]);

const GENERIC_SHORT_PREFIX_STEMS = new Set([
  'a',
  'ad',
  'de',
  'des',
  'dis',
  'en',
  'ex',
  'in',
  'im',
  'ir',
  're',
  'un',
  'con',
  'com',
  'pro',
  'pre',
  'sub',
  'per',
]);

const CITATION_ENDINGS = [
  'ariamente',
  'osamente',
  'escere',
  'izare',
  'icare',
  'einos',
  'einon',
  'ismos',
  'are',
  'ere',
  'ire',
  'ari',
  'eri',
  'iri',
  'ein',
  'os',
  'on',
  'um',
  'us',
  'ia',
  'io',
  'is',
  'as',
  'es',
];

/**
 * Normalizes an etymological root morpheme into a canonical comparable stem.
 * Strips leading/trailing hyphens, diacritics, and classical Latin/Greek/Arabic citation endings
 * down to a comparable stem of >= 3 chars.
 */
export function normalizeRootMorpheme(morpheme: string): string {
  if (!morpheme) return '';

  // If the morpheme lists alternatives separated by "/" or ",", pick the first non-empty part for primary stem
  const primaryPart = (morpheme.split(/[\/,]/)[0] || morpheme).trim();
  const isAffix = primaryPart.startsWith('-') || primaryPart.endsWith('-');

  const cleaned = normalizeDiacritics(primaryPart)
    .replace(/^[-*\s]+|[-*\s]+$/g, '')
    .replace(/[^a-zñ]/g, '');

  if (cleaned.length <= 3 || isAffix) {
    return cleaned;
  }

  for (const ending of CITATION_ENDINGS) {
    if (ending === 'us' && cleaned.endsWith('ous')) continue;
    if (cleaned.endsWith(ending) && cleaned.length - ending.length >= 3) {
      return cleaned.slice(0, -ending.length);
    }
  }

  return cleaned;
}

function extractMorphemeVariants(morpheme: string): string[] {
  if (!morpheme) return [];
  const parts = morpheme
    .split(/[\/,()]/)
    .map((p) => normalizeRootMorpheme(p))
    .filter((p) => p.length >= 3);
  const full = normalizeRootMorpheme(morpheme);
  if (full.length >= 3 && !parts.includes(full)) {
    parts.unshift(full);
  }
  return parts;
}

function isGenericAffixRoot(root: EtymologyRoot): boolean {
  const raw = root.morpheme.trim();
  const norm = normalizeRootMorpheme(raw);
  if (raw.startsWith('-')) return true;
  if (GENERIC_SUFFIX_STEMS.has(norm)) return true;
  if (raw.endsWith('-') && GENERIC_SHORT_PREFIX_STEMS.has(norm)) return true;
  return false;
}

function extractMeaningTokens(meaning: string): string[] {
  const stopWords = new Set([
    'to', 'of', 'the', 'a', 'an', 'in', 'on', 'by', 'for', 'with', 'from', 'or', 'and',
    'el', 'la', 'los', 'las', 'de', 'del', 'en', 'por', 'para', 'con', 'sin', 'o', 'y', 'que',
    'state', 'quality', 'condition', 'action', 'process', 'characterized', 'inclined',
    'cualidad', 'estado', 'accion', 'relativo', 'perteneciente',
  ]);
  return normalizeDiacritics(meaning)
    .replace(/[^a-zñ\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length >= 4 && !stopWords.has(t));
}

function matchSharedRoot(
  targetRoots: EtymologyRoot[],
  candidateRoots: EtymologyRoot[]
): EtymologyRoot | null {
  for (const tRoot of targetRoots) {
    if (isGenericAffixRoot(tRoot)) continue;
    const tVariants = extractMorphemeVariants(tRoot.morpheme);
    const tMeaningTokens = extractMeaningTokens(tRoot.meaning);

    for (const cRoot of candidateRoots) {
      if (isGenericAffixRoot(cRoot)) continue;
      const cVariants = extractMorphemeVariants(cRoot.morpheme);

      // 1. Direct normalized stem equality or >=4 char substring containment
      for (const tv of tVariants) {
        for (const cv of cVariants) {
          if (tv === cv && tv.length >= 3) {
            return tRoot;
          }
          if (tv.length >= 4 && cv.length >= 4 && (tv.includes(cv) || cv.includes(tv))) {
            return tRoot;
          }
        }
      }

      // 2. Identical normalized meaning tokens AND compatible short root prefix (>= 3 chars)
      if (tMeaningTokens.length > 0) {
        const cMeaningTokens = extractMeaningTokens(cRoot.meaning);
        const sharedMeaning = tMeaningTokens.some((tm) => cMeaningTokens.includes(tm));
        if (sharedMeaning) {
          const sameOrigin =
            normalizeDiacritics(tRoot.origin) === normalizeDiacritics(cRoot.origin);
          const prefixMatch = tVariants.some((tv) =>
            cVariants.some((cv) => tv.slice(0, 3) === cv.slice(0, 3))
          );
          if (sameOrigin && prefixMatch) {
            return tRoot;
          }
        }
      }
    }
  }
  return null;
}

/**
 * Finds cross-lingual and same-language etymological cognates across the user's lexicon.
 * Prioritizes cross-lingual EN <-> ES bridges before same-language root siblings.
 */
export function findCrossLingualCognates(
  targetCard: CardWithSrs,
  allCards: CardWithSrs[],
  maxResults: number = 6
): CognateMatch[] {
  if (!targetCard || !Array.isArray(allCards) || maxResults <= 0) {
    return [];
  }

  const targetLang = targetCard.language || 'en';
  const targetTermNorm = normalizeDiacritics(targetCard.term);
  const targetCognatesNorm = (targetCard.etymology?.cognates || []).map((c) =>
    normalizeDiacritics(c)
  );
  const targetGlossNorm = normalizeDiacritics(targetCard.english_gloss || '');
  const targetRoots = targetCard.etymology?.roots || [];

  const matches: CognateMatch[] = [];

  for (const candidate of allCards) {
    if (!candidate || candidate.id === targetCard.id) continue;

    const candLang = candidate.language || 'en';
    const relationType: CognateMatch['relationType'] =
      targetLang !== candLang ? 'cross-lingual' : 'same-language-root';

    const candTermNorm = normalizeDiacritics(candidate.term);
    const candCognatesNorm = (candidate.etymology?.cognates || []).map((c) =>
      normalizeDiacritics(c)
    );
    const candGlossNorm = normalizeDiacritics(candidate.english_gloss || '');
    const candRoots = candidate.etymology?.roots || [];

    // a) Check shared etymological root
    const sharedRoot = matchSharedRoot(targetRoots, candRoots);

    // b) Check explicit cognate / gloss / variant match
    const targetMentionsCandidate = targetCognatesNorm.some(
      (c) => c === candTermNorm || areTermsVariants(c, candTermNorm)
    );
    const candidateMentionsTarget = candCognatesNorm.some(
      (c) => c === targetTermNorm || areTermsVariants(c, targetTermNorm)
    );

    const glossWordsTarget = targetGlossNorm
      .replace(/[^a-zñ\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 4);
    const glossWordsCand = candGlossNorm
      .replace(/[^a-zñ\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 4);

    const glossMatches =
      glossWordsTarget.some((w) => w === candTermNorm || areTermsVariants(w, candTermNorm)) ||
      glossWordsCand.some((w) => w === targetTermNorm || areTermsVariants(w, targetTermNorm));

    const directTermVariant = areTermsVariants(targetCard.term, candidate.term);

    if (
      !sharedRoot &&
      !targetMentionsCandidate &&
      !candidateMentionsTarget &&
      !glossMatches &&
      !directTermVariant
    ) {
      continue;
    }

    let matchReason = '';
    if (directTermVariant && relationType === 'cross-lingual') {
      matchReason = `Direct cross-lingual cognate (${targetCard.term} ↔ ${candidate.term})`;
    } else if (sharedRoot) {
      matchReason = `Shared ${sharedRoot.origin} root "${sharedRoot.morpheme}" (${sharedRoot.meaning})`;
    } else if (targetMentionsCandidate || candidateMentionsTarget) {
      matchReason =
        relationType === 'cross-lingual'
          ? `Cross-lingual cognate linked in etymological family`
          : `Cognate in shared etymological family`;
    } else if (glossMatches) {
      matchReason = `Direct semantic & bilingual gloss bridge (${candidate.term})`;
    } else {
      matchReason = `Morphological cognate variant`;
    }

    matches.push({
      card: candidate,
      relationType,
      sharedRoot: sharedRoot
        ? {
            morpheme: sharedRoot.morpheme,
            meaning: sharedRoot.meaning,
            origin: sharedRoot.origin,
          }
        : undefined,
      matchReason,
    });
  }

  // Sort: 'cross-lingual' first, then 'same-language-root', preferring entries with sharedRoot
  matches.sort((a, b) => {
    if (a.relationType !== b.relationType) {
      return a.relationType === 'cross-lingual' ? -1 : 1;
    }
    if (Boolean(a.sharedRoot) !== Boolean(b.sharedRoot)) {
      return a.sharedRoot ? -1 : 1;
    }
    return a.card.term.localeCompare(b.card.term);
  });

  return matches.slice(0, maxResults);
}
