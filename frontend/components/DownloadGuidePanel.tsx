import React from 'react';
import Image from 'next/image';

type Props = {
  tagLabel?: string;
  heading?: string;
  description?: string;
  bullets: string[];
  href: string;
  buttonLabel?: string;
  thumbnail: string;
  fileName?: string;
  fileSize?: string;
  className?: string;
};

export default function DownloadGuidePanel({
  tagLabel,
  heading,
  description,
  bullets,
  href,
  buttonLabel,
  thumbnail,
  fileName,
  fileSize,
  className = ''
}: Props) {
  return (
    <section className={`w-full max-w-responsive mx-auto mb-20 ${className}`}>
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl shadow-2xl py-9">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gray-500 rounded-full opacity-20 blur-3xl transform translate-x-32 -translate-y-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gray-400 rounded-full opacity-20 blur-3xl transform -translate-x-24 translate-y-24" />

        <div className="relative z-10 grid lg:grid-cols-2 gap-y-20 lg:gap-x-8 items-center p-8 md:p-12">
          <div className="text-white">
            <div className="inline-flex items-center gap-2 bg-gray-500/30 backdrop-blur-sm rounded-full px-4 py-2 mb-4 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
                <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
                <path d="M14 2v5a1 1 0 0 0 1 1h5" />
                <path d="M10 9H8" />
                <path d="M16 13H8" />
                <path d="M16 17H8" />
              </svg>
              <span className="text-sm">{tagLabel}</span>
            </div>

            <h2 className="text-white text-3xl font-semibold mb-4">{heading}</h2>

            <p className="text-gray-100 text-base leading-relaxed mb-6">{description}</p>

            <ul className="space-y-3 pl-4 mb-8">
              {bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 bg-darkGold-400 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-gray-50 text-base">{b}</span>
                </li>
              ))}
            </ul>

            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="pl-4 inline-flex items-center gap-2 bg-white text-gray-700 hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg px-6 py-4 mb-2"
              aria-label={buttonLabel}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-700" aria-hidden="true">
                <path d="M12 15V3" />
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <path d="m7 10 5 5 5-5" />
              </svg>
              <span className="text-md font-semibold">{buttonLabel}</span>
            </a>
          </div>

          <div className="h-full relative order-first lg:order-last">
            <div className="max-h-auto w-auto absolute inset-0 bg-gray-400 rounded-2xl transform rotate-6 opacity-20" />
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={buttonLabel ?? heading ?? fileName}
              className="block h-full"
            >
              <div className="h-full min-h-96 bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                {thumbnail ? (
                  <Image
                    src={thumbnail}
                    alt={fileName ?? 'thumbnail'}
                    fill
                    className="object-contain rounded-lg"
                    sizes="(min-width: 1024px) 200px, 100vw"
                  />
                ) : (
                  <div className="flex flex-col flex-1 justify-around items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-full h-full max-w-[160px] max-h-[160px] text-slate-400 mx-auto" aria-hidden="true">
                      <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
                      <path d="M14 2v5a1 1 0 0 0 1 1h5" />
                      <path d="M12 18v-6" />
                      <path d="m9 15 3 3 3-3" />
                    </svg>
                    <div className="h-3 bg-slate-200 rounded w-full mt-2" />
                    <div className="h-3 bg-slate-200 rounded w-5/6" />
                    <div className="h-3 bg-slate-200 rounded w-4/6 pb-4" />
                  </div>
                )}

                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 p-6 bg-white bg-opacity-50 w-full border-t border-slate-200">
                  <div className="flex items-center justify-between text-lg font-semibold text-center">
                    <span>{fileName}</span>
                    <span>{fileSize}</span>
                  </div>
                </div>
          </div>
            </a>
        </div>

      </div>
    </div>
    </section >
  );
}