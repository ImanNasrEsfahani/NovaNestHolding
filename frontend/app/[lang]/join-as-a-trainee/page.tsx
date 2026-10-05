import Banner from '@/components/common/Banner';
import { Metadata } from 'next';
import { getServerTranslation } from 'app/i18n';
// import CallToAction from '@/components/common/CallToAction';
import Intro from '@/components/common/Intro';
import Accordion from '@/components/startup/Accordions';
import Image from 'next/image';
import '../../[lang]/globals.css';
import AboutUs from '@/components/home/AboutUs';
import TraineeRegistrationForm from '@/components/join-as-a-trainee/TraineeRegistrationForm';
import Priority from '@/components/home/Priority';
import Procedure from '@/components/academy/procedure';

export const metadata: Metadata = {
  title: 'NovaNest Venture | Join as a Trainee',
  description:
    'Meet the future leaders at NovaNest Venture by joining as a trainee. Our comprehensive trainee program is designed to nurture talent and provide hands-on experience in a dynamic work environment. Apply now to kickstart your career with us and be part of an innovative team shaping the future.',
};

export default function TraineePage({
  params: { lang }
}: {
  params: { lang: string };
}) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";

  const { t } = getServerTranslation(lang, 'formComponent');
  const { t: tAcademy } = getServerTranslation(lang, 'academy');

  const raw = tAcademy('FAQ.accordion', { returnObjects: true });
  const items = Array.isArray(raw) ? raw : [];
  const mid = Math.ceil(items.length / 2);
  const left = items.slice(0, mid);
  const right = items.slice(mid);

  return (
    <>
      <div className="hidden md:inline">
        <Banner
          image="/static/images/join-as-a-trainee/header.png"
          title={t('joinAsATrainee', { returnObjects: true }).banner}
          lang={lang}
          backgroundPosition='top'
          backgroundSize='cover'
        />
      </div>
      <div className="inline md:hidden">
        <Banner
          image="/static/images/join-as-a-trainee/header-mobile.jfif"
          title={t('joinAsATrainee', { returnObjects: true }).banner}
          lang={lang}
          backgroundPosition='center'
          backgroundSize='cover'
        />
      </div>

      <AboutUs
        lang={lang}
        translations={{
          AboutUs: t('joinAsATrainee.aboutUS.aboutUs', { returnObjects: true }),
          AboutUsContent: t('joinAsATrainee.aboutUS.aboutUsContent', { returnObjects: true }),
          ReadMore: t('joinAsATrainee.aboutUS.readMore', { returnObjects: true }),
        }}
        href="/about-us"
      />

      <Intro
        title={t("joinAsATrainee.title", { returnObjects: true })}
        subtitle={t("joinAsATrainee.subTitle", { returnObjects: true })}
        description={t("joinAsATrainee.Description", { returnObjects: true })}
      />

      <section className="w-full max-w-responsive mx-auto pt-9 pb-16">
        <h2 className="text-center text-3xl font-header md:text-4xl font-bold mb-1 lg:mb-4 text-gray-800">{t('joinAsATrainee.intro')}</h2>

        <div className="grid lg:grid-cols-2 gap-9 lg:gap-12 items-stretch">
          <div className="flex flex-col justify-center">
            <Accordion data={t('joinAsATrainee.accordion', { returnObjects: true }) || []} />
          </div>

          <div className="min-h-[100vw] lg:min-h-[10vw] flex items-center justify-center order-first lg:order-last">
            <div className="w-full h-full relative">
              <Image
              src="/static/images/academy/academy-illustration.jpeg"
              alt="Services"
              fill
              className="object-contain rounded-lg"
              sizes="(min-width: 1024px) 400px, 100vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Recruitment & Progression (Procedure component) */}
      <Procedure title={tAcademy("process.title", { returnObjects: true })} steps={tAcademy("process.steps", { returnObjects: true })} />

      {/* Learning Opportunities */}
      <Priority
        Priorities={tAcademy('opportunities.title', { returnObjects: true })}
        cardData={(tAcademy('opportunities.list', { returnObjects: true }) || []) as Array<{ title: string; image: string }>}
        mobileCol={2}
      />

      {/* <CallToAction text={t("joinAsATrainee.callToAction", { returnObjects: true })} /> */}

      <TraineeRegistrationForm lang={lang} />

      {/* FAQ */}
      <section className="w-full max-w-responsive mx-auto pt-9 py-16">
        <h3 className="text-4xl font-header leading-loose text-center font-bold">
          {tAcademy('FAQ', { returnObjects: true }).title}
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-12">
          <div className="space-y-4">
            <Accordion data={left} />
          </div>

          <div className="space-y-4">
            <Accordion data={right} />
          </div>
        </div>
      </section>
    </>
  );
}
