import type { Metadata } from 'next';
import { SITE_URL } from '@/utils/site';

/** The single source of truth for share-preview fallbacks. */
export const DEFAULT_SITE_TITLE = 'NovaNest Holding';
export const DEFAULT_SITE_DESCRIPTION =
  'NovaNest Holding connects entrepreneurs, startups, investors, and partners through investment, acceleration, entrepreneurship, and business development opportunities.';
export const DEFAULT_SOCIAL_IMAGE = '/static/images/novanest-holding.png';

type SocialImage = {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
};

/**
 * Page-level metadata. Every optional field falls back independently, so a page
 * may provide only a title, only an image, or any other combination.
 *
 * `socialTitle` and `socialDescription` customize link previews without changing
 * the ordinary browser/SEO title and meta description.
 */
export type PageMetadataOptions = {
  title?: string | null;
  description?: string | null;
  socialTitle?: string | null;
  socialDescription?: string | null;
  image?: string | SocialImage | null;
  path?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  robots?: Metadata['robots'];
};

function withFallback(value: string | null | undefined, fallback: string): string {
  return value?.trim() || fallback;
}

function resolveSocialImage(image: PageMetadataOptions['image'], alt: string): SocialImage {
  if (!image) {
    return {
      url: DEFAULT_SOCIAL_IMAGE,
      width: 1000,
      height: 1000,
      alt: DEFAULT_SITE_TITLE,
    };
  }

  if (typeof image === 'string') {
    return image.trim()
      ? { url: image.trim(), alt }
      : resolveSocialImage(null, alt);
  }

  return image.url?.trim()
    ? { ...image, url: image.url.trim(), alt: image.alt || alt }
    : resolveSocialImage(null, alt);
}

/**
 * Set page-specific Open Graph and Twitter tags explicitly. In Next.js 13,
 * nested metadata objects are shallow-merged; changing a page's `title`
 * alone does NOT replace its inherited `openGraph.title`.
 *
 * Pages without their own metadata inherit the defaults from [lang]/layout.tsx.
 * Pages using this function inherit missing individual values from above.
 */
export function createPageMetadata(options: PageMetadataOptions = {}): Metadata {
  const title = withFallback(options.title, DEFAULT_SITE_TITLE);
  const description = withFallback(options.description, DEFAULT_SITE_DESCRIPTION);
  const socialTitle = withFallback(options.socialTitle, title);
  const socialDescription = withFallback(options.socialDescription, description);
  const image = resolveSocialImage(options.image, socialTitle);

  // Do not incorrectly identify an arbitrary page as the home page.
  // Pages with a known route can supply their actual localized path.
  const pageUrl = options.path ? new URL(options.path, `${SITE_URL}/`).toString() : undefined;

  return {
    title,
    description,
    openGraph: {
      title: socialTitle,
      description: socialDescription,
      siteName: DEFAULT_SITE_TITLE,
      type: 'website',
      ...(pageUrl ? { url: pageUrl } : {}),
      images: [image],
    },
    twitter: {
      card: options.twitterCard || 'summary',
      title: socialTitle,
      description: socialDescription,
      images: [image.url],
    },
    ...(options.robots !== undefined ? { robots: options.robots } : {}),
  };
}

/** Restrict schema-controlled affiliate social images to local public image assets. */
export function safeSocialImage(path?: string | null): string | undefined {
  return path && /^\/static\/images\/[a-z0-9/_-]+\.(png|jpe?g|webp|svg)$/i.test(path) && !path.includes('..')
    ? path
    : undefined;
}
