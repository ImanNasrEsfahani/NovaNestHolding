import React from 'react';
import { getServerTranslation } from 'app/i18n';

export default function WhoCanApply({lang}: {lang: string}) {
      const { t } = getServerTranslation(lang, 'startUp');


    return (
        <section className="bg-gray-50 py-16 pb-20 px-6">
            <h2 className="text-3xl font-bold font-header text-center mb-4">
                {t('whoCanApply.title')}
            </h2>
            <p className="text-center text-gray-600 text-lg mb-10">
                {t('whoCanApply.subtitle')}
            </p>
            <div className="max-w-responsive mx-auto grid md:grid-cols-2 gap-8">
                {t('whoCanApply.categories', { returnObjects: true }).map(
                    (category: { title: string; details: string[] }, idx: number) => (
                        <div key={idx} className="bg-white p-6 rounded-xl shadow-md">
                            <h3 className="font-semibold text-xl mb-2 font-header">
                                {category.title}
                            </h3>
                            <ul className="space-y-2 text-gray-600 text-sm">
                                {category.details.map((detail: string, detailIdx: number) => (
                                    <li key={detailIdx}>• {detail}</li>
                                ))}
                            </ul>
                        </div>
                    )
                )}
            </div>
        </section>
    );
};