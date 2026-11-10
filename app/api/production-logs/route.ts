import { NextRequest, NextResponse } from 'next/server';
import { listAllProductionLogsWithCards, DEFAULT_USER_ID } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const languageParam = searchParams.get('language')?.toLowerCase().trim();
    const statusParam = searchParams.get('status')?.toLowerCase().trim();
    const limitParam = parseInt(searchParams.get('limit') || '100', 10);
    const limit = Number.isFinite(limitParam) && limitParam > 0 ? limitParam : 100;

    let logs = await listAllProductionLogsWithCards(
      DEFAULT_USER_ID,
      Math.max(limit * 3, 200)
    );

    if (languageParam === 'en' || languageParam === 'es') {
      logs = logs.filter((item) => (item.card?.language || 'en') === languageParam);
    }

    if (
      statusParam === 'pass' ||
      statusParam === 'awkward' ||
      statusParam === 'incorrect_usage'
    ) {
      logs = logs.filter((item) => item.evaluation_status === statusParam);
    }

    const sliced = logs.slice(0, limit);

    return NextResponse.json(
      {
        data: sliced,
        count: sliced.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[API GET /api/production-logs] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch production logs' },
      { status: 500 }
    );
  }
}
