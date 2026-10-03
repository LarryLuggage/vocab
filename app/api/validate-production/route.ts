import { NextRequest, NextResponse } from 'next/server';
import { validateProductionSentence } from '@/lib/llm/validator';
import { logProductionAttempt } from '@/lib/db';
import { DEFAULT_USER_ID } from '@/lib/db/seed-data';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      term,
      userSentence,
      targetRegister,
      cardId,
      userId = DEFAULT_USER_ID,
    } = body;

    if (!term || typeof term !== 'string' || !term.trim()) {
      return NextResponse.json(
        { error: 'A valid "term" string is required for production validation.' },
        { status: 400 }
      );
    }

    if (!userSentence || typeof userSentence !== 'string' || !userSentence.trim()) {
      return NextResponse.json(
        { error: 'A valid "userSentence" string is required.' },
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
