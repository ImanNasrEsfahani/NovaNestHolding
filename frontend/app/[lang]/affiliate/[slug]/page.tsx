import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServerTranslation } from 'app/i18n';
import AffiliateProfile from '@/components/our-team/AffiliateProfile';
import type { AffiliatePartner, AffiliatesContent } from '@/components/our-team/AffiliateTypes';

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
  return partner
    ? { title: `${partner.name} | NovaNest Holding`, description: partner.description || partner.category }
    : { title: 'Affiliate | NovaNest Holding' };
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
