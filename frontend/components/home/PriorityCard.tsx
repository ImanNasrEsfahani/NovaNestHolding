import Image from 'next/image';

export default function PriorityCard({
  title,
  image
}: {
  title: string;
  image: string;
}) {

  return (
    <div className="w-full h-36 px-4 pb-6 relative flex items-end justify-center overflow-hidden border border-primary rounded-lg">
      <Image
        loading="lazy"
        src={image}
        alt=""
        width={500}
        height={500}
        className="text-darkGold bg-darkGold absolute bottom-0 right-0 max-w-28 max-h-28 opacity-10 md:bottom-0"
      />

      <div className="z-20 text-base text-center">{title}</div>
      <Image
        loading="lazy"
        src={image}
        alt="NovaNest Venture Priority"
        width={500}
        height={500}
        className="text-darkGold absolute left-2 top-2 max-w-12 max-h-12 lg:max-w-16 lg:max-h-16 z-10"
      />
    </div>
  );
}
