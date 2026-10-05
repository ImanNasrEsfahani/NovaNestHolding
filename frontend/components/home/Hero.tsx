import '../../app/[lang]/globals.css';

export default function Hero({
  titles,
  backgroundImage,
}: {
  titles: string[];
  subTitle?: string;
  backgroundImage: string;
  lang: string;
}) {

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
      <ul className='size-full mx-auto list-disc font-header text-xl lg:text-2xl tracking-wider text-white flex flex-col items-start pl-12 gap-1 md:gap-2 lg:gap-6 lg:justify-start lg:pl-20 lg:max-w-none absolute lg:left-0 lg:right-0 top-2/3 lg:top-1/2 lg:translate-y-0'>
        {titles.map((title: string, index: number) => (
          <li
            key={index}
            className={`get-shadow marker:text-white`}
          >
            {title}
          </li>
        ))}
      </ul>
    </div>
  );
}
