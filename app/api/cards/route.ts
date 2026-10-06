import { NextRequest, NextResponse } from 'next/server';
import {
  listCards,
  findCardByTerm,
  createCard,
  appendContextSentence,
} from '@/lib/db';
import { enrichWord } from '@/lib/llm/enricher';
import { DEFAULT_USER_ID } from '@/lib/db/seed-data';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const pos = searchParams.get('pos') || undefined;
    const userId = searchParams.get('userId') || DEFAULT_USER_ID;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!, 10) : undefined;

    const cards = await listCards({ search, pos, userId, limit, offset });
    return NextResponse.json({ success: true, count: cards.length, data: cards }, { status: 200 });
  } catch (error: any) {
    console.error('[API GET /api/cards] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to retrieve vocabulary cards' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { term, force, appendContext, userId = DEFAULT_USER_ID, ...rest } = body;

    if (!term || typeof term !== 'string' || !term.trim()) {
      return NextResponse.json(
        { error: 'A valid "term" string is required for card creation.' },
        { status: 400 }
      );
    }

    const cleanTerm = term.trim();

    // 1. Variant / Lemma Deduplication Check (ING-04)
    const existing = await findCardByTerm(cleanTerm, userId);

    if (existing && !force) {
      if (appendContext) {
        const sentenceToAppend =
          rest.source_context?.sentence ||
          rest.contextSentence ||
          body.sentence;

        if (sentenceToAppend) {
          const updated = await appendContextSentence(
            existing.id,
            sentenceToAppend,
            rest.source_context?.source || rest.source,
            userId
          );
          return NextResponse.json(
            {
              success: true,
              appended: true,
              data: updated,
              message: `Appended context sentence to existing card for "${existing.term}".`,
            },
            { status: 200 }
          );
        }
      }

      // Return 409 Conflict with details for UI deduplication modal
      return NextResponse.json(
        {
          duplicate: true,
          message: `The term or lemma "${cleanTerm}" matches existing card "${existing.term}".`,
          existingCard: existing,
        },
        { status: 409 }
      );
    }

    // 2. Prepare card payload: enrich if full fields not provided
    let cardData: any;
    if (rest.primary_definition && rest.part_of_speech) {
      cardData = {
        term: cleanTerm,
        part_of_speech: rest.part_of_speech,
        phonetic: rest.phonetic || null,
        primary_definition: rest.primary_definition,
        nuance_note: rest.nuance_note || null,
        etymology: rest.etymology || { roots: [], cognates: [] },
        collocations: rest.collocations || [],
        source_context: rest.source_context || {
          sentence: rest.contextSentence || null,
          source: rest.source || null,
        },
        cloze_sentences: rest.cloze_sentences || [`The {{c1::${cleanTerm}}} was evident.`],
        distinction_matrix: rest.distinction_matrix || null,
        is_fallback: Boolean(rest.is_fallback),
        enrichment_source: rest.enrichment_source || null,
        fallback_reason: rest.fallback_reason || null,
        user_id: userId,
      };
    } else {
      // Auto-enrich using lexical enricher
      const enriched = await enrichWord(
        cleanTerm,
        rest.contextSentence || rest.source_context?.sentence,
        rest.source || rest.source_context?.source
      );
      cardData = {
        ...enriched,
        user_id: userId,
      };
    }

    // 3. Create card & initialize FSRS SRS record
    const created = await createCard(cardData);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    console.error('[API POST /api/cards] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create vocabulary card' },
      { status: 500 }
    );
  }
}
