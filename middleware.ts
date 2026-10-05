import { NextRequest, NextResponse } from 'next/server';
import { getConfiguredToken, isRequestAuthorized } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const isApi = pathname.startsWith('/api/');
  const secret = getConfiguredToken();

  if (!secret) {
    if (isApi) {
      return NextResponse.json(
        { error: 'Server misconfigured: LEXIS_SECRET_TOKEN is not set.' },
        { status: 503 }
      );
    }
    return redirectToUnlock(req, pathname + search);
  }

  if (await isRequestAuthorized(req, secret)) {
    return NextResponse.next();
  }

  if (isApi) {
    return NextResponse.json(
      { error: 'Unauthorized: invalid or missing LEXIS_SECRET_TOKEN' },
      { status: 401 }
    );
  }
  return redirectToUnlock(req, pathname + search);
}

function redirectToUnlock(req: NextRequest, next: string) {
  const url = req.nextUrl.clone();
  url.pathname = '/unlock';
  url.search = next && next !== '/' ? `?next=${encodeURIComponent(next)}` : '';
  return NextResponse.redirect(url);
}

export const config = {
  // Everything except the unlock flow and assets the PWA install needs unauthenticated
  matcher: [
    '/((?!unlock|api/session|_next/static|_next/image|favicon\\.ico|icon\\.svg|manifest\\.json).*)',
  ],
};
