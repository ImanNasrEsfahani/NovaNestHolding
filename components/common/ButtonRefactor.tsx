'use client';

import { ChevronRightIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { appHref } from '@/utils/site';

type ButtonProps = {
  lang?: string;
  text: string;
  type?: 'simple-link' | 'button' | 'reset' | 'submit' | 'link';
  href?: string;
  disabled?: boolean;
  errorList?: string[];
  bgColor?: 'primary' | 'secondary' | 'white' | 'black' | 'transparent';
};

export default function ButtonRefactor({
  lang = "en",
  text,
  type = 'button',
  href,
  disabled = false,
  errorList,
  bgColor = 'black'
}: ButtonProps) {
  const baseClasses = `delay-50 flex h-[50px] w-full flex-wrap place-content-center rounded-xl text-white transition duration-150 ease-in-out py-4`;
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'hover:bg-primary';
  const bgClass = `bg-${bgColor}`;
  const resolvedHref = href ? appHref(href) : undefined;

  // simple anchor link (no client navigation)
  if (type === 'simple-link') {
    if (!resolvedHref) return null;
    return (
      <a
        href={resolvedHref}
        className={`${bgClass} ${baseClasses} ${disabledClasses}`}
        aria-disabled={disabled}
        onClick={(e) => disabled && e.preventDefault()}
      >
        {text} <ChevronRightIcon className="ml-4 mt-1 size-5 rtl:rotate-180" />
      </a>
    );
  }

  // client Link variant: when disabled render a non-link button to avoid navigation
  if (type === 'link') {
    if (!resolvedHref) return null;
    if (disabled) {
      return (
        <div className="group relative w-full overflow-hidden">
          <button
            disabled
            className={`${bgClass} ${baseClasses} ${disabledClasses}`}
            aria-disabled
          >
            <div className="z-10 flex flex-row-reverse items-center gap-2 px-8 py-4">
              <ChevronRightIcon className="size-5 rtl:rotate-180" />
              <span className="text-md">{text}</span>
            </div>
          </button>
        </div>
      );
    }

    return (
      <Link href={resolvedHref} className="group relative w-full overflow-hidden">
        <button className={`${bgClass} ${baseClasses} ${disabledClasses}`}>
          <div className="z-10 flex flex-row-reverse items-center gap-2 px-8 py-4">
            <ChevronRightIcon className="size-5 rtl:rotate-180" />
            <span className="text-md">{text}</span>
          </div>
        </button>
      </Link>
    );
  }

  // button / submit / reset
  return (
    <div className="group relative w-full flex flex-col justify-center items-center overflow-hidden">
      {disabled ? (
        <>
          <p className="text-red-600 text-sm mb-2">{lang === 'en' ? 'Please complete the form before submitting.' : 'لطفا قبل از ارسال فرم، تمامی فیلدهای ضروری را پر کنید.'}</p>
          {errorList && errorList.length > 0 ? (
            <ul className="text-red-600 text-sm mb-2">
              {errorList.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          ) : null}
        </>
      ) : null}
      <button
        type={type}
        disabled={disabled}
        className={`${bgClass} ${baseClasses} ${disabledClasses} w-44 md:w-52 p-2`}
        aria-disabled={disabled}
      >
        <div className="z-10 flex flex-row rtl:flex-row-reverse items-center gap-2">
          <span>{text}</span>
        </div>
      </button>
    </div>
  );
}
