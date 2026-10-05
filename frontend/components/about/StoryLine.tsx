import React from 'react';
import Image from 'next/image';
import { getServerTranslation } from 'app/i18n';

export default function StoryLine({lang}: {lang: string}) {
    const { t } = getServerTranslation(lang, 'aboutUs');

    return (
        <>
            {t("storyLine", { returnObjects: true }).map((item: any, index: number) => (
                <div
                    key={index}
                    className='w-full grid grid-cols-1 lg:grid-cols-2 gap-10 my-9 lg:my-16'
                >
                    <div className={`col-span-1 flex justify-center items-center ${index % 2 === 0 ? "lg:order-last order-first" : ""}`}>
                        <Image
                            className="object-cover h-full rounded-xl"
                            src={item.image.src}
                            alt={item.image.alt}
                            width={item.image.width}
                            height={item.image.height}
                        />
                    </div>
                    <div className='col-span-1 flex flex-col justify-center'>
                        <p className='text-7xl font-bold font-header mb-4'>{item.year}</p>

                        {item.description.map((desc: string, i: number) => (
                            <p key={i} className='text-base text-justify mb-2'>{desc}</p>
                          ))}
                    </div>
                </div>
            ))}
        </>
    );
};