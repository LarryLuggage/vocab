import type { DistinctionMatrix, DistinctionMatrixItem } from '@/types/lexis';

/**
 * Source of randomness for a shuffle. `Math.random` returns a value in [0, 1).
 * Tests inject a seeded or scripted function so a choice can be forced into
 * every slot without depending on the clock.
 */
export type RandomSource = () => number;

export interface DistinctionQuizSource {
  term: string;
  distinction_matrix?: DistinctionMatrix | null;
}

export interface DistinctionQuiz {
  promptTone: string;
  /** Choices in display order. The correct entry is identified by text, not by slot. */
  options: string[];
  /** The target term. Grading compares the clicked choice to this string. */
  correctWord: string;
  comparison: string;
  recommendations: DistinctionMatrixItem[];
}

const FALLBACK_TONE = 'High Literary & Scholarly Register';
const FALLBACK_DISTRACTORS = ['general synonym', 'colloquial parallel'] as const;

export function choicesMatch(left: string, right: string): boolean {
  return left.trim().toLowerCase() === right.trim().toLowerCase();
}

/**
 * Fisher–Yates shuffle. The swap index is drawn from `0..i` inclusive so every
 * permutation of the list is equally likely when `random` is uniform on [0, 1).
 * The input array is not mutated.
 */
export function fisherYatesShuffle<T>(items: readonly T[], random: RandomSource = Math.random): T[] {
  const next = items.slice();
  for (let i = next.length - 1; i > 0; i--) {
    const roll = random();
    const unit = Number.isFinite(roll) ? Math.min(Math.max(roll, 0), 0.999999999999) : 0;
    const j = Math.floor(unit * (i + 1));
    const swap = next[i];
    next[i] = next[j];
    next[j] = swap;
  }
  return next;
}

/**
 * Index of the correct choice after shuffling. Derived from the word itself,
 * so it stays valid no matter which slot the shuffle picked.
 */
export function correctChoiceIndex(options: readonly string[], correctWord: string): number {
  return options.findIndex((option) => choicesMatch(option, correctWord));
}

export function gradeDistinctionChoice(chosenWord: string, correctWord: string): boolean {
  return choicesMatch(chosenWord, correctWord);
}

function assembleChoices(term: string, synonyms: readonly string[] | undefined): string[] {
  const provided = (synonyms ?? []).map((choice) => choice.trim()).filter(Boolean);
  const pool = provided.length > 0 ? provided : [term, ...FALLBACK_DISTRACTORS];
  const seen = new Set<string>();
  const choices: string[] = [];
  let includedCorrect = false;

  for (const choice of pool) {
    const key = choice.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    if (choicesMatch(choice, term)) {
      choices.push(term);
      includedCorrect = true;
    } else {
      choices.push(choice);
    }
  }

  if (!includedCorrect) choices.unshift(term);
  return choices;
}

/**
 * Build one distinction-matrix question. Synonym lists arrive in a fixed order
 * (curriculum rows and model output put the target word in a stable slot).
 * Shuffle after that list is assembled and remember the answer by the term,
 * not by the slot it started in.
 */
export function buildDistinctionQuiz(
  card: DistinctionQuizSource,
  random: RandomSource = Math.random
): DistinctionQuiz {
  const term = card.term.trim();
  const matrix = card.distinction_matrix;
  const recommendations = matrix?.contextRecommendations ?? [];
  const targetRecommendation =
    recommendations.find((item) => choicesMatch(item.word, term)) || recommendations[0];

  const comparison = matrix
    ? matrix.nuanceComparison
    : `"${term}" provides refined connotative precision suitable for literary and academic prose.`;

  const fallbackRecommendations: DistinctionMatrixItem[] = [
    {
      word: term,
      recommendedRegister: 'Literary & Scholarly Register',
      exampleSentence: `The scholar noted the ${term} nature of the passage.`,
    },
  ];

  return {
    promptTone: targetRecommendation?.recommendedRegister || FALLBACK_TONE,
    options: fisherYatesShuffle(assembleChoices(term, matrix?.synonyms), random),
    correctWord: term,
    comparison,
    recommendations: recommendations.length > 0 ? recommendations : fallbackRecommendations,
  };
}
