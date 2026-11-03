import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/utils/site';

export default function robots(): MetadataRoute.Robots {
  return {
    // Let search crawlers fetch Next.js client assets so pages can render.
    // Private backend routes are not linked from the public sitemap.
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/admin/'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
