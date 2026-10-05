import React from 'react';
import { getServerTranslation } from 'app/i18n';

export default function VisionMission({ lang }: { lang: string }) {
  const { t } = getServerTranslation(lang, 'aboutUs');
  const visionMission = t('visionMission', { returnObjects: true }) as any;

  return (
    <section className="w-full max-w-responsive mx-auto pt-16 pb-24 px-4 md:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Mission Card */}
        <div className="flex flex-col bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 md:p-10 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="size-12 bg-primary rounded-full flex items-center justify-center">
              <svg className="size-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-header font-bold text-primary">
              {visionMission.mission.title}
            </h2>
          </div>
          <div className="h-1 w-20 bg-primary rounded-full mb-6"></div>

          {/* center content both horizontally and vertically */}
          <div className="flex-1 flex-col flex items-center justify-center">
            <p className="text-base md:text-lg text-gray-700 leading-relaxed text-center max-w-prose">
              {visionMission.mission.description}
            </p>
          </div>
        </div>

        {/* Vision Card */}
        <div className="flex flex-col bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 md:p-10 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="size-12 bg-gray-800 rounded-full flex items-center justify-center">
              <svg className="size-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-header font-bold text-gray-800">
              {visionMission.vision.title}
            </h2>
          </div>
          <div className="h-1 w-20 bg-gray-800 rounded-full mb-6"></div>

          {/* center content both horizontally and vertically */}
          <div className="flex-1 flex-col flex items-center justify-center">
            <p className="text-base md:text-lg text-gray-700 leading-relaxed text-center max-w-prose">
              {visionMission.vision.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}