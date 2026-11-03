import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// The legacy Startup Visa page is no longer linked or included in the sitemap.
// Retain direct access for old bookmarks, but do not index the retired route.
export const metadata: Metadata = {
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function ArchivedStartupLayout({ children }: { children: ReactNode }) {
  return children;
}
