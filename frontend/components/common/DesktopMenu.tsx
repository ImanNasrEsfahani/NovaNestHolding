'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { MenuEntry } from './menuTypes';
import { appHref } from '@/utils/site';

interface DesktopMenuProps {
  menuItems: MenuEntry[];
}

export default function DesktopMenu({ menuItems }: DesktopMenuProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (openIndex === null) return;
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!listRef.current?.contains(event.target as Node)) {
        setOpenIndex(null);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [openIndex]);

  const closeDropdown = () => setOpenIndex(null);

  return (
    <ul ref={listRef} className="menu menu-horizontal items-center justify-center gap-6 px-0 py-0 m-0 h-full text-lg">
      {menuItems.map((item, index) =>
        item.type === 'dropdown' ? (
          <li
            key={item.label}
            className="relative flex items-center justify-center h-full"
            onMouseEnter={() => setOpenIndex(index)}
            onMouseLeave={() => setOpenIndex((prev) => (prev === index ? null : prev))}
          >
            <button
              type="button"
              className="flex items-center justify-center gap-1 px-3 py-2 font-medium hover:text-primary"
              aria-expanded={openIndex === index}
            >
              {item.label}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7" />
              </svg>
            </button>
            <ul
              className={`menu menu-lg absolute items-center left-1/2 -translate-x-1/2 top-3/4 mt-2 w-80 space-y-1 rounded-box bg-[rgba(0,0,0,0.6)] shadow transition-opacity duration-150 ${
                openIndex === index ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'
              }`}
            >
              {(item.submenuItems ?? []).map(({ label, href }) => (
                <li className="w-full" key={label}>
                  <Link href={appHref(href)} className="px-2 py-3 text-white hover:text-primary hover:font-bold" onClick={closeDropdown}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ) : (
          <li key={item.label}>
            <Link href={appHref(item.href)} className="px-3 py-2 font-medium text-white hover:text-primary hover:font-bold">
              {item.label}
            </Link>
          </li>
        )
      )}
    </ul>
  );
}
