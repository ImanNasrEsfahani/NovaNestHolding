import { Metadata } from 'next';
import { getServerTranslation } from 'app/i18n';
import Banner from '@/components/common/Banner';
import StartupFormForm from '@/components/startups-form/StartupFormForm';
import CallToAction from '@/components/common/CallToAction';
import Intro from '@/components/common/Intro';

export const metadata: Metadata = {
  title: 'NovaNest Venture | Startups',
  description:
    'Explore the NovaNest Venture Startup Form and share your innovative ideas with us. We are interested in hearing from startups and entrepreneurs. Lets work together to bring your vision to life.'
};

export default function StartupValidationPage({
  params: { lang }
}: {
  params: { lang: string };
}) {
  const { t } = getServerTranslation(lang, 'formComponent');

  return (
    <>
      <div className="hidden md:inline">
        <Banner
          image="/static/images/startup-validation-form/header.png"
          title={t('startUp', { returnObjects: true }).banner}
          lang={lang}
        />
      </div>
      <div className="inline md:hidden">
        <Banner
          image="/static/images/startup-validation-form/header-mobile.png"
          title={t('startUp', { returnObjects: true }).banner}
          lang={lang}
        />
      </div>

      <Intro
        title={t('startUp', { returnObjects: true }).title}
        subtitle={t('startUp', { returnObjects: true }).subtitle}
        description={(t('startUp', { returnObjects: true }).description || [])}
      />

      <CallToAction text={t("startUp.callToAction", { returnObject: true })} />
      <StartupFormForm lang={lang} />
    </>
  );
}
