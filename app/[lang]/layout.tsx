import type { Metadata } from 'next';
import Footer from '@/components/home/Footer';
import Navbar from '@/components/common/Navbar';
import ScrollUpButton from '@/components/common/ScrollUpButton';
import { SITE_URL } from '@/utils/site';
import { dir } from 'i18next'
import { languages } from 'app/i18n/setting'
import './globals.css';
import { useLang } from 'stores/langStore';
// import { EB_Garamond } from 'next/font/google'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

export async function generateStaticParams() {
  return languages.map((lang) => ({ lang }));
}

export default function RootLayout({
  params: { lang },
  children
}: {
  params: { lang: string };
  children: React.ReactNode;
}) {

  // const i18next = require("i18next");

  // i18next.loadLanguages(["en", "fa"]);

  useLang.setState({
    lang: lang
  })

  

  // const { rendered } = useLang.getState();

  return (
    <html lang={lang} dir={dir(lang)}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=0.9" />
      </head>
      <body>
        <Navbar lang={lang} />
        <main className="w-full mx-auto">
          {children}
        </main>
        <Footer lang={lang} />
        <ScrollUpButton />
      </body>
    </html>
  );
}
