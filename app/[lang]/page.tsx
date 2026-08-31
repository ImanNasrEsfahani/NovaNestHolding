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

import Intro from "@/components/common/Intro";

export const metadata: Metadata = {
  title: 'NovaNest Holding',
  description:
    'NovaNest Holding connects entrepreneurs, startups, investors, and partners through investment, acceleration, entrepreneurship, and business development opportunities.',
};

export default function Page({ params }: { params: { lang: string } }) {
  const { t } = getServerTranslation(params.lang, 'mainPage');
  const { t: tPNP } = getServerTranslation(params.lang, 'pnp');
  const { t: tStartup } = getServerTranslation(params.lang, 'startUp');

  const base = process.env.NEXT_PUBLIC_BASE_URL || "";
  return (
    <>
      <Hero
        lang={params.lang}
        titles={[t('investment'), t('Acceleration'), t('Entrepreneurship - PNP')]}
        backgroundImage="hero.webp"
      />
      <section className='w-full max-w-responsive mx-auto w-100'>
        <AboutUs
          lang={params.lang}
          translations={{
              AboutUs: t('AboutUs'),
              AboutUsContent: t('AboutUsContent'),
              ReadMore: t('ReadMore'),
          }}
          href={`${base}/about-us`}
        />

        <HomeCardsContainer lang={params.lang} />
        <SpecialFeatures lang={params.lang} />
        {/* <Intro
          title={tStartup('whatIsStartupVisa.title')}
          subtitle={tStartup('whatIsStartupVisa.subtitle')}
          description={tStartup('whatIsStartupVisa.description')}
        />
        <ServicesSection
          title={tStartup('services.title')}
          description={tStartup('services.description')}
          serviceDetails={tStartup('services.serviceDetails', { returnObjects: true })}
          image={{ src: tStartup('services.image.src'), alt: tStartup('services.image.alt') }}
          descriptionIsHtml={true}
        /> */}
        <div className="max-w-xs mx-auto mb-24">
          <ButtonRefactor text={t('ReserveMyFreeConsultation')} type="simple-link" href={`${base}${params.lang}/startup/#startup-application-form`} />
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
          image={{ src: tPNP('services.image.src'), alt: tStartup('services.image.alt') }}
          descriptionIsHtml={true}
        />
        <div className="max-w-xs mx-auto mb-16 md:mb:24">
          <ButtonRefactor text={t('ReserveMyFreeConsultation')} type="simple-link" href={`${base}${params.lang}/pnp/#pnp-application-form`} />
        </div>

        <Academy lang={params.lang} />
        <HalvesCards lang={params.lang} />
        <LatestStartups lang={params.lang} />
        <Differentiators lang={params.lang} />
        <Priority
          Priorities={t('Priorities', { returnObjects: true })}
          cardData={(t('cardData1', { returnObjects: true }) || []) as Array<{ title: string; image: string }>}
         />
      </section>
    </>
  );
}
