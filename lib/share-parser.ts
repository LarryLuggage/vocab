import { parseZoteroCitation } from './zotero-parser';

export interface ExtractedShareData {
  targetTerm: string;
  contextSentence: string;
  author?: string;
  sourceTitle?: string;
  page?: string;
  sourceUrl?: string;
}

export interface ShareTargetParams {
  text?: string | null;
  title?: string | null;
  url?: string | null;
  term?: string | null;
  q?: string | null;
  search?: string | null;
}

/**
 * Strips leading/trailing double quotes, single quotes, smart quotes (“ ”, ‘ ’),
 * brackets, commas, periods, colons, semicolons, and dashes/spaces.
 */
export function cleanPunctuation(str: string): string {
  if (!str) return '';
  let s = str.trim();
  const leading = /^[\s"'“”‘’«»\[\](){}<>,.:;!?—–-]+/;
  const trailing = /[\s"'“”‘’«»\[\](){}<>,.:;!?—–-]+$/;
  let prev = '';
  while (s !== prev) {
    prev = s;
    s = s.replace(leading, '').replace(trailing, '').trim();
  }
  return s;
}

/**
 * Normalizes whitespace (trims and collapses multiple spaces into a single space).
 */
export function normalizeWhitespace(str: string): string {
  if (!str) return '';
  return str.trim().replace(/\s+/g, ' ');
}

/**
 * Strips matching outer quotation marks from a sentence or phrase if present.
 */
export function stripOuterQuotes(str: string): string {
  let s = str.trim();
  const match = s.match(/^["“'‘«](.*)["”'’»]$/s);
  if (match) {
    return match[1].trim();
  }
  return s;
}

/**
 * Looks for words or short terms (1-3 words) surrounded by quotes within a sentence.
 * E.g., 'He criticized the "solipsism" of modern philosophy.' -> 'solipsism'
 */
export function extractQuotedTerm(sentence: string): string | null {
  if (!sentence) return null;
  let s = sentence.trim();

  // If the entire sentence is enclosed in quotes, unwrap it first if it has >= 4 words
  const outerMatch = s.match(/^["“'‘«](.*)["”'’»]$/s);
  if (outerMatch) {
    const inner = outerMatch[1].trim();
    if (inner.split(/\s+/).filter(Boolean).length >= 4) {
      s = inner;
    }
  }

  // Look for 1-3 word phrases inside quotes
  const quoteRegex = /["“'‘«]([^"”'’»]+)["”'’»]/g;
  let match: RegExpExecArray | null;
  while ((match = quoteRegex.exec(s)) !== null) {
    const candidate = match[1].trim();
    const words = candidate.split(/\s+/).filter(Boolean);
    if (words.length >= 1 && words.length <= 3) {
      const cleaned = cleanPunctuation(candidate);
      if (cleaned.length > 0) {
        return cleaned;
      }
    }
  }
  return null;
}

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'can\'t', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing',
  'don\'t', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t',
  'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers',
  'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if',
  'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t',
  'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our',
  'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s',
  'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs',
  'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re',
  'they\'ve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t',
  'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s',
  'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t',
  'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself',
  'yourselves', 'said', 'say', 'says', 'also', 'just', 'like', 'one', 'two', 'even', 'new', 'first',
  'well', 'way', 'many', 'much'
]);

function scoreCandidateWord(word: string, index: number): number {
  let score = 0;
  const lower = word.toLowerCase();

  // Length factor: longer words are more likely to be advanced vocabulary
  score += Math.max(0, lower.length - 4) * 2;

  // Capitalized mid-sentence (proper noun, foreign concept like Gestalt, Aporia)
  if (index > 0 && /^[A-Z][a-z]+$/.test(word)) {
    score += 4;
  }

  // Common high-register suffixes
  const suffixes = [
    'acious', 'icious', 'iferous', 'itude', 'escent', 'escence', 'itious',
    'ulous', 'ular', 'istic', 'idian', 'istic', 'logy', 'morph', 'phile',
    'phobe', 'cracy', 'ous', 'ious', 'ize', 'ise', 'ism', 'ist', 'ity',
    'ate', 'ive', 'ence', 'ance', 'ial', 'ent', 'ant', 'ic', 'al'
  ];
  for (const suffix of suffixes) {
    if (lower.endsWith(suffix) && lower.length > suffix.length + 2) {
      score += suffix.length >= 5 ? 5 : suffix.length >= 3 ? 3 : 1;
      break;
    }
  }

  // Classical roots/combinations: ph, rh, mn, pn, ps, ch, th, sc, x, z
  if (/ph|rh|mn|pn|ps|ch|th|sc|[xz]/.test(lower)) {
    score += 2;
  }

  return score;
}

/**
 * Detects the most probable target vocabulary word from a sentence without explicit quotes.
 * Considers word length, morphological suffixes, classical digraphs, and stopword exclusion.
 */
export function detectCandidateTargetWord(sentence: string): string {
  const rawWords = sentence.split(/\s+/).filter(Boolean);
  const candidates: { clean: string; score: number }[] = [];

  rawWords.forEach((raw, idx) => {
    const clean = cleanPunctuation(raw);
    if (!clean || clean.length < 2) return;
    const lower = clean.toLowerCase();
    if (STOP_WORDS.has(lower)) return;

    const score = scoreCandidateWord(clean, idx);
    candidates.push({ clean, score });
  });

  if (candidates.length === 0) {
    const first = rawWords.map(cleanPunctuation).find((w) => w.length > 0);
    return first || '';
  }

  // Sort descending by score
  candidates.sort((a, b) => b.score - a.score);
  return candidates[0].clean;
}

/**
 * Parses and disambiguates payloads from W3C Web Share Target, URL search parameters,
 * Android Chrome share sheets, and Zotero annotation copies.
 */
export function parseShareTargetPayload(params: ShareTargetParams): ExtractedShareData {
  let targetTerm = '';
  let contextSentence = '';
  let author: string | undefined;
  let sourceTitle: string | undefined;
  let page: string | undefined;
  let sourceUrl: string | undefined;

  let rawTerm = (params.term ?? '').trim();
  let rawText = (params.text ?? '').trim();
  let rawTitle = (params.title ?? '').trim();
  let rawUrl = (params.url ?? '').trim();
  let rawQuery = (params.q ?? params.search ?? '').trim();

  // 1. Process URL field
  if (rawUrl && /^https?:\/\//i.test(rawUrl)) {
    sourceUrl = rawUrl;
  }

  // 2. Disambiguate URLs in text and title
  if (/^https?:\/\//i.test(rawText)) {
    const urlMatch = rawText.match(/^(https?:\/\/[^\s]+)(?:\s+(.*))?$/s);
    if (urlMatch) {
      if (!sourceUrl) {
        sourceUrl = urlMatch[1];
      }
      rawText = urlMatch[2] ? urlMatch[2].trim() : '';
    }
  }

  if (/^https?:\/\//i.test(rawTitle)) {
    const urlMatch = rawTitle.match(/^(https?:\/\/[^\s]+)(?:\s+(.*))?$/s);
    if (urlMatch) {
      if (!sourceUrl) {
        sourceUrl = urlMatch[1];
      }
      rawTitle = urlMatch[2] ? urlMatch[2].trim() : '';
    }
  }

  if (/^https?:\/\//i.test(rawQuery)) {
    if (!sourceUrl) {
      sourceUrl = rawQuery;
    }
    rawQuery = '';
  }

  // 3. Check for Zotero citations in text or title
  if (rawText) {
    const zotero = parseZoteroCitation(rawText);
    if (zotero.author || zotero.sourceTitle || zotero.page || zotero.year) {
      if (zotero.author) author = zotero.author;
      if (zotero.sourceTitle) sourceTitle = zotero.sourceTitle;
      if (zotero.page) page = zotero.page;
      rawText = zotero.cleanedSentence;
      if (zotero.targetTerm) {
        targetTerm = cleanPunctuation(zotero.targetTerm).toLowerCase();
      }
    }
  } else if (rawTitle) {
    const zotero = parseZoteroCitation(rawTitle);
    if (zotero.author || zotero.sourceTitle || zotero.page || zotero.year) {
      if (zotero.author) author = zotero.author;
      if (zotero.sourceTitle) sourceTitle = zotero.sourceTitle;
      if (zotero.page) page = zotero.page;
      rawTitle = zotero.cleanedSentence;
      if (zotero.targetTerm) {
        targetTerm = cleanPunctuation(zotero.targetTerm).toLowerCase();
      }
    }
  }

  // 4. If explicit term is provided, prioritize it
  if (rawTerm) {
    targetTerm = cleanPunctuation(rawTerm).toLowerCase();
    if (rawText) {
      contextSentence = normalizeWhitespace(stripOuterQuotes(rawText));
    }
    if (rawTitle && !sourceTitle) {
      sourceTitle = normalizeWhitespace(stripOuterQuotes(rawTitle));
    }
  } else if (!rawText && !rawTitle && rawQuery) {
    // If only query/search parameter was given
    const queryWords = rawQuery.split(/\s+/).filter(Boolean);
    if (queryWords.length <= 3) {
      targetTerm = cleanPunctuation(rawQuery).toLowerCase();
    } else {
      rawText = rawQuery;
    }
  }

  // If targetTerm is already determined (e.g. from rawTerm or Zotero single word)
  if (targetTerm) {
    if (!contextSentence && rawText) {
      const cleanedText = cleanPunctuation(rawText).toLowerCase();
      if (cleanedText !== targetTerm) {
        contextSentence = normalizeWhitespace(stripOuterQuotes(rawText));
      }
    }
    if (!sourceTitle && rawTitle) {
      const cleanedTitle = cleanPunctuation(rawTitle).toLowerCase();
      if (cleanedTitle !== targetTerm) {
        sourceTitle = normalizeWhitespace(stripOuterQuotes(rawTitle));
      }
    }
    return {
      targetTerm,
      contextSentence,
      ...(author ? { author } : {}),
      ...(sourceTitle ? { sourceTitle } : {}),
      ...(page ? { page } : {}),
      ...(sourceUrl ? { sourceUrl } : {}),
    };
  }

  // 5. Evaluate rawTitle and rawText
  const titleWords = rawTitle ? rawTitle.split(/\s+/).filter(Boolean).length : 0;
  const textWords = rawText ? rawText.split(/\s+/).filter(Boolean).length : 0;

  // Pattern: Title has single word/short phrase (1-3 words) and text has sentence (>= 4 words)
  // Standard Android Chrome share pattern
  if (titleWords >= 1 && titleWords <= 3 && textWords >= 4) {
    targetTerm = cleanPunctuation(rawTitle).toLowerCase();
    contextSentence = normalizeWhitespace(stripOuterQuotes(rawText));
  }
  // Reverse pattern: Title has sentence/article title (>= 4 words) and text has single word/short phrase (1-3 words)
  else if (titleWords >= 4 && textWords >= 1 && textWords <= 3) {
    targetTerm = cleanPunctuation(rawText).toLowerCase();
    if (!sourceTitle) {
      sourceTitle = normalizeWhitespace(stripOuterQuotes(rawTitle));
    }
  }
  // Both title and text are single words/short phrases
  else if (titleWords >= 1 && titleWords <= 3 && textWords >= 1 && textWords <= 3) {
    targetTerm = cleanPunctuation(rawText || rawTitle).toLowerCase();
  }
  // Title-only payload
  else if (titleWords > 0 && textWords === 0) {
    if (titleWords <= 3) {
      targetTerm = cleanPunctuation(rawTitle).toLowerCase();
    } else {
      // Title is a full sentence
      contextSentence = normalizeWhitespace(stripOuterQuotes(rawTitle));
      const quoted = extractQuotedTerm(contextSentence);
      if (quoted) {
        targetTerm = quoted.toLowerCase();
      } else {
        targetTerm = detectCandidateTargetWord(contextSentence).toLowerCase();
      }
    }
  }
  // Text-only payload (or text with sentence)
  else if (textWords > 0) {
    if (textWords <= 3) {
      targetTerm = cleanPunctuation(rawText).toLowerCase();
      if (titleWords > 0 && !sourceTitle) {
        sourceTitle = normalizeWhitespace(stripOuterQuotes(rawTitle));
      }
    } else {
      // Text is a sentence (>= 4 words)
      contextSentence = normalizeWhitespace(stripOuterQuotes(rawText));
      if (titleWords > 0 && !sourceTitle) {
        sourceTitle = normalizeWhitespace(stripOuterQuotes(rawTitle));
      }

      // Check for quotes around a word/term (e.g. He spoke of "homuncular" tendencies)
      const quoted = extractQuotedTerm(contextSentence);
      if (quoted) {
        targetTerm = quoted.toLowerCase();
      } else {
        targetTerm = detectCandidateTargetWord(contextSentence).toLowerCase();
      }
    }
  } else if (rawQuery) {
    targetTerm = cleanPunctuation(rawQuery).toLowerCase();
  }

  return {
    targetTerm,
    contextSentence,
    ...(author ? { author } : {}),
    ...(sourceTitle ? { sourceTitle } : {}),
    ...(page ? { page } : {}),
    ...(sourceUrl ? { sourceUrl } : {}),
  };
}
