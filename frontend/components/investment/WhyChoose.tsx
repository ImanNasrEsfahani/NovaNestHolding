import React from 'react';
import { getServerTranslation } from 'app/i18n';
import Image from 'next/image';
import GoldenListCards from '@/components/common/GoldenListCards';

export default function WhyChoose({ lang }: { lang: string }) {
    const { t } = getServerTranslation(lang, 'investment');

    const title = t('why', { returnObjects: true }).title;
    const items = (t('why', { returnObjects: true }).items as string[]) || [];

    return (
        <div className="w-full max-w-responsive mx-auto py-12 lg:py-24">
            <h3 className="text-center text-3xl font-header font-bold mb-3 text-gray-800">
            {title}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-4">
                <div className="md:col-span-2 mx-auto flex flex-col justify-center order-2 md:order-1">
                    <GoldenListCards
                        items={items}
                        iconSrc="/static/images/startup/circle-check.svg"
                    />
                </div>
                <div className="md:col-span-1 flex items-center">
                    <Image
                        src="/static/images/investment/investment-why-choose-us.png"
                        alt={t('why.imageAlt') || 'Why Choose Us - Nova Nest Venture'}
                        width={500}
                        height={300}
                        className="rounded-lg shadow-lg object-cover h-auto mx-auto"
                    />
                </div>
            </div>
        </div>
    );
}