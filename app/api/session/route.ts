import { NextRequest, NextResponse } from 'next/server';
import {
  getConfiguredToken,
  safeEqual,
  sessionValueFor,
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
} from '@/lib/auth';

// POST { token } -> sets the session cookie used by the web UI
export async function POST(req: NextRequest) {
  const secret = getConfiguredToken();
  if (!secret) {
    return NextResponse.json(
      { error: 'Server misconfigured: LEXIS_SECRET_TOKEN is not set. Add it to the deployment environment and redeploy.' },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const token = typeof body.token === 'string' ? body.token.trim() : '';
  if (!token || !safeEqual(token, secret)) {
    return NextResponse.json({ error: 'Incorrect token.' }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set(SESSION_COOKIE, await sessionValueFor(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return res;
}

// DELETE -> signs this browser out
export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
