import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { middleware } from '@/middleware';
import { POST as createSession } from '@/app/api/session/route';
import { sanitizeNextPath, SESSION_COOKIE } from '@/lib/auth';

const TOKEN = 'test-token-0123456789';

function request(path: string, init?: { headers?: Record<string, string>; cookie?: string }) {
  const headers = new Headers(init?.headers);
  if (init?.cookie) headers.set('cookie', init.cookie);
  return new NextRequest(`http://localhost:3000${path}`, { headers });
}

describe('Token auth middleware', () => {
  beforeEach(() => vi.stubEnv('LEXIS_SECRET_TOKEN', TOKEN));
  afterEach(() => vi.unstubAllEnvs());

  it('rejects API requests without a token', async () => {
    const res = await middleware(request('/api/cards'));
    expect(res.status).toBe(401);
  });

  it('rejects API requests with the wrong token', async () => {
    const res = await middleware(
      request('/api/cards', { headers: { authorization: 'Bearer lexis-personal-secret-2026' } })
    );
    expect(res.status).toBe(401);
  });

  it('protects every API route, not just ingest', async () => {
    for (const path of ['/api/cards/abc', '/api/export', '/api/enrich', '/api/validate-production', '/api/review']) {
      const res = await middleware(request(path));
      expect(res.status, path).toBe(401);
    }
  });

  it('allows unauthenticated access to /api/diagnostic for deployment health checks', async () => {
    const res = await middleware(request('/api/diagnostic'));
    expect(res.headers.get('x-middleware-next')).toBe('1');
  });

  it('accepts a Bearer token', async () => {
    const res = await middleware(
      request('/api/ingest', { headers: { authorization: `Bearer ${TOKEN}` } })
    );
    expect(res.headers.get('x-middleware-next')).toBe('1');
  });

  it('accepts the x-lexis-token header', async () => {
    const res = await middleware(request('/api/ingest', { headers: { 'x-lexis-token': TOKEN } }));
    expect(res.headers.get('x-middleware-next')).toBe('1');
  });

  it('redirects pages to /unlock, preserving share-target params', async () => {
    const res = await middleware(request('/add?text=homuncular&title=Essay'));
    expect(res.status).toBe(307);
    const location = new URL(res.headers.get('location')!);
    expect(location.pathname).toBe('/unlock');
    expect(location.searchParams.get('next')).toBe('/add?text=homuncular&title=Essay');
  });

  it('issues a session cookie for the right token that then authorizes requests', async () => {
    const bad = await createSession(
      new NextRequest('http://localhost:3000/api/session', {
        method: 'POST',
        body: JSON.stringify({ token: 'wrong' }),
      })
    );
    expect(bad.status).toBe(401);

    const good = await createSession(
      new NextRequest('http://localhost:3000/api/session', {
        method: 'POST',
        body: JSON.stringify({ token: TOKEN }),
      })
    );
    expect(good.status).toBe(200);
    const cookieValue = good.cookies.get(SESSION_COOKIE)?.value;
    expect(cookieValue).toBeTruthy();
    expect(cookieValue).not.toContain(TOKEN);

    const res = await middleware(request('/review', { cookie: `${SESSION_COOKIE}=${cookieValue}` }));
    expect(res.headers.get('x-middleware-next')).toBe('1');
  });

  it('lets every request through when LEXIS_SECRET_TOKEN is not set (open mode)', async () => {
    vi.stubEnv('LEXIS_SECRET_TOKEN', '');
    const api = await middleware(request('/api/cards'));
    expect(api.headers.get('x-middleware-next')).toBe('1');

    const page = await middleware(request('/lexicon'));
    expect(page.headers.get('x-middleware-next')).toBe('1');
  });

  it('only allows same-origin relative redirects after unlocking', () => {
    expect(sanitizeNextPath('/add?text=x')).toBe('/add?text=x');
    expect(sanitizeNextPath('//evil.example')).toBe('/');
    expect(sanitizeNextPath('https://evil.example')).toBe('/');
    expect(sanitizeNextPath(null)).toBe('/');
  });
});
