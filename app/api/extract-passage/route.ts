import { NextRequest, NextResponse } from 'next/server';
import { extractPassageCandidates } from '@/lib/llm/passage-extractor';
import { listCards, areTermsVariants, DEFAULT_USER_ID } from '@/lib/db';

export const maxDuration = 30;
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      passage,
      language = 'auto',
      source,
      author,
      maxCandidates = 8,
      userId = DEFAULT_USER_ID,
    } = body;

    if (!passage || typeof passage !== 'string' || passage.trim().length < 10) {
      return NextResponse.json(
        { error: 'A valid passage of at least 10 characters is required.' },
        { status: 400 }
      );
    }

    const extraction = await extractPassageCandidates(passage.trim(), {
      language,
      source,
      author,
      maxCandidates,
    });

    const existingCards = await listCards({ userId });

    const annotatedCandidates = extraction.candidates.map((cand) => {
      const matchedExisting = existingCards.find(
        (c) =>
          c.term.toLowerCase().trim() === cand.term.toLowerCase().trim() ||
          areTermsVariants(c.term, cand.term)
      );
      return {
        ...cand,
        alreadyExists: Boolean(matchedExisting),
        existingCardId: matchedExisting ? matchedExisting.id : null,
      };
    });

    const payload = {
      candidates: annotatedCandidates,
      detectedLanguage: extraction.detectedLanguage,
      parsedCitation: extraction.parsedCitation,
      mode: extraction.mode,
    };

    return NextResponse.json(
      {
        success: true,
        ...payload,
        data: payload,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[API POST /api/extract-passage] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to extract candidate terms from passage' },
      { status: 500 }
    );
  }
}
