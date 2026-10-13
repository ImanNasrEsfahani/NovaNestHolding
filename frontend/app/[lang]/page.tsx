import { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import SpecialFeatures from '@/components/home/SpecialFeatures';
import Differentiators from '@/components/about/Differentiators';
import Priority from '@/components/home/Priority';
import LatestStartups from '@/components/home/LatestStartups';
import HalvesCards from '@/components/home/HalvesCards';
import HomeCardsContainer from '@/components/home/HomeCardsContainer';
import Academy from '@/components/home/Academy';
import AboutUs from '@/components/home/AboutUs';
import ServicesSection from '@/components/common/ServicesSection';
import { getServerTranslation } from 'app/i18n';
import ButtonRefactor from '@/components/common/ButtonRefactor';
import Intro from '@/components/common/Intro';

export const metadata: Metadata = {
  title: 'NovaNest Holding',
  description: 'NovaNest Holding connects entrepreneurs, startups, investors, and partners through investment, acceleration, entrepreneurship, and business development opportunities.'
};

export default function Page({ params }: { params: { lang: string } }) {
  const { t } = getServerTranslation(params.lang, 'mainPage');
  const { t: tPNP } = getServerTranslation(params.lang, 'pnp');
  const lang = params.lang === 'fa' ? 'fa' : 'en';

  return (
    <>
      <Hero lang={lang} titles={[t('investment'), t('Acceleration'), t('Entrepreneurship - PNP')]} backgroundImage="hero.webp" />
      <section className="w-full max-w-responsive mx-auto w-100">
        <AboutUs
          lang={lang}
          translations={{ AboutUs: t('AboutUs'), AboutUsContent: t('AboutUsContent'), ReadMore: t('ReadMore') }}
          href={`/${lang}/about-us`}
        />
        <HomeCardsContainer lang={lang} />
        <SpecialFeatures lang={lang} />
        <div className="max-w-xs mx-auto mb-24">
          <ButtonRefactor text={t('ReserveMyFreeConsultation')} type="simple-link" href={`/${lang}/startup/#startup-application-form`} />
        </div>
        <Intro
          title={tPNP('Intro.title', { returnObjects: true })}
          subtitle={tPNP('Intro.subtitle', { returnObjects: true })}
          description={tPNP('Intro.description', { returnObjects: true })}
        />
        <ServicesSection
          title={tPNP('services.title')}
          description={tPNP('services.description')}
          serviceDetails={tPNP('services.serviceDetails', { returnObjects: true })}
          image={{ src: tPNP('services.image.src'), alt: tPNP('services.image.alt') }}
          descriptionIsHtml={true}
        />
        <div className="max-w-xs mx-auto mb-16 md:mb:24">
          <ButtonRefactor text={t('ReserveMyFreeConsultation')} type="simple-link" href={`/${lang}/pnp/#pnp-application-form`} />
        </div>
        <Academy lang={lang} />
        <HalvesCards lang={lang} />
        <LatestStartups lang={lang} />
        <Differentiators lang={lang} />
        <Priority
          Priorities={t('Priorities', { returnObjects: true })}
          cardData={(t('cardData1', { returnObjects: true }) || []) as Array<{ title: string; image: string }>}
        />
      </section>
    </>
  );
}
