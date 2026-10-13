import { NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';
import { fallbackLng, languages, cookieName } from './app/i18n/setting';

acceptLanguage.languages(languages);

export const config = {
  // Sitemap and robots must be reachable at the site root, with no language prefix.
  matcher: [
    '/((?!api(?:/|$)|_next/static|_next/image|static(?:/|$)|favicon.ico|sw.js|robots.txt|sitemap.xml).*)'
  ]
};

export function middleware(req: any) {
  let lng;
  if (req.cookies.has(cookieName)) {
    lng = acceptLanguage.get(req.cookies.get(cookieName).value);
  }
  if (!lng) lng = acceptLanguage.get(req.headers.get('Accept-Language'));
  if (!lng) lng = fallbackLng;

  const pathname = req.nextUrl.pathname;
  const hasLocale = languages.some((loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`));
  if (!hasLocale) {
    const target = req.nextUrl.clone();
    target.pathname = `/${lng}${pathname === '/' ? '' : pathname}`;
    return NextResponse.redirect(target, 308);
  }

  const response = NextResponse.next();
  if (req.headers.has('referer')) {
    try {
      const refererUrl = new URL(req.headers.get('referer'));
      if (refererUrl.origin === req.nextUrl.origin) {
        const refererLanguage = languages.find((l) => refererUrl.pathname === `/${l}` || refererUrl.pathname.startsWith(`/${l}/`));
        if (refererLanguage) response.cookies.set(cookieName, refererLanguage);
      }
    } catch {
      // Ignore invalid Referer headers.
    }
  }
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  return response;
}
