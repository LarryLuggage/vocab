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
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;
    const includePreviews = searchParams.get('includePreviews') === 'true';

    let dueCards = await getDueCards(userId, asOf);
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
    const { cardId, rating, reviewTime, userId = DEFAULT_USER_ID } = body;

    if (!cardId || typeof cardId !== 'string') {
      return NextResponse.json({ error: 'Valid cardId is required.' }, { status: 400 });
    }

    if (!rating || ![1, 2, 3, 4].includes(rating)) {
      return NextResponse.json(
        { error: 'Valid rating (1: Again, 2: Hard, 3: Good, 4: Easy) is required.' },
        { status: 400 }
      );
    }

    const reviewDate = reviewTime ? new Date(reviewTime) : new Date();
    const result = await recordReview(cardId, rating as FSRSRating, reviewDate, userId);

    if (!result) {
      return NextResponse.json(
        { error: `Card with id "${cardId}" not found for review update.` },
        { status: 404 }
      );
    }

    const previews = getSchedulePreviews(result.card.srs, reviewDate);

    return NextResponse.json({
      success: true,
      card: result.card,
      schedulePreviews: previews,
      recordLog: result.recordLog,
    });
  } catch (error: any) {
    console.error('[API POST /api/review] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process review rating' },
      { status: 500 }
    );
  }
}
