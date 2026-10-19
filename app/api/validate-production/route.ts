import { NextRequest, NextResponse } from 'next/server';
import { validateProductionSentence, validateSynthesisPassage } from '@/lib/llm/validator';
import { logProductionAttempt } from '@/lib/db';
import { DEFAULT_USER_ID } from '@/lib/db/seed-data';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      term,
      terms,
      userSentence,
      targetRegister,
      cardId,
      cardIds,
      userId = DEFAULT_USER_ID,
    } = body;

    if (!userSentence || typeof userSentence !== 'string' || !userSentence.trim()) {
      return NextResponse.json(
        { error: 'A valid "userSentence" string is required.' },
        { status: 400 }
      );
    }

    // Multi-word synthesis validation (ACT-04)
    if (Array.isArray(terms) && terms.length > 0) {
      const cleanTerms = terms
        .filter((t): t is string => typeof t === 'string' && t.trim().length > 0)
        .map((t) => t.trim());

      if (cleanTerms.length === 0) {
        return NextResponse.json(
          { error: 'At least one valid target term is required in "terms".' },
          { status: 400 }
        );
      }

      const result = await validateSynthesisPassage(
        cleanTerms,
        userSentence.trim(),
        targetRegister
      );

      let loggedCount = 0;
      if (Array.isArray(cardIds)) {
        for (const cid of cardIds) {
          if (cid && typeof cid === 'string') {
            try {
              await logProductionAttempt(
                cid,
                userSentence.trim(),
                result.evaluationStatus,
                result.feedback,
                userId
              );
              loggedCount++;
            } catch (err) {
              console.warn('[API /api/validate-production] Failed to log synthesis attempt:', err);
            }
          }
        }
      }

      return NextResponse.json(
        {
          success: true,
          data: result,
          logsCount: loggedCount,
        },
        { status: 200 }
      );
    }

    // Single-word production validation (ACT-03)
    if (!term || typeof term !== 'string' || !term.trim()) {
      return NextResponse.json(
        { error: 'A valid "term" string is required for production validation.' },
        { status: 400 }
      );
    }

    const result = await validateProductionSentence(
      term.trim(),
      userSentence.trim(),
      targetRegister
    );

    // If cardId is provided, log attempt to persistent production_logs table
    let logRecord = null;
    if (cardId && typeof cardId === 'string') {
      try {
        logRecord = await logProductionAttempt(
          cardId,
          userSentence.trim(),
          result.evaluationStatus,
          result.feedback,
          userId
        );
      } catch (err) {
        console.warn('[API /api/validate-production] Failed to log production attempt:', err);
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: result,
        log: logRecord,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[API POST /api/validate-production] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to evaluate sentence production' },
      { status: 500 }
    );
  }
}

