import { CardWithSrs } from '@/types/lexis';

export type ReviewLanguageTrack = 'all' | 'en' | 'es';
export type MixedOrderMode = 'due' | 'en-first' | 'es-first';

export const REVIEW_LANGUAGE_STORAGE_KEY = 'lexis_review_language_preference';
export const REVIEW_SPANISH_AUTO_GLOSS_STORAGE_KEY = 'lexis_review_spanish_auto_gloss';
export const REVIEW_MIXED_ORDER_STORAGE_KEY = 'lexis_review_mixed_order';

export interface LanguageQueueCounts {
  totalDue: number;
  enDue: number;
  esDue: number;
}

export function normalizeCardLanguage(card: Pick<CardWithSrs, 'language'>): 'en' | 'es' {
  return card.language?.toLowerCase().trim() === 'es' ? 'es' : 'en';
}

export function parseReviewLanguageParam(value?: string | null): ReviewLanguageTrack | null {
  if (!value) return null;
  const cleaned = value.toLowerCase().trim();
  if (!cleaned) return null;

  if (cleaned === 'en' || cleaned === 'english') {
    return 'en';
  }
  if (
    cleaned === 'es' ||
    cleaned === 'spanish' ||
    cleaned === 'espanol' ||
    cleaned === 'español'
  ) {
    return 'es';
  }
  if (cleaned === 'all' || cleaned === 'mixed') {
    return 'all';
  }
  return null;
}

export function computeLanguageQueueCounts(cards: CardWithSrs[]): LanguageQueueCounts {
  let enDue = 0;
  let esDue = 0;

  for (const card of cards) {
    if (normalizeCardLanguage(card) === 'es') {
      esDue += 1;
    } else {
      enDue += 1;
    }
  }

  return {
    totalDue: enDue + esDue,
    enDue,
    esDue,
  };
}

export function filterAndOrderReviewQueue(
  cards: CardWithSrs[],
  track: ReviewLanguageTrack,
  mixedOrder: MixedOrderMode = 'due'
): CardWithSrs[] {
  if (track === 'en') {
    return cards.filter((card) => normalizeCardLanguage(card) === 'en');
  }
  if (track === 'es') {
    return cards.filter((card) => normalizeCardLanguage(card) === 'es');
  }

  if (mixedOrder === 'en-first') {
    const enCards: CardWithSrs[] = [];
    const esCards: CardWithSrs[] = [];
    for (const card of cards) {
      if (normalizeCardLanguage(card) === 'es') {
        esCards.push(card);
      } else {
        enCards.push(card);
      }
    }
    return [...enCards, ...esCards];
  }

  if (mixedOrder === 'es-first') {
    const esCards: CardWithSrs[] = [];
    const enCards: CardWithSrs[] = [];
    for (const card of cards) {
      if (normalizeCardLanguage(card) === 'es') {
        esCards.push(card);
      } else {
        enCards.push(card);
      }
    }
    return [...esCards, ...enCards];
  }

  return [...cards];
}

export function pruneRatedCardsFromQueue(
  cards: CardWithSrs[],
  ratedCardIds: string[]
): CardWithSrs[] {
  if (!ratedCardIds || ratedCardIds.length === 0) {
    return [...cards];
  }
  const ratedSet = new Set(ratedCardIds);
  return cards.filter((card) => !ratedSet.has(card.id));
}

export function deferCardToEndOfQueue(
  cards: CardWithSrs[],
  cardId: string
): CardWithSrs[] {
  if (cards.length <= 1) {
    return [...cards];
  }
  const index = cards.findIndex((card) => card.id === cardId);
  if (index === -1 || index === cards.length - 1) {
    return [...cards];
  }
  const target = cards[index];
  return [...cards.slice(0, index), ...cards.slice(index + 1), target];
}

export function toggleEnglishSpanishTrack(
  current: ReviewLanguageTrack
): 'en' | 'es' {
  return current === 'en' ? 'es' : 'en';
}

export function cycleReviewLanguageTrack(
  current: ReviewLanguageTrack
): ReviewLanguageTrack {
  if (current === 'en') return 'es';
  if (current === 'es') return 'all';
  return 'en';
}
