import React from 'react';
import Image from 'next/image';
import { getServerTranslation } from 'app/i18n';
import ButtonRefactor from '@/components/common/ButtonRefactor';

export default function Founder({ lang }: { lang: string }) {
  const { t } = getServerTranslation(lang, 'aboutUs');
  const founder = t('founder', { returnObjects: true }) as any;

  const base = process.env.NEXT_PUBLIC_BASE_URL || "";

  return (
    <section className="w-full max-w-responsive mx-auto py-12 px-4 md:px-8 lg:px-16 my-16">
      <div className="bg-whiteGold rounded-2xl shadow-md overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center p-6">
          <div className="h-full flex justify-center px-2">
            <div className="size-full aspect-square relative rounded-lg overflow-hidden ring-2 ring-primary/20">
              <Image
                src={founder.image?.src ?? '/static/images/about/founder-rasoul-moradimehr.png'}
                alt={founder.image?.alt ?? 'Founder of NovaNest Venture - Rasoul Moradimehr'}
                fill
                sizes="(max-width: 1024px) 40vw, 240px"
                className="object-cover object-top "
              />
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col justify-center gap-4 py-4 pr-6">
            <h3 className="text-3xl md:text-5xl font-header font-bold">{founder.title}</h3>
            <h4 className="text-xl md:text-2xl font-semibold text-primary mb-6">{founder.name}</h4>

            <div className="text-base text-gray-700 space-y-4 mb-4">
              {founder.paragraphs.map((p: string, i: number) => (
                <p key={i} className="text-justify leading-relaxed">{p}</p>
              ))}
            </div>

            <div className="ml-auto w-[224px] p-2">
              <ButtonRefactor
                text="Read more"
                type="link"
                href={`${base}profile/rasoul-moradimehr`}
                bgColor="black"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}