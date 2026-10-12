/**
 * Dual-language utilities for English & Spanish vocabulary practice.
 */

export type SupportedLanguage = 'en' | 'es';

const SPANISH_CHARS_REGEX = /[áéíóúüñÁÉÍÓÚÜÑ¿¡]/;

const SPANISH_STOP_WORDS = new Set([
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'al',
  'en', 'por', 'para', 'con', 'sin', 'sobre', 'tras', 'hacia', 'desde', 'hasta',
  'y', 'e', 'o', 'u', 'pero', 'mas', 'más', 'porque', 'que', 'qué', 'quien', 'quién',
  'es', 'son', 'era', 'eran', 'fue', 'fueron', 'ha', 'han', 'había', 'habían',
  'su', 'sus', 'mi', 'mis', 'tu', 'tus', 'nuestro', 'nuestra', 'nuestros', 'nuestras',
  'este', 'esta', 'estos', 'estas', 'ese', 'esa', 'esos', 'esas', 'aquel', 'aquella',
  'se', 'me', 'te', 'nos', 'os', 'le', 'les', 'lo', 'la', 'los', 'las',
  'como', 'cómo', 'donde', 'dónde', 'cuando', 'cuándo', 'cuanto', 'cuánto',
  'muy', 'ya', 'no', 'si', 'sí', 'todo', 'toda', 'todos', 'todas', 'otro', 'otra',
  'bien', 'mal', 'tambien', 'también', 'tampoco', 'siempre', 'nunca', 'jamás',
  'hacer', 'tener', 'estar', 'ser', 'decir', 'poder', 'ver', 'dar', 'saber',
]);

const ENGLISH_STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'if', 'because', 'as', 'what',
  'which', 'this', 'that', 'these', 'those', 'then', 'so', 'than', 'such',
  'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'up', 'about',
  'into', 'over', 'after', 'beneath', 'under', 'above',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
  'do', 'does', 'did', 'can', 'could', 'will', 'would', 'shall', 'should',
  'he', 'she', 'it', 'they', 'we', 'i', 'you', 'his', 'her', 'their', 'our', 'my', 'your',
  'not', 'no', 'nor', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
]);

const SPANISH_SUFFIXES = [
  'ción', 'sión', 'xión', 'dad', 'tad', 'miento', 'mienta',
  'mente', 'eza', 'oso', 'osa', 'able', 'ible', 'ado', 'ada',
  'ido', 'ida', 'ero', 'era', 'aje', 'encia', 'ancia', 'ecer',
  'izar', 'ecer', 'uelo', 'uela', 'ísimo', 'ísima',
];

/**
 * Strips diacritics/accents and normalizes for accent-tolerant comparisons.
 * E.g., 'desahuciado' -> 'desahuciado', 'incómodo' -> 'incomodo', 'niño' -> 'nino'.
 */
export function normalizeDiacritics(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Checks whether user input matches the target word in a diacritic-tolerant manner.
 */
export function isDiacriticMatch(input: string, target: string): boolean {
  const normInput = normalizeDiacritics(input);
  const normTarget = normalizeDiacritics(target);
  if (!normInput || !normTarget) return false;
  return normInput === normTarget;
}

/**
 * Dynamically detects whether a given text/term is primarily Spanish ('es') or English ('en').
 */
export function detectLanguage(text: string): SupportedLanguage {
  const trimmed = text.trim();
  if (!trimmed) return 'en';

  // 1. Explicit Spanish characters/punctuation
  if (SPANISH_CHARS_REGEX.test(trimmed)) {
    return 'es';
  }

  // Split into tokens
  const words = trimmed
    .toLowerCase()
    .replace(/[^\p{L}\s]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return 'en';

  let esScore = 0;
  let enScore = 0;

  for (const w of words) {
    if (SPANISH_STOP_WORDS.has(w)) esScore += 2;
    if (ENGLISH_STOP_WORDS.has(w)) enScore += 2;

    // Check Spanish suffixes on individual words
    for (const suffix of SPANISH_SUFFIXES) {
      if (w.length > suffix.length + 2 && w.endsWith(suffix)) {
        esScore += 1.5;
        break;
      }
    }
  }

  // Single word checks
  if (words.length === 1) {
    const single = words[0];
    if (single.startsWith('des') && single.length > 5) esScore += 1;
    if (single.endsWith('ar') || single.endsWith('er') || single.endsWith('ir')) {
      if (single.length >= 5) esScore += 0.8;
    }
  }

  if (esScore > enScore) return 'es';
  return 'en';
}

export interface GenderBadgeInfo {
  article: string;
  label: string;
  fullBadge: string;
}

/**
 * Formats grammatical gender for Spanish nouns and adjectives.
 * Returns e.g. { article: 'el', label: 'sustantivo masculino', fullBadge: 'el • sustantivo masculino' }
 */
export function formatGenderBadge(
  gender?: 'masculine' | 'feminine' | 'neuter' | string | null,
  partOfSpeech?: string
): GenderBadgeInfo | null {
  if (!gender) return null;
  const g = gender.toLowerCase().trim();
  const pos = (partOfSpeech || '').toLowerCase();
  const isNoun = pos.includes('noun') || pos.includes('sustantivo') || !pos;

  if (g === 'masculine' || g === 'm') {
    const label = isNoun ? 'sustantivo masculino' : 'masculino';
    return {
      article: 'el',
      label,
      fullBadge: isNoun ? 'el • sustantivo masculino' : 'masculino',
    };
  }

  if (g === 'feminine' || g === 'f') {
    const label = isNoun ? 'sustantivo femenino' : 'femenino';
    return {
      article: 'la',
      label,
      fullBadge: isNoun ? 'la • sustantivo femenino' : 'femenino',
    };
  }

  if (g === 'neuter' || g === 'n') {
    const label = isNoun ? 'sustantivo neutro' : 'neutro';
    return {
      article: 'lo',
      label,
      fullBadge: isNoun ? 'lo • sustantivo neutro' : 'neutro',
    };
  }

  return null;
}
