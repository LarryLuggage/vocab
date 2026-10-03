import { NextRequest, NextResponse } from 'next/server';
import {
  getCardById,
  updateCard,
  appendContextSentence,
  deleteCard,
} from '@/lib/db';
import { DEFAULT_USER_ID } from '@/lib/db/seed-data';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || DEFAULT_USER_ID;

    const card = await getCardById(id, userId);
    if (!card) {
      return NextResponse.json(
        { error: `Vocabulary card with id "${id}" not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: card }, { status: 200 });
  } catch (error: any) {
    console.error('[API GET /api/cards/[id]] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to retrieve card' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await req.json().catch(() => ({}));
    const userId = body.userId || DEFAULT_USER_ID;

    const existing = await getCardById(id, userId);
    if (!existing) {
      return NextResponse.json(
        { error: `Vocabulary card with id "${id}" not found.` },
        { status: 404 }
      );
    }

    // If request is specifically to append context sentence
    if (body.sentence) {
      const updated = await appendContextSentence(id, body.sentence, body.source, userId);
      return NextResponse.json({ success: true, data: updated }, { status: 200 });
    }

    // Generic card field update
    const { userId: _, id: __, srs: ___, ...updates } = body;
    const updated = await updateCard(id, updates, userId);
    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (error: any) {
    console.error('[API PATCH /api/cards/[id]] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update card' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || DEFAULT_USER_ID;

    const deleted = await deleteCard(id, userId);
    if (!deleted) {
      return NextResponse.json(
        { error: `Vocabulary card with id "${id}" not found or could not be deleted.` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, id, message: 'Card successfully deleted.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[API DELETE /api/cards/[id]] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to delete card' },
      { status: 500 }
    );
  }
}
