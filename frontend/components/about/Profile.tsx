import AboutusPersonalTabs from './AboutusPersonalTabs';
import { getServerTranslation } from 'app/i18n';

export default function Profile({lang}: {lang: string}) {
  const { t } = getServerTranslation(lang, 'aboutUs');

  return (
    <div className="mb-32 flex w-full flex-col justify-center">
      <div className=" flex flex-col justify-center py-10">
        <div className="mb-8 flex flex-col justify-between gap-24 md:flex-row md:gap-10">
          {t('boardMemebers', { returnObjects: true }).map(
            (
              {
                name,
                image,
                links,
                position
              }: {
                name: string;
                image: string;
                links: {
                  linkedin: string;
                  email: string;
                  website: string;
                  instagram: string;
                };
                position: string;
              },
              index: number
            ) => (
              <AboutusPersonalTabs
                key={index}
                image={image}
                name={name}
                position={position}
                linkedIn={links.linkedin}
                email={links.email}
                website={links.website}
                instagram={links.instagram}
              />
            )
          )}
        </div>

      </div>
    </div>
  );
}

