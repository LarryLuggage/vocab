import { NextRequest, NextResponse } from 'next/server';
import { listCards, createCard, DEFAULT_USER_ID } from '@/lib/db';
import { SPANISH_LITERARY_SEED_CARDS } from '@/lib/db/spanish-seed-data';
import { PHILOSOPHICAL_SEED_CARDS } from '@/lib/db/philosophical-seed-data';
import { CardWithSrs } from '@/types/lexis';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const pack: 'es-literary' | 'en-philosophical' | 'all' =
      body.pack === 'en-philosophical' || body.pack === 'all' ? body.pack : 'es-literary';
    const userId: string = body.userId || DEFAULT_USER_ID;

    const existing = await listCards({ userId });
    const existingTerms = new Set(existing.map((c) => c.term.toLowerCase().trim()));
    const existingIds = new Set(existing.map((c) => c.id));

    let candidates: CardWithSrs[] = [];
    if (pack === 'es-literary') {
      candidates = SPANISH_LITERARY_SEED_CARDS;
    } else if (pack === 'en-philosophical') {
      candidates = PHILOSOPHICAL_SEED_CARDS;
    } else {
      candidates = [...SPANISH_LITERARY_SEED_CARDS, ...PHILOSOPHICAL_SEED_CARDS];
    }

    let addedCount = 0;
    let skippedCount = 0;

    for (const seedCard of candidates) {
      const normalizedTerm = seedCard.term.toLowerCase().trim();
      if (existingTerms.has(normalizedTerm)) {
        skippedCount++;
        continue;
      }

      const { srs, ...vocabPart } = seedCard;
      const targetId = existingIds.has(vocabPart.id) ? crypto.randomUUID() : vocabPart.id;

      await createCard(
        {
          ...vocabPart,
          id: targetId,
          user_id: userId,
        },
        {
          ...srs,
          card_id: targetId,
          user_id: userId,
        }
      );

      existingTerms.add(normalizedTerm);
      existingIds.add(targetId);
      addedCount++;
    }

    return NextResponse.json(
      {
        success: true,
        pack,
        added: addedCount,
        skipped: skippedCount,
        total: existing.length + addedCount,
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
