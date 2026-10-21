/**
 * Mixed review sessions.
 *
 * A session walks the due queue one card at a time. Instead of asking the
 * learner to pick one drill for every card, each card is assigned a question
 * type it can actually support. Assignments stay balanced (least-used type
 * first) and randomized among ties, and the same type is not repeated back
 * to back when another eligible type is equally due.
 */

export type ReviewModality = 'ACT-01' | 'ACT-02' | 'ACT-03' | 'ACT-04';

export type ReviewSessionMode = 'mixed' | ReviewModality;

export const REVIEW_MODALITIES: readonly ReviewModality[] = [
  'ACT-01',
  'ACT-02',
  'ACT-03',
  'ACT-04',
];

export const REVIEW_MODALITY_LABELS: Record<ReviewModality, string> = {
  'ACT-01': 'Contextual Cloze',
  'ACT-02': 'Distinction Matrix',
  'ACT-03': 'Production',
  'ACT-04': 'Synthesis Weave',
};

export type RandomSource = () => number;

export interface MixableCard {
  id: string;
  term: string;
  cloze_sentences?: readonly string[] | null;
  distinction_matrix?: {
    synonyms?: readonly string[] | null;
  } | null;
}

export interface PlannedQuestion {
  cardId: string;
  modality: ReviewModality;
}

export interface MixedPlan {
  /** Changes when the learner starts a new queue. Stays put when cards are only removed. */
  nonce: string;
  questions: PlannedQuestion[];
}

export interface AttemptBucket {
  correct: number;
  total: number;
}

export type AttemptStats = Record<ReviewModality, AttemptBucket>;

export interface MixCursor {
  counts: Record<ReviewModality, number>;
  last: ReviewModality | null;
}

export function isReviewModality(value: string | null | undefined): value is ReviewModality {
  return (
    value === 'ACT-01' || value === 'ACT-02' || value === 'ACT-03' || value === 'ACT-04'
  );
}

export function emptyAttemptStats(): AttemptStats {
  return {
    'ACT-01': { correct: 0, total: 0 },
    'ACT-02': { correct: 0, total: 0 },
    'ACT-03': { correct: 0, total: 0 },
    'ACT-04': { correct: 0, total: 0 },
  };
}

export function emptyMixCursor(): MixCursor {
  return {
    counts: { 'ACT-01': 0, 'ACT-02': 0, 'ACT-03': 0, 'ACT-04': 0 },
    last: null,
  };
}

function pickIndex(length: number, random: RandomSource): number {
  if (length <= 1) return 0;
  const roll = random();
  const unit = Number.isFinite(roll) ? Math.min(Math.max(roll, 0), 0.999999999999) : 0;
  return Math.floor(unit * length);
}

function hasUsableCloze(card: MixableCard): boolean {
  const term = card.term.trim().toLowerCase();
  return (card.cloze_sentences ?? []).some((sentence) => {
    const text = sentence.trim();
    if (!text) return false;
    if (text.includes('{{')) return true;
    return term.length > 0 && text.toLowerCase().includes(term);
  });
}

function hasUsableDistinction(card: MixableCard): boolean {
  const term = card.term.trim().toLowerCase();
  if (!term) return false;
  const distinct = new Set(
    (card.distinction_matrix?.synonyms ?? [])
      .map((synonym) => synonym.trim().toLowerCase())
      .filter(Boolean)
  );
  return distinct.has(term) && distinct.size >= 2;
}

function hasUsableProduction(card: MixableCard): boolean {
  return card.term.trim().length > 0;
}

/**
 * Question types this card can actually present.
 * Cloze needs a real masked sentence. Distinction needs the target plus at
 * least one other synonym. Production needs a word. Synthesis needs another
 * card in the pool to weave with.
 */
export function eligibleReviewModalities(
  card: MixableCard,
  options?: { companionPoolSize?: number }
): ReviewModality[] {
  const eligible: ReviewModality[] = [];
  if (hasUsableCloze(card)) eligible.push('ACT-01');
  if (hasUsableDistinction(card)) eligible.push('ACT-02');
  if (hasUsableProduction(card)) eligible.push('ACT-03');
  if (hasUsableProduction(card) && (options?.companionPoolSize ?? 0) >= 2) {
    eligible.push('ACT-04');
  }
  return eligible;
}

