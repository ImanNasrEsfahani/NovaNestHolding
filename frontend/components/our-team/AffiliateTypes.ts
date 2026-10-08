export type AffiliateRepresentative = {
  name: string;
  position?: string;
  photo?: string;
  biography?: string;
};

export type AffiliateCertificate = {
  title: string;
  issuer?: string;
  issuedAt?: string;
  file: string;
};

export type AffiliatePartner = {
  slug: string;
  name: string;
  category?: string;
  description?: string;
  about?: string[];
  services?: string[];
  certificates?: AffiliateCertificate[];
  logo?: string;
  city?: string;
  address?: string;
  phones?: string[];
  emails?: string[];
  websites?: string[];
  representative?: AffiliateRepresentative;
};

export type AffiliatesContent = {
  title: string;
  description?: string;
  visitWebsiteLabel?: string;
  contactLabel: string;
  representativeLabel: string;
  partners: AffiliatePartner[];
  profile: {
    backToTeam: string;
    about: string;
    services: string;
    certificates: string;
    noCertificates: string;
    viewCertificate: string;
    websites: string;
    phones: string;
    emails: string;
    location: string;
  };
};

export function safeLocalImage(path?: string): string | null {
  return path && /^\/static\/images\/[a-z0-9/_-]+\.(png|jpe?g|webp|svg)$/i.test(path) && !path.includes('..')
    ? path : null;
}

export function safeWebsite(input?: string): string | null {
  if (!input || !/^https?:\/\//i.test(input) || /[\s<>"'\\]/.test(input)) return null;
  try {
    const url = new URL(input);
    if (!['http:', 'https:'].includes(url.protocol) || !url.hostname.includes('.') || url.username || url.password) return null;
    return url.href;
  } catch {
    return null;
  }
}

export function safeCertificate(path?: string): string | null {
  return path && /^\/static\/[a-z0-9/_-]+\.(pdf|png|jpe?g|webp)$/i.test(path) && !path.includes('..')
    ? path : null;
}

export function initials(name: string): string {
  return name.trim().split(/\s+/).slice(0, 2).map((word) => word.charAt(0)).join('').toUpperCase();
}

