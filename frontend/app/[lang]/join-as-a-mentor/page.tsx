import Banner from '@/components/common/Banner';
import MentorRegistrationForm from '@/components/join-as-mentor/MentorRegistrationForm';
import Accordions from '@/components/startup/Accordions';
import Image from 'next/image';
import { Metadata } from 'next';
import { getServerTranslation } from 'app/i18n';
import Intro from '@/components/common/Intro';
import AboutUs from '@/components/home/AboutUs';
import TwoColumnsRole from '@/components/common/TwoColumnsRole';

export const metadata: Metadata = {
  title: 'NovaNest Venture | Join as a Mentor',
  description:
    'Explore the NovaNest Venture Join as Mentor Form and take the first step towards exciting opportunities. Share your qualifications and interests with us as you apply for roles within our organization. Join us in shaping a brighter future together.',
};

export default function JoinAsMentorPage({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";
  const { t } = getServerTranslation(lang, "MentorForm");

  const benefits = t('benefits', { returnObjects: true }) as Array<{
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
    <div>
      <div className="hidden md:inline">
        <Banner
          image="/static/images/work-with-us/header.png"
          title={t('banner')}
          lang={lang}
        />
      </div>
      <div className="inline md:hidden">
        <Banner
          image="/static/images/work-with-us/header.png"
          title={t('banner')}
          lang={lang}
        />
      </div>

      <AboutUs
        lang={lang}
        translations={{
          AboutUs: t('aboutUS.AboutUs', { returnObjects: true }),
          AboutUsContent: t('aboutUS.AboutUsContent', { returnObjects: true }),
          ReadMore: t('aboutUS.ReadMore', { returnObjects: true }),
        }}
        href={`${base}/about-us`}
      />

      <Intro
        title={t('title', { returnObjects: true })}
        subtitle={t('subtitle', { returnObjects: true })}
        description=""
      />


      <TwoColumnsRole
        imageSrc={t('role.imageSrc', { returnObjects: true })}
        imageAlt={t('role.imageAlt', { returnObjects: true })}
        text={t('role.description', { returnObjects: true })}
        title={t('role.activities.title', { returnObjects: true })}
        activities={t('role.activities.items', { returnObjects: true })}
      />


      <section className="w-full max-w-responsive mx-auto pt-32" >
        <h2 className="text-center text-3xl font-header md:text-4xl font-bold mb-4 text-gray-800">Unique opportunities for Mentors</h2>

        <div className="w-full max-w-responsive mx-auto pt-9 grid lg:grid-cols-3 gap-20 py-12 items-start">
          <div className="lg:col-span-2 flex flex-col justify-center">
            <Accordions data={accordionData} />
          </div>

          <div className="w-full flex items-center justify-center order-first lg:order-last">
            <div className="w-full h-auto max-h-full">
              <Image
                src="/static/images/join-as-a-mentor/services.png"
                alt="Services"
                className="size-full object-cover rounded-lg shadow-md"
                width={1400}
                height={900}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <div className='max-w-responsive mx-auto'>
        <MentorRegistrationForm lang={lang} />
      </div>
    </div>
  );
}
