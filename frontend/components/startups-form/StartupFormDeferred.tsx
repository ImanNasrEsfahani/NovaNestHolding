'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import type { ComponentProps } from 'react';
import type StartupFormFormClient from './StartupFormFormClient';

type Props = ComponentProps<typeof StartupFormFormClient>;

// Do not download/hydrate the full validation form, its three business-stage
// variants and react-hook-form until a visitor approaches the form section.
const StartupFormClient = dynamic<Props>(() => import('./StartupFormFormClient'), {
  ssr: false,
  loading: () => <div role="status" className="mx-auto max-w-responsive px-6 py-12 text-center">Loading the application form…</div>,
});

export default function StartupFormDeferred(props: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const isFarsi = props.lang === 'fa';

  useEffect(() => {
    if (ready) return;
    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setReady(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: '650px 0px', threshold: 0 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ready]);

  return (
    <div ref={sectionRef} id="startup-validation-form" className="min-h-[220px]">
      {ready ? (
        <StartupFormClient {...props} />
      ) : (
        <div className="mx-auto flex min-h-[220px] max-w-responsive items-center justify-center px-6 py-10">
          <button
            type="button"
            onClick={() => setReady(true)}
            className="rounded-lg border border-primary px-6 py-3 text-sm font-medium text-gray-800 hover:bg-whiteGold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            {isFarsi ? 'نمایش فرم درخواست' : 'Load application form'}
          </button>
        </div>
      )}
    </div>
  );
}
