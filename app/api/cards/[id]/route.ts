import { NextRequest, NextResponse } from 'next/server';
import {
  getCardById,
  updateCard,
  appendContextSentence,
  deleteCard,
  getProductionLogs,
} from '@/lib/db';
import { VocabCard } from '@/types/lexis';
import { DEFAULT_USER_ID } from '@/lib/db/seed-data';
import { enrichWord } from '@/lib/llm/enricher';

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

    const productionLogs = await getProductionLogs(id);

    return NextResponse.json({ success: true, data: card, productionLogs }, { status: 200 });
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

    // Re-enrich card while preserving source_context and FSRS scheduling history
    if (body.reenrich === true) {
      const enriched = await enrichWord(
        existing.term,
        existing.source_context?.sentence || undefined,
        existing.language
      );

      const updates: Partial<VocabCard> = {
        part_of_speech: enriched.part_of_speech || existing.part_of_speech,
        phonetic: enriched.phonetic ?? existing.phonetic,
        gender: enriched.gender ?? existing.gender,
        english_gloss: enriched.english_gloss ?? existing.english_gloss,
        primary_definition: enriched.primary_definition || existing.primary_definition,
        nuance_note: enriched.nuance_note ?? existing.nuance_note,
        etymology: enriched.etymology || existing.etymology,
        collocations: enriched.collocations?.length ? enriched.collocations : existing.collocations,
        cloze_sentences: enriched.cloze_sentences?.length
          ? enriched.cloze_sentences
          : existing.cloze_sentences,
        distinction_matrix: enriched.distinction_matrix ?? existing.distinction_matrix,
        is_fallback: Boolean(enriched.is_fallback),
        enrichment_source: enriched.enrichment_source as VocabCard['enrichment_source'],
        fallback_reason: enriched.fallback_reason || undefined,
        source_context: existing.source_context,
      };

      const updated = await updateCard(id, updates, userId);
      const fullCard = await getCardById(id, userId);
      return NextResponse.json(
        { success: true, reenriched: true, data: fullCard || updated },
        { status: 200 }
      );
    }

    // If request is specifically to append context sentence
    if (body.sentence && !body.source_context) {
      const updated = await appendContextSentence(id, body.sentence, body.source, userId);
      return NextResponse.json({ success: true, data: updated }, { status: 200 });
    }

    // Generic card field update
    const { userId: _, id: __, srs: ___, ...updates } = body;
    const updated = await updateCard(id, updates, userId);
    const fullCard = await getCardById(id, userId);
    return NextResponse.json({ success: true, data: fullCard || updated }, { status: 200 });
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
