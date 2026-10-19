import { NextRequest, NextResponse } from 'next/server';
import {
  listCards,
  bulkCreateCards,
  BulkCardInput,
  DEFAULT_USER_ID,
} from '@/lib/db';
import { ALL_CURATED_PACKS } from '@/lib/db/thematic-packs';
import { generateTopicPack } from '@/lib/llm/pack-generator';
import { CardWithSrs } from '@/types/lexis';

export const maxDuration = 30;
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || DEFAULT_USER_ID;

    const existing = await listCards({ userId });
    const existingTerms = new Set(existing.map((c) => c.term.toLowerCase().trim()));

    const data = ALL_CURATED_PACKS.map((p) => {
      const ownedCount = p.cards.filter((c) =>
        existingTerms.has(c.term.toLowerCase().trim())
      ).length;
      const totalCards = p.cards.length;
      return {
        id: p.id,
        title: p.title,
        subtitle: p.subtitle,
        description: p.description,
        language: p.language,
        category: p.category,
        totalCards,
        ownedCount,
        remainingCount: totalCards - ownedCount,
        sampleTerms: p.cards.slice(0, 5).map((c) => c.term),
      };
    });

    return NextResponse.json({ success: true, count: data.length, data }, { status: 200 });
  } catch (error: any) {
    console.error('[API GET /api/cards/packs] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to list curated packs' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      action = 'seed',
      packId,
      topic,
      language = 'en',
      count,
      selectedTerms,
      customCards,
      userId = DEFAULT_USER_ID,
    } = body;

    if (!packId && !topic && !Array.isArray(customCards)) {
      return NextResponse.json(
        { error: 'Either "packId", "topic", or "customCards" must be provided.' },
        { status: 400 }
      );
    }

    const existing = await listCards({ userId });
    const existingTerms = new Set(existing.map((c) => c.term.toLowerCase().trim()));
    const existingIds = new Set(existing.map((c) => c.id));

    if (action === 'preview') {
      const generated = await generateTopicPack({
        packId,
        topic,
        language,
        count: typeof count === 'number' ? count : packId ? undefined : 8,
      });

      const annotated = generated.cards.map((card) => ({
        ...card,
        alreadyOwned: existingTerms.has(card.term.toLowerCase().trim()),
      }));

      return NextResponse.json(
        {
          success: true,
          action: 'preview',
          packId: packId || null,
          topic: topic || null,
          language,
          title: generated.title,
          mode: generated.mode,
          count: annotated.length,
          data: annotated,
        },
        { status: 200 }
      );
    }

    // Default: action === 'seed'
    let candidates: CardWithSrs[] = [];
    let title = 'Custom Pack';

    if (Array.isArray(customCards) && customCards.length > 0) {
      candidates = customCards;
      title = topic ? `Custom Topic Pack: ${topic}` : 'Custom Selection';
    } else {
      const generated = await generateTopicPack({
        packId,
        topic,
        language,
        count: typeof count === 'number' ? count : packId ? undefined : 8,
      });
      candidates = generated.cards;
      title = generated.title;
    }

    if (Array.isArray(selectedTerms) && selectedTerms.length > 0) {
      const allowedSet = new Set(
        selectedTerms
          .filter((t: unknown): t is string => typeof t === 'string')
          .map((t: string) => t.toLowerCase().trim())
      );
      candidates = candidates.filter((c) => allowedSet.has(c.term.toLowerCase().trim()));
    }

    const toInsert: BulkCardInput[] = [];
    let skippedCount = 0;

    for (const seedCard of candidates) {
      const normalizedTerm = seedCard.term.toLowerCase().trim();
      if (existingTerms.has(normalizedTerm)) {
        skippedCount++;
        continue;
      }

      const { srs, ...vocabPart } = seedCard;
      const targetId =
        !vocabPart.id || existingIds.has(vocabPart.id)
          ? crypto.randomUUID()
          : vocabPart.id;

      toInsert.push({
        ...vocabPart,
        id: targetId,
        user_id: userId,
        srs: srs
          ? {
              ...srs,
              card_id: targetId,
              user_id: userId,
            }
          : undefined,
      });

      existingTerms.add(normalizedTerm);
      existingIds.add(targetId);
    }

    const inserted = await bulkCreateCards(toInsert, userId);

    return NextResponse.json(
      {
        success: true,
        action: 'seed',
        packId: packId || null,
        topic: topic || null,
        title,
        added: inserted.length,
        skipped: skippedCount,
        total: existing.length + inserted.length,
        seededCount: inserted.length,
        skippedCount,
        data: inserted,
        message: `Seeded ${inserted.length} cards from "${title}" (${skippedCount} already owned).`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[API POST /api/cards/packs] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process pack request' },
      { status: 500 }
    );
  }
}
