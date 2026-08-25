import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { getServerTranslation } from 'app/i18n';
import MobileMenu from './MobileMenu';
import DesktopMenu from './DesktopMenu';
import type { MenuEntry } from './menuTypes';
import { appHref } from '@/utils/site';

export default function Navbar({ lang }: { lang: string }) {
  const { t } = getServerTranslation(lang, 'layout');
  const menuItems = (t('menuItems', { returnObjects: true }) as MenuEntry[]) ?? [];

  return (
    <nav className="navbar p-0 fixed inset-x-0 top-0 z-50 h-20 min-h-20 bg-[rgba(0,0,0,0.6)] backdrop-blur-sm text-white shadow-lg">
      <div className="max-w-responsive w-full mx-auto h-full">
        <div className="navbar-start gap-2 flex flex-grow lg:flex-none lg:!w-auto">
          <MobileMenu menuItems={menuItems} toggleLabel={t('menuToggle', { defaultValue: 'Toggle navigation' })} />
          <Link
            href={appHref('/')}
            className="absolute top-0 left-0 size-full z-[10] lg:relative btn btn-ghost px-2 normal-case flex flex-grow lg:flex-none lg:!w-auto"
          >
            <Image
              src="/static/images/nova-nest-academy.svg"
              alt="Logo"
              width={150}
              height={64}
              className="h-12 w-auto"
              priority
            />
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex flex-grow justify-center h-full">
          <DesktopMenu menuItems={menuItems} />
        </div>

        <div className="navbar-end hidden lg:flex flex-none !w-auto gap-2">
          {/* <LanguageSwitch /> */}
        </div>
      </div>
    </nav>
  );
}
