import Image from 'next/image';
import { getServerTranslation } from 'app/i18n';

export default function StoryOfUs({ lang }: { lang: string }) {
  const { t } = getServerTranslation(lang, 'aboutUs');

  return (
    <div className="flex flex-col  grid-cols-2 gap-12 pb-10 pt-24">
      {/* top */}
      <div className="flex flex-col justify-between gap-5 pb-14  text-black sm:py-14 lg:flex-row">
        <div className="flex flex-col w-full md:w-[48%] md:text-justify">

          <span className="font-header text-2xl md:text-4xl font-bold mb-0 md:mb-10 text-black">
            {t('LANDAStartups', { returnObjects: true })[0].title}
          </span>
          <ul className="mt-5 flex flex-col space-y-3 font-barlow">
            <li className="list-disc marker:text-primary">
              <span className="font-bold text-primary">
                {t('LANDAStartups', { returnObjects: true })[1].LandaTrip}
              </span>
              :{t('LANDAStartups', { returnObjects: true })[0].LandaTrip}
            </li>
            <li className="list-disc marker:text-primary">
              <span className="font-bold text-primary">
                {t('LANDAStartups', { returnObjects: true })[1].DiacoCenter}
              </span>
              :{t('LANDAStartups', { returnObjects: true })[0].DiacoCenter}
            </li>
            <li className="list-disc marker:text-primary">
              <span className="font-bold text-primary">
                {t('LANDAStartups', { returnObjects: true })[1].VisionRaft}
              </span>
              :{t('LANDAStartups', { returnObjects: true })[0].VisionRaft}
            </li>
            <li className="list-disc marker:text-primary">
              <span className="font-bold text-primary">
                {t('LANDAStartups', { returnObjects: true })[1].LandaHandicraft}
              </span>
              :{t('LANDAStartups', { returnObjects: true })[0].LandaHandicraft}
            </li>
            <li className="list-disc marker:text-primary">
              <span className="font-bold text-primary">
                {t('LANDAStartups', { returnObjects: true })[1].landaGene}
              </span>
              :{t('LANDAStartups', { returnObjects: true })[0].landaGene}
            </li>
          </ul>
        </div>
        {/* top - left */}
        <div className="flex flex-col text-justify w-full md:w-[48%]">
          <div className="relative hidden md:block h-[310px] w-screen md:h-[740px] md:w-[300px] lg:w-[449px] xl:w-[589px] ">
            <div className='h-[200px]'>
              <Image
                className="h-[1200px] hidden md:block w-full object-cover rounded-xl"
                src="/static/images/about/story/aboutus.webp"
                alt="story of NovaNest Venture"
                layout="fill"
              // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="font-header text-2xl font-bold md:text-5xl pt-10">
        {t('VISIONMission', { returnObjects: true }).title}
      </div>

      <div className=' flex justify-between gap-8 '>
        <div className='relative hidden md:block h-[310px] w-screen md:h-[310px] md:w-[48%]'>
          <Image
            className="hidden md:block object-cover w-full rounded-xl"
            src="/static/images/about/story/about-us.webp"
            alt="story of NovaNest Venture"
            layout="fill"
          />
        </div>

        <div className='text-lg w-full md:w-[48%] text-justify'>
          {t('VISIONMission', { returnObjects: true }).text}
        </div>
      </div>
    </div>
  );
}