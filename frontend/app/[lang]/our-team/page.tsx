import Banner from '@/components/common/Banner';
import { Metadata } from 'next';
import { getServerTranslation } from 'app/i18n';
import '../../[lang]/globals.css';

import Intro from '@/components/common/Intro';
import PeopleCarousel from '@/components/our-team/PeopleCarousel';

export const metadata: Metadata = {
  title: 'NovaNest Venture | Our Team',
  description:
    'Meet the dedicated and talented individuals who make up the NovaNest Venture team. Learn about their expertise, passion, and commitment to excellence. Get to know the driving force behind our success.'
};

export default function TeamPage({
  params: { lang }
}: {
  params: { lang: string };
}) {
  const { t } = getServerTranslation(lang, 'ourTeam');

  const roles = t('roles', { returnObjects: true });

  const mentors = roles.Mentors ?? [];
  const trainees = roles.Trainees ?? [];
  const coreTeam = roles["Core Team"] ?? [];

  return (
    <div>
      <div className="hidden md:inline">
        <Banner
          image="/static/images/our-team/header.png"
          title={t('title')}
          lang={lang}
        />
      </div>
      <div className="inline md:hidden">
        <Banner
          image="/static/images/our-team/header-mobile.jfif"
          title={t('title')}
          lang={lang}
          // className="h-[80vh]"
        />
      </div>

      <div className="max-w-responsive mx-auto">
        <Intro
          title={t('title', { returnObjects: true })}
          subtitle={t('subtitle', { returnObjects: true })}
          description={t('description', { returnObjects: true })}
        />

        {/* <div className="w-full mx-auto overflow-x-hidden px-2 lg:px-6 my-16">
          <h2 className="text-3xl md:text-4xl font-header font-bold text-blue text-center mb-4">
            {coreTeam.title}
          </h2>
          <PeopleCarousel
            people={coreTeam.people}
          />
        </div> */}


        <div className="max-w-responsive mx-auto px-2 lg:px-6 my-16">
          <h2 className="text-3xl md:text-4xl font-header font-bold text-blue text-center mb-4">
            {mentors.title}
          </h2>
          <PeopleCarousel
            people={mentors.people}
          />
        </div>

        {/* <div className="max-w-responsive mx-auto px-2 lg:px-6 my-16">
          <h2 className="text-3xl md:text-4xl font-header font-bold text-blue text-center mb-4">
            {trainees.title}
          </h2>
          <PeopleCarousel
            people={trainees.people}
          />
        </div> */}

        {/* <TeamPersons lang={lang} /> */}
      </div>
    </div>
  );
}
