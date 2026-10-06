import { NextRequest, NextResponse } from 'next/server';
import { getConfiguredToken, isRequestAuthorized } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const isApi = pathname.startsWith('/api/');
  const secret = getConfiguredToken();

  // Open mode: with no LEXIS_SECRET_TOKEN set, auth is off and every request
  // passes. Setting the variable turns the gate on for all pages and routes.
  if (!secret) {
    return NextResponse.next();
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
