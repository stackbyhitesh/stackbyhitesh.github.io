import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type RefObject } from 'react';

const REDUCED = '(prefers-reduced-motion: reduce)';

const subscribeReduced = (callback: () => void) => {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
};

/** True when the visitor asked their device for less motion. Updates live if the setting changes. */
export const usePrefersReducedMotion = (): boolean =>
  useSyncExternalStore(subscribeReduced, () => window.matchMedia(REDUCED).matches, () => false);

interface InViewOptions {
  threshold?: number;
  once?: boolean;
}

/** Ref + boolean that turns true when the element scrolls into view. */
export function useInView<T extends HTMLElement = HTMLElement>({ threshold = 0.15, once = true }: InViewOptions = {}): [RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) { setInView(true); return; }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); if (once) io.disconnect(); }
      else if (!once) setInView(false);
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, once]);
  return [ref, inView];
}

/** Types out each word, deletes it, then moves to the next. Shows the first word as plain text if motion is reduced. */
export function useTyping(words: readonly string[]): string {
  const reduced = usePrefersReducedMotion();
  const [text, setText] = useState(words[0]);
  useEffect(() => {
    if (reduced) { setText(words[0]); return; }
    let wi = 0;
    let ci = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const word = words[wi];
      ci += deleting ? -1 : 1;
      setText(word.slice(0, ci));
      let delay = deleting ? 35 : 75;
      if (!deleting && ci === word.length) { deleting = true; delay = 1400; }
      else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; delay = 300; }
      timer = setTimeout(tick, delay);
    };
    setText('');
    timer = setTimeout(tick, 400);
    return () => clearTimeout(timer);
  }, [words, reduced]);
  return text;
}

/** Returns the id of the section currently being read (used to highlight the menu). */
export function useScrollSpy(ids: readonly string[]): string {
  const [current, setCurrent] = useState('');
  useEffect(() => {
    let ticking = false;
    const spy = () => {
      ticking = false;
      const line = window.innerHeight * 0.35;
      let cur = '';
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) cur = id;
      });
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) cur = 'contact';
      setCurrent(cur);
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(spy); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    spy();
    return () => window.removeEventListener('scroll', onScroll);
  }, [ids]);
  return current;
}

/** Copy-to-clipboard with a short-lived label. The timer is cleaned up on unmount. */
export function useCopy(text: string, resetMs = 1800): [string, () => Promise<void>] {
  const [label, setLabel] = useState('Copy');
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = useCallback(async () => {
    try { await navigator.clipboard.writeText(text); setLabel('Copied'); }
    catch { setLabel('Select above'); }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setLabel('Copy'), resetMs);
  }, [text, resetMs]);
  return [label, copy];
}

/** Tilts `targetRef` towards the pointer while it moves over `areaRef`. */
export function useTilt(areaRef: RefObject<HTMLElement>, targetRef: RefObject<HTMLElement>): void {
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    const area = areaRef.current;
    const target = targetRef.current;
    if (reduced || !area || !target) return;
    const move = (e: PointerEvent) => {
      const r = area.getBoundingClientRect();
      target.style.setProperty('--ry', ((e.clientX - r.left) / r.width - 0.5) * 16 + 'deg');
      target.style.setProperty('--rx', -((e.clientY - r.top) / r.height - 0.5) * 16 + 'deg');
    };
    const leave = () => { target.style.setProperty('--rx', '0deg'); target.style.setProperty('--ry', '0deg'); };
    area.addEventListener('pointermove', move);
    area.addEventListener('pointerleave', leave);
    return () => { area.removeEventListener('pointermove', move); area.removeEventListener('pointerleave', leave); leave(); };
  }, [areaRef, targetRef, reduced]);
}

/** Makes an element drift slightly towards the pointer. */
export function useMagnetic(ref: RefObject<HTMLElement>): void {
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
    };
    const leave = () => { el.style.transform = ''; };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); leave(); };
  }, [ref, reduced]);
}
