import Image from 'next/image';
import Link from 'next/link';
import type { AffiliatePartner, AffiliatesContent } from './AffiliateTypes';
import { initials, safeCertificate, safeLocalImage, safeWebsite } from './AffiliateTypes';
import AffiliateContactForm from './AffiliateContactForm';

const phoneHref = (phone: string): string | null => {
  const value = phone.replace(/[\s()-]/g, '');
  return /^\+?\d{7,15}$/.test(value) ? `tel:${value}` : null;
};

export default function AffiliateProfile({ partner, content, lang, formLabels }: {
  partner: AffiliatePartner;
  content: AffiliatesContent;
  lang: string;
  formLabels: {
    formTitle: string;
    formSubtitle: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    message: string;
    firstNameRequired: string;
    lastNameRequired: string;
    emailRequired: string;
    phoneNumberRequired: string;
    messageRequired: string;
    sendButton: string;
    sendingButton: string;
    successMessage: string;
    failedMessage: string;
  };
}) {
  const ui = content.profile;
  const logo = safeLocalImage(partner.logo);
  const photo = safeLocalImage(partner.representative?.photo);
  const certificates = (partner.certificates ?? []).filter((certificate) => Boolean(certificate?.title && safeCertificate(certificate.file)));
  const about = partner.about?.length ? partner.about : partner.description ? [partner.description] : [];
  const websites = (partner.websites ?? []).map(safeWebsite).filter((url): url is string => Boolean(url));
  const emails = (partner.emails ?? []).filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));

  return (
    <div className="mx-auto max-w-responsive px-2 pb-16 pt-32 md:px-4 lg:px-8">
      <Link href={`/${lang === 'fa' ? 'fa' : 'en'}/our-team`}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
        <span aria-hidden="true">←</span> {ui.backToTeam}
      </Link>
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        {/* Same profile composition as /profile/[slug]: identity + contacts at left. */}
        <aside className="flex w-full flex-col items-center gap-6 rounded-xl border border-[#E9DED1] bg-white px-4 py-6 shadow lg:w-1/3 lg:px-6">
          <div className="relative flex h-64 w-64 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-whiteGold shadow-md md:h-72 md:w-72">
            {logo ? (
              <Image src={logo} alt={`${partner.name} logo`} fill sizes="288px" className="object-contain p-6" priority />
            ) : (
              <span aria-hidden="true" className="font-header text-5xl font-bold text-primary">{initials(partner.name)}</span>
            )}
          </div>
          <div className="text-center">
            <h1 className="font-header text-3xl font-semibold text-gray-800 md:text-4xl">{partner.name}</h1>
            {partner.category && <p className="mt-2 text-lg text-gray-600">{partner.category}</p>}
          </div>
          <div className="w-full space-y-5 text-base text-gray-700">
            {partner.city && (
              <div>
                <h2 className="mb-1 text-sm font-semibold uppercase text-gray-600">{ui.location}</h2>
                <p>{partner.city}</p>
                {partner.address && <p className="mt-1 text-sm leading-relaxed text-gray-600">{partner.address}</p>}
              </div>
            )}
            {websites.length > 0 && (
              <div>
                <h2 className="mb-1 text-sm font-semibold uppercase text-gray-600">{ui.websites}</h2>
                {websites.map((url) => <div key={url}><Link href={url} target="_blank" rel="noopener noreferrer"
                  className="break-all text-sm text-primary underline-offset-4 hover:underline">{new URL(url).hostname.replace(/^www\./, '')} ↗</Link></div>)}
              </div>
            )}
            {emails.length > 0 && (
              <div>
                <h2 className="mb-1 text-sm font-semibold uppercase text-gray-600">{ui.emails}</h2>
                {emails.map((email) => <div key={email} dir="ltr" className="text-start"><a className="break-all text-sm text-primary hover:underline" href={`mailto:${email}`}>{email}</a></div>)}
              </div>
            )}
            {!!partner.phones?.length && (
              <div>
                <h2 className="mb-1 text-sm font-semibold uppercase text-gray-600">{ui.phones}</h2>
                {partner.phones.map((phone) => <div key={phone} dir="ltr" className="text-start">{phoneHref(phone)
                  ? <a className="text-sm text-primary hover:underline" href={phoneHref(phone)!}>{phone}</a>
                  : <span className="text-sm">{phone}</span>}</div>)}
              </div>
            )}
            {partner.representative?.name && (
              <div className="border-t border-[#E9DED1] pt-5">
                <h2 className="mb-3 text-sm font-semibold uppercase text-gray-600">{content.representativeLabel}</h2>
                <div className="flex items-center gap-3">
                  <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-whiteGold text-xl text-primary">
                    {photo ? <Image src={photo} alt={partner.representative.name} fill sizes="64px" className="object-cover" /> : initials(partner.representative.name)}
                  </div>
                  <div>
                    <p className="font-header font-semibold text-gray-800">{partner.representative.name}</p>
                    {partner.representative.position && <p className="text-sm text-gray-600">{partner.representative.position}</p>}
                  </div>
                </div>
                {partner.representative.biography && <p className="mt-3 text-sm text-gray-600">{partner.representative.biography}</p>}
              </div>
            )}
          </div>
        </aside>

        {/* Same main-column layout as mentors, with an additional Certificates section. */}
        <div className="w-full lg:w-2/3">
          <section className="rounded-xl border border-[#E9DED1] bg-white p-6 shadow">
            <h2 className="mb-4 font-header text-2xl font-semibold text-gray-800">{ui.about}</h2>
            <div className="space-y-3 text-justify text-base leading-relaxed text-gray-700">
              {about.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </div>
          </section>

          {!!partner.services?.length && (
            <section className="mt-6 rounded-xl border border-[#E9DED1] bg-white p-6 shadow">
              <h2 className="mb-4 font-header text-2xl font-semibold text-gray-800">{ui.services}</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {partner.services.map((service) => <li key={service} className="flex items-start gap-2 text-base text-gray-700">
                  <span aria-hidden="true" className="mt-1 text-primary">◆</span> {service}
                </li>)}
              </ul>
            </section>
          )}

          <section className="mt-6 rounded-xl border border-[#E9DED1] bg-white p-6 shadow" aria-labelledby="affiliate-certificates">
            <h2 id="affiliate-certificates" className="mb-4 font-header text-2xl font-semibold text-gray-800">{ui.certificates}</h2>
            {certificates.length ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {certificates.map((certificate, index) => {
                  const file = safeCertificate(certificate.file)!;
                  const isPdf = file.toLowerCase().endsWith('.pdf');
                  return (
                    <a key={`${file}-${index}`} href={file} target="_blank" rel="noopener noreferrer"
                      className="group overflow-hidden rounded-xl border border-[#E9DED1] bg-whiteGold transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                      <div className="relative flex h-40 items-center justify-center bg-white p-4">
                        {isPdf ? <span aria-hidden="true" className="rounded-lg bg-primary/10 px-5 py-4 text-3xl font-semibold text-primary">PDF</span>
                          : <Image src={file} alt={certificate.title} fill sizes="(max-width: 640px) 90vw, 300px" className="object-contain p-3" />}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800">{certificate.title}</h3>
                        {certificate.issuer && <p className="mt-1 text-sm text-gray-600">{certificate.issuer}</p>}
                        {certificate.issuedAt && <p className="text-sm text-gray-600">{certificate.issuedAt}</p>}
                        <p className="mt-3 text-sm font-semibold text-primary group-hover:underline">{ui.viewCertificate} ↗</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            ) : <p className="text-sm text-gray-500">{ui.noCertificates}</p>}
          </section>

          <section className="mt-6 rounded-xl border border-[#E9DED1] bg-white p-2 shadow md:p-6" aria-label={formLabels.formTitle}>
            <AffiliateContactForm affiliateName={partner.name} affiliateSlug={partner.slug} labels={formLabels} />
          </section>
        </div>
      </div>
    </div>
  );
}
