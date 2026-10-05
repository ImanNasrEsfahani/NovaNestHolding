'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { MenuEntry } from './menuTypes';
import { appHref } from '@/utils/site';

interface MobileMenuProps {
  menuItems: MenuEntry[];
  toggleLabel: string;
}

export default function MobileMenu({ menuItems, toggleLabel }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setOpenIndex(null);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (!next) setOpenIndex(null);
      return next;
    });
  };
  const closeMenu = () => {
    setIsOpen(false);
    setOpenIndex(null);
  };

  return (
    <div ref={wrapperRef} className="relative z-[100] lg:hidden">
      <button
        type="button"
        aria-label={toggleLabel}
        aria-expanded={isOpen}
        aria-controls="mobile-nav-menu"
        onClick={toggleMenu}
        className="btn btn-ghost btn-circle h-full"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      </button>

      {isOpen && (
        <ul
          id="mobile-nav-menu"
          className="menu menu-lg absolute left-0 mt-3 z-50 min-w-[70vw] space-y-2 rounded-box bg-[rgba(255,255,255,0.9)] p-3 shadow"
        >
          {menuItems.map((item, index) =>
            item.type === 'dropdown' ? (
              <li key={item.label}>
                <div className="flex flex-col">
                  <button
                    type="button"
                    aria-expanded={openIndex === index}
                    onClick={() => setOpenIndex((prev) => (prev === index ? null : index))}
                    className="w-full text-left font-medium text-base-content hover:text-primary flex items-center justify-between px-2 py-2"
                  >
                    {item.label}
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${openIndex === index ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7" />
                    </svg>
                  </button>

                  {openIndex === index && (
                    <ul className="w-full space-y-1 p-2">
                      {(item.submenuItems ?? []).map(({ label, href }) => (
                        <li key={label}>
                          <Link
                            href={appHref(href)}
                            className="whitespace-nowrap text-base-content hover:text-primary block px-2 py-2"
                            onClick={closeMenu}
                          >
                            {label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ) : (
              <li key={item.label}>
                <Link href={appHref(item.href)} className="whitespace-nowrap text-base-content hover:text-primary" onClick={closeMenu}>
                  {item.label}
                </Link>
              </li>
            )
          )}
          <li className="mt-12">{/* <LanguageSwitch /> */}</li>
        </ul>
      )}
    </div>
  );
}
