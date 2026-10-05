import React from 'react';
import Image from 'next/image';

type Props = {
  title?: string;
  items: string[];
  iconSrc?: string;
  iconAlt?: string;
  className?: string;
};

export default function GoldenListCards({
  title,
  items = [],
  iconSrc = '/static/images/startup/circle-check.svg',
  iconAlt = 'check',
  className = ''
}: Props) {
  return (
    <section className={`w-full max-w-responsive mx-auto mt-12 mb-16 px-4 lg:px-2 ${className}`}>
      {title && (
        <h3 className="text-center text-3xl font-header font-bold mb-9 text-gray-800">
          {title}
        </h3>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-4 gap-x-6 max-w-5xl mx-auto">
        {items.map((requirement, index) => (
          <div
            key={index}
            className="group relative rounded-lg p-6 border-l-4 border-darkGold shadow-md hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1 text-darkGold">
                <Image
                  loading="lazy"
                  src={iconSrc}
                  alt={iconAlt}
                  width={500}
                  height={500}
                  className="w-7 h-7 text-darkGold"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-slate-900 mb-2">{requirement}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}