'use client'
import React from 'react';
import UlList from '@/components/List/UlList';
import { getServerTranslation } from 'app/i18n';
import ButtonRefactor from '@/components/common/ButtonRefactor';

const base = process.env.NEXT_PUBLIC_BASE_URL || "";

export default function HalvesCards({lang}: {lang: string}) {
  const { t } = getServerTranslation(lang, 'mainPage');

  // Get the cards array directly from translation
  const specialFeatureCards = t('specialFeatureCards', { returnObjects: true });

  return (
    <div className="relative flex flex-col md:flex-row justify-evenly items-stretch md:gap-10 md:pt-10">
      {specialFeatureCards.map((card: any) => (
      <article
        key={card.id}
        className="bg-whiteGold border-4 border-darkGold bg-opacity-10 z-10 flex flex-col mb-10 px-4 py-6 xl:px-12 gap-5 rtl:mr-1 rounded-xl xl:w-1/2 max-w-[40rem] md:h-auto md:mb-0"
      >
        <h3 className="pt-8 pb-1 text-center font-header text-4xl font-bold text-black">
        {card.subtitle}
        </h3>

        <p className="text-base text-justify">{card.text}</p>

        <UlList
        list={card.benefits}
        style1="pl-8"
        style2="space-y-2"
        style3="pt-1"
        />

        <div className="mt-auto mx-auto w-[200px] md:w-[224px] p-2">
        <ButtonRefactor
          text={card.buttonText}
          type="link"
          href={`${base}${card.href}`}
          bgColor="black"
        />
        </div>
      </article>
      ))}
    </div>
  );
}
