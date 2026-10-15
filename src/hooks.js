import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';

const REDUCED = '(prefers-reduced-motion: reduce)';
const subscribeReduced = (cb) => {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};

/** True when the visitor asked their device for less motion. Updates live if the setting changes. */
export const usePrefersReducedMotion = () =>
  useSyncExternalStore(subscribeReduced, () => window.matchMedia(REDUCED).matches, () => false);

/** Ref + boolean that turns true when the element scrolls into view. */
export function useInView({ threshold = 0.15, once = true } = {}) {
  const ref = useRef(null);
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

/** Returns the id of the section currently being read (used to highlight the menu). */
export function useScrollSpy(ids) {
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
export function useCopy(text, resetMs = 1800) {
  const [label, setLabel] = useState('Copy');
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = useCallback(async () => {
    try { await navigator.clipboard.writeText(text); setLabel('Copied'); }
    catch { setLabel('Select above'); }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setLabel('Copy'), resetMs);
  }, [text, resetMs]);
  return [label, copy];
}

/** Types out each word, deletes it, then moves to the next. Shows the first word as plain text if motion is reduced. */
export function useTyping(words) {
  const reduced = usePrefersReducedMotion();
  const [text, setText] = useState(words[0]);
  useEffect(() => {
    if (reduced) { setText(words[0]); return; }
    let wi = 0, ci = 0, deleting = false, timer;
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

/** Tilts `targetRef` towards the pointer while it moves over `areaRef`. */
export function useTilt(areaRef, targetRef) {
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    const area = areaRef.current, target = targetRef.current;
    if (reduced || !area || !target) return;
    const move = (e) => {
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
export function useMagnetic(ref) {
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
    };
    const leave = () => { el.style.transform = ''; };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); leave(); };
  }, [ref, reduced]);
}
