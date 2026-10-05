import React from 'react';
import Image from 'next/image';

interface TwoColumnLayoutProps {
  imageSrc: string;
  imageAlt: string;
  text: string;
  title: string;
  activities: string[];
}

export default function TwoColumnsRole({ imageSrc, imageAlt, text, title, activities }: TwoColumnLayoutProps) {
  return (
    <div className="w-full max-w-responsive mx-auto grid lg:grid-cols-5 gap-8 items-center">

      <div className="lg:col-span-3 flex flex-col justify-center px-1">
        <p className="text-lg md:text-xl text-gray-700 leading-relaxed text-justify mb-4">{text}</p>
        {title? <h3 className="text-3xl md:text-4xl text-center lg:text-left font-header font-bold mb-1 text-gray-800 leading-relaxed">{title}</h3> : null}
        <ul className="w-full ml-6">
          {activities.map((activity, index) => (
            <li key={index} className="mt-3 text-lg list-disc list-inside">
              {activity}
            </li>
          ))}
        </ul>
      </div>

      <div className="lg:col-span-2 relative w-full lg:h-auto order-first lg:order-last">
        <Image
          src={imageSrc}
          alt={imageAlt}
          className="size-full object-cover rounded-lg shadow-md"
          width={600}
          height={600}
        />
      </div>
    </div>
  );
}