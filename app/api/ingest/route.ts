import { NextRequest, NextResponse } from 'next/server';
import { enrichWord } from '@/lib/llm/enricher';
import {
  findCardByTerm,
  createCard,
  appendContextSentence,
  DEFAULT_USER_ID,
} from '@/lib/db';
import { parseZoteroCitation } from '@/lib/zotero-parser';
import { IngestRequestPayload, VocabCard } from '@/types/lexis';
import { createInitialSrsCard } from '@/lib/fsrs';

const DEFAULT_SECRET_TOKEN = 'lexis-personal-secret-2026';

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.LEXIS_SECRET_TOKEN || DEFAULT_SECRET_TOKEN;
  const authHeader = req.headers.get('authorization');
  const customHeader = req.headers.get('x-lexis-token');

  if (customHeader && customHeader === secret) return true;
  if (authHeader) {
    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0].toLowerCase() === 'bearer' && parts[1] === secret) {
      return true;
    }
  }

  // Also allow query param for mobile shortcut webhooks if bearer header is difficult
  const tokenParam = req.nextUrl.searchParams.get('token');
  if (tokenParam && tokenParam === secret) return true;

  return false;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid or missing LEXIS_SECRET_TOKEN' },
      { status: 401 }
    );
  }

  try {
    const body: IngestRequestPayload & { rawCitation?: string } = await req.json().catch(() => ({}));
    let { term, contextSentence, source, author, page, url } = body;

    // Check if raw text or context sentence contains a Zotero parenthetical citation
    const textToScan = body.rawCitation || contextSentence || term;
    if (textToScan && (textToScan.includes('(') || textToScan.includes('（'))) {
      const parsed = parseZoteroCitation(textToScan);
      if (parsed.author && !author) author = parsed.author;
      if (parsed.sourceTitle && !source) source = parsed.sourceTitle;
      if (parsed.page && !page) page = parsed.page;
      if (parsed.targetTerm && (!term || term === textToScan)) term = parsed.targetTerm;
      if (parsed.cleanedSentence && parsed.cleanedSentence !== term) {
        contextSentence = parsed.cleanedSentence;
      }
    }

    if (!term || typeof term !== 'string' || !term.trim()) {
      return NextResponse.json(
        { error: 'A valid "term" string is required for ingestion.' },
        { status: 400 }
      );
    }

    const cleanTerm = term.trim();

    // 1. Deduplication check (ING-04)
    const existing = await findCardByTerm(cleanTerm);
    if (existing) {
      const sentenceToAppend = contextSentence ? contextSentence.trim() : `Encountered in ${source || 'Reading'}`;
      const sourceCitation = [source, author, page].filter(Boolean).join(' • ');
      const updated = await appendContextSentence(
        existing.id,
        sentenceToAppend,
        sourceCitation || existing.source_context?.source || undefined
      );

      return NextResponse.json({
        success: true,
        action: 'appended',
        message: `Context sentence appended to existing card "${existing.term}"`,
        card: updated || existing,
      }, { status: 200 });
    }

    // 2. Enrich via LLM
    const enriched = await enrichWord(cleanTerm, contextSentence, source);

    // 3. Assemble SourceContext
    const fullSourceTitle = [source, author, page].filter(Boolean).join(' • ');
    const sourceContext = {
      sentence: contextSentence || enriched.source_context?.sentence || null,
      source: fullSourceTitle || enriched.source_context?.source || null,
      author: author || null,
      page: page || null,
      url: url || null,
    };

    // 4. Create Card & Initial FSRS record in DB
    const cardId = `card-${cleanTerm.toLowerCase()}-${Date.now()}`;
    const initialSrs = createInitialSrsCard(cardId, DEFAULT_USER_ID);

    const newCardData: Omit<VocabCard, 'id' | 'created_at'> = {
      user_id: DEFAULT_USER_ID,
      term: enriched.term || cleanTerm,
      part_of_speech: enriched.part_of_speech,
      phonetic: enriched.phonetic || null,
      primary_definition: enriched.primary_definition,
      nuance_note: enriched.nuance_note || null,
      etymology: enriched.etymology,
      collocations: enriched.collocations,
      source_context: sourceContext,
      cloze_sentences: enriched.cloze_sentences,
      distinction_matrix: enriched.distinction_matrix || null,
    };

    const saved = await createCard(newCardData, initialSrs);

    return NextResponse.json({
      success: true,
      action: 'created',
      message: `Enriched and saved "${saved.term}" to personal lexicon`,
      card: saved,
    }, { status: 201 });
  } catch (err: any) {
    console.error('[API /api/ingest] Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Ingestion failed' },
      { status: 500 }
    );
  }
}
