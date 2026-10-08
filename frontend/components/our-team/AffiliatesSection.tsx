import Image from 'next/image';
import Link from 'next/link';

export type AffiliateRepresentative = {
  name: string;
  position?: string;
  photo?: string;
  biography?: string;
};

export type AffiliatePartner = {
  name: string;
  category?: string;
  description?: string;
  logo?: string;
  city?: string;
  address?: string;
  phones?: string[];
  emails?: string[];
  websites?: string[];
  representative?: AffiliateRepresentative;
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
  contactLabel: string;
  representativeLabel: string;
  partners?: AffiliatePartner[];
};

type Props = {
  lang: string;
  content: AffiliatesContent;
};

// Public asset paths only; no remote-image configuration is necessary.
function localImage(path?: string): string | null {
  if (!path || !/^\/static\/images\/[a-z0-9/_-]+\.(?:png|jpe?g|webp|svg)$/i.test(path)) {
    return null;
  }
  return path;
}

// Accept the real business websites' HTTP links, while rejecting non-web protocols,
// credentials, whitespace and malformed addresses.
function safeWebsite(input?: string): string | null {
  if (!input || !/^https?:\/\//i.test(input) || /[\s<>"'\\]/.test(input)) return null;
  try {
    const value = new URL(input);
    if (
      !['http:', 'https:'].includes(value.protocol) ||
      !value.hostname ||
      !value.hostname.includes('.') ||
      value.username ||
      value.password
    ) return null;
    return value.href;
  } catch {
    return null;
  }
}

function safeEmail(email: string): boolean {
  return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email);
}

function safePhone(phone: string): string | null {
  const compact = phone.replace(/[\s()\-]/g, '');
  return /^\+?\d{7,15}$/.test(compact) ? compact : null;
}

function monogram(name: string): string {
  const parts = name.trim().split(/\s+/);
  return (parts.length > 1 ? parts.slice(0, 2) : parts)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();
}

function PartnerCard({partner, content}: {partner: AffiliatePartner; content: AffiliatesContent}) {
  const logo = localImage(partner.logo);
  const contact = partner.representative;
  const photo = localImage(contact?.photo);
  const websites = (partner.websites || []).map(safeWebsite).filter((url): url is string => Boolean(url));
  const emails = (partner.emails || []).filter(safeEmail);
  const phones = (partner.phones || []).filter((phone) => Boolean(safePhone(phone)));

  return (
    <article className="overflow-hidden rounded-2xl border border-[#E9DED1] bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <div className="flex h-28 w-full shrink-0 items-center justify-center rounded-xl bg-whiteGold p-4 sm:w-44">
              {logo ? (
                <Image
                  src={logo}
                  alt={`${partner.name} logo`}
                  width={175}
                  height={88}
                  sizes="(max-width: 640px) 175px, 175px"
                  className="max-h-20 w-auto max-w-full object-contain"
                />
              ) : (
                <span aria-hidden="true" className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 font-header text-2xl font-bold text-primary">
                  {monogram(partner.name)}
                </span>
              )}
            </div>
            <div>
              {partner.category && (
                <p className="mb-2 font-barlow text-sm font-semibold uppercase tracking-wider text-primary">
                  {partner.category}
                </p>
              )}
              <h3 className="font-header text-2xl font-bold leading-snug text-gray-800">{partner.name}</h3>
              {partner.city && <p className="mt-2 font-barlow text-sm text-gray-600">{partner.city}</p>}
            </div>
          </div>

          {partner.description && (
            <p className="mt-6 font-barlow text-base leading-relaxed text-gray-700">{partner.description}</p>
          )}

          <div className="mt-6 border-t border-[#E9DED1] pt-5">
            <p className="mb-3 font-barlow text-sm font-semibold uppercase tracking-wider text-primary">{content.contactLabel}</p>
            <div className="grid grid-cols-1 gap-3 text-sm text-gray-700 sm:grid-cols-2">
              {websites.length > 0 && (
                <div className="flex flex-col items-start gap-2">
                  {websites.map((href) => (
                    <Link
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all border-b border-primary/40 font-barlow text-primary hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      {new URL(href).hostname.replace(/^www\./, '')} <span aria-hidden="true">↗</span>
                    </Link>
                  ))}
                </div>
              )}
              {emails.length > 0 && (
                <div className="flex flex-col items-start gap-2" dir="ltr">
                  {emails.map((email) => (
                    <a key={email} href={`mailto:${email}`} className="break-all font-barlow text-gray-700 hover:text-primary">
                      {email}
                    </a>
                  ))}
                </div>
              )}
              {phones.length > 0 && (
                <div className="flex flex-col items-start gap-2" dir="ltr">
                  {phones.map((phone) => (
                    <a key={phone} href={`tel:${safePhone(phone)}`} className="font-barlow text-gray-700 hover:text-primary">
                      {phone}
                    </a>
                  ))}
                </div>
              )}
              {partner.address && (
                <p className="font-barlow leading-relaxed text-gray-600">{partner.address}</p>
              )}
            </div>
          </div>
        </div>

        {contact && contact.name && (
          <aside className="flex flex-col justify-center border-t border-[#E9DED1] bg-whiteGold p-6 sm:p-8 lg:border-s lg:border-t-0">
            <p className="mb-5 font-barlow text-sm font-semibold uppercase tracking-wider text-primary">{content.representativeLabel}</p>
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#E9DED1] bg-white shadow-sm">
                {photo ? (
                  <Image src={photo} width={80} height={80} alt={contact.name} className="h-full w-full object-cover" />
                ) : (
                  <span aria-hidden="true" className="font-header text-2xl font-semibold text-primary">{monogram(contact.name)}</span>
                )}
              </div>
              <div>
                <h4 className="font-header text-xl font-bold text-gray-800">{contact.name}</h4>
                {contact.position && <p className="mt-1 font-barlow text-sm text-gray-600">{contact.position}</p>}
              </div>
            </div>
            {contact.biography && (
              <p className="mt-5 font-barlow text-sm leading-relaxed text-gray-600">{contact.biography}</p>
            )}
          </aside>
        )}
      </div>
    </article>
  );
}

