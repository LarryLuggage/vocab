import { describe, it, expect } from 'vitest';
import {
  createInitialSrsCard,
  scheduleCardWithRating,
  getSchedulePreviews,
  getCardStateLabel,
} from '@/lib/fsrs';

describe('FSRS Scheduling Engine', () => {
  const userId = 'user-123';
  const cardId = 'card-456';
  const baseTime = new Date('2026-10-03T12:00:00Z');

  it('initializes a new card correctly', () => {
    const card = createInitialSrsCard(cardId, userId, baseTime);
    expect(card.card_id).toBe(cardId);
    expect(card.user_id).toBe(userId);
    expect(card.state).toBe(0); // New
    expect(card.reps).toBe(0);
    expect(card.lapses).toBe(0);
    expect(card.stability).toBe(0);
    expect(card.difficulty).toBe(0);
    expect(new Date(card.due).getTime()).toBe(baseTime.getTime());
    expect(getCardStateLabel(card.state)).toBe('New');
  });

  it('advances state and schedules due date on "Good" rating', () => {
    const initial = createInitialSrsCard(cardId, userId, baseTime);
    const { updatedSrs } = scheduleCardWithRating(initial, 3, baseTime);

    expect(updatedSrs.reps).toBe(1);
    expect(updatedSrs.stability).toBeGreaterThan(0);
    expect(updatedSrs.difficulty).toBeGreaterThan(0);
    expect(updatedSrs.last_review).toBe(baseTime.toISOString());
    // In FSRS, first review on a new card moves to Learning (state 1)
    expect(updatedSrs.state).toBe(1);
    expect(new Date(updatedSrs.due).getTime()).toBeGreaterThan(baseTime.getTime());
  });

  it('handles "Again" rating on new card', () => {
    const initial = createInitialSrsCard(cardId, userId, baseTime);
    const { updatedSrs } = scheduleCardWithRating(initial, 1, baseTime);

    expect(updatedSrs.reps).toBe(1);
    expect(updatedSrs.state).toBe(1); // Learning
    // Due should be short interval (e.g., 5-10 mins)
    const diffMinutes = (new Date(updatedSrs.due).getTime() - baseTime.getTime()) / (1000 * 60);
    expect(diffMinutes).toBeLessThanOrEqual(15);
  });

  it('provides 4 rating previews with human-readable intervals', () => {
    const initial = createInitialSrsCard(cardId, userId, baseTime);
    const previews = getSchedulePreviews(initial, baseTime);

    expect(previews).toHaveLength(4);
    expect(previews[0].label).toBe('Again');
    expect(previews[1].label).toBe('Hard');
    expect(previews[2].label).toBe('Good');
    expect(previews[3].label).toBe('Easy');
    previews.forEach((p) => {
      expect(typeof p.intervalDisplay).toBe('string');
      expect(p.intervalDisplay.length).toBeGreaterThan(0);
    });
  });
});
