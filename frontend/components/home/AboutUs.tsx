import React from 'react';
import ButtonRefactor from '@/components/common/ButtonRefactor';

interface AboutUsProps {
    lang: string;
    translations: {
        AboutUs: string;
        AboutUsContent: string | string[];
        ReadMore?: string;
    };
    href?: string;
}

export default function AboutUs({ translations, href }: AboutUsProps) {
    return (
        <section className="w-full max-w-responsive mx-auto text-center pt-20 pb-10">
            <h2 className="text-5xl font-header font-bold mb-4 text-gray-800 relative">{translations.AboutUs}</h2>
            <p className="text-gray-700 text-lg md:text-xl leading-relaxed text-justify md:text-center tracking-wide mb-8">
                {Array.isArray(translations.AboutUsContent)
                    ? translations.AboutUsContent.map((content, index) => (
                          <span key={index}>
                              {content}
                              {index < translations.AboutUsContent.length - 1 && <br />}
                          </span>
                      ))
                    : translations.AboutUsContent}
            </p>

            {href && (
              <div className="max-w-xs lg:w-[200px] mx-auto">
                <ButtonRefactor text={translations.ReadMore || ""} type="link" href={href} />
              </div>
            )}
        </section>
    );
};