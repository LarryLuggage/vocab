import { NextRequest, NextResponse } from 'next/server';
import {
  listCards,
  bulkCreateCards,
  BulkCardInput,
  appendContextSentence,
  updateCard,
  areTermsVariants,
  DEFAULT_USER_ID,
} from '@/lib/db';
import { enrichWord } from '@/lib/llm/enricher';
import { VocabCard } from '@/types/lexis';

export const maxDuration = 30;
export const dynamic = 'force-dynamic';

export interface BatchCardItemInput {
  term: string;
  contextSentence?: string;
  source?: string;
  author?: string;
  page?: string;
  language?: 'en' | 'es';
  candidateData?: Partial<VocabCard>;
  part_of_speech?: string;
  phonetic?: string;
  gender?: 'masculine' | 'feminine' | 'neuter' | null;
  english_gloss?: string | null;
  primary_definition?: string;
  nuance_note?: string;
  etymology?: VocabCard['etymology'];
  collocations?: string[];
  cloze_sentences?: string[];
  distinction_matrix?: VocabCard['distinction_matrix'];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { items, userId = DEFAULT_USER_ID } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'A non-empty "items" array is required for batch card ingestion.' },
        { status: 400 }
      );
    }

    const existingCards = await listCards({ userId });
    const toCreate: BulkCardInput[] = [];
    const mergedIds: string[] = [];
    const seenNewTerms = new Set<string>();

    for (const rawItem of items as BatchCardItemInput[]) {
      if (!rawItem || typeof rawItem.term !== 'string' || !rawItem.term.trim()) {
        continue;
      }

      const cleanTerm = rawItem.term.trim();
      const lowerTerm = cleanTerm.toLowerCase();

      const matchedExisting = existingCards.find(
        (c) =>
          c.term.toLowerCase().trim() === lowerTerm ||
          areTermsVariants(c.term, cleanTerm)
      );

      if (matchedExisting) {
        const sentenceToAppend =
          rawItem.contextSentence ||
          rawItem.candidateData?.source_context?.sentence ||
          undefined;
        const sourceToAppend =
          rawItem.source ||
          rawItem.candidateData?.source_context?.source ||
          undefined;

        if (sentenceToAppend) {
          const updated = await appendContextSentence(
            matchedExisting.id,
            sentenceToAppend,
            sourceToAppend,
            userId
          );
          if (updated && (rawItem.author || rawItem.page)) {
            await updateCard(
              matchedExisting.id,
              {
                source_context: {
                  ...updated.source_context,
                  author: rawItem.author || updated.source_context?.author || null,
                  page: rawItem.page || updated.source_context?.page || null,
                },
              },
              userId
            );
          }
        }
        if (!mergedIds.includes(matchedExisting.id)) {
          mergedIds.push(matchedExisting.id);
        }
        continue;
      }

      if (seenNewTerms.has(lowerTerm)) {
        continue;
      }
      seenNewTerms.add(lowerTerm);

      const cand: Partial<VocabCard> = {
        ...(rawItem.candidateData || {}),
        ...(rawItem.primary_definition ? { primary_definition: rawItem.primary_definition } : {}),
        ...(rawItem.part_of_speech ? { part_of_speech: rawItem.part_of_speech } : {}),
        ...(rawItem.phonetic ? { phonetic: rawItem.phonetic } : {}),
        ...(rawItem.nuance_note ? { nuance_note: rawItem.nuance_note } : {}),
        ...(rawItem.etymology ? { etymology: rawItem.etymology } : {}),
        ...(rawItem.collocations ? { collocations: rawItem.collocations } : {}),
        ...(rawItem.cloze_sentences ? { cloze_sentences: rawItem.cloze_sentences } : {}),
        ...(rawItem.distinction_matrix ? { distinction_matrix: rawItem.distinction_matrix } : {}),
        ...(rawItem.gender !== undefined ? { gender: rawItem.gender } : {}),
        ...(rawItem.english_gloss !== undefined ? { english_gloss: rawItem.english_gloss } : {}),
      };

      const contextSentence =
        rawItem.contextSentence || cand.source_context?.sentence || null;
      const sourceTitle =
        rawItem.source || cand.source_context?.source || null;
      const authorName =
        rawItem.author || cand.source_context?.author || null;
      const pageNum =
        rawItem.page || cand.source_context?.page || null;

      if (cand.primary_definition && cand.part_of_speech) {
        toCreate.push({
          user_id: userId,
          term: cleanTerm,
          language: rawItem.language || (cand.language as 'en' | 'es') || 'en',
          gender: (cand.gender as 'masculine' | 'feminine' | 'neuter' | null) || null,
          english_gloss: cand.english_gloss || null,
          part_of_speech: cand.part_of_speech,
          phonetic: cand.phonetic || null,
          primary_definition: cand.primary_definition,
          nuance_note: cand.nuance_note || null,
          etymology: cand.etymology || { roots: [], cognates: [] },
          collocations: cand.collocations || [],
          source_context: {
            sentence: contextSentence,
            source: sourceTitle,
            author: authorName,
            page: pageNum,
          },
          cloze_sentences:
            cand.cloze_sentences && cand.cloze_sentences.length > 0
              ? cand.cloze_sentences
              : [
                  contextSentence
                    ? contextSentence.replace(
                        new RegExp(`\\b${cleanTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i'),
                        (m) => `{{c1::${m}}}`
                      )
                    : `The {{c1::${cleanTerm}}} was notable in context.`,
                ],
          distinction_matrix: cand.distinction_matrix || null,
          is_fallback: false,
          enrichment_source: 'curated',
        });
      } else {
        const enriched = await enrichWord(
          cleanTerm,
          contextSentence || undefined,
          sourceTitle || undefined,
          rawItem.language
        );
        toCreate.push({
          user_id: userId,
          term: enriched.term,
          language: rawItem.language || (enriched.language as 'en' | 'es') || 'en',
          gender: enriched.gender || null,
          english_gloss: enriched.english_gloss || null,
          part_of_speech: enriched.part_of_speech,
          phonetic: enriched.phonetic || null,
          primary_definition: enriched.primary_definition,
          nuance_note: enriched.nuance_note || null,
          etymology: enriched.etymology,
          collocations: enriched.collocations,
          source_context: {
            sentence: contextSentence || enriched.source_context?.sentence || null,
            source: sourceTitle || enriched.source_context?.source || null,
            author: authorName,
            page: pageNum,
          },
          cloze_sentences: enriched.cloze_sentences,
          distinction_matrix: enriched.distinction_matrix || null,
          is_fallback: enriched.is_fallback,
          enrichment_source: enriched.enrichment_source as VocabCard['enrichment_source'],
          fallback_reason: enriched.fallback_reason as VocabCard['fallback_reason'],
        });
      }
    }

    const createdCards = await bulkCreateCards(toCreate, userId);

    return NextResponse.json(
      {
        success: true,
        createdCount: createdCards.length,
        mergedCount: mergedIds.length,
        createdIds: createdCards.map((c) => c.id),
        mergedIds,
        data: createdCards,
        message: `Created ${createdCards.length} new cards and merged ${mergedIds.length} existing sightings.`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[API POST /api/cards/batch] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process batch card ingestion' },
      { status: 500 }
    );
  }
}
