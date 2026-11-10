import { NextRequest, NextResponse } from 'next/server';
import {
  listCards,
  logProductionAttempt,
  DEFAULT_USER_ID,
} from '@/lib/db';
import { polishUserProse } from '@/lib/llm/prose-polisher';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      draft,
      language = 'auto',
      focusRoot,
      maxSuggestions,
      commitCardIds,
      committedDraft,
    } = body;

    // Mode A: Commit mode — log polished draft to production_logs for each selected card
    if (
      Array.isArray(commitCardIds) &&
      commitCardIds.length > 0 &&
      typeof committedDraft === 'string' &&
      committedDraft.trim().length > 0
    ) {
      const cleanDraft = committedDraft.trim();
      let committedCount = 0;

      for (const cardId of commitCardIds) {
        if (typeof cardId === 'string' && cardId.trim()) {
          await logProductionAttempt(
            cardId.trim(),
            cleanDraft,
            'pass',
            'ACT-05 Prose Polisher revision committed to portfolio.',
            DEFAULT_USER_ID
          );
          committedCount++;
        }
      }

      return NextResponse.json(
        {
          success: true,
          committedCount,
        },
        { status: 200 }
      );
    }

    // Mode B: Polish mode — analyze user's draft and suggest high-register lexicon substitutions
    if (!draft || typeof draft !== 'string' || !draft.trim()) {
      return NextResponse.json(
        { error: 'A non-empty "draft" string is required.' },
        { status: 400 }
      );
    }

    const cards = await listCards({ userId: DEFAULT_USER_ID });
    const result = await polishUserProse({
      draft: draft.trim(),
      cards,
      language:
        language === 'en' || language === 'es' || language === 'auto'
          ? language
          : 'auto',
      focusRoot: typeof focusRoot === 'string' ? focusRoot : undefined,
      maxSuggestions:
        typeof maxSuggestions === 'number' ? maxSuggestions : undefined,
    });

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[API POST /api/polish-prose] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to polish prose draft' },
      { status: 500 }
    );
  }
}
