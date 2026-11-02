import React from 'react';
import Image from 'next/image';
import { getServerTranslation } from 'app/i18n';

export default function WhyStartBusiness({ lang }: { lang: string }) {
  const { t } = getServerTranslation(lang, 'pnp');
  const content = t('whyStartBusiness', { returnObjects: true }) as {
    title: string;
    points: string[];
    image: { src: string; alt: string };
  };

  // Avoid an unqualified claim about tax incentives across Canadian provinces.
  const points = content.points.map((point) =>
    point.includes('tax incentives')
      ? lang === 'fa'
        ? 'حمایت‌های دولتی و استانی، فرصت‌های سرمایه‌گذاری و زیرساخت‌های مناسب'
        : 'Strong government and provincial support, investment opportunities, and solid infrastructure'
      : point
  );

  return (
    <section className="py-16 px-6 max-w-responsive mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      <div className="order-2 lg:order-1">
        <h2 className="text-3xl text-center lg:text-left font-header font-bold mb-6">
          {content.title}
        </h2>
        <ul className="space-y-3 text-gray-700 pl-6 list-disc text-base">
          {points.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </div>
      <div className="flex justify-center">
        <Image
          src={content.image.src}
          alt={content.image.alt}
          className="max-w-md w-full rounded-xl shadow-md"
          width={300}
          height={150}
        />
      </div>
    </section>
  );
}
