'use client';

import { useLang } from 'stores/langStore';
import i18n from 'i18next';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';
import { languages } from 'app/i18n/setting';

export default function LanguageSwitch() {
  const { lang, setLanguage } = useLang();
  const router = useRouter();
  const pathName = usePathname();
  const persianIsPublic = languages.includes('fa');

  const handleClick = () => {
    if (!persianIsPublic) return;
    const newLanguage = lang === 'en' ? 'fa' : 'en';
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
    setCookie('i18next', newLanguage);
  };

  useEffect(() => {
    if (!persianIsPublic) return;
    const newPath = pathName?.replace(/^\/(en|fa)(?=\/|$)/, `/${lang}`);
    if (newPath && newPath !== pathName) router.push(newPath);
  }, [lang, pathName, router, persianIsPublic]);

  if (!persianIsPublic) return null;

  return (
    <button
      type="button"
      className="mx-auto flex h-10 w-40 flex-shrink-0 cursor-pointer select-none items-center rounded-xl bg-white bg-opacity-50 p-1 backdrop-blur-md md:w-28"
      onClick={handleClick}
      aria-label="Switch website language"
    >
      <span className="flex h-8 w-1/2 items-center justify-center gap-2.5 rounded-[10px] text-black transition-all duration-1000 ltr:bg-white">
        EN
      </span>
      <span className="flex h-8 w-1/2 items-center justify-center gap-2.5 rounded-[10px] text-black transition-all duration-1000 rtl:bg-white">
        FA
      </span>
    </button>
  );
}
