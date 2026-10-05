import Link from 'next/link';
import { getServerTranslation } from 'app/i18n';

import Instagram from '@/components/icons/footer/Instagram';
import Envelope from '@/components/icons/footer/Envelope';
import Whatsapp from '@/components/icons/footer/Whatsapp';
import LinkedIn from '@/components/icons/footer/LinkedIn';
import Facebook from '@/components/icons/footer/Facebook';

export default function ContactUsDescription({ lang }: { lang: string }) {
  const { t } = getServerTranslation(lang, 'contact');

  return (
    <div className="h-full hidden lg:block">
      <div className="mb-5 mt-10 flex flex-col items-center md:my-0 md:w-[494px] md:items-start">
        <h1 className="font-header text-4xl md:text-5xl mb-4">
          {t('NovaNestVenture')}
        </h1>
        {t('text', { returnObjects: true }).map((p: string, i: number) => (
          <p key={i} className="text-justify font-normal mb-4">
            {p}
          </p>
        ))}
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
  );
}
