import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import affiliateData from 'app/i18n/locales/en/ourTeamAffiliates.json';
import AffiliateApplicationForm from '@/components/our-team/AffiliateApplicationForm';
import { initials, safeLocalImage } from '@/components/our-team/AffiliateTypes';

type Params = { params: { lang: string; slug: string } };

function getAffiliate(slug: string) {
  return affiliateData.affiliates.partners.find(p => p.slug === slug && p.primaryEmail && p.emails.some(e => e.toLowerCase() === p.primaryEmail.toLowerCase()));
}

export function generateMetadata({ params: { lang, slug } }: Params): Metadata {
  const partner = lang === 'en' ? getAffiliate(slug) : undefined;
  return partner
    ? { title: `Apply with ${partner.name} | NovaNest Holding`, description: `Submit your application through ${partner.name}.`, robots: { index: false, follow: false } }
    : { title: 'Affiliate application | NovaNest Holding', robots: { index: false, follow: false } };
}

export default function Page({ params: { lang, slug } }: Params) {
  // The application is English-only until translated and reviewed.
  if (lang !== 'en') notFound();
  const partner = getAffiliate(slug);
  if (!partner) notFound();
  const logo = safeLocalImage(partner.logo);

  return (
    <div className="min-h-screen bg-[#FCFBFA] px-4 pb-20 pt-28 sm:px-6 md:pt-32" lang="en" dir="ltr">
      <div className="mx-auto max-w-4xl">
        <Link href={`/en/affiliate/${encodeURIComponent(partner.slug)}`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
          <span aria-hidden="true">←</span> Back to partner profile
        </Link>
        <header className="mb-7 flex flex-col items-center gap-5 rounded-2xl border border-[#E7DDD1] bg-white px-6 py-7 text-center shadow-sm sm:flex-row sm:px-9 sm:text-left">
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F8F5F0] sm:h-28 sm:w-28">
            {logo
              ? <Image src={logo} alt={`${partner.name} logo`} fill className="object-contain p-2" sizes="112px" priority />
              : <span aria-hidden="true" className="font-header text-4xl text-primary">{initials(partner.name)}</span>}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">Affiliate application · NovaNest Holding</p>
            <h1 className="mt-2 font-header text-2xl font-bold text-[#1D2942] sm:text-3xl">{partner.name}</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-600">Fill out the secure application below. Fields marked * are required. You can use Tab to move between fields and your browser’s autofill for contact details.</p>
          </div>
        </header>
        <AffiliateApplicationForm slug={partner.slug} affiliateName={partner.name} />
      </div>
    </div>
  );
}
