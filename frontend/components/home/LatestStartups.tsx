import LatestStartupsCard from '@/components/home/LatestStartupsCard';
import { getServerTranslation } from 'app/i18n';

export default function LatestStartups({lang}: {lang: string}) {
  const { t } = getServerTranslation(lang, 'mainPage');

  return (
    <section className="px-6 md:px-0 py-16 md:pt-36 md:pb-24 flex flex-col">
      <div className="flex flex-col items-center mb-6">
        <p className="font-header">{t('NovaNestVenture')}</p>
        <h2 className="font-header text-4xl font-bold text-black md:mt-3 ltr:tracking-[3.5px]">
          {t('LatestStartups')}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {t('LatestStartupsList', { returnObjects: true }).map(
          (
            {
              image,
              title,
              description,
              link
            }: {
              image: string;
              title: string;
              description: string;
              link: string;
            },
            index: number
          ) => (
            <LatestStartupsCard
              key={index}
              title={title}
              image={image}
              description={description}
              link={link}
              lang={t('lng')}
            />
          )
        )}
      </div>
    </section>
  );
}
