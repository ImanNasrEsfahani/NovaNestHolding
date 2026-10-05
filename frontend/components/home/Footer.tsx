import Link from 'next/link';
import Instagram from '@/components/icons/footer/Instagram';
import Envelope from '@/components/icons/footer/Envelope';
import Whatsapp from '@/components/icons/footer/Whatsapp';
import LinkedIn from '@/components/icons/footer/LinkedIn';
import Facebook from '@/components/icons/footer/Facebook';
import { getServerTranslation } from 'app/i18n';
import { appHref } from '@/utils/site';

export default function Footer({
  lang
}: {
  lang: string;
}) {

  const { t } = getServerTranslation(lang, "footer")

  const exploreItems = (t('explore', { returnObjects: true })?.text ?? []) as Array<{ title: string; link: string }>;
  const formItems = (t('forms', { returnObjects: true })?.text ?? []) as Array<{ title: string; link: string }>;
  const contactItems = (t('contact', { returnObjects: true })?.text ?? []) as Array<{ type: 'text' | 'link'; title: string; link?: string }>;


  function GetYear() {
    const currentYear = new Date().getFullYear();
    return currentYear;
  }
  return (
    <div className="bg-[#F7F3EE] font-barlow">

      <div className="w-full max-w-responsive mx-auto p-6 grid grid-cols-2 gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-12">

        {/* About - spans more columns on large screens */}
        <div className="col-span-2 lg:col-span-6 flex flex-col justify-between">
          <div>
            <h4 className="text-justify text-xl font-medium text-primary pb-2">{t('about.title')}</h4>
            <p className="text-justify font-normal pb-2">{t('about.text')}</p>
          </div>
          <div className="mt-2 pb-1 flex flex-row items-center gap-4">
            <Link aria-label="Instagram" href={'https://instagram.com/novanest.venture'} className="hover:text-primary" target="_blank">
              <Instagram />
            </Link>
            <Link aria-label="Email" href={'mailto:info@novanestholding.com'} className="hover:text-primary">
              <Envelope />
            </Link>
            <Link aria-label="Whatsapp" href={'https://wa.me/+17789865432'} className="hover:text-primary" target="_blank">
              <Whatsapp />
            </Link>
            <Link aria-label="Linkedin" href={'https://www.linkedin.com/company/novanestventure/'} className="hover:text-primary" target="_blank">
              <LinkedIn />
            </Link>
            <Link aria-label="Facebook" href={'https://www.facebook.com/people/NovaNest-Venture/pfbid02MEtyGfDFbdWqRF4mTkxieN1iwrtYwTG48x13C72J89gBFDxjpbSKJNpxQLchGa59l/'} className="hover:text-primary" target="_blank" rel="noopener noreferrer">
              <Facebook />
            </Link>
          </div>
        </div>

        {/* Explore */}
        <div className="col-span-1 lg:col-span-2">
          <div className="text-xl font-medium text-primary pb-2">
            {t('explore.title')}
          </div>
          <div className="flex flex-col">
            {exploreItems.map((item, index) => (
              <Link
                key={index}
                href={appHref(item.link)}
                className={`hover:text-primary ${index > 0 ? 'pt-2' : ''}`}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Forms */}
        <div className="col-span-1 lg:col-span-2">
          <div className="text-xl font-medium text-primary pb-2">{t('forms', { returnObjects: true }).title}</div>
          <div className="flex flex-col">
            {formItems.map((item, index) => (
              <Link
                key={index}
                href={appHref(item.link)}
                className={`hover:text-primary ${index > 0 ? 'pt-2' : ''}`}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="col-span-2 lg:col-span-2">
          <div className="text-xl font-medium text-primary pb-2">
            {t('contact', { returnObjects: true }).title}
          </div>

          <div className="">
            {contactItems.map((item, index) =>
              item.type === 'link' && item.link ? (
                <Link
                  key={item.title}
                  href={item.link}
                  className={`block w-full hover:text-primary ${index > 0 ? 'pt-2' : ''} `}
                >
                  {item.title}
                </Link>
              ) : (
                <span key={item.title} className={`inline lg:block ${index > 0 ? 'pt-2' : ''}`}>
                  {item.title}
                </span>
              )
            )}
          </div>
        </div>
      </div>

      <div className="max-w-responsive mx-auto p-4 border-t border-tableHeader text-center text-tableHeader">
        © Copyright {GetYear()} by{' '}
        <Link href={appHref('/')} className="text-tableHeader">
          Nova Nest
        </Link>
      </div>

    </div>
  );
}
