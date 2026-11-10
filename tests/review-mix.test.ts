import { describe, expect, it } from 'vitest';
import {
  chooseMixedModality,
  eligibleReviewModalities,
  emptyAttemptStats,
  emptyMixCursor,
  overallAccuracy,
  planMixedSession,
  reconcileMixedPlan,
  recordReviewAttempt,
  summarizeAttempts,
  type MixableCard,
  type RandomSource,
  type ReviewModality,
} from '@/lib/review-mix';

function scriptedRandom(rolls: number[]): RandomSource {
  let cursor = 0;
  return () => {
    const roll = rolls[cursor] ?? 0;
    cursor += 1;
    return roll;
  };
}

function mulberry32(seed: number): RandomSource {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let mixed = Math.imul(state ^ (state >>> 15), 1 | state);
    mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

function card(id: string, overrides: Partial<MixableCard> = {}): MixableCard {
  const term = overrides.term ?? `term-${id}`;
  return {
    id,
    term,
    cloze_sentences: [`A careful use of {{c1::${term}}} settles the point.`],
    distinction_matrix: { synonyms: [term, 'near-synonym', 'distant-synonym'] },
    ...overrides,
  };
}

function countsOf(modalities: ReviewModality[]): Record<ReviewModality, number> {
  const counts: Record<ReviewModality, number> = {
    'ACT-01': 0,
    'ACT-02': 0,
    'ACT-03': 0,
    'ACT-04': 0,
  };
  for (const modality of modalities) counts[modality] += 1;
  return counts;
}

describe('mixed review sessions', () => {
  it('skips question types the card cannot generate', () => {
    const bare = card('bare', {
      term: 'bare',
      cloze_sentences: [],
      distinction_matrix: null,
    });
    expect(eligibleReviewModalities(bare, { companionPoolSize: 1 })).toEqual(['ACT-03']);
    expect(eligibleReviewModalities(bare, { companionPoolSize: 4 })).toEqual(['ACT-03', 'ACT-04']);

    const noCloze = card('nocloze', { cloze_sentences: ['No blank in this sentence.'] });
    expect(eligibleReviewModalities(noCloze, { companionPoolSize: 3 })).not.toContain('ACT-01');

    const noMatrix = card('nomatrix', { distinction_matrix: { synonyms: ['nomatrix'] } });
    expect(eligibleReviewModalities(noMatrix, { companionPoolSize: 3 })).not.toContain('ACT-02');

    const missingTermInMatrix = card('off', {
      distinction_matrix: { synonyms: ['alpha', 'beta'] },
    });
    expect(eligibleReviewModalities(missingTermInMatrix, { companionPoolSize: 3 })).not.toContain(
      'ACT-02'
    );

    const alone = card('alone');
    expect(eligibleReviewModalities(alone, { companionPoolSize: 1 })).not.toContain('ACT-04');
    expect(eligibleReviewModalities(alone, { companionPoolSize: 2 })).toContain('ACT-04');
  });

  it('does not schedule a type a card cannot support', () => {
    const cards = [
      card('a', { cloze_sentences: [], distinction_matrix: null }),
      card('b', { distinction_matrix: { synonyms: ['term-b'] } }),
      card('c'),
    ];
    const plan = planMixedSession(cards, mulberry32(7), { companionPoolSize: 3 });
    const byId = Object.fromEntries(plan.map((question) => [question.cardId, question.modality]));
    expect(byId.a).not.toBe('ACT-01');
    expect(byId.a).not.toBe('ACT-02');
    expect(byId.b).not.toBe('ACT-02');
    expect(['ACT-03', 'ACT-04']).toContain(byId.a);
  });

  it('balances a full session and does not repeat a type when another is equally due', () => {
    const cards = Array.from({ length: 12 }, (_, index) => card(`c${index}`));
    const plan = planMixedSession(cards, mulberry32(42));
    const modalities = plan.map((question) => question.modality);
    const counts = countsOf(modalities);
    expect(counts['ACT-01']).toBe(3);
    expect(counts['ACT-02']).toBe(3);
    expect(counts['ACT-03']).toBe(3);
    expect(counts['ACT-04']).toBe(3);
    for (let index = 1; index < modalities.length; index++) {
      expect(modalities[index]).not.toBe(modalities[index - 1]);
    }
  });

  it('can place any type first, so the mix is not a fixed rotation', () => {
    const cards = [card('only')];
    const firsts = new Set<ReviewModality>();
    for (const roll of [0, 0.3, 0.5, 0.9]) {
      const plan = planMixedSession(cards, scriptedRandom([roll]), { companionPoolSize: 4 });
      firsts.add(plan[0].modality);
    }
    expect(firsts).toEqual(new Set(['ACT-01', 'ACT-02', 'ACT-03', 'ACT-04']));

    const sessionA = planMixedSession(
      Array.from({ length: 8 }, (_, index) => card(`a${index}`)),
      mulberry32(1)
    ).map((question) => question.modality);
    const sessionB = planMixedSession(
      Array.from({ length: 8 }, (_, index) => card(`a${index}`)),
      mulberry32(99)
    ).map((question) => question.modality);
    expect(sessionA.join(',')).not.toBe(sessionB.join(','));
  });

  it('still balances the types a limited card can take', () => {
    const cards = Array.from({ length: 6 }, (_, index) =>
      card(`p${index}`, { cloze_sentences: [], distinction_matrix: null })
    );
    const plan = planMixedSession(cards, mulberry32(3), { companionPoolSize: 6 });
    const counts = countsOf(plan.map((question) => question.modality));
    expect(counts['ACT-01']).toBe(0);
    expect(counts['ACT-02']).toBe(0);
    expect(counts['ACT-03']).toBe(3);
    expect(counts['ACT-04']).toBe(3);
  });

  it('keeps a card’s type when companions are removed, and replans on a new session', () => {
    const cards = [card('a'), card('b'), card('c'), card('d')];
    const random = scriptedRandom([0, 0, 0, 0]);
    const planned = reconcileMixedPlan(null, cards, random, {
      nonce: 'session-1',
      companionPoolSize: 4,
    });
    const trimmed = reconcileMixedPlan(
      planned,
      cards.filter((entry) => entry.id !== 'c'),
      () => {
        throw new Error('removing a card must not reshuffle');
      },
      { nonce: 'session-1', companionPoolSize: 3 }
    );
    expect(trimmed.questions.map((question) => question.cardId)).toEqual(['a', 'b', 'd']);
    expect(trimmed.questions.map((question) => question.modality)).toEqual([
      planned.questions[0].modality,
      planned.questions[1].modality,
      planned.questions[3].modality,
    ]);

    const replanned = reconcileMixedPlan(trimmed, cards, scriptedRandom([0.9, 0.9, 0.9, 0.9]), {
      nonce: 'session-2',
      companionPoolSize: 4,
    });
    expect(replanned.questions[0].modality).not.toBe(planned.questions[0].modality);
  });

  it('falls back to production when a card has nothing else to ask', () => {
    const empty = card('empty', {
      term: '   ',
      cloze_sentences: ['   '],
      distinction_matrix: null,
    });
    expect(eligibleReviewModalities(empty, { companionPoolSize: 5 })).toEqual([]);
    const choice = chooseMixedModality([], emptyMixCursor(), () => 0);
    expect(choice.modality).toBe('ACT-03');
  });

  it('scores each question type on its own and keeps the session total', () => {
    let stats = emptyAttemptStats();
    stats = recordReviewAttempt(stats, 'ACT-01', false);
    stats = recordReviewAttempt(stats, 'ACT-01', true);
    stats = recordReviewAttempt(stats, 'ACT-02', true);
    stats = recordReviewAttempt(stats, 'ACT-03', false);
    stats = recordReviewAttempt(stats, 'ACT-04', true);

    expect(stats['ACT-01']).toEqual({ correct: 1, total: 2 });
    expect(stats['ACT-02']).toEqual({ correct: 1, total: 1 });
    expect(stats['ACT-03']).toEqual({ correct: 0, total: 1 });
    expect(stats['ACT-04']).toEqual({ correct: 1, total: 1 });
    expect(summarizeAttempts(stats)).toEqual({ correct: 3, total: 5 });
    expect(overallAccuracy(stats)).toBe(60);
    expect(overallAccuracy(emptyAttemptStats())).toBe(100);

    const untouched = emptyAttemptStats();
    recordReviewAttempt(untouched, 'ACT-02', true);
    expect(untouched['ACT-02']).toEqual({ correct: 0, total: 0 });
  });
});
