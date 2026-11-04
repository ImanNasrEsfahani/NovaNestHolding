'use client';

import Image from 'next/image';
import Link from 'next/link';
import LinkedInIcon from '../icons/footer/LinkedIn';
import type { Person } from '@/types/global';
import { localizedHref } from '@/utils/site';
import profileContactLinks from '@/components/profile/profileContactLinks.json';

type Props = {
  person: Person;
  lang: string;
  duplicate?: boolean;
};

type ContactLink = { type: string; value: string };
const contactLinksBySlug = profileContactLinks as Record<string, ContactLink[]>;

export default function PersonCard({ person, lang, duplicate = false }: Props) {
  // Keep localized profile links and the existing contact directory unchanged.
  const profileHref = localizedHref(`/profile/${encodeURIComponent(person.slug)}`, lang);
  const configuredLinkedIn = contactLinksBySlug[person.slug]?.find(
    (link) => link.type.toLowerCase() === 'linkedin' &&
      /^https:\/\/(?:www\.)?linkedin\.com\//i.test(link.value)
  )?.value;
  const linkedinHref = configuredLinkedIn || person.linkedIn;

  return (
    <article className="group/card relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#E9DED1] bg-white shadow-md transition-all duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:shadow-xl">
      <Link
        href={profileHref}
        prefetch={false}
        tabIndex={duplicate ? -1 : undefined}
        aria-label={`View ${person.name}'s profile`}
        className="flex h-full flex-1 flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        {/* Preserve image width and its original 3:4 aspect ratio. */}
        <div className="shrink-0 bg-white pb-2">
          <div className="relative aspect-[0.75/1] shrink-0 overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
            <Image
              src={person.image}
              alt={person.name}
              fill
              className="object-center object-cover transition-transform duration-500 group-hover/card:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 288px"
            />
          </div>
        </div>

        {/* A single-line name and content-led height keep the card compact. */}
        <div className="min-w-0 px-3 py-2 text-center">
          <h3 title={person.name} className="mb-2 block w-full min-w-0 truncate font-header text-xl font-bold leading-[1.15] text-blue">
            {person.name}
          </h3>
          <span className="inline-block max-w-full rounded-full bg-primary/10 px-3 py-1 text-[13px] font-semibold leading-[18px] text-primary">
            {person.position}
          </span>
        </div>
      </Link>

      {/* LinkedIn is a sibling of the profile link (not a nested anchor). */}
      {linkedinHref && (
        <Link
          href={linkedinHref}
          tabIndex={duplicate ? -1 : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${person.name} on LinkedIn`}
          className="absolute right-3 top-3 z-30 rounded-full bg-white p-2 text-blue shadow-sm transition-colors duration-200 transform group-hover/card:scale-[0.95238] group-hover/card:translate-y-2 hover:bg-primary hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        >
          <LinkedInIcon />
        </Link>
      )}
    </article>
  );
}
