import Banner from '@/components/common/Banner';
import JoinAsaPartnerForm from '@/components/partner-membership/JoinAsaPartnerForm';
import { Metadata } from 'next';
import { getServerTranslation } from 'app/i18n';
// import CallToAction from '@/components/common/CallToAction';
import Intro from '@/components/common/Intro';

export const metadata: Metadata = {
  title: 'NovaNest Venture | Affiliate',
  description:
    'Explore the NovaNest Venture Affiliate Form and discover opportunities for collaboration and partnership. Join us in shaping the future of business together.'
};

export default async function AffiliateFormPage({
  params: { lang }
}: {
  params: { lang: string };
}) {
  const { t } = getServerTranslation(lang, 'formComponent');

  return (
    <>
      <div className="hidden md:inline">
        <Banner
          image="/static/images/affiliate-registeration-form/header.png"
          title={t('affiliateForm', { returnObjects: true }).banner}
          lang={lang}
        />
      </div>
      <div className="inline md:hidden">
        <Banner
          image="/static/images/affiliate-registeration-form/header-mobile.png"
          title={t('affiliateForm', { returnObjects: true }).banner}
          lang={lang}
        />
      </div>

      <Intro
        title={t("affiliateForm", { returnObjects: true }).title}
        subtitle={t("affiliateForm", { returnObjects: true }).subtitle}
        description={t("affiliateForm", { returnObjects: true }).description}
      />

      {/* <CallToAction text={t('affiliateForm', { returnObjects: true }).callToAction} /> */}

      <JoinAsaPartnerForm lang={lang} />
    </>
  );
}
