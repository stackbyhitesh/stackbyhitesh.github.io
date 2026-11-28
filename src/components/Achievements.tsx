import { useCallback, useEffect, useRef, useState } from 'react';
import Reveal, { stagger } from './Reveal';
import Section, { SectionHead } from './Section';
import { achievements } from '../data';
import { findAchievementImage } from '../lib/achievementImages';

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

function Medal() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
    <div className="lightbox" ref={dialogRef} role="dialog" aria-modal="true" aria-label={item.title} onClick={onClose}>
      <figure onClick={(e) => e.stopPropagation()}>
        <img src={item.src} alt={item.title} />
        <figcaption>{item.title}<small>{index + 1} / {withImages.length}</small></figcaption>
        <button type="button" className="lightbox__btn lightbox__close glass" ref={closeRef} onClick={onClose} aria-label="Close">✕</button>
        {withImages.length > 1 && (
          <>
            <button type="button" className="lightbox__btn lightbox__prev glass" onClick={() => onNav(-1)} aria-label="Previous award">‹</button>
            <button type="button" className="lightbox__btn lightbox__next glass" onClick={() => onNav(1)} aria-label="Next award">›</button>
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
    <Section id="achievements">
      <SectionHead title="Recognised for engineering excellence" lead={withImages.length > 0 ? 'Click an award to view it full size.' : undefined} />
      <div className="awards">
        {achievements.map((a, i) => {
          const at = withImages.findIndex((x) => x.slug === a.slug);
          return (
            <Reveal as="article" className="award" delay={stagger(i)} key={a.slug}>
              {at >= 0 ? (
                <button type="button" className="award__print" onClick={() => setIndex(at)} aria-label={`View ${a.title}`}>
                  <img src={withImages[at].src} alt={a.title} loading="lazy" decoding="async" />
                </button>
              ) : (
                <div className="award__empty"><Medal /></div>
              )}
              <div>
                <h3>{a.title}</h3>
                <p>{a.note}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
      {index !== null && <Lightbox index={index} onClose={close} onNav={nav} />}
    </Section>
  );
}
