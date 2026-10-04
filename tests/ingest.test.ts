import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/ingest/route';

describe('Private Token Ingestion API (/api/ingest)', () => {
  const secretToken = 'lexis-personal-secret-2026';

  it('rejects unauthenticated requests with 401', async () => {
    const req = new NextRequest('http://localhost:3000/api/ingest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ term: 'lucid' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('accepts requests with valid Bearer token', async () => {
    const uniqueTerm = `apercu-${Date.now()}`;
    const req = new NextRequest('http://localhost:3000/api/ingest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secretToken}`,
      },
      body: JSON.stringify({
        term: uniqueTerm,
        contextSentence: 'A brilliant aperçu illuminates the entire essay.',
        source: 'Literary Theory',
        author: 'Eagleton',
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.action).toBe('created');
    expect(data.card.term).toBe(uniqueTerm);
    expect(data.card.source_context?.author).toBe('Eagleton');
  });

  it('handles Zotero citation strings automatically', async () => {
    const uniqueTerm = `aporia-${Date.now()}`;
    const req = new NextRequest('http://localhost:3000/api/ingest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-lexis-token': secretToken,
      },
      body: JSON.stringify({
        term: uniqueTerm,
        contextSentence: `An insoluble ${uniqueTerm} stopped the philosophical argument. (Derrida, Margins of Philosophy, p. 88)`,
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.card.source_context?.author).toBe('Derrida');
    expect(data.card.source_context?.page).toBe('p. 88');
  });

  it('appends context sentence when word already exists (ING-04 deduplication)', async () => {
    const term = 'perspicacious'; // Pre-seeded card in backend DB
    const req = new NextRequest('http://localhost:3000/api/ingest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secretToken}`,
      },
      body: JSON.stringify({
        term,
        contextSentence: 'New context sentence highlighting perspicacious clarity.',
        source: 'Journal of Aesthetics',
        author: 'Scruton',
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.action).toBe('appended');
  });
});
