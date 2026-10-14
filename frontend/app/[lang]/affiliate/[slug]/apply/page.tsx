import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServerTranslation } from 'app/i18n';
import AffiliateProfile from '@/components/our-team/AffiliateProfile';
import type { AffiliatePartner, AffiliatesContent } from '@/components/our-team/AffiliateTypes';
import { createPageMetadata, safeSocialImage } from '@/utils/socialMetadata';
import { SITE_URL } from '@/utils/site';

type Params = { params: { lang: string; slug: string } };

function findPartner(slug: string) {
  // Read the same translation JSON and images as the public partner profile.
  const { t } = getServerTranslation('en', 'ourTeamAffiliates');
  const content = t('affiliates', { returnObjects: true }) as unknown as AffiliatesContent;
  const partner = (content.partners || []).find((item: AffiliatePartner) =>
    item.slug === slug && Boolean(item.primaryEmail) &&
    (item.emails ?? []).some(email => email.toLowerCase() === item.primaryEmail!.toLowerCase())
  );
  return { content, partner };
}

export function generateMetadata({ params: { lang, slug } }: Params): Metadata {
  const partner = lang === 'en' ? findPartner(slug).partner : undefined;
  if (!partner) {
    return createPageMetadata({
      title: 'Affiliate application | NovaNest Holding',
      robots: { index: false, follow: false },
    });
  }

  const social = partner.social?.application;
  const socialImage = safeSocialImage(social?.image);
  return createPageMetadata({
    title: `Apply with ${partner.name} | NovaNest Holding`,
    description: `Submit your application through ${partner.name}.`,
    socialTitle: social?.title || `NovaNest Holding × ${partner.name} | Affiliate Application`,
    socialDescription: social?.description ||
      `Apply to NovaNest Holding through our affiliate partner ${partner.name}. Complete your application using the secure partner form.`,
    image: socialImage
      ? {
          url: new URL(socialImage, SITE_URL).toString(),
          width: 1200,
          height: 1200,
          alt: `NovaNest Holding and ${partner.name} affiliate logos`,
        }
      : undefined,
    twitterCard: 'summary_large_image',
    path: `/${lang}/affiliate/${encodeURIComponent(slug)}/apply`,
    robots: { index: false, follow: false },
  });
}

export default function Page({ params: { lang, slug } }: Params) {
  // This application has been reviewed only in English. The profile itself also supports Persian.
  if (lang !== 'en') notFound();
  const { content, partner } = findPartner(slug);
  if (!partner) notFound();

  // The two pages have no direct navigation links. Both reuse this single profile
  // layout, with independent forms selected by formVariant.
  return <AffiliateProfile partner={partner} content={content} lang={lang} formVariant="application" />;
}
