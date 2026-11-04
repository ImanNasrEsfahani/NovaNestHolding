'use client';

import Image from 'next/image';
import Link from 'next/link';
import LinkedInIcon from '../icons/footer/LinkedIn';
import type { Person } from '@/types/global';
import { localizedHref } from '@/utils/site';

type Props = {
  person: Person;
  lang: string;
  duplicate?: boolean;
};

export default function PersonCard({ person, lang, duplicate = false }: Props) {
  // Point directly at the localized Next.js route, not /profile/... which
  // requires a middleware redirect during a client-side navigation.
  const profileHref = localizedHref(`/profile/${encodeURIComponent(person.slug)}`, lang);

  return (
    <article className="group/card relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden border border-[#E9DED1] h-full flex flex-col transform hover:scale-[1.01] hover:-translate-y-2">
      <Link
        href={profileHref}
        prefetch={false}
        tabIndex={duplicate ? -1 : undefined}
        aria-label={`View ${person.name}'s profile`}
        className="flex h-full flex-1 flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="relative aspect-[0.75/1] h-auto overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
          <Image
            src={person.image}
            alt={person.name}
            fill
            className="object-center object-cover group-hover/card:scale-[1.02] transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 288px"
          />
        </div>

        <div className="p-6 flex-grow flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-header font-bold text-blue mb-2">
              {person.name}
            </h3>
            <span className="inline-block bg-primary/10 text-primary text-md font-semibold px-3 py-1 rounded-full mb-3">
              {person.position}
            </span>
          </div>

          <div className="pt-4 border-t border-[#E9DED1]">
            <span className="text-sm text-grayDark capitalize">
              {person.text}
            </span>
          </div>
        </div>
      </Link>

      {/* This is a sibling of the profile link, never a nested anchor. */}
      {person.linkedIn && (
        <Link
          href={person.linkedIn}
          tabIndex={duplicate ? -1 : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${person.name} on LinkedIn`}
          className="absolute top-3 right-3 z-30 rounded-full bg-white p-2 shadow-sm text-blue transition-colors duration-200 transform group-hover/card:scale-[0.95238] group-hover/card:translate-y-2 hover:bg-primary hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        >
          <LinkedInIcon />
        </Link>
      )}
    </article>
  );
}
