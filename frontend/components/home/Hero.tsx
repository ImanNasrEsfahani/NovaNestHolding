import Link from 'next/link';
import '../../app/[lang]/globals.css';

export default function Hero({
  titles,
  backgroundImage,
  lang
}: {
  titles: string[];
  subTitle?: string;
  backgroundImage: string;
  lang: string;
}) {
  const locale = lang === 'fa' ? 'fa' : 'en';
  const destinations = [`/${locale}/investment`, `/${locale}/acceleration`, `/${locale}/pnp`];

  return (
    <div
      style={{
        backgroundImage: `url('/static/images/home/hero/${backgroundImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
      data-bgset={`/static/images/home/hero/${backgroundImage} [(max-width: 640px)] | /static/images/home/hero/${backgroundImage}`}
      className="relative h-[calc(100vh)] overflow-hidden"
    >
      <ul className="size-full mx-auto list-disc font-header text-xl lg:text-2xl tracking-wider text-white flex flex-col items-start pl-12 gap-1 md:gap-2 lg:gap-6 lg:justify-start lg:pl-20 lg:max-w-none absolute lg:left-0 lg:right-0 top-2/3 lg:top-1/2 lg:translate-y-0">
        {titles.map((title, index) => (
          <li key={index} className="get-shadow marker:text-white">
            <Link
              href={destinations[index] ?? `/${locale}`}
              className="inline-block rounded-sm underline-offset-4 transition-colors hover:text-[#F0D0A2] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
