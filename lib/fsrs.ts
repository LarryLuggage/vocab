import {
  fsrs,
  Rating as FsrsRating,
  createEmptyCard,
  Card as TsFsrsCard,
  RecordLogItem,
} from 'ts-fsrs';
import { SrsCard, FSRSRating, FSRSState, ReviewSchedulePreview } from '@/types/lexis';

// Initialize FSRS scheduler with default parameters
const scheduler = fsrs();

export function createInitialSrsCard(cardId: string, userId: string, now: Date = new Date()): SrsCard {
  const empty = createEmptyCard(now);
  return {
    card_id: cardId,
    user_id: userId,
    due: empty.due.toISOString(),
    stability: empty.stability,
    difficulty: empty.difficulty,
    elapsed_days: empty.elapsed_days,
    scheduled_days: empty.scheduled_days,
    reps: empty.reps,
    lapses: empty.lapses,
    state: empty.state as FSRSState,
    last_review: empty.last_review ? empty.last_review.toISOString() : null,
  };
}

export function toTsFsrsCard(srs: SrsCard): TsFsrsCard {
  return {
    due: new Date(srs.due),
    stability: srs.stability,
    difficulty: srs.difficulty,
    elapsed_days: srs.elapsed_days,
    scheduled_days: srs.scheduled_days,
    reps: srs.reps,
    lapses: srs.lapses,
    state: srs.state,
    last_review: srs.last_review ? new Date(srs.last_review) : undefined,
  };
}

export function scheduleCardWithRating(
  currentSrs: SrsCard,
  rating: FSRSRating,
  reviewTime: Date = new Date()
): { updatedSrs: SrsCard; recordLog: RecordLogItem } {
  const fsrsCard = toTsFsrsCard(currentSrs);
  const schedulingRecord = scheduler.repeat(fsrsCard, reviewTime);

  // Map 1 -> Again, 2 -> Hard, 3 -> Good, 4 -> Easy
  const result = (schedulingRecord as unknown as Record<number, RecordLogItem>)[rating];
  const nextCard = result.card;

  const updatedSrs: SrsCard = {
    card_id: currentSrs.card_id,
    user_id: currentSrs.user_id,
    due: nextCard.due.toISOString(),
    stability: nextCard.stability,
    difficulty: nextCard.difficulty,
    elapsed_days: nextCard.elapsed_days,
    scheduled_days: nextCard.scheduled_days,
    reps: nextCard.reps,
    lapses: nextCard.lapses,
    state: nextCard.state as FSRSState,
    last_review: nextCard.last_review ? nextCard.last_review.toISOString() : reviewTime.toISOString(),
  };

  return { updatedSrs, recordLog: result };
}

export function formatIntervalDisplay(dueDate: Date, now: Date = new Date()): string {
  const diffMs = dueDate.getTime() - now.getTime();
  if (diffMs <= 0) return 'now';

  const diffMinutes = Math.round(diffMs / (1000 * 60));
  if (diffMinutes < 60) return `${Math.max(1, diffMinutes)}m`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h`;

  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d`;

  const diffMonths = Math.round(diffDays / 30);
  return `${diffMonths}mo`;
}

export function getSchedulePreviews(
  currentSrs: SrsCard,
  now: Date = new Date()
): ReviewSchedulePreview[] {
  const fsrsCard = toTsFsrsCard(currentSrs);
  const schedulingRecord = scheduler.repeat(fsrsCard, now);

  const ratings: { rating: FSRSRating; label: 'Again' | 'Hard' | 'Good' | 'Easy' }[] = [
    { rating: 1, label: 'Again' },
    { rating: 2, label: 'Hard' },
    { rating: 3, label: 'Good' },
    { rating: 4, label: 'Easy' },
  ];

  return ratings.map(({ rating, label }) => {
    const nextItem = (schedulingRecord as unknown as Record<number, RecordLogItem>)[rating];
    const intervalDisplay = formatIntervalDisplay(nextItem.card.due, now);
    return {
      rating,
      label,
      intervalDisplay,
    };
  });
}

export function getCardStateLabel(state: FSRSState): string {
  switch (state) {
    case 0:
      return 'New';
    case 1:
      return 'Learning';
    case 2:
      return 'Review';
    case 3:
      return 'Relearning';
    default:
      return 'Unknown';
  }
}
