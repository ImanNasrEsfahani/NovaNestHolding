import React from 'react';
import { getServerTranslation } from 'app/i18n';

export default function Why({lang}: {lang: string}) {
    const { t } = getServerTranslation(lang, 'pnp');

    return (
        <section className="bg-gradient-to-r from-grayDark to-gray-800 text-white py-20 mb-16 px-6">
            <div className="max-w-responsive mx-auto text-center">
                <h2 className="text-3xl font-header font-bold mb-6">
                    {t('why', { returnObjects: true }).title}
                </h2>
                <ul className="space-y-4 text-lg">
                    {t('why', { returnObjects: true }).points.map((point: string, index: number) => (
                        <li key={index}>{point}</li>
                    ))}
                </ul>
            </div>
        </section>
    );
};