import { NextResponse, type NextRequest } from 'next/server';
import { cookieName } from './app/i18n/setting';

export const config = {
  // Public SEO resources and static assets must stay at the site root.
  matcher: [
    '/((?!api(?:/|$)|_next/static|_next/image|static(?:/|$)|favicon.ico|sw.js|robots.txt|sitemap.xml).*)',
  ],
};

// Persian is currently public ONLY for the two approved affiliate profiles
// and their dedicated application forms. Other Persian URLs remain retired.
const allowedPersianAffiliatePage =
  /^\/fa\/affiliate\/(?:sama-owj-middle-east|gohar-afarinan-farda)(?:\/apply)?\/?$/;

function withHeadersAndLanguageCookie(
  response: NextResponse,
  req: NextRequest,
  language: 'en' | 'fa'
): NextResponse {
  if (req.cookies.get(cookieName)?.value !== language) {
    response.cookies.set(cookieName, language, { path: '/', sameSite: 'lax' });
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
    return withHeadersAndLanguageCookie(NextResponse.next(), req, 'en');
  }

  // Keep these exact four Persian URLs (two profiles and two forms) in Persian.
  // This does not enable any other /fa page.
  if (allowedPersianAffiliatePage.test(pathname)) {
    return withHeadersAndLanguageCookie(NextResponse.next(), req, 'fa');
  }

  // Preserve the existing English-only behavior for every other route,
  // including query parameters and the existing redirect status.
  const target = req.nextUrl.clone();
  if (pathname === '/fa') {
    target.pathname = '/en';
  } else if (pathname.startsWith('/fa/')) {
    target.pathname = `/en${pathname.slice(3)}`;
  } else {
    target.pathname = `/en${pathname === '/' ? '' : pathname}`;
  }

  return withHeadersAndLanguageCookie(NextResponse.redirect(target, 307), req, 'en');
}