/**
 * Pick the next question type. Least-used eligible types win. Ties are random.
 * The type just shown is skipped when another tied option exists, so the
 * session does not run the same drill twice in a row.
 */
export function chooseMixedModality(
  eligible: readonly ReviewModality[],
  cursor: MixCursor,
  random: RandomSource = Math.random
): { modality: ReviewModality; cursor: MixCursor } {
  const pool = eligible.length > 0 ? [...eligible] : (['ACT-03'] as ReviewModality[]);
  const lowest = Math.min(...pool.map((modality) => cursor.counts[modality]));
  let candidates = pool.filter((modality) => cursor.counts[modality] === lowest);
  if (candidates.length > 1 && cursor.last && candidates.includes(cursor.last)) {
    const withoutRepeat = candidates.filter((modality) => modality !== cursor.last);
    if (withoutRepeat.length > 0) candidates = withoutRepeat;
  }
  const modality = candidates[pickIndex(candidates.length, random)];
  return {
    modality,
    cursor: {
      counts: { ...cursor.counts, [modality]: cursor.counts[modality] + 1 },
      last: modality,
    },
  };
}

export function planMixedSession(
  cards: readonly MixableCard[],
  random: RandomSource = Math.random,
  options?: { companionPoolSize?: number }
): PlannedQuestion[] {
  const poolSize = options?.companionPoolSize ?? cards.length;
  let cursor = emptyMixCursor();
  const questions: PlannedQuestion[] = [];
  for (const card of cards) {
    const eligible = eligibleReviewModalities(card, { companionPoolSize: poolSize });
    const choice = chooseMixedModality(eligible, cursor, random);
    cursor = choice.cursor;
    questions.push({ cardId: card.id, modality: choice.modality });
  }
  return questions;
}

function isOrderedSubset(previousIds: readonly string[], nextIds: readonly string[]): boolean {
  let index = 0;
  for (const id of previousIds) {
    if (index < nextIds.length && nextIds[index] === id) index += 1;
  }
  return index === nextIds.length;
}

/**
 * Keep each card's question type when the queue only loses cards (a synthesis
 * grade removing companions). Replan when the session nonce changes or the
 * queue is a different list.
 */
export function reconcileMixedPlan(
  previous: MixedPlan | null,
  cards: readonly MixableCard[],
  random: RandomSource,
  options: { companionPoolSize?: number; nonce: string }
): MixedPlan {
  const nextIds = cards.map((card) => card.id);
  if (
    previous &&
    previous.nonce === options.nonce &&
    isOrderedSubset(
      previous.questions.map((question) => question.cardId),
      nextIds
    )
  ) {
    if (previous.questions.length === nextIds.length) return previous;
    const keep = new Set(nextIds);
    return {
      nonce: options.nonce,
      questions: previous.questions.filter((question) => keep.has(question.cardId)),
    };
  }
  return {
    nonce: options.nonce,
    questions: planMixedSession(cards, random, {
      companionPoolSize: options.companionPoolSize,
    }),
  };
}

export function modalityForCard(
  plan: MixedPlan | null,
  cardId: string | undefined,
  sessionMode: ReviewSessionMode
): ReviewModality | null {
  if (sessionMode !== 'mixed') return sessionMode;
  if (!cardId || !plan) return null;
  return plan.questions.find((question) => question.cardId === cardId)?.modality ?? null;
}

/** Record one answered question against its type. Does not mutate `stats`. */
export function recordReviewAttempt(
  stats: AttemptStats,
  modality: ReviewModality,
  correct: boolean
): AttemptStats {
  const bucket = stats[modality];
  return {
    ...stats,
    [modality]: {
      correct: bucket.correct + (correct ? 1 : 0),
      total: bucket.total + 1,
    },
  };
}

export function summarizeAttempts(stats: AttemptStats): AttemptBucket {
  return REVIEW_MODALITIES.reduce(
    (summary, modality) => ({
      correct: summary.correct + stats[modality].correct,
      total: summary.total + stats[modality].total,
    }),
    { correct: 0, total: 0 }
  );
}

/** Overall percent. An untouched session reports 100, matching the previous summary. */
export function overallAccuracy(stats: AttemptStats): number {
  const summary = summarizeAttempts(stats);
  if (summary.total === 0) return 100;
  return Math.round((summary.correct / summary.total) * 100);
}
