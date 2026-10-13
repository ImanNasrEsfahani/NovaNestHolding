import Image from 'next/image';
import Link from 'next/link';

export default function LatestStartupsCard({
  image, title, description, link
}: {
  image: string;
  title: string;
  description: string;
  link: string;
  lang: string;
}) {
  return (
    <Link
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${title} website`}
      className="block h-full"
    >
      <div className="group relative size-full col-span-1 border transition-all border-black hover:shadow-lg rounded-lg">
        <div className="w-full" />
        <Image
          className="w-1/2 h-44 mx-auto object-contain transition-all group-hover:scale-110 my-6"
          loading="lazy"
          alt={`${title} company logo`}
          src={image}
          width={500}
          height={500}
        />
        <div className="pt-3 pl-3 pr-3 font-header text-2xl font-bold text-center md:text-start text-neutral-800">
          {title}
        </div>
        <div className="border border-neutral-800" />
        <div className="font-barlow text-base font-normal p-3 mb-6 leading-relaxed text-justify text-neutral-800">
          {description}
        </div>
        <div aria-hidden="true" className="absolute inline-flex ltr:right-2 bottom-2 size-9 mx-auto gap-2.5 bg-neutral-800 rounded-lg rtl:left-2 rtl:rotate-180">
          <svg
            className="absolute border rounded-lg border-[#fff0] text-white transition-all duration-300 group-hover:border-black group-hover:bg-white group-hover:text-black"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14.43 5.93L20.5 12l-6.07 6.07M3.5 12h16.83" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