export default function AffiliatesSection({ lang, content }: Props) {
  const partners = Array.isArray(content.partners)
    ? content.partners.filter((partner) => partner && typeof partner.name === 'string' && partner.name.trim())
    : [];
  const focusAreas = Array.isArray(content.focusAreas) ? content.focusAreas : [];

  return (
    <section aria-labelledby="business-affiliates-title" className="max-w-responsive mx-auto px-2 lg:px-6 my-16">
      <div className="relative overflow-hidden rounded-[28px] border border-[#E9DED1] bg-whiteGold px-5 py-12 shadow-sm sm:px-8 lg:px-12 lg:py-16">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full border border-primary/20" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-12 h-44 w-44 rounded-full border border-primary/20" />

        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span aria-hidden="true" className="h-px w-8 bg-primary" />
            <p className="font-barlow text-sm font-semibold uppercase tracking-[0.18em] text-primary">{content.eyebrow}</p>
            <span aria-hidden="true" className="h-px w-8 bg-primary" />
          </div>
          <h2 id="business-affiliates-title" className="font-header text-3xl font-bold leading-tight text-gray-800 md:text-4xl">{content.title}</h2>
          <p className="mx-auto mt-5 max-w-2xl font-barlow text-base leading-relaxed text-gray-600">{content.description}</p>
        </div>

        {partners.length ? (
          <div className="relative mx-auto mt-10 flex max-w-5xl flex-col gap-6">
            {partners.map((partner, index) => (
              <PartnerCard key={`${partner.name}-${index}`} partner={partner} content={content} />
            ))}
          </div>
        ) : (
          <div className="relative mt-9 flex flex-wrap justify-center gap-3">
            {focusAreas.map((area) => (
              <span key={area} className="rounded-full border border-[#DDCEBA] bg-white px-5 py-2 font-barlow text-sm text-gray-700">{area}</span>
            ))}
          </div>
        )}

        <div className="relative mt-10 flex flex-col items-start justify-between gap-6 rounded-2xl border border-[#E9DED1] bg-white px-6 py-7 sm:flex-row sm:items-center sm:px-8">
          <div className="max-w-2xl">
            <h3 className="font-header text-2xl font-bold text-gray-800">{content.ctaTitle}</h3>
            <p className="mt-2 font-barlow text-sm leading-relaxed text-gray-600">{content.ctaDescription}</p>
          </div>
          <Link
            href={'/' + (lang === 'fa' ? 'fa' : 'en') + '/affiliate-registration-form'}
            className="inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-lg bg-primary px-6 py-3 font-barlow text-sm font-semibold text-white transition-colors hover:bg-[#8D6B40] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            {content.ctaLabel} <span aria-hidden="true" className="ms-3">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
