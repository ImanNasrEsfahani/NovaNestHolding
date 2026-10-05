'use client';

import React, { useEffect, useRef, useState } from 'react';
import PersonCard from './PersonCard';
import { Person } from '@/types/global';
import styles from './PeopleCarousel.module.css';

type Props = {
  people: Person[];
};

export default function PeopleCarousel({ people }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // new: detect mobile (matches Tailwind md breakpoint)
  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mq.matches);
    update();
    if (mq.addEventListener) mq.addEventListener('change', update);
    else mq.addListener(update);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', update);
      else mq.removeListener(update);
    };
  }, []);

  // animation speed in pixels per frame (adjust to taste)
  const SPEED_PX_PER_FRAME = 0.2;

  // drag state
  const drag = useRef({
    startX: 0,
    startScrollLeft: 0,
    pointerId: 0
  });

  // RAF loop for auto-scrolling (only for non-mobile horizontal carousel)
  useEffect(() => {
    if (isMobile) return;
    const el = containerRef.current;
    if (!el || people.length === 0) return;

    let rafId = 0;

    const step = () => {
      if (!isHovered && !isDragging) {
        // auto scroll
        el.scrollLeft += SPEED_PX_PER_FRAME;
        // seamless reset when we've scrolled past the duplicated half
        const half = el.scrollWidth / 2;
        if (el.scrollLeft >= half) {
          el.scrollLeft -= half;
        }
      }
      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [isHovered, isDragging, people.length, isMobile]);

  // pointer handlers for drag-to-scroll (only for non-mobile)
  useEffect(() => {
    if (isMobile) return;
    const el = containerRef.current;
    if (!el) return;

    const onPointerDown = (e: PointerEvent) => {
      // only left button or touch
      if (e.pointerType === 'mouse' && e.button !== 0) return;

      (e.target as Element).setPointerCapture(e.pointerId);
      drag.current.pointerId = e.pointerId;
      drag.current.startX = e.clientX;
      drag.current.startScrollLeft = el.scrollLeft;
      setIsDragging(true);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging || drag.current.pointerId !== e.pointerId) return;
      const dx = e.clientX - drag.current.startX;
      el.scrollLeft = drag.current.startScrollLeft - dx;
    };

    const endDrag = (e: PointerEvent) => {
      if (drag.current.pointerId !== e.pointerId) return;
      try {
        (e.target as Element).releasePointerCapture(e.pointerId);
      } catch {}
      drag.current.pointerId = 0;
      setIsDragging(false);
    };

    el.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', endDrag);
      window.removeEventListener('pointercancel', endDrag);
    };
  }, [isDragging, isMobile]);

  // initialize scroll position so duplication starts seamlessly (only for non-mobile)
  useEffect(() => {
    if (isMobile) return;
    const el = containerRef.current;
    if (!el) return;
    // small delay to ensure layout measured
    requestAnimationFrame(() => {
      if (el.scrollLeft === 0) {
        el.scrollLeft = 0;
      }
    });
  }, [people.length, isMobile]);

  return (
    <section className="w-full relative">
      <div className="absolute left-0 top-0 bottom-0 pointer-events-none" />

      {isMobile ? (
        // mobile: vertical list (no auto-scroll, stacked cards)
        <div className="flex flex-col gap-16 py-4 px-4">
          {people.map((person, index) => (
            <div key={`${person.name}-${index}`} className="w-full">
              <PersonCard person={person} />
            </div>
          ))}
        </div>
      ) : (
        // desktop/tablet: horizontal auto-scrolling carousel (existing behavior)
        <div
          ref={containerRef}
          className={`${styles.scrollContainer} flex gap-6 md:gap-8 py-4 px-6 overflow-x-auto scroll-smooth`}
          style={{
            // prevent native touch-action from interfering with our pointer drag
            touchAction: 'pan-y'
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/*
            Keep original horizontal items. If you want infinite seamless effect,
            you can duplicate items here (people.concat(people)), but that was not changed.
          */}
          {people.map((person, index) => (
            <div key={`${person.name}-${index}`} className="flex-shrink-0 w-64 md:w-72">
              <PersonCard person={person} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}