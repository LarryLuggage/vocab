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
    const card = {
      id: `card-${payload.term.toLowerCase()}-${Date.now()}`,
      user_id: 'default-user',
      created_at: new Date().toISOString(),
      term: payload.term,
      part_of_speech: payload.part_of_speech,
      phonetic: payload.phonetic || null,
      primary_definition: payload.primary_definition,
      nuance_note: payload.nuance_note || null,
      etymology: payload.etymology,
      collocations: payload.collocations,
      source_context: payload.source_context || {
        sentence: contextSentence || null,
        source: source || null,
      },
      cloze_sentences: payload.cloze_sentences,
      distinction_matrix: payload.distinction_matrix || null,
    };

    return NextResponse.json({ success: true, data: payload, card }, { status: 200 });
  } catch (error: any) {
    console.error('[API /api/enrich] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to enrich lexical entry' },
      { status: 500 }
    );
  }
}
