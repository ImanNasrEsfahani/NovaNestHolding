'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Continuously scrolls at a constant number of CSS pixels per second.
 * A single original set that fits the viewport stays still (no duplicates).
 * Three repeated groups allow invisible wrapping in either direction.
 * Shared by Mentors and Business Affiliates.
 */
export default function useSeamlessAutoScroll(itemCount: number, speed = 22) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const middleGroupRef = useRef<HTMLDivElement>(null);
  const cycleRef = useRef(0);
  const pauseUntilRef = useRef(0);
  const [isLooping, setIsLooping] = useState(false);
  const [repeats, setRepeats] = useState(1);

  useIsomorphicLayoutEffect(() => {
    const viewport = scrollerRef.current;
    const group = middleGroupRef.current;
    if (!viewport || !group) return;

    const check = () => {
      const card = group.firstElementChild as HTMLElement | null;
      if (!card || itemCount < 2) {
        setIsLooping(false);
        return;
      }
      const style = getComputedStyle(viewport);
      const available = viewport.clientWidth - (parseFloat(style.paddingLeft) || 0) - (parseFloat(style.paddingRight) || 0);
      const cardWidth = card.getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(group).columnGap) || 0;
      if (cardWidth > 0 && available > 0) {
        setIsLooping(itemCount * cardWidth + (itemCount - 1) * gap > available + 1);
      }
    };
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(check);
    ro?.observe(viewport);
    const first = group.firstElementChild;
    if (first) ro?.observe(first);
    window.addEventListener('resize', check);
    check();
    return () => { ro?.disconnect(); window.removeEventListener('resize', check); };
  }, [itemCount, isLooping]);

  useIsomorphicLayoutEffect(() => {
    if (isLooping) return;
    cycleRef.current = 0;
    if (scrollerRef.current) scrollerRef.current.scrollLeft = 0;
    setRepeats(1);
  }, [isLooping]);

  const moveBy = useCallback((distance: number) => {
    const node = scrollerRef.current;
    if (!node || !isLooping) return;
    pauseUntilRef.current = performance.now() + 2400;
    node.scrollBy({ left: distance, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }, [isLooping]);

  useEffect(() => {
    const node = scrollerRef.current;
    const middle = middleGroupRef.current;
    if (!isLooping || itemCount < 2 || !node || !middle) return;

    let raf = 0;
    let last = 0;
    let intersecting = true;
    let pointerHeld = false;
    let isReducedMotion = false;
    let drag: { id: number; x: number; left: number; moved: boolean } | null = null;
    let touchStart: { x: number; y: number; left: number; time: number } | null = null;
    let snapAnimation = 0;
    let snapActive = false;
    let suppressClick = false;
    let suppressTimer: ReturnType<typeof setTimeout> | undefined;

    const wrap = () => {
      const width = cycleRef.current;
      if (!width) return 0;
      const before = node.scrollLeft;
      if (before >= width && before < 2 * width) return 0;
      const after = width + (((before - width) % width + width) % width);
      node.scrollLeft = after;
      return after - before;
    };

    const measure = () => {
      const width = middle.getBoundingClientRect().width;
      if (!width || !node.clientWidth) return;
      // Each duplicated group must be at least as wide as the visible area.
      const perRepeat = width / repeats;
      const required = Math.max(1, Math.min(16, Math.ceil((node.clientWidth + 32) / perRepeat)));
      if (required !== repeats) { setRepeats(required); return; }
      const previous = cycleRef.current;
      if (!previous) {
        cycleRef.current = width;
        node.scrollLeft = width;
      } else if (Math.abs(previous - width) > 0.5) {
        const fraction = (((node.scrollLeft - previous) % previous + previous) % previous) / previous;
        cycleRef.current = width;
        node.scrollLeft = width * (1 + fraction);
      }
    };

    const cardStep = () => {
      const first = middle.firstElementChild as HTMLElement | null;
      if (!first) return 0;
      const cardWidth = first.getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(middle).columnGap) || 0;
      return cardWidth + gap;
    };
    const stopSnap = () => {
      if (snapAnimation) cancelAnimationFrame(snapAnimation);
      snapAnimation = 0;
      snapActive = false;
    };
    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) { touchStart = null; return; }
      stopSnap();
      wrap();
      touchStart = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
        left: node.scrollLeft,
        time: performance.now(),
      };
      pointerHeld = true;
    };
    const onTouchEnd = (event: TouchEvent) => {
      const start = touchStart;
      touchStart = null;
      pointerHeld = false;
      if (!start || event.changedTouches.length !== 1) return;
      const dx = event.changedTouches[0].clientX - start.x;
      const dy = event.changedTouches[0].clientY - start.y;
      // Preserve normal page vertical scrolling and taps on profile cards.
      if (Math.abs(dx) < 25 || Math.abs(dx) <= Math.abs(dy) * 1.15) {
        pauseUntilRef.current = performance.now() + 250;
        return;
      }
      const step = cardStep();
      if (step <= 0 || isReducedMotion) {
        pauseUntilRef.current = performance.now() + 250;
        return;
      }
      // One swipe = exactly one card, irrespective of swipe velocity.
      // Find the nearest card boundary at the beginning of the gesture.
      const base = cycleRef.current;
      const origin = base + Math.round((start.left - base) / step) * step;
      const target = origin + (dx < 0 ? step : -step);
      // Force an explicit snap, cancelling browser momentum scrolling.
      // Start at the current physical scroll position for a smooth landing.
      const from = node.scrollLeft;
      const begin = performance.now();
      const duration = 320;
      snapActive = true;
      pauseUntilRef.current = begin + duration + 180;
      const animate = (now: number) => {
        const t = Math.min(1, (now - begin) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        node.scrollLeft = from + (target - from) * eased;
        if (t < 1) snapAnimation = requestAnimationFrame(animate);
        else {
          node.scrollLeft = target;
          wrap();
          snapActive = false;
          snapAnimation = 0;
        }
      };
      snapAnimation = requestAnimationFrame(animate);
    };
    const onTouchCancel = () => {
      touchStart = null;
      pointerHeld = false;
      pauseUntilRef.current = performance.now() + 250;
    };
    const onDown = (event: PointerEvent) => {
      pointerHeld = true;
      if (event.pointerType !== 'touch') pauseUntilRef.current = performance.now() + 2400;
      if (event.pointerType === 'mouse' && event.button === 0)
        drag = { id: event.pointerId, x: event.clientX, left: node.scrollLeft, moved: false };
    };
    const onMove = (event: PointerEvent) => {
      if (!drag || drag.id !== event.pointerId) return;
      if (Math.abs(event.clientX - drag.x) > 6) drag.moved = true;
      if (!drag.moved) return;
      event.preventDefault();
      node.scrollLeft = drag.left - (event.clientX - drag.x);
      drag.left += wrap();
    };
    const onUp = (event: PointerEvent) => {
      pointerHeld = false;
      if (event.pointerType !== 'touch') pauseUntilRef.current = performance.now() + 2400;
      if (drag?.id === event.pointerId) {
        if (drag.moved) {
          suppressClick = true;
          if (suppressTimer) clearTimeout(suppressTimer);
          suppressTimer = setTimeout(() => { suppressClick = false; }, 220);
        }
        drag = null;
      }
    };
    const onClick = (event: MouseEvent) => {
      if (!suppressClick) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      suppressClick = false;
    };
    const onWheel = () => { pauseUntilRef.current = performance.now() + 2400; };
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion = () => { isReducedMotion = mq.matches; };
    onMotion();
    mq.addEventListener?.('change', onMotion);
    const io = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting;
      last = 0; // Don't jump after the carousel returns to view.
    });
    io?.observe(node);
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    ro?.observe(node);
    ro?.observe(middle);
    node.addEventListener('touchstart', onTouchStart, { passive: true });
    node.addEventListener('touchend', onTouchEnd, { passive: true });
    node.addEventListener('touchcancel', onTouchCancel, { passive: true });
    node.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    node.addEventListener('wheel', onWheel, { passive: true });
    node.addEventListener('click', onClick, true);
    node.addEventListener('scroll', wrap, { passive: true });
    window.addEventListener('resize', measure);
    measure();

    const frame = (now: number) => {
      const dt = last ? Math.min(50, now - last) : 0;
      last = now;
      // Keep the same slow pace on all screens; don't pause just because
      // the mouse happens to be hovering over a card.
      if (dt > 0 && intersecting && !document.hidden && !isReducedMotion &&
          !pointerHeld && !drag && !snapActive && !node.contains(document.activeElement) &&
          now >= pauseUntilRef.current && cycleRef.current > 0) {
        node.scrollLeft += speed * dt / 1000;
        wrap();
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      stopSnap();
      ro?.disconnect(); io?.disconnect();
      mq.removeEventListener?.('change', onMotion);
      node.removeEventListener('touchstart', onTouchStart);
      node.removeEventListener('touchend', onTouchEnd);
      node.removeEventListener('touchcancel', onTouchCancel);
      node.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      node.removeEventListener('wheel', onWheel);
      node.removeEventListener('click', onClick, true);
      node.removeEventListener('scroll', wrap);
      window.removeEventListener('resize', measure);
      if (suppressTimer) clearTimeout(suppressTimer);
    };
  }, [isLooping, itemCount, repeats, speed]);

  return { scrollerRef, middleGroupRef, repeats, isLooping, moveBy };
}
