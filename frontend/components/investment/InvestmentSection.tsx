import React from 'react';
import ButtonRefactor from '@/components/common/ButtonRefactor';

import { getServerTranslation } from 'app/i18n';

const base = process.env.NEXT_PUBLIC_BASE_URL || "";

export default function InvestmentSection({ lang }: {
    lang: string;
}) {
    const { t } = getServerTranslation(lang, 'investment');

    return (
        <>
            <div className="w-full max-w-responsive mx-auto py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {(t('forFounders', { returnObjects: true }) || []).map((section: any, idx: number) => (
                        <div
                            key={section?.id ?? section?.title ?? idx}
                            className="bg-whiteGold border-4 border-darkGold bg-opacity-20 flex flex-col get-shadow-g px-2 lg:px-4 py-6 xl:px-12 pt-20 rounded-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="flex flex-col items-center text-center mb-6">
                                <h3 className="font-header text-3xl font-bold text-gray-800">
                                    {section.title}
                                </h3>
                            </div>
                            <div className="text-base leading-loose">
                                <p className="mb-6">{section.p1}</p>
                                <p>{section.p2}</p>
                            </div>
                            <div className="max-w-xs mx-auto text-center mt-12">
                                {/* <a href={`${base}${section.href}`} className="btn btn-dark text-white btn-lg normal-case font-light transition duration-150 ease-in-out hover:bg-primary">
                                    {section.button}
                                </a> */}
                                <ButtonRefactor text={section.button} type="link" href={`${base}${section.href}`} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}