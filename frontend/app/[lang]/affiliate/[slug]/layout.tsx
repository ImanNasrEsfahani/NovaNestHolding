import type { Metadata } from 'next';

// Affiliate-only tab icon; keep the existing site favicon and bypass stale browser cache.
export const metadata: Metadata = {
  icons: {
    icon: [
      { url: '/favicon.ico?v=affiliate-20261014', sizes: 'any', type: 'image/x-icon' },
      { url: '/favicon-32x32.png?v=affiliate-20261014', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico?v=affiliate-20261014',
  },
};

export default function AffiliateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
