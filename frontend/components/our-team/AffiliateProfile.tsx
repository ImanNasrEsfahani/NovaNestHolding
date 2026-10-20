import Image from 'next/image';
import Link from 'next/link';
import type { AffiliatePartner, AffiliatesContent } from './AffiliateTypes';
import { initials, safeCertificate, safeLocalImage, safeWebsite } from './AffiliateTypes';
import AffiliateContactForm from './AffiliateContactForm';
import AffiliateApplicationForm from './AffiliateApplicationForm';
import AffiliateCertificates from './AffiliateCertificates';

const phoneHref = (phone: string): string | null => {
  const value = phone.replace(/[\s()-]/g, '');
  return /^\+?\d{7,15}$/.test(value) ? `tel:${value}` : null;
};

type ContactFormLabels = {
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
  emailInvalid: string;
  phoneNumberRequired: string;
  messageRequired: string;
  sendButton: string;
  sendingButton: string;
  successMessage: string;
  failedMessage: string;
};

type CommonProfileProps = {
  partner: AffiliatePartner;
  content: AffiliatesContent;
  lang: string;
};

type AffiliateProfileProps = CommonProfileProps & (
  | { formVariant?: 'contact'; formLabels: ContactFormLabels }
  | { formVariant: 'application'; formLabels?: never }
);

export default function AffiliateProfile(props: AffiliateProfileProps) {
  const { partner, content, lang } = props;
  const ui = content.profile;
  const logo = safeLocalImage(partner.logo);
  const photo = safeLocalImage(partner.representative?.photo);
  const certificates = (partner.certificates ?? []).filter((certificate) => Boolean(certificate?.title && safeCertificate(certificate.file)));
  const about = partner.about?.length ? partner.about : partner.description ? [partner.description] : [];
  const websites = (partner.websites ?? []).map(safeWebsite).filter((url): url is string => Boolean(url));
  const emails = (partner.emails ?? []).filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));

  return (
    <div className="mx-auto max-w-responsive px-2 pb-16 pt-32 md:px-4 lg:px-8" dir={lang === 'fa' ? 'rtl' : 'ltr'}>
      <Link href={`/${lang === 'fa' ? 'fa' : 'en'}/our-team`}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
        <span aria-hidden="true">{lang === 'fa' ? '→' : '←'}</span> {ui.backToTeam}
      </Link>
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
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
                  className="break-all text-sm text-primary underline-offset-4 hover:underline">{new URL(url).hostname.replace(/^www\./, '')} </Link></div>)}
              </div>
            )}
            {emails.length > 0 && (
              <div>
                <h2 className="mb-1 text-sm font-semibold uppercase text-gray-600">{ui.emails}</h2>
                {emails.map((email) => <div key={email} dir="ltr" className={lang === 'fa' ? 'text-right' : 'text-start'}><a className="break-all text-sm text-primary hover:underline" href={`mailto:${email}`}>{email}</a></div>)}
              </div>
            )}
            {!!partner.phones?.length && (
              <div>
                <h2 className="mb-1 text-sm font-semibold uppercase text-gray-600">{ui.phones}</h2>
                {partner.phones.map((phone) => <div key={phone} dir="ltr" className={lang === 'fa' ? 'text-right' : 'text-start'}>{phoneHref(phone)
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
          {/* Certificates are the final item in the left information column on both pages. */}
          <AffiliateCertificates
            certificates={certificates}
            title={ui.certificates}
            emptyLabel={ui.noCertificates}
            viewLabel={ui.viewCertificate}
          />
        </aside>

        {/* Both affiliate routes share the same profile, with a route-specific form. */}
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

          <section className="mt-6 rounded-xl border border-[#E9DED1] bg-white p-2 shadow md:p-6"
            aria-label={props.formVariant === 'application' ? (lang === 'fa' ? 'فرم درخواست افیلیت' : 'Affiliate application') : props.formLabels.formTitle}>
            {props.formVariant === 'application' ? (
              <AffiliateApplicationForm slug={partner.slug} affiliateName={partner.name} lang={lang} />
            ) : (
              <AffiliateContactForm affiliateName={partner.name} affiliateSlug={partner.slug} labels={props.formLabels} />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
