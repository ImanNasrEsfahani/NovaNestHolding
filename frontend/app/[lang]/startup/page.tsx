import Banner from '@/components/common/Banner';
import { getServerTranslation } from 'app/i18n';
import Image from 'next/image';
import TwoColumnShowcase from '@/components/startup/TwoColumnShowcase';
import Intro from '@/components/common/Intro';
import WhoCanApply from '@/components/startup/WhoCanApply';
import Why from '@/components/startup/Why';
import SmallReservationForm from '@/components/common/form/SmallReservationForm';
import Accordions from '@/components/startup/Accordions';
import Priority from '@/components/home/Priority';
import ButtonRefactor from '@/components/common/ButtonRefactor';
import DownloadGuidePanel from '@/components/DownloadGuidePanel';
import ServicesSection from '@/components/common/ServicesSection';
import GoldenListCards from '@/components/common/GoldenListCards';


export default function StartUp({ params: { lang } }: { params: { lang: string } }) {
  const { t: tStartup } = getServerTranslation(lang, 'startUp');
  const benefits = tStartup('faq', { returnObjects: true }) as Array<{
    id: string;
    title: string;
    items: string[];
  }>;

  // Build accordion-friendly data
  const accordionData = [
    ...benefits.map((b) => ({
      header: `${b.title}`,
      content: b.items
    }))
  ];

  return (
    <>
      <div className='hidden md:inline'>
        <Banner
          image="/static/images/startup/header.png"
          title={tStartup('banner')}
          lang={lang}
          backgroundPosition="top center"
          backgroundSize="cover"
        />
      </div>
      <div className='inline md:hidden'>
        <Banner
          image="/static/images/startup/header-mobile.png"
          title={tStartup('banner')}
          lang={lang}
          backgroundPosition="top center"
          backgroundSize="cover"
        />
      </div>

      <Intro
        title={tStartup('whatIsStartupVisa.title')}
        subtitle={tStartup('whatIsStartupVisa.subtitle')}
        description={tStartup('whatIsStartupVisa.description')}
      />

      <WhoCanApply lang={lang} />

      <GoldenListCards
        title={tStartup('Requirements.title', { returnObjects: true })}
        items={tStartup('Requirements.list', { returnObjects: true })}
        iconSrc="/static/images/startup/circle-check.svg"
      />

      <ServicesSection
        title={tStartup('services.title')}
        description={tStartup('services.description')}
        serviceDetails={tStartup('services.serviceDetails', { returnObjects: true })}
        image={{ src: tStartup('services.image.src'), alt: tStartup('services.image.alt') }}
        descriptionIsHtml={true}
      />

      <Priority
        Priorities={tStartup('benefits.title', { returnObjects: true })}
        cardData={(tStartup('benefits.list', { returnObjects: true }) || []) as Array<{ title: string; image: string }>}
        mobileCol={1}
      />

      <Why lang={lang} />

      <section className='w-full max-w-5xl mx-auto py-9 lg:py-24 px-4 w-100 lg:px-16'>
        <h3 className="text-3xl font-header font-bold text-gray-800 text-center mb-12">{tStartup("StartupVisaRoadmap")}</h3>
        <Image
          src="/static/images/startup/startup-visa-canada-roadmap.png"
          alt="SUV startup roadmap"
          className="mx-auto w-full max-w-full rounded-lg"
          width={1800}
          height={2400}
        />
      </section>

      {/* Latest Startups */}
      <section className='max-w-responsive mx-auto pt-12 px-4 w-100 lg:px-16 space-y-16 mb-16'>
        <h2 className="text-3xl font-header font-bold text-gray-800 text-center mb-12">{tStartup("LatestStartups", { returnObjects: true })}</h2>
        {tStartup('latest-startups', { returnObjects: true }).map(
          (startup: {
            title: string;
            description: string;
            buttonText: string;
            buttonUrl: string;
            imageSrc: string;
            imageAlt: string;
            imageLogoSrc: string;
            imageLogoAlt: string;
          }, idx: number) => (
            <TwoColumnShowcase
              key={startup.title}
              title={startup.title}
              description={startup.description}
              buttonText={startup.buttonText}
              buttonUrl={startup.buttonUrl}
              imageSrc={startup.imageSrc}
              imageAlt={startup.imageAlt}
              imageLogoSrc={startup.imageLogoSrc}
              imageLogoAlt={startup.imageLogoAlt}
              reverse={idx % 2 === 1}
              className={idx !== 0 ? "pt-12 lg:pt-32" : ""}
            />
          )
        )}
      </section>

      <section id="startup-application-form" className='max-w-responsive mx-auto py-12 lg:px-4 w-100'>
        <SmallReservationForm
          lang={lang}
          subject='startup'
        />
      </section>

      <section className="w-full max-w-responsive mx-auto pt-12 lg:pt-32" >
        <h2 className="text-center text-3xl font-header md:text-4xl font-bold mb-4 text-gray-800">FAQ (Frequently Asked Question)</h2>

        <div className="w-full max-w-4xl mx-auto pt-9 py-12">
          <Accordions data={accordionData} />
        </div>
      </section>


      <DownloadGuidePanel
          tagLabel={tStartup('download.tagLabel', { returnObjects: true })}
          heading={tStartup('download.heading', { returnObjects: true })}
          description={tStartup('download.description', { returnObjects: true })}
          bullets={tStartup('download.bullets', { returnObjects: true })}
          href={tStartup('download.href', { returnObjects: true })}
          buttonLabel={tStartup('download.buttonLabel', { returnObjects: true })}
          thumbnail={tStartup('download.thumbnail', { returnObjects: true })}
          fileName={tStartup('download.fileName', { returnObjects: true })}
          fileSize={tStartup('download.fileSize', { returnObjects: true })}
      />
    </>
  )
}
