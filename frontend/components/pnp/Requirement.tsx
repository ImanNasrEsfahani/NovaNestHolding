import React from 'react';
import { getServerTranslation } from 'app/i18n';

export default function Requirement({lang}: {lang: string}) {
    const { t } = getServerTranslation(lang, 'pnp');

    return (
        <section className="bg-gray-50 py-16 px-6">
            <div className="max-w-responsive w-full mx-auto text-center">
                <h2 className="text-3xl font-header font-bold mb-6 text-gray-800">
                    {t('requirements', { returnObjects: true }).title}
                </h2>
                <p className="text-lg italic font-header font-semibold mb-4 text-gray-600 leading-relaxed">
                    {t('requirements', { returnObjects: true }).subtitle}
                </p>
                <div className="w-full grid md:grid-cols-2 gap-6 text-left">
                    {t('requirements', { returnObjects: true }).items.map((item: any, index: number) => (
                        <div key={index} className="flex flex-col items-center bg-white shadow rounded-xl p-6 text-center">
                            <div
                                className="text-primary size-12 mb-4"
                                dangerouslySetInnerHTML={{ __html: item.icon }}
                            />
                            <h3 className="font-header text-lg font-semibold mb-2">{item.title}</h3>
                            <p className="text-base text-gray-600">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};