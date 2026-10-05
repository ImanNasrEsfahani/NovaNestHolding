import Accordions from '@/components/startup/Accordions';
import Image from 'next/image';
import { Metadata } from 'next';
import { getServerTranslation } from 'app/i18n';
import Banner from '@/components/common/Banner';
import JoinOurTeamForm from '@/components/job-form/JoinOurTeamForm';
import CallToAction from '@/components/common/CallToAction';
import Intro from "@/components/common/Intro";
import AboutUs from '@/components/home/AboutUs';

export const metadata: Metadata = {
  title: 'NovaNest Venture | Join as a Team Member',
  description:
    'Explore the NovaNest Venture Apply Form and take the first step towards exciting opportunities. Share your qualifications and interests with us as you apply for roles within our organization. Join us in shaping a brighter future together.'
};

export default function ApplyFormPage({
  params: { lang }
}: {
  params: { lang: string };
}) {
  const { t } = getServerTranslation(lang, 'formComponent');
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";

  return (
    <>
      <div className="hidden md:inline">
        <Banner
          image="/static/images/join-our-team-form/header.png"
          title={t('join-our-team', { returnObjects: true }).banner}
          lang={lang}
        />
      </div>
      <div className="inline md:hidden">
        <Banner
          image="/static/images/join-our-team-form/header-mobile.jfif"
          title={t('join-our-team', { returnObjects: true }).banner}
          lang={lang}
        />
      </div>

      <AboutUs
        lang={lang}
        translations={{
          AboutUs: t('joinAsATrainee.aboutUS.aboutUs', { returnObjects: true }),
          AboutUsContent: t('joinAsATrainee.aboutUS.aboutUsContent', { returnObjects: true }),
          ReadMore: t('joinAsATrainee.aboutUS.readMore', { returnObjects: true }),
        }}
        href={`${base}/about-us`}
      />
      
      <Intro
        title={t('join-our-team.title', { returnObjects: true })}
        subtitle={t('join-our-team.subtitle', { returnObjects: true })}
        description={t('join-our-team.description', { returnObjects: true })}
      />

      {/* Introduction Text */}
      {/* <div className='w-full max-w-responsive mx-auto bg-whiteGold rounded-lg p-8 mb-6 border-l-4 border-primary'>
        <p className='text-lg text-grayDark leading-relaxed'>By joining the NovaNest Professional Team, you will gain unique opportunities:</p>
      </div>

      <div className="w-full max-w-responsive mx-auto grid lg:grid-cols-2 gap-12 py-12 items-stretch">
        <div className="flex flex-col justify-center">
          <Accordions data={accordionData} />
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full rounded-lg overflow-hidden h-full relative">
            <Image
              src="/static/images/join-our-team-form/services.png"
              alt="Services"
              fill
              className="object-contain rounded-lg"
              sizes="(min-width: 1024px) 400px, 100vw"
            />
          </div>
        </div>
      </div>

      <CallToAction text={t('join-our-team', { returnObjects: true }).callToAction} /> */}

      <div className="w-full max-w-responsive mx-auto">
        <JoinOurTeamForm lang={lang} />
      </div>
    </>
  );
}
