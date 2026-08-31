import type { Metadata } from 'next';
import Footer from '@/components/home/Footer';
import Navbar from '@/components/common/Navbar';
import ScrollUpButton from '@/components/common/ScrollUpButton';
import { SITE_URL } from '@/utils/site';
import { dir } from 'i18next';
import { languages } from 'app/i18n/setting';
import './globals.css';
import { useLang } from 'stores/langStore';

const siteTitle = 'NovaNest Holding';
const siteDescription =
  'NovaNest Holding connects entrepreneurs, startups, investors, and partners through investment, acceleration, entrepreneurship, and business development opportunities.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: siteTitle,
  description: siteDescription,
  applicationName: siteTitle,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: SITE_URL,
    siteName: siteTitle,
    type: 'website',
    images: [
      {
        url: '/static/images/novanest-holding.png',
        width: 1000,
        height: 1000,
        alt: 'NovaNest Holding',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: siteTitle,
    description: siteDescription,
    images: ['/static/images/novanest-holding.png'],
  },
};

export async function generateStaticParams() {
  return languages.map((lang) => ({ lang }));
}

export default function RootLayout({
  params: { lang },
  children,
}: {
  params: { lang: string };
  children: React.ReactNode;
}) {
  useLang.setState({
    lang,
  });

  return (
    <html lang={lang} dir={dir(lang)}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/apple-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/apple-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />

        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="theme-color" content="#ffffff" />
      </head>

      <body>
        <Navbar lang={lang} />
        <main className="w-full mx-auto">{children}</main>
        <Footer lang={lang} />
        <ScrollUpButton />
      </body>
    </html>
  );
}
