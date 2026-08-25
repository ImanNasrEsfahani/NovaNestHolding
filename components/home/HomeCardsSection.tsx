'use client';
import Image from 'next/image';
import ButtonRefactor from '@/components/common/ButtonRefactor';
import { appHref } from '@/utils/site';

export default function HomeCardsSection({
  smallTitle,
  text,
  images,
  reverse,
  link,
  titles,
  buttonText
}: {
  smallTitle: string;
  text: string;
  images: Array<{ src: string; alt: string }>;
  reverse: boolean;
  link: string;
  titles: string;
  buttonText: string;
}) {

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 items-center gap-6 md:gap-10`}>
      {/* Text column */}
      <div
        className={`flex flex-col size-full items-center justify-center md:items-start order-2 ${reverse ? 'md:order-2' : 'md:order-1'}`}
      >
        <div className="w-full text-center md:text-start">
          <p className="font-header text-lg mb-1">{smallTitle}</p>
          <h2 className="font-header text-5xl font-bold mb-4">{titles}</h2>
        </div>
        <p className="text-justify text-base md:w-full mb-6">
          {text}
        </p>
        <div className="max-w-container-xxs">
          <ButtonRefactor text={buttonText} type="link" href={link} />
        </div>
      </div>

      {/* Images column */}
      <div
        className={`flex ${reverse ? 'md:justify-start' : 'md:justify-end'} space-x-4 rtl:space-x-reverse items-center order-1 ${reverse ? 'md:order-1' : 'md:order-2'} md:pb-0`}
      >
        {images.map((image, index) => (
          <a key={index} href={appHref(link)} className="w-full" aria-label={image.alt || `image-${index}`}>
            <div
              className={`relative h-72 md:h-[26.5rem] w-full max-w-xs`}
              key={index}
            >
              <Image
                loading="lazy"
                className="rounded-lg object-cover"
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 110vw, (max-width: 1200px) 100vw, 33vw"
              />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
