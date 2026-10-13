import { NextResponse, type NextRequest } from 'next/server';
import { cookieName } from './app/i18n/setting';

export const config = {
  // Public SEO resources and static assets must stay at the site root.
  matcher: [
    '/((?!api(?:/|$)|_next/static|_next/image|static(?:/|$)|favicon.ico|sw.js|robots.txt|sitemap.xml).*)',
  ],
};

function withHeadersAndEnglishCookie(response: NextResponse, req: NextRequest): NextResponse {
  // Replace any previously saved Persian language preference.
  if (req.cookies.get(cookieName)?.value !== 'en') {
    response.cookies.set(cookieName, 'en', { path: '/', sameSite: 'lax' });
  }

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  return response;
}

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (pathname === '/en' || pathname.startsWith('/en/')) {
    return withHeadersAndEnglishCookie(NextResponse.next(), req);
  }

  // Retire the public Persian URLs but preserve the same destination,
  // query parameters and the ability to re-enable Persian later.
  const target = req.nextUrl.clone();
  if (pathname === '/fa') {
    target.pathname = '/en';
  } else if (pathname.startsWith('/fa/')) {
    target.pathname = `/en${pathname.slice(3)}`;
  } else {
    target.pathname = `/en${pathname === '/' ? '' : pathname}`;
  }

  return withHeadersAndEnglishCookie(NextResponse.redirect(target, 307), req);
}
