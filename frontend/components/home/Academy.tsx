import { getServerTranslation } from 'app/i18n';
import Image from 'next/image';
import ButtonRefactor from '@/components/common/ButtonRefactor';
import { appHref } from '@/utils/site';

export default function Academy({ lang }: { lang: string }) {
  const { t } = getServerTranslation(lang, 'mainPage');

  return (
    <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 py-16 md:py-36">
      <div className="size-full flex flex-col items-center justify-center md:items-start order-last md:order-1">
        <div className="w-full text-center md:text-start">
          <span className="font-header">{t('NovaNest')}</span>
          <h2 className="mt-2 font-header text-5xl font-bold">{t('Academy')}</h2>
        </div>

        <p className='leading-loose my-6 text-base'>{t('NovaNestAcademyInfo')}</p>

        <div className="max-w-container-xxs">
          <ButtonRefactor
            text={t('visit')}
            type="link"
            href="/join-as-a-trainee"
          />
        </div>
      </div>

      <div className="flex justify-center size-full order-first md:order-2">
        <a
          href={appHref('/join-as-a-trainee')}
          className="w-full"
          aria-label="nova-nest-venture-academy"
        >
          <Image
            loading="lazy"
            className="rounded-lg object-cover"
            src={"/static/images/home/academy/nova-nest-venture-academy.jpg"}
            alt={"Academy"}
            width={1200}
            height={675}
          />
        </a>
      </div>
    </div >
  )
}
