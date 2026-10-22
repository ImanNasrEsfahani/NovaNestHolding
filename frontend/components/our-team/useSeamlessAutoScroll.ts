'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

const useClientLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
type Phase = 'auto' | 'drag' | 'snap';
type Gesture = {
  id: number;
  kind: string;
  x: number;
  y: number;
  origin: number;
  previousX: number;
  horizontal: boolean;
  vertical: boolean;
};

/**
 * Mentors and Affiliates share markup, but use separate input/animation engines.
 * Desktop retains its existing behaviour. Mobile uses touch events and its own
 * clock, fractional scroll position and snap completion.
 */
export default function useSeamlessAutoScroll(itemCount: number, secondsPerCard = 3.5) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const middleGroupRef = useRef<HTMLDivElement>(null);
  const cycleRef = useRef(0);
  const moveRef = useRef<((direction: number) => void) | null>(null);
  const [isLooping, setIsLooping] = useState(false);
  const [repeats, setRepeats] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)');
    const change = () => setIsMobile(query.matches);
    change();
    query.addEventListener?.('change', change);
    return () => query.removeEventListener?.('change', change);
  }, []);

  useClientLayoutEffect(() => {
    const node = scrollerRef.current;
    const group = middleGroupRef.current;
    if (!node || !group) return;
    const update = () => {
      const card = group.firstElementChild as HTMLElement | null;
      if (!card || itemCount < 2) { setIsLooping(false); return; }
      const style = getComputedStyle(node);
      const available = node.clientWidth - (parseFloat(style.paddingLeft) || 0) - (parseFloat(style.paddingRight) || 0);
      const gap = parseFloat(getComputedStyle(group).columnGap) || 0;
      const cardWidth = card.getBoundingClientRect().width;
      if (available > 0 && cardWidth > 0) setIsLooping(itemCount * cardWidth + (itemCount - 1) * gap > available + 1);
    };
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    observer?.observe(node);
    if (group.firstElementChild) observer?.observe(group.firstElementChild);
    window.addEventListener('resize', update);
    update();
    return () => { observer?.disconnect(); window.removeEventListener('resize', update); };
  }, [itemCount, isLooping]);

  useClientLayoutEffect(() => {
    if (isLooping) return;
    cycleRef.current = 0;
    if (scrollerRef.current) scrollerRef.current.scrollLeft = 0;
    setRepeats(1);
  }, [isLooping]);

  const moveBy = useCallback((distance: number) => {
    if (isLooping && distance !== 0) moveRef.current?.(distance > 0 ? 1 : -1);
  }, [isLooping]);

  useEffect(() => {
    const node = scrollerRef.current;
    const middle = middleGroupRef.current;
    if (!node || !middle || !isLooping || itemCount < 2) return;

    const originalTouchAction = node.style.touchAction;
    node.style.touchAction = 'pan-y';
    let phase: Phase = 'auto';
    let gesture: Gesture | null = null;
    let touch: { identifier: number; x: number; y: number; origin: number; lastX: number; horizontal: boolean; vertical: boolean } | null = null;
    let frameId = 0;
    let snapFrame = 0;
    let lastFrame = 0;
    let visible = true;
    let reduceMotion = false;
    let blockedClick = false;
    let clickTimer: ReturnType<typeof setTimeout> | undefined;
    let wheelTimer: ReturnType<typeof setTimeout> | undefined;
    let wheelActive = false;
    // Retain subpixel travel even if a mobile browser rounds scrollLeft.
    let virtualLeft = 0;
    const step = () => {
      const card = middle.firstElementChild as HTMLElement | null;
      return card ? card.getBoundingClientRect().width + (parseFloat(getComputedStyle(middle).columnGap) || 0) : 0;
    };
    const setLeft = (value: number) => {
      virtualLeft = value;
      node.scrollLeft = value;
    };
    const wrap = () => {
      const cycle = cycleRef.current;
      if (cycle <= 0) return 0;
      const before = node.scrollLeft;
      if (before >= cycle && before < cycle * 2) return 0;
      const next = cycle + (((before - cycle) % cycle + cycle) % cycle);
      setLeft(next);
      return next - before;
    };
    const cancelSnap = () => {
      if (snapFrame) cancelAnimationFrame(snapFrame);
      snapFrame = 0;
      if (phase === 'snap') phase = 'auto';
    };
    const snapTo = (destination: number) => {
      cancelSnap();
      const from = node.scrollLeft;
      const started = performance.now();
      const duration = reduceMotion ? 0 : 320;
      phase = 'snap';
      const draw = (now: number) => {
        const fraction = duration === 0 ? 1 : Math.min(1, (now - started) / duration);
        const eased = 1 - Math.pow(1 - fraction, 3);
        setLeft(from + (destination - from) * eased);
        if (fraction < 1) snapFrame = requestAnimationFrame(draw);
        else {
          setLeft(destination);
          wrap();
          snapFrame = 0;
          phase = 'auto';
          lastFrame = now;
        }
      };
      snapFrame = requestAnimationFrame(draw);
    };
    const snapNearest = () => {
      const unit = step();
      const cycle = cycleRef.current;
      if (unit > 0 && cycle > 0) snapTo(cycle + Math.round((node.scrollLeft - cycle) / unit) * unit);
      else phase = 'auto';
    };
    const moveOne = (direction: number) => {
      if (gesture || touch) return;
      const unit = step();
      const cycle = cycleRef.current;
      if (unit <= 0 || cycle <= 0) return;
      const position = cycle + Math.round((node.scrollLeft - cycle) / unit) * unit;
      snapTo(position + direction * unit);
    };
    moveRef.current = moveOne;
    const measure = () => {
      const width = middle.getBoundingClientRect().width;
      if (width <= 0 || node.clientWidth <= 0) return;
      const perRepeat = width / repeats;
      const needed = Math.max(1, Math.min(16, Math.ceil((node.clientWidth + 32) / perRepeat)));
      if (needed !== repeats) { setRepeats(needed); return; }
      const previous = cycleRef.current;
      if (!previous) { cycleRef.current = width; setLeft(width); }
      else if (Math.abs(previous - width) > 0.5) {
        const fraction = (((node.scrollLeft - previous) % previous + previous) % previous) / previous;
        cycleRef.current = width;
        setLeft(width * (1 + fraction));
      }
    };
    const blockNextClick = () => {
      blockedClick = true;
      if (clickTimer) clearTimeout(clickTimer);
      clickTimer = setTimeout(() => { blockedClick = false; }, 400);
    };

    // Desktop engine: same pointer gestures, easing and auto-scrolling as before.
    const endGesture = (event?: PointerEvent, cancelled = false) => {
      const held = gesture;
      if (!held || (event && event.pointerId !== held.id)) return;
      gesture = null;
      if (node.hasPointerCapture(held.id)) {
        try { node.releasePointerCapture(held.id); } catch { /* Already released. */ }
      }
      if (held.horizontal) {
        blockNextClick();
        const distance = (event?.clientX ?? held.previousX) - held.x;
        const unit = step();
        const cycle = cycleRef.current;
        if (unit > 0 && cycle > 0) {
          const index = Math.round((held.origin - cycle) / unit);
          const direction = !cancelled && Math.abs(distance) >= 20 ? (distance < 0 ? 1 : -1) : 0;
          const target = cycle + (index + direction) * unit;
          snapTo(target + wrap());
          return;
        }
      }
      phase = 'auto'; lastFrame = 0;
    };
    const onDown = (event: PointerEvent) => {
      if (gesture || (event.pointerType === 'mouse' && event.button !== 0)) return;
      cancelSnap(); wrap();
      gesture = { id: event.pointerId, kind: event.pointerType, x: event.clientX, y: event.clientY, previousX: event.clientX, origin: node.scrollLeft, horizontal: false, vertical: false };
      phase = 'drag';
      if (event.pointerType === 'mouse') {
        try { node.setPointerCapture(event.pointerId); } catch { /* Ignore unsupported capture. */ }
      }
    };
    const onMove = (event: PointerEvent) => {
      const held = gesture;
      if (!held || held.id !== event.pointerId) return;
      if (held.kind === 'mouse' && event.buttons === 0) { endGesture(event); return; }
      held.previousX = event.clientX;
      const dx = event.clientX - held.x;
      const dy = event.clientY - held.y;
      if (!held.horizontal && !held.vertical) {
        if (Math.abs(dy) > 9 && Math.abs(dy) > Math.abs(dx) * 1.2) { held.vertical = true; endGesture(event, true); return; }
        if (Math.abs(dx) > 7 && Math.abs(dx) > Math.abs(dy)) held.horizontal = true;
      }
      if (!held.horizontal) return;
      if (event.cancelable) event.preventDefault();
      node.scrollLeft = held.origin - dx;
      held.origin += wrap();
    };
    const onCancel = (event: PointerEvent) => endGesture(event, true);
    const onLost = (event: PointerEvent) => { if (gesture?.id === event.pointerId) endGesture(event, true); };
    const onBlur = () => endGesture(undefined, true);

    // Mobile engine: TouchEvents avoid implicit PointerCapture / pointercancel.
    // No input handler on mobile can leave phase='drag' after the gesture ends.
    const getTouch = (list: TouchList, id: number): Touch | null => {
      for (let i = 0; i < list.length; i += 1) if (list[i].identifier === id) return list[i];
      return null;
    };
    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) { touch = null; phase = 'auto'; return; }
      cancelSnap(); wrap();
      const point = event.touches[0];
      touch = { identifier: point.identifier, x: point.clientX, y: point.clientY, origin: node.scrollLeft, lastX: point.clientX, horizontal: false, vertical: false };
      phase = 'drag';
    };
    const onTouchMove = (event: TouchEvent) => {
      if (!touch) return;
      const point = getTouch(event.touches, touch.identifier);
      if (!point) return;
      const dx = point.clientX - touch.x;
      const dy = point.clientY - touch.y;
      touch.lastX = point.clientX;
      if (!touch.horizontal && !touch.vertical) {
        if (Math.abs(dy) > 9 && Math.abs(dy) > Math.abs(dx) * 1.15) {
          touch.vertical = true;
          phase = 'auto';
          return;
        }
        if (Math.abs(dx) > 6 && Math.abs(dx) >= Math.abs(dy)) touch.horizontal = true;
      }
      if (!touch.horizontal) return;
      if (event.cancelable) event.preventDefault();
      setLeft(touch.origin - dx);
      touch.origin += wrap();
    };
    const finishTouch = (event?: TouchEvent, cancelled = false) => {
      const held = touch;
      if (!held) { phase = 'auto'; return; }
      if (event && getTouch(event.touches, held.identifier)) return;
      const released = event ? getTouch(event.changedTouches, held.identifier) : null;
      const dx = (released?.clientX ?? held.lastX) - held.x;
      touch = null;
      if (held.horizontal) {
        blockNextClick();
        const unit = step();
        const cycle = cycleRef.current;
        if (unit > 0 && cycle > 0) {
          const startIndex = Math.round((held.origin - cycle) / unit);
          const direction = !cancelled && Math.abs(dx) >= 18 ? (dx < 0 ? 1 : -1) : 0;
          snapTo(cycle + (startIndex + direction) * unit + wrap());
          return;
        }
      }
      phase = 'auto'; lastFrame = 0;
    };
    const onTouchEnd = (event: TouchEvent) => finishTouch(event);
    const onTouchCancel = (event: TouchEvent) => finishTouch(event, true);
    const onMobileBlur = () => finishTouch(undefined, true);
    const onClick = (event: MouseEvent) => {
      if (!blockedClick) return;
      event.preventDefault(); event.stopImmediatePropagation(); blockedClick = false;
    };
    const onWheel = () => {
      wheelActive = true;
      if (wheelTimer) clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => { wheelActive = false; if (!gesture && !touch) snapNearest(); }, 160);
    };
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => { reduceMotion = media.matches; };
    updateMotion(); media.addEventListener?.('change', updateMotion);
    const intersection = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting; lastFrame = 0;
    });
    intersection?.observe(node);
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(node); observer?.observe(middle);
    window.addEventListener('resize', measure);
    if (isMobile) {
      node.addEventListener('touchstart', onTouchStart, { passive: true });
      node.addEventListener('touchmove', onTouchMove, { passive: false });
      node.addEventListener('touchend', onTouchEnd);
      node.addEventListener('touchcancel', onTouchCancel);
      window.addEventListener('blur', onMobileBlur);
    } else {
      node.addEventListener('pointerdown', onDown);
      window.addEventListener('pointermove', onMove, { passive: false });
      window.addEventListener('pointerup', endGesture);
      window.addEventListener('pointercancel', onCancel);
      node.addEventListener('lostpointercapture', onLost);
      window.addEventListener('blur', onBlur);
    }
    node.addEventListener('click', onClick, true);
    node.addEventListener('wheel', onWheel, { passive: true });
    node.addEventListener('scroll', wrap, { passive: true });
    measure();

    const tick = (now: number) => {
      const elapsed = lastFrame ? Math.min(now - lastFrame, 100) : 0;
      lastFrame = now;
      if (elapsed > 0 && visible && !document.hidden && !reduceMotion && phase === 'auto' && !gesture && !touch && !wheelActive && cycleRef.current > 0) {
        const unit = step();
        if (unit > 0) {
          const movement = (unit / Math.max(0.5, secondsPerCard)) * elapsed / 1000;
          if (isMobile) {
            // Advance our high-precision logical offset rather than reading a
            // potentially integer-rounded scrollLeft on every animation frame.
            virtualLeft += movement;
            setLeft(virtualLeft);
          } else {
            node.scrollLeft += movement;
          }
          wrap();
        }
      }
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => {
      node.style.touchAction = originalTouchAction;
      cancelAnimationFrame(frameId); cancelSnap(); moveRef.current = null;
      intersection?.disconnect(); observer?.disconnect(); media.removeEventListener?.('change', updateMotion);
      window.removeEventListener('resize', measure);
      if (isMobile) {
        node.removeEventListener('touchstart', onTouchStart);
        node.removeEventListener('touchmove', onTouchMove);
        node.removeEventListener('touchend', onTouchEnd);
        node.removeEventListener('touchcancel', onTouchCancel);
        window.removeEventListener('blur', onMobileBlur);
      } else {
        node.removeEventListener('pointerdown', onDown);
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', endGesture);
        window.removeEventListener('pointercancel', onCancel);
        node.removeEventListener('lostpointercapture', onLost);
        window.removeEventListener('blur', onBlur);
      }
      node.removeEventListener('click', onClick, true);
      node.removeEventListener('wheel', onWheel);
      node.removeEventListener('scroll', wrap);
      if (clickTimer) clearTimeout(clickTimer);
      if (wheelTimer) clearTimeout(wheelTimer);
    };
  }, [isLooping, itemCount, repeats, secondsPerCard, isMobile]);

  return { scrollerRef, middleGroupRef, repeats, isLooping, moveBy };
}
