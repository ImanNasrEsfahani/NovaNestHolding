import React from 'react';
import Image from 'next/image';
import Accordion from '@/components/startup/Accordions';

type Props = {
  title: string;
  description: string;
  serviceDetails: any[];
  image: { src: string; alt: string };
  descriptionIsHtml?: boolean;
  className?: string;
};

export default function ServicesSection({
  title,
  description,
  serviceDetails = [],
  image = { src: '', alt: '' },
  descriptionIsHtml = false,
  className = ''
}: Props) {

  return (
    <section className={`w-full max-w-responsive mx-auto pt-12 pb-4 md:py-16 ${className}`}>
      <h3 className="text-3xl lg:text-4xl font-header leading-relaxed text-center font-bold">{title}</h3>

      {descriptionIsHtml ? (
        <p
          className="text-gray-600 text-base text-center mb-4 max-w-5xl mx-auto"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      ) : (
        <p className="text-gray-600 text-base text-center mb-4 max-w-5xl mx-auto">{description}</p>
      )}

      <div className="grid lg:grid-cols-2 gap-12 pt-12 items-stretch">
        <div className="flex flex-col justify-center">
          <Accordion data={serviceDetails} />
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full rounded-lg overflow-hidden h-full relative">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-contain rounded-lg"
              sizes="(min-width: 1024px) 400px, 100vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}