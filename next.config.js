/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === 'production';
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || (isProduction ? '' : 'http://localhost:3000');

if (!configuredSiteUrl) {
  throw new Error('NEXT_PUBLIC_SITE_URL must be configured in production');
}

const siteUrl = configuredSiteUrl.replace(/\/+$/, '');
const siteHostname = new URL(siteUrl).hostname.replace(/^www\./, '');
const legacyBaseUrl = `${siteUrl}/`;

// Keep old code compatible, but derive it from the single canonical source.
// A stale NEXT_PUBLIC_BASE_URL from the server can no longer redirect users
// to another domain because this value is overwritten from NEXT_PUBLIC_SITE_URL.
process.env.NEXT_PUBLIC_SITE_URL = siteUrl;
process.env.NEXT_PUBLIC_BASE_URL = legacyBaseUrl;

const nextConfig = {
  // output: 'standalone',
  reactStrictMode: true,
  // output: "export",
  // distDir: 'out',
  env: {
    NEXT_PUBLIC_SITE_URL: siteUrl,
    NEXT_PUBLIC_BASE_URL: legacyBaseUrl,
  },
  images: {
    domains: [
      // 'res.cloudinary.com',
      `panel-back.${siteHostname}`,
      `panel.${siteHostname}`,
      siteHostname,
      'localhost',
      `nova-back.${siteHostname}`
    ],
    unoptimized: false,
  },
  async rewrites() {
    return [
      {
        source: '/static/:path*',
        destination: '/static/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
