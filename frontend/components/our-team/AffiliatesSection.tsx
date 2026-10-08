'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

import { AffiliatePartner, AffiliatesContent, initials, safeLocalImage } from './AffiliateTypes';

export function AffiliateCard({ partner, lang }: { partner: AffiliatePartner; lang: string }) {
  const logo = safeLocalImage(partner.logo);
  return (
    <Link
      href={`/${lang === 'fa' ? 'fa' : 'en'}/affiliate/${encodeURIComponent(partner.slug)}`}
      aria-label={partner.name}
      className="group/card flex h-full flex-col overflow-hidden rounded-2xl border border-[#E9DED1] bg-white shadow-md transition-all duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      <div className="relative aspect-[0.75/1] overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
        {logo ? (
          <Image
            src={logo}
            alt={`${partner.name} logo`}
            fill
            sizes="(max-width: 768px) 76vw, 288px"
            className="object-contain p-7 transition-transform duration-500 group-hover/card:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-header text-5xl font-bold text-primary" aria-hidden="true">
            {initials(partner.name)}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <h3 className="mb-3 font-header text-2xl font-bold leading-snug text-blue">{partner.name}</h3>
          {partner.category && (
            <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
              {partner.category}
            </span>
          )}
        </div>
        {partner.city && (
          <div className="border-t border-[#E9DED1] pt-4 text-sm text-grayDark">{partner.city}</div>
        )}
      </div>
    </Link>
  );
}

export default function AffiliatesSection({ lang, content }: { lang: string; content: AffiliatesContent }) {
  const scroller = useRef<HTMLDivElement>(null);
  const partners = Array.isArray(content.partners)
    ? content.partners.filter((p) => p && typeof p.slug === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug) && p.name)
    : [];
  if (!partners.length) return null;

  return (
    <section aria-labelledby="business-affiliates-title" className="max-w-responsive mx-auto my-16 px-2 lg:px-6">
      <h2 id="business-affiliates-title" className="mb-4 text-center font-header text-3xl font-bold text-blue md:text-4xl">
        {content.title}
      </h2>
      {content.description && (
        <p className="mx-auto mb-7 max-w-3xl text-center text-base leading-relaxed text-gray-600">{content.description}</p>
      )}
      <div className="relative">
        {partners.length > 1 && (
          <div className="mb-3 flex justify-end gap-2" dir="ltr">
            <button type="button" aria-label="Scroll affiliates left" onClick={() => scroller.current?.scrollBy({left: -320, behavior: 'smooth'})}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E9DED1] bg-white text-primary transition-colors hover:bg-whiteGold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">←</button>
            <button type="button" aria-label="Scroll affiliates right" onClick={() => scroller.current?.scrollBy({left: 320, behavior: 'smooth'})}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E9DED1] bg-white text-primary transition-colors hover:bg-whiteGold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">→</button>
          </div>
        )}
        <div ref={scroller} tabIndex={0} aria-label={content.title}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-2 py-4 scroll-smooth focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary md:gap-8 md:px-6"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#AA8453 #F8F5F0' }}>
          {partners.map((partner) => (
            <div key={partner.slug} className="w-[76vw] max-w-72 shrink-0 snap-start sm:w-64 md:w-72">
              <AffiliateCard partner={partner} lang={lang} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
