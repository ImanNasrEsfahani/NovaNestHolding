import React from 'react';
import { Metadata } from 'next';
import { getServerTranslation } from 'app/i18n';

import Banner from '@/components/common/Banner';
import Intro from '@/components/common/Intro';
import InvestmentSection from '@/components/investment/InvestmentSection';
import WhyChoose from '@/components/investment/WhyChoose';
import Priority from '@/components/home/Priority';
// import InvestorRegistrationForm from '@/components/investor-registration/InvestorRegistrationForm';
import SmallReservationForm from '@/components/common/form/SmallReservationForm';

export const metadata: Metadata = {
  title: 'NovaNest Venture | Investment',
  description:
    'Welcome to NovaNest Venture, where innovation meets excellence. Explore our diverse portfolio, discover our commitment to sustainable growth, and join us on a journey towards a brighter future.'
};

export default function Page({
  params: { lang }
}: {
  params: { lang: string };
}) {
  const { t } = getServerTranslation(lang, 'investment');
  const { t: tMainPage } = getServerTranslation(lang, 'mainPage');

  return (
    <>
      <div className="hidden md:inline">
        <Banner
          image="/static/images/investment/investment-hero.webp"
          title={t('banner')}
          lang={lang}
        />
      </div>
      <div className="inline md:hidden">
        <Banner
          image="/static/images/investment/mobile-hero.jpg"
          title={t('banner')}
          lang={lang}
        />
      </div>

      <Intro
        title={t('intro', { returnObjects: true }).title}
        subtitle={t('intro', { returnObjects: true }).subtitle}
        description={t('intro', { returnObjects: true }).description}
      />

      <InvestmentSection lang={lang} />
      
      <WhyChoose lang={lang} />

      <Priority
        Priorities={tMainPage('Priorities', { returnObjects: true })}
        cardData={(tMainPage('cardData1', { returnObjects: true }) || []) as Array<{ title: string; image: string }>}
      />

      {/* <iframe src='https://outlook.office.com/book/NovaNestConsulting@landatrip.com/?ismsaljsauthenabled' width='100%' height='2000px%' scrolling='yes'></iframe> */}
      {/* <InvestorRegistrationForm lang={lang} /> */}
      <div className="max-w-responsive mx-auto lg:px-4 mb-16 lg:mb-24">
        <SmallReservationForm
          lang={lang}
          subject='investment'
        />
      </div>
    </>
  );
}
