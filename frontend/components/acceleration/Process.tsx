import React from "react";
import { getServerTranslation } from 'app/i18n';

export default function Process({ lang }: { lang: string }) {
    const { t } = getServerTranslation(lang, 'acceleration');

    return (
        <section className="w-full pt-12 pb-24 px-6">
            <div className="max-w-responsive mx-auto">
                <h2 className="text-3xl font-header font-bold text-center mb-12">
                    {t("process", { returnObjects: true }).title}
                </h2>
                <div className="max-w-responsive mx-auto space-y-6">
                    {t("process", { returnObjects: true }).items.map((item: string, i: number) => (
                        <div
                            key={`${i}-${String(item).slice(0, 30)}`}
                            className="text-base card mx-auto max-w-6xl flex flex-row bg-base-100 shadow rounded-xl p-5 border border-gray-200"
                        >
                            <span className="font-bold mr-2">{i + 1}.</span>
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};