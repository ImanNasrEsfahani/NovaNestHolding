import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServerTranslation } from 'app/i18n';
import AffiliateProfile from '@/components/our-team/AffiliateProfile';
import type { AffiliatePartner, AffiliatesContent } from '@/components/our-team/AffiliateTypes';
import { createPageMetadata, safeSocialImage } from '@/utils/socialMetadata';
import { SITE_URL } from '@/utils/site';

type Params = { params: { lang: string; slug: string } };

function contentFor(lang: string): AffiliatesContent {
  const { t } = getServerTranslation(lang === 'fa' ? 'fa' : 'en', 'ourTeamAffiliates');
  return t('affiliates', { returnObjects: true }) as unknown as AffiliatesContent;
}

function findPartner(lang: string, slug: string) {
  const content = contentFor(lang);
  const partner = (content.partners || []).find((item: AffiliatePartner) => item.slug === slug);
  return { content, partner };
}

export function generateMetadata({ params: { lang, slug } }: Params): Metadata {
  const { partner } = findPartner(lang, slug);
  if (!partner) return createPageMetadata({ title: 'Affiliate | NovaNest Holding' });

  const social = partner.social?.profile;
  const socialImage = safeSocialImage(social?.image);
  return createPageMetadata({
    title: `${partner.name} | NovaNest Holding`,
    description: partner.description || partner.category,
    socialTitle: social?.title || `NovaNest Holding × ${partner.name} | Affiliate Partnership`,
    socialDescription: social?.description ||
      `Discover the collaboration between NovaNest Holding and ${partner.name}. Explore the affiliate partner profile and services.`,
    image: socialImage ? {
      url: new URL(socialImage, SITE_URL).toString(),
      width: 1200,
      height: 1200,
      alt: `NovaNest Holding and ${partner.name} affiliate logos`,
    } : undefined,
    twitterCard: 'summary_large_image',
    path: `/${lang}/affiliate/${encodeURIComponent(slug)}`,
  });
}

export default function AffiliatePage({ params: { lang, slug } }: Params) {
  if (lang !== 'en' && lang !== 'fa') notFound();
  const { content, partner } = findPartner(lang, slug);
  if (!partner) notFound();

  const { t } = getServerTranslation(lang, 'formComponent');
  const formLabels = {
    formTitle: t('ContactProfileForm.formTitle'),
    formSubtitle: `${t('ContactProfileForm.formSubtitle')} · ${partner.name}`,
    firstName: t('firstName'),
    lastName: t('lastName'),
    email: t('email'),
    phoneNumber: t('phoneNumber'),
    message: t('contactForm.message'),
    firstNameRequired: t('firstNameRequired'),
    lastNameRequired: t('lastNameRequired'),
    emailRequired: t('emailRequired'),
    phoneNumberRequired: t('phoneNumberRequired'),
    messageRequired: t('contactForm.messageRequired'),
    sendButton: t('sendButton'),
    sendingButton: t('sendingButton'),
    successMessage: t('successMessage'),
    failedMessage: t('failedMessage')
  };

  return <AffiliateProfile partner={partner} content={content} lang={lang} formLabels={formLabels} />;
}
