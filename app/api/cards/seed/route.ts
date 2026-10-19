import { NextRequest, NextResponse } from 'next/server';
import { listCards, bulkCreateCards, BulkCardInput, DEFAULT_USER_ID } from '@/lib/db';
import { SPANISH_LITERARY_SEED_CARDS } from '@/lib/db/spanish-seed-data';
import { PHILOSOPHICAL_SEED_CARDS } from '@/lib/db/philosophical-seed-data';
import { findCuratedPackById } from '@/lib/db/thematic-packs';
import { CardWithSrs } from '@/types/lexis';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawPack = typeof body.pack === 'string' ? body.pack.trim() : 'es-literary';
    const userId: string = body.userId || DEFAULT_USER_ID;

    const existing = await listCards({ userId });
    const existingTerms = new Set(existing.map((c) => c.term.toLowerCase().trim()));
    const existingIds = new Set(existing.map((c) => c.id));

    let candidates: CardWithSrs[] = [];
    if (rawPack === 'all') {
      candidates = [...SPANISH_LITERARY_SEED_CARDS, ...PHILOSOPHICAL_SEED_CARDS];
    } else {
      const matchedPack = findCuratedPackById(rawPack);
      candidates = matchedPack ? matchedPack.cards : SPANISH_LITERARY_SEED_CARDS;
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
      const targetId = existingIds.has(vocabPart.id) ? crypto.randomUUID() : vocabPart.id;

      toInsert.push({
        ...vocabPart,
        id: targetId,
        user_id: userId,
        srs: {
          ...srs,
          card_id: targetId,
          user_id: userId,
        },
      });

      existingTerms.add(normalizedTerm);
      existingIds.add(targetId);
    }

    const insertedCards = await bulkCreateCards(toInsert, userId);
    const addedCount = insertedCards.length;

    return NextResponse.json(
      {
        success: true,
        pack: rawPack,
        added: addedCount,
        skipped: skippedCount,
        total: existing.length + addedCount,
        seededCount: addedCount,
        skippedCount,
        totalAvailableInPack: candidates.length,
        message: `Seeded ${addedCount} cards (${skippedCount} already existed).`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[API POST /api/cards/seed] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to seed vocabulary pack' },
      { status: 500 }
    );
  }
}
