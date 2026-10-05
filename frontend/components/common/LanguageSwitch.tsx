"use client";
import { useLang } from 'stores/langStore';
import i18n from 'i18next';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { setCookie } from 'cookies-next';

export default function LanguageSwitch() {
  const { lang, setLanguage } = useLang();
  const router = useRouter();
  const pathName = usePathname();

  const handleClick = () => {
    const newLanguage = lang === 'en' ? 'fa' : 'en';
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
    setCookie("i18next", newLanguage);
  };

  useEffect(() => {
    const newPath = pathName?.replace(/^\/(en|fa)/, `/${lang}`);
    if (newPath && newPath !== pathName) {
      router.push(newPath);
    }
  }, [lang, pathName, router]);

  return (
    <div
      className="mx-auto flex h-10 w-40 flex-shrink-0 cursor-pointer select-none items-center rounded-xl bg-white bg-opacity-50 p-1 backdrop-blur-md md:w-28"
      onClick={handleClick}
    >
      <div
        className={`flex h-8 w-1/2 items-center justify-center gap-2.5 rounded-[10px] text-black transition-all duration-1000 ltr:bg-white`}
      >
        EN
      </div>
      <div
        className={`flex h-8 w-1/2 items-center justify-center gap-2.5 rounded-[10px] text-black transition-all duration-1000 rtl:bg-white`}
      >
        FA
      </div>
    </div>
  );
}
