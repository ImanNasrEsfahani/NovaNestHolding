import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

type Item = {
  title: string;
  image: string;
  href?: string;
  alt?: string;
  backgroundPosition?: string;
  backgroundSize?: string;
};

type Props = {
  heading: string;
  items: Item[];
  className?: string;
};

export default function Businesses({ heading, items = [], className = '' }: Props) {
  return (
    <div className={`w-full max-w-responsive mx-auto px-2 lg:px-4 ${className}`}>
      <h3 className="text-3xl font-header font-bold text-gray-800 text-center mb-12">{heading}</h3>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 lg:gap-6">
        {items.map((it, idx) => {
          const backgroundPosition = it.backgroundPosition ?? 'center';
          const backgroundSize = it.backgroundSize ?? 'cover';

          const Card = (
            <article
              key={idx}
              className="group relative rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow duration-200"
              aria-labelledby={`cat-${idx}`}
            >
              <div className="relative w-full h-44 md:h-56">
                <div
                  className="absolute inset-0 transform transition-transform duration-200 ease-out group-hover:scale-105"
                  style={{
                    backgroundImage: `url(${it.image})`,
                    backgroundPosition,
                    backgroundSize,
                    backgroundRepeat: 'no-repeat'
                  }}
                  role="img"
                  aria-label={it.alt ?? it.title}
                />

                {/* gradient caption */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-emerald-800/90 via-emerald-700/70 to-transparent px-4 py-3">
                  <h4
                    id={`cat-${idx}`}
                    className="text-white text-center text-md lg:text-lg font-semibold drop-shadow-sm"
                  >
                    {it.title}
                  </h4>
                </div>
              </div>

              {/* subtle hover lift */}
              <div className="pointer-events-none absolute inset-0 transition-transform duration-200 transform group-hover:-translate-y-0.5" />
            </article>
          );

          return it.href ? (
            <Link key={idx} href={it.href} className="block" aria-label={it.title}>
              {Card}
            </Link>
          ) : (
            Card
          );
        })}
      </div>
    </div>
  );
}