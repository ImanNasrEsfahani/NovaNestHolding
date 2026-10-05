import React from 'react';
import { getServerTranslation } from 'app/i18n';

export default function Impact({ lang }: { lang: string }) {
    const { t } = getServerTranslation(lang, 'acceleration');

    return (
        <section className="bg-gradient-to-r from-gray-600 to-gray-700 text-white py-16 mb-9 px-2 md:px-6">
            <div className="w-full max-w-responsive mx-auto text-center">
                <h2 className="text-3xl font-header font-bold mb-9">{t('impact.title')}</h2>
                <ul className="space-y-4 text-lg">
                    {t('impact.items', { returnObjects: true }).map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>
        </section>
    );
};