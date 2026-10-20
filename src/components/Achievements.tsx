import { useCallback, useEffect, useRef, useState } from 'react';
import Reveal, { stagger } from './Reveal';
import Section from './Section';
import { achievements } from '../data';
import { findAchievementImage } from '../lib/achievementImages';
import { h2, lead } from '../ui';

interface LightboxProps {
  index: number;
  onClose: () => void;
  onNav: (step: number) => void;
}

// Only awards that have an image can be opened full size.
const withImages = achievements.flatMap((a) => {
  const src = findAchievementImage(a.slug);
  return src ? [{ ...a, src }] : [];
});

const lbButton = 'glass absolute grid size-11 cursor-pointer place-items-center rounded-full bg-bg2 text-ink';

function Medal() {
  return (
    <svg className="size-[76px]" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 4h24l-6 18H26L20 4Z" />
      <circle cx="32" cy="40" r="16" />
      <path d="m32 31 3 6.2 6.8.9-5 4.7 1.2 6.7-6-3.3-6 3.3 1.2-6.7-5-4.7 6.8-.9L32 31Z" />
    </svg>
  );
}

/** Full-size view. Close with Escape, ✕ or a click outside; move between awards with the arrow keys or buttons. */
function Lightbox({ index, onClose, onNav }: LightboxProps) {
  const item = withImages[index];
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const opener = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      (opener as HTMLElement | null)?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') onNav(-1);
      else if (e.key === 'ArrowRight') onNav(1);
      else if (e.key === 'Tab') {
        // Keep keyboard focus inside the viewer while it is open.
        const items = dialogRef.current ? dialogRef.current.querySelectorAll('button') : [];
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, onNav]);

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-[rgba(3,7,18,.86)] p-[clamp(12px,3vw,24px)] backdrop-blur-sm print:hidden" ref={dialogRef} role="dialog" aria-modal="true" aria-label={item.title} onClick={onClose}>
      <figure className="relative m-0 max-w-[min(94vw,980px)]" onClick={(e) => e.stopPropagation()}>
        <img className="mx-auto block max-h-[78dvh] max-w-full rounded-[14px] shadow-[0_30px_80px_-20px_#000]" src={item.src} alt={item.title} />
        <figcaption className="mt-3.5 text-center font-semibold text-[#e8edf8]">{item.title}<span className="ml-2.5 font-mono text-[.8rem] font-medium text-[#a3b2d3]">{index + 1} / {withImages.length}</span></figcaption>
        <button type="button" className={`${lbButton} top-2 right-2 md:-top-3.5 md:-right-3.5`} ref={closeRef} onClick={onClose} aria-label="Close">✕</button>
        {withImages.length > 1 && (
          <>
            <button type="button" className={`${lbButton} top-[46%] left-2 -translate-y-1/2 text-[26px] leading-none xl:-left-[60px]`} onClick={() => onNav(-1)} aria-label="Previous award">‹</button>
            <button type="button" className={`${lbButton} top-[46%] right-2 -translate-y-1/2 text-[26px] leading-none xl:-right-[60px]`} onClick={() => onNav(1)} aria-label="Next award">›</button>
          </>
        )}
      </figure>
    </div>
  );
}

export default function Achievements() {
  const [index, setIndex] = useState<number | null>(null);
  const close = useCallback(() => setIndex(null), []);
  const nav = useCallback((step: number) => setIndex((i) => ((i ?? 0) + step + withImages.length) % withImages.length), []);

  return (
    <Section id="achievements" className="blob [--blob-y:8%] [--blob:var(--c)] after:right-0 md:after:-right-[4%]">
      <Reveal>
        <div className="kick">Achievements</div>
        <h2 className={h2}>Recognised for engineering excellence</h2>
        {withImages.length > 0 && <p className={lead}>Click an award to view it full size.</p>}
      </Reveal>
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        {achievements.map((a, i) => {
          const at = withImages.findIndex((x) => x.slug === a.slug);
          return (
            <Reveal className="card group flex flex-col overflow-hidden p-0" delay={stagger(i)} key={a.slug}>
              {at >= 0 ? (
                <button
                  type="button"
                  className="relative m-0 block aspect-[4/3] w-full cursor-zoom-in overflow-hidden border-0 bg-bg2 p-0 before:pointer-events-none before:absolute before:top-0 before:-left-[120%] before:z-[2] before:h-full before:w-[55%] before:-skew-x-[18deg] before:bg-[linear-gradient(100deg,transparent,rgba(255,255,255,.35),transparent)] before:transition-[left] before:duration-[900ms] before:ease-out group-hover:before:left-[150%]"
                  onClick={() => setIndex(at)}
                  aria-label={`View ${a.title}`}
                >
                  <img className="block size-full object-cover transition-transform duration-500 group-hover:scale-[1.06]" src={withImages[at].src} alt={a.title} loading="lazy" decoding="async" />
                </button>
              ) : (
                <div className="grid aspect-[4/3] w-full place-items-center bg-[linear-gradient(135deg,color-mix(in_srgb,var(--a)_35%,transparent),color-mix(in_srgb,var(--b)_16%,transparent)),var(--bg2)] text-accent2"><Medal /></div>
              )}
              <div className="px-[22px] pt-5 pb-6">
                <h3 className="mb-1.5 text-[1.1rem]">{a.title}</h3>
                <p className="text-[.92rem]">{a.note}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
      {index !== null && <Lightbox index={index} onClose={close} onNav={nav} />}
    </Section>
  );
}
