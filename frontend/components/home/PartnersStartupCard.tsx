import Image from 'next/image';

export default function PartnersStartupCard({
  logo,
  title,
  description
}: {
  logo: number;
  title: string;
  description: string;
}) {

  return (
    <div className="h-[300px] w-[275px] select-none items-center gap-4 overflow-x-auto rounded-md bg-whiteGold p-3 shadow-lg">
      <div className='size-20 relative mx-auto'>
        <Image
          className="object-contain"
          src={`/static/images/home/contact/${logo}.png`}
          alt="r"
          layout='fill'
          sizes='50vw, 33vw'
        />
      </div>
      <div className="flex flex-col gap-8 mt-5">
        <span className="font-header font-bold text-center text-md">{title}</span>
        <p className="font-barlow leading-4 text-xs">
          {description}
        </p>
      </div>
    </div>
  );
}
