import Image from 'next/image';
import Link from 'next/link';

export default function CompaniesCard({
  name,
  logo,
  link
}: {
  name: string;
  logo: string;
  link: string;
}) {

  return (
    <Link href={link} target="_blank">
      <div className=" relative flex h-[160px] w-[150px] mb-5 md:mb-0 flex-col items-center group justify-center bg-[#F7F3EE] md:size-[322px] rounded-xl">
        <div className="relative size-[120px] md:size-[138px]">
          <Image
            className=" object-contain"
            src={`/static/images/about/companies/${logo}`}
            alt="NovaNest Venture Companies"
            layout="fill"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <span className="absolute flex items-center justify-center bottom-0 transition-all w-full bg-[#00000069] h-8 md:h-12 font-header text-sm text-white md:text-lg rounded-md group-hover:h-full">
          {name}
        </span>
      </div>
    </Link>
  );
}
