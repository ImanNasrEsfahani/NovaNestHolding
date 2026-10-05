import { getServerTranslation } from 'app/i18n';
import Banner from '@/components/common/Banner';
import Intro from "@/components/common/Intro";
import WhyStartBusiness from "@/components/pnp/WhyStartBusiness";
import Requirement from '@/components/pnp/Requirement';
import Why from '@/components/pnp/Why';
import CallToAction from '@/components/common/CallToAction';
import SmallReservationForm from '@/components/common/form/SmallReservationForm';
import Accordions from '@/components/startup/Accordions';
import DownloadGuidePanel from '@/components/DownloadGuidePanel';
import ServicesSection from '@/components/common/ServicesSection';
import Businesses from '@/components/pnp/Businesses';
import Image from 'next/image';

export default function pnp({ params: { lang } }: { params: { lang: string } }) {
    const { t } = getServerTranslation(lang, 'pnp');

    const benefits = t('faq', { returnObjects: true }) as Array<{
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
                    image="/static/images/pnp/pnp-banner.png"
                    title={t('banner')}
                    lang={lang}
                />
            </div>
            <div className='inline md:hidden'>
                <Banner
                    image="/static/images/pnp/pnp-banner-mobile.png"
                    title={t('banner')}
                    lang={lang}
                    backgroundPosition='right'
                    backgroundSize='cover'
                />
            </div>

            <Intro
                title={t('Intro.title', { returnObjects: true })}
                subtitle={t('Intro.subtitle', { returnObjects: true })}
                description={t('Intro.description', { returnObjects: true })}
            />

            <WhyStartBusiness lang={lang} />

            <Requirement lang={lang} />

            <ServicesSection
                title={t('services.title')}
                description={t('services.description')}
                serviceDetails={t('services.serviceDetails', { returnObjects: true })}
                image={{ src: t('services.image.src'), alt: t('services.image.alt') }}
                descriptionIsHtml={true}
            />

            <Why lang={lang} />

            <section className='w-full max-w-7xl mx-auto py-12 lg:py-24 px-1 lg:px-4'>
                <h3 className="text-3xl font-header font-bold text-gray-800 text-center mb-12">{t('roadmap.title')}</h3>
                <Image
                    src={t('roadmap.image')}
                    alt="SUV startup roadmap"
                    className="mx-auto w-full max-w-full rounded-lg"
                    width={1800}
                    height={2400}
                />
            </section>

            <Businesses
                heading={t('businesses.heading', { returnObjects: true })}
                items={t('businesses.list', { returnObjects: true })}
                className="pt-12 lg:pt-24"
            />

            <section id="pnp-application-form" className='max-w-responsive mx-auto pt-6 pb-12 w-100'>
                <SmallReservationForm
                    lang={lang}
                    subject='entrepreneur-pnp'
                />
            </section>

            <section className="w-full max-w-responsive mx-auto pt-12 lg:pt-32" >
                <h2 className="text-center text-3xl font-header md:text-4xl font-bold mb-4 text-gray-800">FAQ (Frequently Asked Question)</h2>

                <div className="w-full max-w-4xl mx-auto pt-9 py-12">
                    <Accordions data={accordionData} />
                </div>
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
            />
        </>
    )
}