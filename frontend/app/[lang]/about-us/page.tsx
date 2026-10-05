import { Metadata } from 'next';
import { getServerTranslation } from 'app/i18n';
import Banner from '@/components/common/Banner';
import AboutUs from '@/components/home/AboutUs';
import StoryLine from '@/components/about/StoryLine';
import VisionMission from '@/components/about/VisionMission';
import Differentiators from '@/components/about/Differentiators';
import Founder from '@/components/about/Founder';
import ContactUsForm from '@/components/common/form/ContactUsForm';
import ContactUsDescription from '@/components/common/ContactUsDescription';

export const metadata: Metadata = {
  title: 'NovaNest Venture | About',
  description:
    'Learn about NovaNest Venture, a forward-thinking company dedicated to innovation and excellence. Discover our mission, values, and the team behind our success. Join us on our journey towards a brighter future.',
};

export default function Page({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const { t } = getServerTranslation(lang, "aboutUs");

  return (
    <>
      <div className='hidden md:inline'>
        <Banner
          image="/static/images/about/group.webp"
          title={t('banner')}
          lang={lang}
        />
      </div>
      <div className='inline md:hidden'>
        <Banner
          image="/static/images/about/group-mobile.webp"
          title={t('banner')}
          lang={lang}
        />
      </div>

      <div className='w-full max-w-responsive mx-auto'>
        
        <AboutUs
          lang={lang} 
          translations={{
              AboutUs: t('AboutUsNovaNest.title'),
              AboutUsContent: t('AboutUsNovaNest.text', { returnObjects: true })
          }}
        />

        <StoryLine lang={lang} />

        <VisionMission lang={lang} />

        <Differentiators lang={lang} />

        <Founder lang={lang} />

        <div className='w-full max-w-responsive mx-auto grid grid-cols-1 gap-12 px-5 py-8 md:flex items-center md:flex-row md:justify-between'>        
          <ContactUsDescription lang={lang} />
          <ContactUsForm lang={lang} />
        </div>
      </div>
    </>
  );
}