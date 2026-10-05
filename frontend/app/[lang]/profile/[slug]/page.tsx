import React from 'react';
import { getServerTranslation } from 'app/i18n';
import Profile from '@/components/profile/Profile';
import { Person } from '@/types/global';
import { notFound } from 'next/navigation';


export default async function Page({
  params: { slug, lang }
}: {
  params: { slug: string; lang: string };
}) {

  const { t } = getServerTranslation(lang, 'ourTeam');

  const roles = t('roles', { returnObjects: true });
  const mentors = roles.Mentors ?? [];
  const trainees = roles.Trainees ?? [];
  const coreTeam = roles["Core Team"] ?? [];

  // concat the three arrays into one
  const allPeople: Person[] = [...mentors.people, ...trainees.people, ...coreTeam.people];

  // find the person that matches the slug from the URL
  const person = allPeople.find((p) => p?.slug === slug);

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