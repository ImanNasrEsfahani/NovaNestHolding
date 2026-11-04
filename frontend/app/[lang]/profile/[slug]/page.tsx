import Profile from '@/components/profile/Profile';
import type { Person } from '@/types/global';
import englishTeam from '../../../i18n/locales/en/ourTeam.json';
import persianTeam from '../../../i18n/locales/fa/ourTeam.json';
import { notFound } from 'next/navigation';

type PageParams = { slug: string; lang: string };

// Use the same source data as the Our Team cards. Importing the JSON directly
// also makes the list of profile routes visible to Next.js at build time.
function getPeople(lang: string): Person[] {
  const roles = lang === 'fa' ? persianTeam.roles : englishTeam.roles;
  return Object.values(roles).flatMap((role) => role.people) as Person[];
}

// Pre-render every currently published mentor/profile URL rather than relying
// entirely on first-request generation of the dynamic [slug] route.
export function generateStaticParams(): Array<{ slug: string }> {
  const slugs = new Set(
    Object.values(englishTeam.roles)
      .flatMap((role) => role.people)
      .map((person) => person.slug)
      .filter(Boolean)
  );
  return Array.from(slugs, (slug) => ({ slug }));
}

// Keep on-demand generation available for new slugs added in future builds.
export const dynamicParams = true;

export default function Page({ params: { slug, lang } }: { params: PageParams }) {
  const person = getPeople(lang).find((entry) => entry.slug === slug);

  if (!person) {
    notFound();
  }

  return (
    <>
      <br />
      <br />
      <br />
      <br />
      <Profile person={person} lang={lang} />
    </>
  );
}
