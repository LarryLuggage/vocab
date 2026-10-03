import { NextRequest, NextResponse } from 'next/server';
import { enrichWord } from '@/lib/llm/enricher';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { term, contextSentence, source } = body;

    if (!term || typeof term !== 'string' || !term.trim()) {
      return NextResponse.json(
        { error: 'A valid "term" string is required for enrichment.' },
        { status: 400 }
      );
    }

    const payload = await enrichWord(term.trim(), contextSentence, source);
    return NextResponse.json({ success: true, data: payload }, { status: 200 });
  } catch (error: any) {
    console.error('[API /api/enrich] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to enrich lexical entry' },
      { status: 500 }
    );
  }
}
