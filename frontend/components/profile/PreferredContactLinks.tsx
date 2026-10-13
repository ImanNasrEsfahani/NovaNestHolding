import type { ReactNode } from 'react';
import type { Person } from '@/types/global';
import profileContactLinks from './profileContactLinks.json';
import { PhoneIcon, GlobeAltIcon, PaperAirplaneIcon, PlayIcon, CodeBracketIcon, MusicalNoteIcon } from '@heroicons/react/24/outline';
import Instagram from '@/components/icons/footer/Instagram';
import LinkedIn from '@/components/icons/footer/LinkedIn';
import Whatsapp from '@/components/icons/footer/Whatsapp';
import Facebook from '@/components/icons/footer/Facebook';
import Envelope from '@/components/icons/footer/Envelope';

/**
 * An ordered, per-person list. Unknown platform names are deliberately supported:
 * supply a safe https URL and a label; they appear with a generic website icon.
 * Entries are opt-in and do not affect any other member's profile.
 */
export type ProfileContactLink = {
  type: string; // phone, whatsapp, email, linkedin, instagram, facebook, website, telegram, x, youtube, github, tiktok, or custom
  value: string; // phone number, email address, or HTTPS profile URL, depending on type
  label?: string;
  message?: string; // Optional WhatsApp message prefill; never sends automatically
};

type ContactablePerson = Person & { contactLinks?: ProfileContactLink[] };
type ResolvedContact = { key: string; href: string; label: string; icon: ReactNode; external: boolean };

const validTelephone = (value: string): string | null => {
  const trimmed = value.trim();
  // Reject characters that could inject an unexpected URI payload.
  if (!/^[+\d\s().-]+$/.test(trimmed)) return null;
  const normalized = trimmed.replace(/[\s().-]/g, '');
  return /^\+?\d{7,15}$/.test(normalized) ? normalized : null;
};

const safeExternalUrl = (value: string): string | null => {
  try {
    const uri = new URL(value);
    return uri.protocol === 'https:' && !!uri.hostname && !uri.username && !uri.password
      ? uri.href
      : null;
  } catch {
    return null;
  }
};

function resolveContact(link: ProfileContactLink): ResolvedContact | null {
  if (!link || typeof link.type !== 'string' || typeof link.value !== 'string') return null;
  const type = link.type.toLowerCase().trim();
  const value = link.value.trim();
  const title = typeof link.label === 'string' && link.label.trim() ? link.label.trim() : type;
  let href: string | null = null;
  let icon: ReactNode = <GlobeAltIcon className="h-5 w-5" aria-hidden="true" />;
  let external = false;

  if (type === 'phone' || type === 'tel') {
    const number = validTelephone(value);
    if (!number) return null;
    href = `tel:${number}`;
    icon = <PhoneIcon className="h-5 w-5" aria-hidden="true" />;
  } else if (type === 'whatsapp') {
    const number = validTelephone(value);
    if (!number) return null;
    const message = typeof link.message === 'string' ? link.message.trim() : '';
    href = `https://wa.me/${number.replace('+', '')}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
    icon = <Whatsapp />;
    external = true;
  } else if (type === 'email' || type === 'mail') {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return null;
    href = `mailto:${value}`;
    icon = <Envelope />;
  } else {
    href = safeExternalUrl(value);
    if (!href) return null;
    external = true;
    if (type === 'instagram') icon = <Instagram />;
    else if (type === 'linkedin') icon = <LinkedIn />;
    else if (type === 'facebook') icon = <Facebook />;
    else if (type === 'telegram') icon = <PaperAirplaneIcon className="h-5 w-5" aria-hidden="true" />;
    else if (type === 'youtube') icon = <PlayIcon className="h-5 w-5" aria-hidden="true" />;
    else if (type === 'github') icon = <CodeBracketIcon className="h-5 w-5" aria-hidden="true" />;
    else if (type === 'tiktok') icon = <MusicalNoteIcon className="h-5 w-5" aria-hidden="true" />;
    else if (type === 'x' || type === 'twitter') icon = <span className="text-base font-bold" aria-hidden="true">𝕏</span>;
  }

  if (!href) return null;
  return { key: `${type}:${href}`, href, label: title, icon, external };
}

export default function PreferredContactLinks({ person }: { person: Person }) {
  const data = person as ContactablePerson;
  // Backward compatibility: existing profiles keep LinkedIn/Instagram as before.
  // Once a contactLinks array is present, only its items are shown in its stated order.
  // A person can override the default directory in ourTeam.json via contactLinks.
  // Otherwise use the per-slug JSON configuration, then legacy LinkedIn/Instagram.
  const configured = (profileContactLinks as Record<string, ProfileContactLink[]>)[person.slug];
  const items: ProfileContactLink[] = Array.isArray(data.contactLinks)
    ? data.contactLinks
    : Array.isArray(configured)
      ? configured
      : [
          ...(person.linkedin ? [{ type: 'linkedin', value: person.linkedin, label: 'LinkedIn' }] : []),
          ...(person.instagram ? [{ type: 'instagram', value: person.instagram, label: 'Instagram' }] : []),
        ];

  const contacts = items
    .map(resolveContact)
    .filter((item): item is ResolvedContact => item !== null)
    .filter((item, index, array) => array.findIndex((other) => other.href === item.href) === index);

  if (!contacts.length) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-2" aria-label="Preferred contact methods">
      {contacts.map((contact) => (
        <a
          key={contact.key}
          href={contact.href}
          title={contact.label}
          aria-label={contact.label}
          {...(contact.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E9DED1] bg-white text-gray-600 transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {contact.icon}
        </a>
      ))}
    </div>
  );
}
