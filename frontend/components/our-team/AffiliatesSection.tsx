'use client';

import Image from 'next/image';
import Link from 'next/link';

import { AffiliatePartner, AffiliatesContent, initials, safeLocalImage } from './AffiliateTypes';
import useSeamlessAutoScroll from './useSeamlessAutoScroll';
import styles from './PeopleCarousel.module.css';

export function AffiliateCard({ partner, lang, duplicate = false }: {
  partner: AffiliatePartner;
  lang: string;
  duplicate?: boolean;
}) {
  const logo = safeLocalImage(partner.logo);
  return (
    <Link
      href={`/${lang === 'fa' ? 'fa' : 'en'}/affiliate/${encodeURIComponent(partner.slug)}`}
      aria-label={partner.name}
      tabIndex={duplicate ? -1 : undefined}
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
      <div className="flex flex-1 flex-col justify-between p-6" dir={lang === 'fa' ? 'rtl' : 'ltr'}>
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

const copies = [0, 1, 2] as const;

export default function AffiliatesSection({ lang, content }: { lang: string; content: AffiliatesContent }) {
  const partners = Array.isArray(content.partners)
    ? content.partners.filter((p) => p && typeof p.slug === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug) && p.name)
    : [];
  const { scrollerRef, middleGroupRef, repeats, isLooping, moveBy } = useSeamlessAutoScroll(partners.length, 15);
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
        {isLooping && (
          <div className="mb-3 flex justify-end gap-2" dir="ltr">
            <button type="button" aria-label="Scroll affiliates left" onClick={() => moveBy(-320)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E9DED1] bg-white text-primary transition-colors hover:bg-whiteGold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">←</button>
            <button type="button" aria-label="Scroll affiliates right" onClick={() => moveBy(320)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E9DED1] bg-white text-primary transition-colors hover:bg-whiteGold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">→</button>
          </div>
        )}
        <div
          ref={scrollerRef}
          dir="ltr"
          tabIndex={isLooping ? 0 : undefined}
          aria-label={content.title}
          className={`${styles.scrollContainer} overflow-x-auto overflow-y-hidden px-2 py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary md:px-6`}
        >
          <div className="flex w-max min-w-full items-stretch justify-center">
            {(isLooping ? copies : [1]).map((groupNumber) => (
              <div
                key={groupNumber}
                ref={groupNumber === 1 ? middleGroupRef : undefined}
                className={`flex shrink-0 items-stretch gap-5 md:gap-8 ${isLooping ? 'pr-5 md:pr-8' : ''}`}
              >
                {Array.from({ length: isLooping ? repeats : 1 }, (_, repetition) =>
                  partners.map((partner) => {
                    const duplicate = groupNumber !== 1 || repetition !== 0;
                    return (
                      <div
                        key={`${groupNumber}-${repetition}-${partner.slug}`}
                        aria-hidden={duplicate || undefined}
                        className="w-[76vw] max-w-72 shrink-0 sm:w-64 md:w-72"
                      >
                        <AffiliateCard partner={partner} lang={lang} duplicate={duplicate} />
                      </div>
                    );
                  })
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
