import { NextRequest, NextResponse } from 'next/server';
import { listCards } from '@/lib/db';
import { DEFAULT_USER_ID } from '@/lib/db/seed-data';

function escapeCsvField(val: unknown): string {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  return `"${str.replace(/"/g, '""')}"`;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format')?.toLowerCase() || 'json';
    const userId = searchParams.get('userId') || DEFAULT_USER_ID;
    const download = searchParams.get('download') === 'true';

    const cards = await listCards({ userId });

    if (format === 'anki' || format === 'csv') {
      // Generate Anki-compatible CSV with standard cloze & vocabulary headers
      const headers = [
        'Term',
        'Part of Speech',
        'Phonetic',
        'Primary Definition',
        'Nuance Note',
        'Etymology Roots',
        'Cognates',
        'Collocations',
        'Cloze Sentences',
        'Source Sentence',
        'Tags',
      ];

      const rows = cards.map((card) => {
        const rootsStr = card.etymology.roots
          .map((r) => `${r.morpheme} (${r.origin}: ${r.meaning})`)
          .join('; ');
        const cognatesStr = card.etymology.cognates.join('; ');
        const collocationsStr = card.collocations.join('; ');
        const clozeStr = card.cloze_sentences.join('\n');
        const sourceSentence = card.source_context?.sentence || '';
        const tags = `lexis-engine ${card.part_of_speech}`;

        return [
          escapeCsvField(card.term),
          escapeCsvField(card.part_of_speech),
          escapeCsvField(card.phonetic || ''),
          escapeCsvField(card.primary_definition),
          escapeCsvField(card.nuance_note || ''),
          escapeCsvField(rootsStr),
          escapeCsvField(cognatesStr),
          escapeCsvField(collocationsStr),
          escapeCsvField(clozeStr),
          escapeCsvField(sourceSentence),
          escapeCsvField(tags),
        ].join(',');
      });

      const csvContent = [headers.join(','), ...rows].join('\n');
      const filename = `lexis_export_${new Date().toISOString().split('T')[0]}.csv`;

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    }

    // Default JSON Export
    const filename = `lexis_export_${new Date().toISOString().split('T')[0]}.json`;
    const responsePayload = {
      version: '1.0',
      exported_at: new Date().toISOString(),
      count: cards.length,
      cards,
    };

    if (download) {
      return new NextResponse(JSON.stringify(responsePayload, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    }

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error: any) {
    console.error('[API GET /api/export] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to export vocabulary cards' },
      { status: 500 }
    );
  }
}
