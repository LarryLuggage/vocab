import { NextRequest, NextResponse } from 'next/server';
import { getDueCards, recordReview, getCardById } from '@/lib/db';
import { getSchedulePreviews } from '@/lib/fsrs';
import { FSRSRating } from '@/types/lexis';
import { DEFAULT_USER_ID } from '@/lib/db/seed-data';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || DEFAULT_USER_ID;
    const asOfParam = searchParams.get('asOf');
    const asOf = asOfParam ? new Date(asOfParam) : new Date();
    const languageParam = searchParams.get('language') || undefined;
    const language = languageParam && languageParam !== 'all' ? languageParam : undefined;
    const cardId = searchParams.get('cardId') || undefined;
    const root = searchParams.get('root') || undefined;
    const source = searchParams.get('source') || undefined;
    const includeAll = searchParams.get('includeAll') === 'true';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;
    const includePreviews = searchParams.get('includePreviews') === 'true';

    let dueCards = await getDueCards(userId, asOf, {
      language,
      cardId,
      root,
      source,
      includeAll,
    });
    if (limit) {
      dueCards = dueCards.slice(0, limit);
    }

    const data = dueCards.map((card) => {
      if (includePreviews) {
        return {
          ...card,
          schedulePreviews: getSchedulePreviews(card.srs, asOf),
        };
      }
      return card;
    });

    return NextResponse.json({
      success: true,
      count: data.length,
      asOf: asOf.toISOString(),
      filter: {
        language: language || null,
        cardId: cardId || null,
        root: root || null,
        source: source || null,
        includeAll,
      },
      data,
    });
  } catch (error: any) {
    console.error('[API GET /api/review] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to retrieve review queue' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { cardId, cardIds, rating, reviewTime, userId = DEFAULT_USER_ID } = body;

    const rawCardIds: string[] =
      Array.isArray(cardIds) && cardIds.length > 0
        ? cardIds
            .filter((id: unknown): id is string => typeof id === 'string' && id.trim().length > 0)
            .map((id: string) => id.trim())
        : typeof cardId === 'string' && cardId.trim().length > 0
        ? [cardId.trim()]
        : [];
    const targetCardIds = Array.from(new Set(rawCardIds));

    if (targetCardIds.length === 0) {
      return NextResponse.json(
        { error: 'Valid cardId (or cardIds) is required.' },
        { status: 400 }
      );
    }

    if (!rating || ![1, 2, 3, 4].includes(rating)) {
      return NextResponse.json(
        { error: 'Valid rating (1: Again, 2: Hard, 3: Good, 4: Easy) is required.' },
        { status: 400 }
      );
    }

    const reviewDate = reviewTime ? new Date(reviewTime) : new Date();
    const batchResults: Array<{
      cardId: string;
      term: string;
      previousState: number;
      updatedSrs: any;
      card: any;
      recordLog: any;
      intervalDays: number;
    }> = [];

    for (let i = 0; i < targetCardIds.length; i++) {
      const targetId = targetCardIds[i];
      const existing = await getCardById(targetId, userId);
      if (!existing) {
        if (i === 0) {
          return NextResponse.json(
            { error: `Card with id "${targetId}" not found for review update.` },
            { status: 404 }
          );
        }
        continue;
      }

      const previousState = existing.srs.state;
      const result = await recordReview(targetId, rating as FSRSRating, reviewDate, userId);
      if (result) {
        batchResults.push({
          cardId: result.card.id,
          term: result.card.term,
          previousState,
          updatedSrs: result.card.srs,
          card: result.card,
          recordLog: result.recordLog,
          intervalDays: result.card.srs.scheduled_days,
        });
      }
    }

    const primary = batchResults[0];
    const previews = getSchedulePreviews(primary.card.srs, reviewDate);

    return NextResponse.json({
      success: true,
      card: primary.card,
      data: primary.card,
      schedulePreviews: previews,
      recordLog: primary.recordLog,
      batchCount: batchResults.length,
      batchResults,
    });
  } catch (error: any) {
    console.error('[API POST /api/review] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process review rating' },
      { status: 500 }
    );
  }
}
