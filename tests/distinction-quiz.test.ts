import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  buildDistinctionQuiz,
  correctChoiceIndex,
  fisherYatesShuffle,
  gradeDistinctionChoice,
  type RandomSource,
} from '@/lib/distinction-quiz';
import { normalizeLexicalPayload } from '@/lib/llm/enricher';
import type { DistinctionMatrix } from '@/types/lexis';

function scriptedRandom(rolls: number[]): RandomSource {
  let cursor = 0;
  return () => {
    const roll = rolls[cursor] ?? 0;
    cursor += 1;
    return roll;
  };
}

/**
 * Deterministic mulberry32. Used to show a uniform source actually visits
 * every button, not only the scripted swaps below.
 */
function mulberry32(seed: number): RandomSource {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let mixed = Math.imul(state ^ (state >>> 15), 1 | state);
    mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Fisher–Yates on 3 items consumes two rolls.
 * First roll picks j in 0..2 (`floor(roll * 3)`), second picks j in 0..1.
 * Each call returns a fresh source so a sequence is not spent by an earlier test.
 * These rolls place the item that starts at index 0 into each final slot.
 */
const placeOriginalFirstAt: Record<number, () => RandomSource> = {
  0: () => scriptedRandom([0.9, 0.9]),
  1: () => scriptedRandom([0.9, 0.0]),
  2: () => scriptedRandom([0.0, 0.9]),
};

/**
 * Rolls that place the item that starts in the middle (the reported bug)
 * into each final slot.
 */
const placeOriginalMiddleAt: Record<number, () => RandomSource> = {
  0: () => scriptedRandom([0.9, 0.0]),
  1: () => scriptedRandom([0.9, 0.9]),
  2: () => scriptedRandom([0.4, 0.9]),
};

const matrix = (synonyms: string[]): DistinctionMatrix => ({
  synonyms,
  nuanceComparison: 'Perspicacious sees through obscurity; the others do not.',
  contextRecommendations: [
    {
      word: 'perspicacious',
      recommendedRegister: 'Scholarly / Critical',
      exampleSentence: 'A perspicacious reader notices the dodge.',
    },
    {
      word: 'astute',
      recommendedRegister: 'Pragmatic',
      exampleSentence: 'An astute negotiator waits.',
    },
    {
      word: 'sagacious',
      recommendedRegister: 'Philosophical',
      exampleSentence: 'A sagacious elder listens.',
    },
  ],
});

function expectGradedAt(options: string[], correctWord: string, expectedIndex: number) {
  expect(correctChoiceIndex(options, correctWord)).toBe(expectedIndex);
  options.forEach((option, index) => {
    const graded = gradeDistinctionChoice(option, correctWord);
    expect(graded).toBe(index === expectedIndex);
  });
  expect(gradeDistinctionChoice(correctWord.toUpperCase(), correctWord)).toBe(true);
  expect(gradeDistinctionChoice(`  ${correctWord}  `, correctWord)).toBe(true);
  expect(gradeDistinctionChoice('not-the-term', correctWord)).toBe(false);
}

describe('distinction matrix choice order', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('places the original first item in every slot under a scripted RNG', () => {
    const start = ['perspicacious', 'astute', 'sagacious'];
    for (const slot of [0, 1, 2]) {
      const shuffled = fisherYatesShuffle(start, placeOriginalFirstAt[slot]());
      expect(shuffled).toHaveLength(3);
      expect(new Set(shuffled)).toEqual(new Set(start));
      expectGradedAt(shuffled, 'perspicacious', slot);
      expect(start).toEqual(['perspicacious', 'astute', 'sagacious']);
    }
  });

  it('moves a target that the model put in the middle into every button', () => {
    const fixedMiddle = ['astute', 'perspicacious', 'sagacious'];
    for (const slot of [0, 1, 2]) {
      const quiz = buildDistinctionQuiz(
        { term: 'perspicacious', distinction_matrix: matrix(fixedMiddle) },
        placeOriginalMiddleAt[slot]()
      );
      expect(quiz.correctWord).toBe('perspicacious');
      expect(quiz.options).toHaveLength(3);
      expect(new Set(quiz.options)).toEqual(new Set(fixedMiddle));
      expectGradedAt(quiz.options, quiz.correctWord, slot);
      expect(quiz.promptTone).toBe('Scholarly / Critical');
    }
  });

  it('moves a target stored first, as in the curriculum, into every button', () => {
    const storedFirst = ['perspicacious', 'astute', 'sagacious'];
    for (const slot of [0, 1, 2]) {
      const quiz = buildDistinctionQuiz(
        { term: 'perspicacious', distinction_matrix: matrix(storedFirst) },
        placeOriginalFirstAt[slot]()
      );
      expectGradedAt(quiz.options, quiz.correctWord, slot);
    }
  });

  it('visits every position across a seeded RNG and keeps grading tied to the word', () => {
    const random = mulberry32(0xdec0de);
    const counts = [0, 0, 0];
    for (let trial = 0; trial < 200; trial++) {
      const quiz = buildDistinctionQuiz(
        {
          term: 'perspicacious',
          distinction_matrix: matrix(['astute', 'perspicacious', 'sagacious']),
        },
        random
      );
      const slot = correctChoiceIndex(quiz.options, quiz.correctWord);
      expect(slot).toBeGreaterThanOrEqual(0);
      expect(slot).toBeLessThan(3);
      counts[slot] += 1;
      expect(gradeDistinctionChoice(quiz.options[slot], quiz.correctWord)).toBe(true);
      for (let index = 0; index < quiz.options.length; index++) {
        if (index === slot) continue;
        expect(gradeDistinctionChoice(quiz.options[index], quiz.correctWord)).toBe(false);
      }
    }
    expect(counts[0]).toBeGreaterThan(30);
    expect(counts[1]).toBeGreaterThan(30);
    expect(counts[2]).toBeGreaterThan(30);
  });

  it('uses Math.random when no source is injected', () => {
    const spy = vi.spyOn(Math, 'random').mockReturnValueOnce(0.0).mockReturnValueOnce(0.9);
    const quiz = buildDistinctionQuiz({
      term: 'perspicacious',
      distinction_matrix: matrix(['perspicacious', 'astute', 'sagacious']),
    });
    expect(spy).toHaveBeenCalled();
    expectGradedAt(quiz.options, quiz.correctWord, 2);
  });

  it('still grades the term when the matrix omitted it from the synonym list', () => {
    const quiz = buildDistinctionQuiz(
      { term: 'perspicacious', distinction_matrix: matrix(['astute', 'sagacious']) },
      placeOriginalFirstAt[2]()
    );
    expect(quiz.options).toContain('perspicacious');
    expect(quiz.options).toHaveLength(3);
    expectGradedAt(quiz.options, quiz.correctWord, 2);
  });

  it('shuffles parsed model synonyms instead of trusting the emitted order', () => {
    const raw = {
      term: 'perspicacious',
      part_of_speech: 'adjective',
      primary_definition: 'Having a ready insight into things.',
      distinction_matrix: {
        synonyms: ['astute', 'perspicacious', 'sagacious'],
        nuanceComparison: 'Perspicacious sees through obscurity.',
        contextRecommendations: [
          {
            word: 'perspicacious',
            recommendedRegister: 'Scholarly / Critical',
            exampleSentence: 'A perspicacious reader notices the dodge.',
          },
        ],
      },
    };

    for (const slot of [0, 1, 2]) {
      const normalized = normalizeLexicalPayload(
        raw,
        'perspicacious',
        'en',
        placeOriginalMiddleAt[slot]()
      );
      const synonyms = normalized.distinction_matrix?.synonyms ?? [];
      expect(new Set(synonyms)).toEqual(new Set(['astute', 'perspicacious', 'sagacious']));
      expectGradedAt(synonyms, 'perspicacious', slot);
      expect(normalized.distinction_matrix?.contextRecommendations[0].recommendedRegister).toBe(
        'Scholarly / Critical'
      );
    }

    const unshuffledInput = ['astute', 'perspicacious', 'sagacious'];
    expect(raw.distinction_matrix.synonyms).toEqual(unshuffledInput);
  });

  it('inserts a missing target term and can still place it in any slot', () => {
    const raw = {
      term: 'perspicacious',
      part_of_speech: 'adjective',
      primary_definition: 'Having a ready insight into things.',
      distinction_matrix: {
        synonyms: ['astute', 'sagacious'],
        nuanceComparison: 'Perspicacious sees through obscurity.',
        contextRecommendations: [
          {
            word: 'perspicacious',
            recommendedRegister: 'Scholarly',
            exampleSentence: 'A perspicacious reader.',
          },
        ],
      },
    };

    for (const slot of [0, 1, 2]) {
      const normalized = normalizeLexicalPayload(raw, 'perspicacious', 'en', placeOriginalFirstAt[slot]());
      const synonyms = normalized.distinction_matrix?.synonyms ?? [];
      expect(synonyms).toHaveLength(3);
      expectGradedAt(synonyms, 'perspicacious', slot);
    }
  });
});
