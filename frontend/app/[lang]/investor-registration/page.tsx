import Banner from '@/components/common/Banner';
import InvestorRegistrationForm from '@/components/investor-registration/InvestorRegistrationForm';
import { Metadata } from 'next';
import { getServerTranslation } from 'app/i18n';
import CallToAction from '@/components/common/CallToAction';
import Intro from '@/components/common/Intro';

export const metadata: Metadata = {
  title: 'NovaNest Venture | Investors',
  description:
    'Explore the NovaNest Venture Investor Center, your gateway to comprehensive financial information, reports, and updates. Stay informed about our financial performance and investment opportunities.',
};

export default function InvestorRegistrationPage({
  params: { lang },
}: {
  params: { lang: string };
}) {

  const { t } = getServerTranslation(lang, "investorForm")

  return (
    <>
      <div className="hidden md:inline">
        <Banner
          image="/static/images/investor-registeration-form/header.png"
          title={t('banner', { returnObjects: true })}
          lang={lang}
          backgroundPosition='top'
          backgroundSize='cover'
        />
      </div>
      <div className="inline md:hidden">
        <Banner
          image="/static/images/investor-registeration-form/header-mobile.png"
          title={t('banner', { returnObjects: true })}
          lang={lang}
          backgroundPosition='center'
          backgroundSize='cover'
        />
      </div>

      <Intro
        title={t("title", { returnObject: true })}
        subtitle={t("subtitle", { returnObject: true })}
        description={t('description', { returnObjects: true }) as string | string[]}
      />

      {/* <CallToAction text={t("callToAction", { returnObject: true })} /> */}

      <InvestorRegistrationForm lang={lang} />
    </>
  );
}
