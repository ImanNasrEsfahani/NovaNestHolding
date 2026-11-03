'use client';

import { usePathname, useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';
import { languages } from 'app/i18n/setting';

/** Language comes from the URL, not a mutable process-wide Zustand store. */
export default function LanguageSwitch() {
  const router = useRouter();
  const pathname = usePathname();
  const persianIsPublic = languages.includes('fa');
  const currentLanguage = pathname?.split('/')[1] === 'fa' ? 'fa' : 'en';

  const handleClick = () => {
    if (!persianIsPublic || !pathname) return;
    const newLanguage = currentLanguage === 'en' ? 'fa' : 'en';
    const newPath = pathname.replace(/^\/(en|fa)(?=\/|$)/, `/${newLanguage}`);
    if (newPath === pathname) return;
    setCookie('i18next', newLanguage);
    router.push(newPath);
  };

  if (!persianIsPublic) return null;

  return (
    <button
      type="button"
      className="mx-auto flex h-10 w-40 flex-shrink-0 cursor-pointer select-none items-center rounded-xl bg-white bg-opacity-50 p-1 backdrop-blur-md md:w-28"
      onClick={handleClick}
      aria-label="Switch website language"
    >
      <span className="flex h-8 w-1/2 items-center justify-center gap-2.5 rounded-[10px] text-black transition-all duration-1000 ltr:bg-white">EN</span>
      <span className="flex h-8 w-1/2 items-center justify-center gap-2.5 rounded-[10px] text-black transition-all duration-1000 rtl:bg-white">FA</span>
    </button>
  );
}
