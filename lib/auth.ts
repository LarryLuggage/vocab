import type { NextRequest } from 'next/server';

// ============================================================================
// Single-User Token Auth
// ----------------------------------------------------------------------------
// Every page and API route is gated by LEXIS_SECRET_TOKEN (see middleware.ts).
// Remote clients (Chrome extension, Zotero script) present the token as a
// header; the web UI exchanges it once at /unlock for an httpOnly cookie that
// holds a hash of the token. Rotating the token invalidates every cookie.
// There is no default token: when LEXIS_SECRET_TOKEN is unset, auth is off
// entirely (open mode) rather than guarded by a guessable value.
// ============================================================================

export const SESSION_COOKIE = 'lexis_session';
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export function getConfiguredToken(): string | null {
  const raw = process.env.LEXIS_SECRET_TOKEN?.trim();
  return raw ? raw : null;
}

// Constant-time comparison (Edge runtime has no crypto.timingSafeEqual)
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function sessionValueFor(token: string): Promise<string> {
  const data = new TextEncoder().encode(`lexis-session:v1:${token}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function extractPresentedToken(headers: Headers): string | null {
  const custom = headers.get('x-lexis-token');
  if (custom && custom.trim()) return custom.trim();

  const authHeader = headers.get('authorization');
  if (authHeader) {
    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    if (match) return match[1].trim();
  }
  return null;
}

export async function isRequestAuthorized(req: NextRequest, secret: string): Promise<boolean> {
  const presented = extractPresentedToken(req.headers);
  if (presented && safeEqual(presented, secret)) return true;

  const cookie = req.cookies.get(SESSION_COOKIE)?.value;
  if (cookie && safeEqual(cookie, await sessionValueFor(secret))) return true;

  return false;
}

// Only allow same-origin relative redirects after unlocking
export function sanitizeNextPath(next: string | null | undefined): string {
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) {
    return '/';
  }
  return next;
}
