import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServerTranslation } from 'app/i18n';
import AffiliateProfile from '@/components/our-team/AffiliateProfile';
import type { AffiliatePartner, AffiliatesContent } from '@/components/our-team/AffiliateTypes';
import { createPageMetadata, safeSocialImage } from '@/utils/socialMetadata';
import { SITE_URL } from '@/utils/site';

type Params = { params: { lang: string; slug: string } };

// Only the two reviewed affiliate applications are enabled in Persian.
const PERSIAN_APPLICATIONS = new Set(['sama-owj-middle-east', 'gohar-afarinan-farda']);

function supportedLanguage(lang: string, slug: string): boolean {
  return lang === 'en' || (lang === 'fa' && PERSIAN_APPLICATIONS.has(slug));
}

function findPartner(lang: string, slug: string) {
  const { t } = getServerTranslation(lang === 'fa' ? 'fa' : 'en', 'ourTeamAffiliates');
  const content = t('affiliates', { returnObjects: true }) as unknown as AffiliatesContent;
  // The same registry rules and email recipients apply in both languages.
  const partner = (content.partners || []).find((item: AffiliatePartner) =>
    item.slug === slug && Boolean(item.primaryEmail) &&
    (item.emails ?? []).some(email => email.toLowerCase() === item.primaryEmail!.toLowerCase())
  );
  return { content, partner };
}

export function generateMetadata({ params: { lang, slug } }: Params): Metadata {
  const partner = supportedLanguage(lang, slug) ? findPartner(lang, slug).partner : undefined;
  if (!partner) {
    return createPageMetadata({
      title: 'Affiliate application | NovaNest Holding',
      robots: { index: false, follow: false },
    });
  }

  const isFa = lang === 'fa';
  const social = partner.social?.application;
  const socialImage = safeSocialImage(social?.image);
  return createPageMetadata({
    title: isFa ? `درخواست از طریق ${partner.name} | نووانست هلدینگ` : `Apply with ${partner.name} | NovaNest Holding`,
    description: isFa ? `ثبت درخواست از طریق ${partner.name}.` : `Submit your application through ${partner.name}.`,
    socialTitle: social?.title || (isFa
      ? `نووانست هلدینگ × ${partner.name} | فرم درخواست افیلیت`
      : `NovaNest Holding × ${partner.name} | Affiliate Application`),
    socialDescription: social?.description || (isFa
      ? `درخواست خود را از طریق افیلیت ${partner.name} در نووانست هلدینگ ثبت کنید.`
      : `Apply to NovaNest Holding through our affiliate partner ${partner.name}. Complete your application using the secure partner form.`),
    image: socialImage
      ? {
          url: new URL(socialImage, SITE_URL).toString(),
          width: 1200,
          height: 1200,
          alt: isFa ? `لوگوی نووانست هلدینگ و ${partner.name}` : `NovaNest Holding and ${partner.name} affiliate logos`,
        }
      : undefined,
    twitterCard: 'summary_large_image',
    path: `/${lang}/affiliate/${encodeURIComponent(slug)}/apply`,
    robots: { index: false, follow: false },
  });
}

export default function Page({ params: { lang, slug } }: Params) {
  if (!supportedLanguage(lang, slug)) notFound();
  const { content, partner } = findPartner(lang, slug);
  if (!partner) notFound();

  // Reuse the exact English layout; its direction is inherited from the locale.
  // The form keeps its original backend payload and validation in both languages.
  return <AffiliateProfile partner={partner} content={content} lang={lang} formVariant="application" />;
}
