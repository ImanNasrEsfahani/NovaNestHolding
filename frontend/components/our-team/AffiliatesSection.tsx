import Image from 'next/image';
import Link from 'next/link';

export type AffiliatePartner = {
  name: string;
  category?: string;
  description?: string;
  // Store logos in frontend/public/static/images/affiliates/.
  logo?: string;
  website?: string;
};

export type AffiliatesContent = {
  eyebrow: string;
  title: string;
  description: string;
  focusAreas?: string[];
  ctaTitle: string;
  ctaDescription: string;
  ctaLabel: string;
  visitWebsiteLabel: string;
  partners?: AffiliatePartner[];
};

type Props = {
  lang: string;
  content: AffiliatesContent;
};

// Refuse non-HTTPS destination URLs.
function externalWebsite(url?: string): string | null {
  if (!url || !/^https:\/\/[^/\s?#]+(?:[/?#]|$)/i.test(url)) return null;
  return url;
}

// Using local logos avoids changes to Next.js remote image settings.
function localLogo(path?: string): string | null {
  if (!path || !/^\/static\/images\/[a-z0-9/_-]+\.(?:png|jpe?g|webp|svg)$/i.test(path)) {
    return null;
  }
  return path;
}

function monogram(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();
}

export default function AffiliatesSection({ lang, content }: Props) {
  const partners = Array.isArray(content.partners)
    ? content.partners.filter(
        (partner) => partner && typeof partner.name === 'string' && partner.name.trim().length > 0
      )
    : [];
  const focusAreas = Array.isArray(content.focusAreas) ? content.focusAreas : [];

  return (
    <section
      aria-labelledby="business-affiliates-title"
      className="max-w-responsive mx-auto px-2 lg:px-6 my-16"
    >
      <div className="relative overflow-hidden rounded-[28px] border border-[#E9DED1] bg-whiteGold px-5 py-12 shadow-sm sm:px-8 lg:px-12 lg:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full border border-primary/20"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-8 -top-12 h-44 w-44 rounded-full border border-primary/20"
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-primary" />
            <p className="font-barlow text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              {content.eyebrow}
            </p>
            <span aria-hidden="true" className="h-px w-8 bg-primary" />
          </div>
          <h2
            id="business-affiliates-title"
            className="font-header text-3xl font-bold leading-tight text-gray-800 md:text-4xl"
          >
            {content.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl font-barlow text-base leading-relaxed text-gray-600">
            {content.description}
          </p>
        </div>

        {partners.length > 0 ? (
          <div className="relative mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((partner, index) => {
              const logo = localLogo(partner.logo);
              const website = externalWebsite(partner.website);

              return (
                <article
                  key={partner.name + '-' + index}
                  className="group flex h-full flex-col rounded-2xl border border-[#E9DED1] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-6 flex h-28 items-center justify-center rounded-xl bg-whiteGold p-4">
                    {logo ? (
                      <Image
                        src={logo}
                        alt={partner.name + ' logo'}
                        width={200}
                        height={90}
                        sizes="(max-width: 640px) 70vw, 200px"
                        className="max-h-20 w-auto max-w-full object-contain"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 font-header text-2xl font-bold text-primary"
                      >
                        {monogram(partner.name)}
                      </span>
                    )}
                  </div>
                  {partner.category && (
                    <p className="mb-2 font-barlow text-sm font-semibold uppercase tracking-wider text-primary">
                      {partner.category}
                    </p>
                  )}
                  <h3 className="font-header text-2xl font-bold text-gray-800">
                    {partner.name}
                  </h3>
                  {partner.description && (
                    <p className="mt-3 flex-1 font-barlow text-sm leading-relaxed text-gray-600">
                      {partner.description}
                    </p>
                  )}
                  {website && (
                    <Link
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={content.visitWebsiteLabel + ': ' + partner.name}
                      className="mt-5 inline-flex w-fit items-center gap-2 border-b border-primary/40 pb-1 font-barlow text-sm font-semibold text-primary transition-colors hover:border-primary hover:text-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                    >
                      {content.visitWebsiteLabel}
                      <span aria-hidden="true">↗</span>
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="relative mt-9 flex flex-wrap justify-center gap-3">
            {focusAreas.map((area) => (
              <span
                key={area}
                className="rounded-full border border-[#DDCEBA] bg-white px-5 py-2 font-barlow text-sm text-gray-700"
              >
                {area}
              </span>
            ))}
          </div>
        )}

        <div className="relative mt-10 flex flex-col items-start justify-between gap-6 rounded-2xl border border-[#E9DED1] bg-white px-6 py-7 sm:flex-row sm:items-center sm:px-8">
          <div className="max-w-2xl">
            <h3 className="font-header text-2xl font-bold text-gray-800">
              {content.ctaTitle}
            </h3>
            <p className="mt-2 font-barlow text-sm leading-relaxed text-gray-600">
              {content.ctaDescription}
            </p>
          </div>
          <Link
            href={'/' + (lang === 'fa' ? 'fa' : 'en') + '/affiliate-registration-form'}
            className="inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-lg bg-primary px-6 py-3 font-barlow text-sm font-semibold text-white transition-colors hover:bg-[#8D6B40] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            {content.ctaLabel}
            <span aria-hidden="true" className="ms-3">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
