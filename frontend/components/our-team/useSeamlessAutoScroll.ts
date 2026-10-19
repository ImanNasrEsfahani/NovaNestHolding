'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

// Measure the carousel before its first browser paint, without running a
// layout effect during server-side rendering.
const useClientLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Responsive, seamless horizontal carousel behavior for Our Team.
 *
 * Only enable the infinite loop when the ORIGINAL, unique cards do not fit
 * inside the available viewport. Otherwise show each card exactly once and
 * keep the row stationary. The decision follows actual card/viewport sizes,
 * not hard-coded mobile/tablet/desktop breakpoints.
 *
 * While looping, three identical groups are rendered. The middle group is
 * the starting position; crossing a group boundary is visually seamless.
 */
export default function useSeamlessAutoScroll(itemCount: number, speed = 15) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const middleGroupRef = useRef<HTMLDivElement>(null);
  const cycleWidthRef = useRef(0);
  const pauseUntilRef = useRef(0);
  const [repeats, setRepeats] = useState(1);
  const [isLooping, setIsLooping] = useState(false);

  const moveBy = useCallback((distance: number) => {
    const element = scrollerRef.current;
    if (!element || !isLooping) return;
    pauseUntilRef.current = performance.now() + 2200;
    element.scrollBy({
      left: distance,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }, [isLooping]);

  // Determine whether ONE copy of the original cards fits, regardless of
  // how many extra copies the seamless scrolling mode currently renders.
  useClientLayoutEffect(() => {
    const element = scrollerRef.current;
    const middle = middleGroupRef.current;
    if (!element || !middle) return;

    const firstCard = middle.firstElementChild as HTMLElement | null;
    const measureFit = () => {
      if (itemCount < 2 || !firstCard) {
        setIsLooping((previous) => previous ? false : previous);
        return;
      }

      const cardWidth = firstCard.getBoundingClientRect().width;
      const gap = parseFloat(window.getComputedStyle(middle).columnGap) || 0;
      const containerStyle = window.getComputedStyle(element);
      const paddingLeft = parseFloat(containerStyle.paddingLeft) || 0;
      const paddingRight = parseFloat(containerStyle.paddingRight) || 0;
      const viewportWidth = element.clientWidth - paddingLeft - paddingRight;
      if (cardWidth <= 0 || viewportWidth <= 0) return;

      const uniqueCardsWidth = itemCount * cardWidth + (itemCount - 1) * gap;
      const shouldLoop = uniqueCardsWidth > viewportWidth + 1;
      setIsLooping((previous) => previous === shouldLoop ? previous : shouldLoop);
    };

    const observer = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(measureFit)
      : null;
    observer?.observe(element);
    if (firstCard) observer?.observe(firstCard);
    window.addEventListener('resize', measureFit);
    measureFit();

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measureFit);
    };
  }, [itemCount, isLooping]);

  // When a carousel becomes stationary after resizing, return to the start.
  useClientLayoutEffect(() => {
    if (isLooping) return;
    cycleWidthRef.current = 0;
    const element = scrollerRef.current;
    if (element) element.scrollLeft = 0;
  }, [isLooping]);

  useEffect(() => {
    const element = scrollerRef.current;
    const middle = middleGroupRef.current;
    if (!isLooping || !element || !middle || itemCount < 2) {
      cycleWidthRef.current = 0;
      return;
    }

    let frame = 0;
    let lastFrame: number | null = null;
    let visible = true;
    let hovered = false;
    let pointerDown = false;
    let reducedMotion = false;
    let drag: { id: number; x: number; start: number; moved: boolean } | null = null;
    let suppressNextClick = false;
    let suppressClickTimer: ReturnType<typeof setTimeout> | undefined;

    // Return the scroll correction so dragging stays continuous at wraps.
    const wrap = () => {
      const cycle = cycleWidthRef.current;
      if (cycle <= 0) return 0;
      const previous = element.scrollLeft;
      if (previous >= cycle && previous < 2 * cycle) return 0;
      const normalized = cycle + (((previous - cycle) % cycle + cycle) % cycle);
      element.scrollLeft = normalized;
      return normalized - previous;
    };

    const measure = () => {
      const cycle = middle.getBoundingClientRect().width;
      const viewport = element.clientWidth;
      if (cycle <= 0 || viewport <= 0) return;

      // Make each group wider than the viewport for seamless wraps.
      const widthPerRepetition = cycle / repeats;
      const needed = Math.max(1, Math.min(12, Math.ceil((viewport + 24) / widthPerRepetition)));
      if (needed !== repeats) {
        setRepeats(needed);
        return;
      }

      const oldCycle = cycleWidthRef.current;
      if (oldCycle === 0) {
        cycleWidthRef.current = cycle;
        element.scrollLeft = cycle;
      } else if (Math.abs(cycle - oldCycle) > 0.5) {
        // Keep the same relative card position after resizing or font loading.
        const logicalPosition = (((element.scrollLeft - oldCycle) % oldCycle + oldCycle) % oldCycle);
        cycleWidthRef.current = cycle;
        element.scrollLeft = cycle + (logicalPosition / oldCycle) * cycle;
      } else {
        cycleWidthRef.current = cycle;
      }
    };

    const handleEnter = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') hovered = true;
    };
    const handleLeave = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') hovered = false;
    };
    const handleDown = (event: PointerEvent) => {
      pointerDown = true;
      pauseUntilRef.current = performance.now() + 2200;
      if (event.pointerType === 'mouse' && event.button === 0) {
        drag = { id: event.pointerId, x: event.clientX, start: element.scrollLeft, moved: false };
      }
    };
    const handleMove = (event: PointerEvent) => {
      if (!drag || drag.id !== event.pointerId) return;
      const distance = event.clientX - drag.x;
      if (Math.abs(distance) > 6) drag.moved = true;
      if (!drag.moved) return;
      event.preventDefault();
      element.scrollLeft = drag.start - distance;
      drag.start += wrap();
    };
    const handleUp = (event: PointerEvent) => {
      pointerDown = false;
      pauseUntilRef.current = performance.now() + 2200;
      if (drag?.id === event.pointerId) {
        if (drag.moved) {
          // Prevent an accidental profile visit at the end of a drag.
          suppressNextClick = true;
          if (suppressClickTimer) clearTimeout(suppressClickTimer);
          suppressClickTimer = setTimeout(() => { suppressNextClick = false; }, 180);
        }
        drag = null;
      }
    };
    const handleClick = (event: MouseEvent) => {
      if (!suppressNextClick) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      suppressNextClick = false;
    };
    const handleWheel = () => {
      pauseUntilRef.current = performance.now() + 2200;
    };

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => { reducedMotion = mediaQuery.matches; };
    updateMotionPreference();
    if (mediaQuery.addEventListener) mediaQuery.addEventListener('change', updateMotionPreference);
    else mediaQuery.addListener(updateMotionPreference);

    const intersection = typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0 })
      : null;
    intersection?.observe(element);

    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    observer?.observe(element);
    observer?.observe(middle);
    window.addEventListener('resize', measure);
    element.addEventListener('pointerenter', handleEnter);
    element.addEventListener('pointerleave', handleLeave);
    element.addEventListener('pointerdown', handleDown);
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleUp);
    element.addEventListener('wheel', handleWheel, { passive: true });
    element.addEventListener('click', handleClick, true);
    element.addEventListener('scroll', wrap, { passive: true });

    measure();
    const tick = (now: number) => {
      const elapsed = lastFrame === null ? 0 : Math.min(64, now - lastFrame);
      lastFrame = now;
      if (
        elapsed > 0 && visible && !document.hidden && !reducedMotion && !hovered &&
        !pointerDown && !drag && !element.contains(document.activeElement) &&
        now >= pauseUntilRef.current && cycleWidthRef.current > 0
      ) {
        element.scrollLeft += (speed * elapsed) / 1000;
        wrap();
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      intersection?.disconnect();
      window.removeEventListener('resize', measure);
      element.removeEventListener('pointerenter', handleEnter);
      element.removeEventListener('pointerleave', handleLeave);
      element.removeEventListener('pointerdown', handleDown);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleUp);
      element.removeEventListener('wheel', handleWheel);
      element.removeEventListener('click', handleClick, true);
      element.removeEventListener('scroll', wrap);
      if (mediaQuery.removeEventListener) mediaQuery.removeEventListener('change', updateMotionPreference);
      else mediaQuery.removeListener(updateMotionPreference);
      if (suppressClickTimer) clearTimeout(suppressClickTimer);
    };
  }, [itemCount, isLooping, repeats, speed]);

  return { scrollerRef, middleGroupRef, repeats, isLooping, moveBy };
}
