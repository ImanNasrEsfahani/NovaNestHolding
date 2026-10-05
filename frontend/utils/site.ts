const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

if (!configuredSiteUrl && process.env.NODE_ENV === 'production') {
  throw new Error('NEXT_PUBLIC_SITE_URL must be configured in production');
}

export const SITE_URL = (configuredSiteUrl || 'http://localhost:3000').replace(/\/+$/, '');

const siteHostname = new URL(SITE_URL).hostname.toLowerCase().replace(/^www\./, '');
const absoluteHttpUrl = /^https?:\/\//i;
const protocolRelativeUrl = /^\/\//;
const hasScheme = /^[a-z][a-z\d+\-.]*:/i;

function isCurrentSite(hostname: string): boolean {
  return hostname.toLowerCase().replace(/^www\./, '') === siteHostname;
}

function normalizedPath(pathname: string): string {
  const path = pathname.replace(/\/{2,}/g, '/');
  return path.startsWith('/') ? path : `/${path}`;
}

function currentSiteUrlToPath(url: URL): string {
  return `${normalizedPath(url.pathname)}${url.search}${url.hash}`;
}

/**
 * Converts links that belong to this website into same-origin paths.
 * External URLs and non-http protocols (mailto:, tel:, etc.) are preserved.
 * This prevents internal navigation from ever jumping to a different hostname.
 */
export function appHref(href: string): string {
  const value = href.trim();

  if (!value) return '/';
  if (value.startsWith('#') || value.startsWith('?')) return value;

  if (absoluteHttpUrl.test(value)) {
    try {
      const url = new URL(value);
      return isCurrentSite(url.hostname) ? currentSiteUrlToPath(url) : value;
    } catch {
      return value;
    }
  }

  if (protocolRelativeUrl.test(value)) {
    try {
      const url = new URL(`https:${value}`);
      return isCurrentSite(url.hostname) ? currentSiteUrlToPath(url) : value;
    } catch {
      return value;
    }
  }

  if (hasScheme.test(value)) return value;

  return `/${value.replace(/^\/+/, '')}`;
}
