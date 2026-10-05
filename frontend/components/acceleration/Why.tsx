import React from 'react';
import { getServerTranslation } from 'app/i18n';
import Image from 'next/image';

export default function Why({ lang }: { lang: string }) {
  const { t } = getServerTranslation(lang, 'acceleration');

  return (
    <section className="w-full max-w-responsive mx-auto py-24 px-6">
      <h2 className="text-3xl font-header font-bold text-center mb-10">
        {t('why', { returnObjects: true }).title}
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {t('why', { returnObjects: true }).items.map((item: any, i: number) => (
          <div key={i} className="card bg-base-100 shadow-lg border border-gray-200 hover:shadow-xl transition">
            <div className="card-body p-6 text-center flex flex-col items-center justify-center">
              <Image
                src={`/static/images/acceleration/icons/${item.fileName}`}
                alt={item.title}
                className="size-12 max-w-full rounded-lg"
                width={200}
                height={200}
              />
              <h3 className="font-header card-title text-lg mb-3">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}