'use client';

import { ChevronRightIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { localizedHref } from '@/utils/site';
import { useSubmit } from 'stores/dataStore';
import { UnifiedFormSubmit } from '@/components/common/form/UnifiedFormSubmit';

type ButtonProps = {
  lang?: string;
  text: string;
  type?: 'simple-link' | 'button' | 'reset' | 'submit' | 'link';
  href?: string;
  disabled?: boolean;
  /** A form-local loading state overrides the legacy Zustand send flag. */
  loading?: boolean;
  loadingText?: string;
  /** Retained for compatibility; field errors should appear at their fields. */
  errorList?: string[];
  bgColor?: 'primary' | 'secondary' | 'white' | 'black' | 'transparent';
};

export default function ButtonRefactor({
  lang = 'en', text, type = 'button', href, disabled = false,
  loading, loadingText, bgColor = 'black'
}: ButtonProps) {
  const pathname = usePathname();
  const legacySending = useSubmit((state) => state.send);
  const currentLocale = pathname?.split('/')[1];
  const activeLang = currentLocale === 'fa' || currentLocale === 'en' ? currentLocale : lang;
  const isFa = activeLang === 'fa';
  const baseClasses = 'delay-50 flex h-[50px] w-full flex-wrap place-content-center rounded-xl text-white transition duration-150 ease-in-out py-4';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'hover:bg-primary';
  const bgClass = `bg-${bgColor}`;
  const resolvedHref = href ? localizedHref(href, activeLang) : undefined;

  if (type === 'simple-link') {
    if (!resolvedHref) return null;
    return (
      <a href={resolvedHref} className={`${bgClass} ${baseClasses} ${disabledClasses}`}
        aria-disabled={disabled} onClick={(e) => disabled && e.preventDefault()}>
        {text} <ChevronRightIcon className="ml-4 mt-1 size-5 rtl:rotate-180" />
      </a>
    );
  }

  if (type === 'link') {
    if (!resolvedHref) return null;
    if (disabled) {
      return (
        <div className="group relative w-full overflow-hidden">
          <button disabled className={`${bgClass} ${baseClasses} ${disabledClasses}`} aria-disabled>
            <div className="z-10 flex flex-row-reverse items-center gap-2 px-8 py-4">
              <ChevronRightIcon className="size-5 rtl:rotate-180" /><span className="text-md">{text}</span>
            </div>
          </button>
        </div>
      );
    }
    return (
      <Link href={resolvedHref} className="group relative w-full overflow-hidden">
        <button className={`${bgClass} ${baseClasses} ${disabledClasses}`}>
          <div className="z-10 flex flex-row-reverse items-center gap-2 px-8 py-4">
            <ChevronRightIcon className="size-5 rtl:rotate-180" /><span className="text-md">{text}</span>
          </div>
        </button>
      </Link>
    );
  }

  if (type === 'submit') {
    // Older forms set Zustand's `send` to true during the HTTP request;
    // newer forms may supply their own react-hook-form loading state.
    const busy = loading ?? legacySending;
    return (
      <div className="group relative flex w-full flex-col items-center justify-center">
        <UnifiedFormSubmit
          lang={isFa ? 'fa' : 'en'}
          label={text}
          loadingLabel={loadingText || (isFa ? 'در حال ارسال…' : 'Sending…')}
          busy={busy}
          disabled={disabled}
          background={bgColor}
          className="w-44 md:w-52"
        />
      </div>
    );
  }

  return (
    <div className="group relative flex w-full flex-col items-center justify-center overflow-hidden">
      <button type={type} disabled={disabled} className={`${bgClass} ${baseClasses} ${disabledClasses} w-44 p-2 md:w-52`} aria-disabled={disabled}>
        <div className="z-10 flex flex-row items-center gap-2 rtl:flex-row-reverse"><span>{text}</span></div>
      </button>
    </div>
  );
}
