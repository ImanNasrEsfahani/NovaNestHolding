// Static content belongs on the server: only its existing button is a client
// component. This also removes a redundant usePathname client subscription.
import Image from 'next/image';
import Link from 'next/link';
import ButtonRefactor from '@/components/common/ButtonRefactor';
import { localizedHref } from '@/utils/site';

type Props = {
  lang: string;
  smallTitle: string;
  text: string;
  images: Array<{ src: string; alt: string }>;
  reverse: boolean;
  link: string;
  titles: string;
  buttonText: string;
};

export default function HomeCardsSection({
  lang, smallTitle, text, images, reverse, link, titles, buttonText
}: Props) {
  const locale = lang === 'fa' ? 'fa' : 'en';
  const destination = localizedHref(link, locale);
  const investmentImages = locale === 'fa'
    ? ['مشاوره سرمایه‌گذاری و ارزیابی استارتاپ در نووانست', 'برنامه‌ریزی رشد کسب‌وکار و جذب سرمایه در نووانست']
    : ['NovaNest startup investment consultation and evaluation', 'NovaNest investment planning for growing businesses'];
  const accelerationImages = locale === 'fa'
    ? ['منتورینگ و حمایت از رشد استارتاپ‌ها در نووانست', 'شتاب‌دهی به بنیان‌گذاران و ایده‌های نوآورانه']
    : ['NovaNest startup acceleration and mentoring', 'NovaNest accelerator supporting innovative startup founders'];
  const descriptions = titles.toLowerCase().includes('invest') || titles.includes('سرمایه')
    ? investmentImages : accelerationImages;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 md:gap-10">
      <div className={`flex flex-col size-full items-center justify-center md:items-start order-2 ${reverse ? 'md:order-2' : 'md:order-1'}`}>
        <div className="w-full text-center md:text-start">
          <p className="font-header text-lg mb-1">{smallTitle}</p>
          <h2 className="font-header text-5xl font-bold mb-4">{titles}</h2>
        </div>
        <p className="text-justify text-base md:w-full mb-6">{text}</p>
        <div className="max-w-container-xxs">
          <ButtonRefactor text={buttonText} type="link" href={destination} />
        </div>
      </div>
      <div className={`flex ${reverse ? 'md:justify-start' : 'md:justify-end'} space-x-4 rtl:space-x-reverse items-center order-1 ${reverse ? 'md:order-1' : 'md:order-2'} md:pb-0`}>
        {images.map((image, index) => {
          const alt = image.alt?.trim() || descriptions[index] || `${titles} at NovaNest`;
          return (
            <Link key={index} href={destination} className="w-full" aria-label={`Learn more about ${titles}`}>
              <div className="relative h-72 md:h-[26.5rem] w-full max-w-xs">
                <Image
                  loading="lazy" className="rounded-lg object-cover"
                  src={image.src} alt={alt} fill
                  sizes="(max-width: 768px) 110vw, (max-width: 1200px) 100vw, 33vw"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
