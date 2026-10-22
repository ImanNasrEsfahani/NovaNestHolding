'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

const useClientLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** Seamless, responsive carousel shared by Mentors and Business Affiliates. */
export default function useSeamlessAutoScroll(itemCount: number, speed = 110) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const middleGroupRef = useRef<HTMLDivElement>(null);
  const cycleRef = useRef(0);
  const stopUntilRef = useRef(0);
  const snapRef = useRef<((direction?: number, origin?: number) => void) | null>(null);
  const [isLooping, setIsLooping] = useState(false);
  const [repeats, setRepeats] = useState(1);

  useClientLayoutEffect(() => {
    const node = scrollerRef.current;
    const middle = middleGroupRef.current;
    if (!node || !middle) return;
    const measure = () => {
      const card = middle.firstElementChild as HTMLElement | null;
      if (!card || itemCount < 2) { setIsLooping(false); return; }
      const style = getComputedStyle(node);
      const available = node.clientWidth - (parseFloat(style.paddingLeft) || 0) - (parseFloat(style.paddingRight) || 0);
      const cardWidth = card.getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(middle).columnGap) || 0;
      if (available > 0 && cardWidth > 0)
        setIsLooping(itemCount * cardWidth + (itemCount - 1) * gap > available + 1);
    };
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(node);
    if (middle.firstElementChild) observer?.observe(middle.firstElementChild);
    window.addEventListener('resize', measure);
    measure();
    return () => { observer?.disconnect(); window.removeEventListener('resize', measure); };
  }, [itemCount, isLooping]);

  useClientLayoutEffect(() => {
    if (isLooping) return;
    cycleRef.current = 0;
    if (scrollerRef.current) scrollerRef.current.scrollLeft = 0;
    setRepeats(1);
  }, [isLooping]);

  const moveBy = useCallback((distance: number) => {
    if (!isLooping) return;
    snapRef.current?.(distance > 0 ? 1 : -1);
  }, [isLooping]);

  useEffect(() => {
    const node = scrollerRef.current;
    const middle = middleGroupRef.current;
    if (!node || !middle || !isLooping || itemCount < 2) return;

    const previousTouchAction = node.style.touchAction;
    node.style.touchAction = 'pan-y';
    let autoFrame = 0;
    let snapFrame = 0;
    let lastFrame = 0;
    let visible = true;
    let reducedMotion = false;
    let snapping = false;
    let currentPointer: { id: number; x: number; y: number; left: number; moved: boolean; horizontal: boolean } | null = null;
    let blockClick = false;
    let clickTimeout: ReturnType<typeof setTimeout> | undefined;
    let wheelTimeout: ReturnType<typeof setTimeout> | undefined;

    const wrap = () => {
      const cycle = cycleRef.current;
      if (cycle <= 0) return 0;
      const before = node.scrollLeft;
      if (before >= cycle && before < 2 * cycle) return 0;
      node.scrollLeft = cycle + (((before - cycle) % cycle + cycle) % cycle);
      return node.scrollLeft - before;
    };

    const stepWidth = () => {
      const card = middle.firstElementChild as HTMLElement | null;
      if (!card) return 0;
      return card.getBoundingClientRect().width + (parseFloat(getComputedStyle(middle).columnGap) || 0);
    };

    const cancelSnap = () => {
      if (snapFrame) cancelAnimationFrame(snapFrame);
      snapFrame = 0;
      snapping = false;
    };

    const snap = (direction = 0, origin?: number) => {
      const step = stepWidth();
      const cycle = cycleRef.current;
      if (!step || !cycle) return;
      cancelSnap();
      const source = origin === undefined ? node.scrollLeft : origin;
      const index = Math.round((source - cycle) / step);
      const destination = cycle + (index + direction) * step;
      const start = node.scrollLeft;
      const beginning = performance.now();
      const duration = reducedMotion ? 0 : 300;
      snapping = true;
      stopUntilRef.current = beginning + duration + 90;
      const draw = (now: number) => {
        const fraction = duration === 0 ? 1 : Math.min(1, (now - beginning) / duration);
        const eased = 1 - Math.pow(1 - fraction, 3);
        node.scrollLeft = start + (destination - start) * eased;
        if (fraction < 1) snapFrame = requestAnimationFrame(draw);
        else {
          node.scrollLeft = destination;
          wrap();
          snapping = false;
          snapFrame = 0;
        }
      };
      snapFrame = requestAnimationFrame(draw);
    };
    snapRef.current = snap;

    const measureCycle = () => {
      const width = middle.getBoundingClientRect().width;
      if (!width || !node.clientWidth) return;
      const needed = Math.max(1, Math.min(16, Math.ceil((node.clientWidth + 32) / (width / repeats))));
      if (needed !== repeats) { setRepeats(needed); return; }
      const previous = cycleRef.current;
      if (previous === 0) {
        cycleRef.current = width;
        node.scrollLeft = width;
      } else if (Math.abs(previous - width) > 0.5) {
        const position = (((node.scrollLeft - previous) % previous + previous) % previous) / previous;
        cycleRef.current = width;
        node.scrollLeft = width * (1 + position);
      }
    };

    const onDown = (event: PointerEvent) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      cancelSnap();
      wrap();
      currentPointer = { id: event.pointerId, x: event.clientX, y: event.clientY, left: node.scrollLeft, moved: false, horizontal: false };
      stopUntilRef.current = Number.POSITIVE_INFINITY;
      // Capture release events even when the finger or mouse leaves the carousel.
      try { node.setPointerCapture(event.pointerId); } catch { /* Browser may have cancelled this pointer. */ }
    };
    const onMove = (event: PointerEvent) => {
      const gesture = currentPointer;
      if (!gesture || gesture.id !== event.pointerId) return;
      // Recover when a mouse release happened outside the browser window.
      if (event.pointerType === 'mouse' && event.buttons === 0) {
        finishGesture(event);
        return;
      }
      const dx = event.clientX - gesture.x;
      const dy = event.clientY - gesture.y;
      if (!gesture.horizontal && Math.abs(dx) > 7 && Math.abs(dx) > Math.abs(dy) * 1.15) gesture.horizontal = true;
      if (!gesture.horizontal) return;
      gesture.moved = true;
      if (event.cancelable) event.preventDefault();
      node.scrollLeft = gesture.left - dx;
      gesture.left += wrap();
    };
    const finishGesture = (event: PointerEvent, cancelled = false) => {
      const gesture = currentPointer;
      if (!gesture || gesture.id !== event.pointerId) return;
      currentPointer = null;
      if (node.hasPointerCapture(event.pointerId)) {
        try { node.releasePointerCapture(event.pointerId); } catch { /* Already released. */ }
      }
      const dx = event.clientX - gesture.x;
      const horizontal = gesture.horizontal && Math.abs(dx) > 12 && !cancelled;
      if (gesture.moved) {
        blockClick = true;
        if (clickTimeout) clearTimeout(clickTimeout);
        clickTimeout = setTimeout(() => { blockClick = false; }, 350);
      }
      // A completed drag always settles at a complete card, never between cards.
      // A deliberate swipe advances one card from the starting card.
      snap(horizontal ? (dx < 0 ? 1 : -1) : 0, gesture.left);
    };
    // Browsers can emit lostpointercapture without delivering pointerup.
    // Always finalize the gesture to clear the paused state.
    const onLostCapture = (event: PointerEvent) => {
      if (currentPointer?.id === event.pointerId) finishGesture(event, true);
    };
    const onWindowBlur = () => {
      if (currentPointer) {
        const gesture = currentPointer;
        currentPointer = null;
          stopUntilRef.current = 0;
        if (gesture.moved) snap(0);
      } else if (!snapping) {
        stopUntilRef.current = 0;
      }
    };
    const onClick = (event: MouseEvent) => {
      if (!blockClick) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      blockClick = false;
    };
    const onWheel = () => {
      stopUntilRef.current = Number.POSITIVE_INFINITY;
      if (wheelTimeout) clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => snap(), 180);
    };
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    const onPreference = () => { reducedMotion = mq.matches; };
    onPreference();
    mq.addEventListener?.('change', onPreference);
    const io = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      lastFrame = 0;
    });
    io?.observe(node);
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measureCycle);
    ro?.observe(node);
    ro?.observe(middle);
    window.addEventListener('resize', measureCycle);
    node.addEventListener('pointerdown', onDown);
    node.addEventListener('lostpointercapture', onLostCapture);
    window.addEventListener('blur', onWindowBlur);
    window.addEventListener('pointermove', onMove, { passive: false });
    window.addEventListener('pointerup', finishGesture);
    const onCancel = (event: PointerEvent) => finishGesture(event, true);
    window.addEventListener('pointercancel', onCancel);
    node.addEventListener('click', onClick, true);
    node.addEventListener('wheel', onWheel, { passive: true });
    node.addEventListener('scroll', wrap, { passive: true });
    measureCycle();

    const frame = (now: number) => {
      const dt = lastFrame ? Math.min(50, now - lastFrame) : 0;
      lastFrame = now;
      if (dt > 0 && visible && !document.hidden && !reducedMotion && !currentPointer && !snapping &&
          now >= stopUntilRef.current && cycleRef.current > 0) {
        node.scrollLeft += Math.max(110, speed) * dt / 1000;
        wrap();
      }
      autoFrame = requestAnimationFrame(frame);
    };
    autoFrame = requestAnimationFrame(frame);
    return () => {
      node.style.touchAction = previousTouchAction;
      cancelAnimationFrame(autoFrame);
      cancelSnap();
      snapRef.current = null;
      ro?.disconnect(); io?.disconnect();
      mq.removeEventListener?.('change', onPreference);
      window.removeEventListener('resize', measureCycle);
      node.removeEventListener('pointerdown', onDown);
      node.removeEventListener('lostpointercapture', onLostCapture);
      window.removeEventListener('blur', onWindowBlur);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', finishGesture);
      window.removeEventListener('pointercancel', onCancel);
      node.removeEventListener('click', onClick, true);
      node.removeEventListener('wheel', onWheel);
      node.removeEventListener('scroll', wrap);
      if (clickTimeout) clearTimeout(clickTimeout);
      if (wheelTimeout) clearTimeout(wheelTimeout);
    };
  }, [itemCount, isLooping, repeats, speed]);

  return { scrollerRef, middleGroupRef, repeats, isLooping, moveBy };
}
