'use client';

import Image from 'next/image';
import useSeamlessAutoScroll from './useSeamlessAutoScroll';
import styles from './PeopleCarousel.module.css';
import { safeLocalImage } from './AffiliateTypes';

export type TeamMember = {
  slug: string;
  name: string;
  /** Display label, not necessarily a job title. */
  position?: string;
  photo?: string;
};

export type TeamsContent = {
  title: string;
  description?: string;
  members: TeamMember[];
};

function TeamCard({ member, lang, duplicate = false }: { member: TeamMember; lang: string; duplicate?: boolean }) {
  const photo = safeLocalImage(member.photo);
  return (
    <article className="group/card flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[#E9DED1] bg-white shadow-md transition-all duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:shadow-xl">
      <div className="relative aspect-[0.75/1] shrink-0 overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
        {photo ? (
          <Image
            src={photo}
            alt={member.name}
            fill
            sizes="(max-width: 768px) 76vw, 288px"
            className="object-cover object-center transition-transform duration-500 group-hover/card:scale-[1.02]"
            priority={!duplicate}
          />
        ) : (
          <div aria-hidden="true" className="flex h-full items-center justify-center font-header text-5xl font-bold text-primary">
            {member.name.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between p-6" dir={lang === 'fa' ? 'rtl' : 'ltr'}>
        <div>
          <h3 className="mb-3 font-header text-2xl font-bold leading-snug text-blue">{member.name}</h3>
          {member.position && (
            <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
              {member.position}
            </span>
          )}
        </div>
        <div className="border-t border-[#E9DED1] pt-4 text-sm text-grayDark">NovaNest Holding</div>
      </div>
    </article>
  );
}

const copies = [0, 1, 2] as const;

export default function TeamsSection({ lang, content }: { lang: string; content: TeamsContent }) {
  const members = Array.isArray(content?.members)
    ? content.members.filter((member) => member && typeof member.slug === 'string' &&
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(member.slug) && typeof member.name === 'string' && Boolean(member.name.trim()))
    : [];
  const { scrollerRef, middleGroupRef, repeats, isLooping, moveBy } = useSeamlessAutoScroll(members.length);
  if (!members.length) return null;

  return (
    <section aria-labelledby="nova-teams-title" className="max-w-responsive mx-auto my-16 px-2 lg:px-6">
      <h2 id="nova-teams-title" className="mb-4 text-center font-header text-3xl font-bold text-blue md:text-4xl">
        {content.title}
      </h2>
      {content.description && (
        <p className="mx-auto mb-7 max-w-3xl text-center text-base leading-relaxed text-gray-600">
          {content.description}
        </p>
      )}
      <div className="relative">
        {isLooping && (
          <div className="mb-3 flex justify-end gap-2" dir="ltr">
            <button type="button" aria-label={lang === 'fa' ? 'حرکت کارت‌های تیم به چپ' : 'Scroll team cards left'}
              onClick={() => moveBy(-1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E9DED1] bg-white text-primary transition-colors hover:bg-whiteGold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">←</button>
            <button type="button" aria-label={lang === 'fa' ? 'حرکت کارت‌های تیم به راست' : 'Scroll team cards right'}
              onClick={() => moveBy(1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E9DED1] bg-white text-primary transition-colors hover:bg-whiteGold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">→</button>
          </div>
        )}
        <div ref={scrollerRef} dir="ltr" tabIndex={isLooping ? 0 : undefined} aria-label={content.title}
          className={`${styles.scrollContainer} overflow-x-auto overflow-y-hidden px-2 py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary md:px-6`}>
          <div className="flex w-max min-w-full items-stretch justify-center">
            {(isLooping ? copies : [1]).map((groupNumber) => (
              <div key={groupNumber} ref={groupNumber === 1 ? middleGroupRef : undefined}
                className={`flex shrink-0 items-stretch gap-5 md:gap-8 ${isLooping ? 'pr-5 md:pr-8' : ''}`}>
                {Array.from({ length: isLooping ? repeats : 1 }, (_, repetition) =>
                  members.map((member) => {
                    const duplicate = groupNumber !== 1 || repetition !== 0;
                    return (
                      <div key={`${groupNumber}-${repetition}-${member.slug}`} aria-hidden={duplicate || undefined}
                        className="flex h-auto min-h-[560px] w-[76vw] max-w-72 shrink-0 self-stretch sm:w-64 md:min-h-[590px] md:w-72">
                        <TeamCard member={member} lang={lang} duplicate={duplicate} />
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
