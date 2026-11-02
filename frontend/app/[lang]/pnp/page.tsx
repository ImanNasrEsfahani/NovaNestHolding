import { getServerTranslation } from 'app/i18n';
import Banner from '@/components/common/Banner';
import Intro from '@/components/common/Intro';
import WhyStartBusiness from '@/components/pnp/WhyStartBusiness';
import Requirement from '@/components/pnp/Requirement';
import Why from '@/components/pnp/Why';
import SmallReservationForm from '@/components/common/form/SmallReservationForm';
import Accordions from '@/components/startup/Accordions';
import DownloadGuidePanel from '@/components/DownloadGuidePanel';
import ServicesSection from '@/components/common/ServicesSection';
import Businesses from '@/components/pnp/Businesses';
import ProvinceComparison from '@/components/pnp/ProvinceComparison';
import GovernmentFeeSchedule from '@/components/pnp/GovernmentFeeSchedule';
import PnpEntrepreneurTimeline from '@/components/pnp/PnpEntrepreneurTimeline';

export default function pnp({ params: { lang } }: { params: { lang: string } }) {
  const { t } = getServerTranslation(lang, 'pnp');
  const benefits = t('faq', { returnObjects: true }) as Array<{ id: string; title: string; items: string[] }>;
  // Replace the outdated 'popular provinces' FAQ with a verified, linked comparison table.
  const accordionData = benefits
    .filter((b) => b.title !== 'Which provinces are currently popular for starting a business?')
    .map((b) => ({ header: b.title, content: b.items }));

  const businessesHeading = lang === 'fa'
    ? 'نمونه کسب‌وکارهایی که مشتریان ما راه‌اندازی کرده‌اند'
    : 'Examples of businesses our clients have opened';

  return (
    <>
      <div className="hidden md:inline"><Banner image="/static/images/pnp/pnp-banner.png" title={t('banner')} lang={lang} /></div>
      <div className="inline md:hidden"><Banner image="/static/images/pnp/pnp-banner-mobile.png" title={t('banner')} lang={lang} backgroundPosition="right" backgroundSize="cover" /></div>
      <Intro title={t('Intro.title', { returnObjects: true })} subtitle={t('Intro.subtitle', { returnObjects: true })} description={t('Intro.description', { returnObjects: true })} />
      <WhyStartBusiness lang={lang} />
      <Requirement lang={lang} />
      <ProvinceComparison lang={lang} />
      <GovernmentFeeSchedule lang={lang} />
      <ServicesSection title={t('services.title')} description={t('services.description')} serviceDetails={t('services.serviceDetails', { returnObjects: true })} image={{ src: t('services.image.src'), alt: t('services.image.alt') }} descriptionIsHtml={true} />
      <Why lang={lang} />
      <PnpEntrepreneurTimeline lang={lang} />
      <Businesses heading={businessesHeading} items={t('businesses.list', { returnObjects: true })} className="pt-12 lg:pt-24" />
      <section id="pnp-application-form" className="max-w-responsive mx-auto pt-6 pb-12 w-100"><SmallReservationForm lang={lang} subject="entrepreneur-pnp" /></section>
      <section className="w-full max-w-responsive mx-auto pt-12 lg:pt-32">
        <h2 className="text-center text-3xl font-header md:text-4xl font-bold mb-4 text-gray-800">FAQ (Frequently Asked Question)</h2>
        <div className="w-full max-w-4xl mx-auto pt-9 py-12"><Accordions data={accordionData} /></div>
      </section>
      <DownloadGuidePanel
        tagLabel={t('download.tagLabel', { returnObjects: true })}
        heading={t('download.heading', { returnObjects: true })}
        description={t('download.description', { returnObjects: true })}
        bullets={t('download.bullets', { returnObjects: true })}
        href={t('download.href', { returnObjects: true })}
        buttonLabel={t('download.buttonLabel', { returnObjects: true })}
        thumbnail={t('download.thumbnail', { returnObjects: true })}
        fileName={t('download.fileName', { returnObjects: true })}
        fileSize={t('download.fileSize', { returnObjects: true })}
        downloadOnButton
      />
    </>
  );
}
