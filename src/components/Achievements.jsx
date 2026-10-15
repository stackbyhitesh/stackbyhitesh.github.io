import { useCallback, useEffect, useRef, useState } from 'react';
import Reveal, { stagger } from './Reveal';
import { achievements } from '../data';
import { achievementImages } from '../lib/achievementImages';

// Only awards that have an image can be opened full size.
const withImages = achievements
  .filter((a) => achievementImages[a.slug])
  .map((a) => ({ ...a, src: achievementImages[a.slug] }));

function Medal() {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 4h24l-6 18H26L20 4Z" />
      <circle cx="32" cy="40" r="16" />
      <path d="m32 31 3 6.2 6.8.9-5 4.7 1.2 6.7-6-3.3-6 3.3 1.2-6.7-5-4.7 6.8-.9L32 31Z" />
    </svg>
  );
}

/** Full-size view. Close with Escape, ✕ or a click outside; move between awards with the arrow keys or buttons. */
function Lightbox({ index, onClose, onNav }) {
  const item = withImages[index];
  const closeRef = useRef(null);

  useEffect(() => {
    const opener = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      opener?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') onNav(-1);
      else if (e.key === 'ArrowRight') onNav(1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, onNav]);

  return (
    <div className="lb" role="dialog" aria-modal="true" aria-label={item.title} onClick={onClose}>
      <figure onClick={(e) => e.stopPropagation()}>
        <img src={item.src} alt={item.title} />
        <figcaption>{item.title}<span>{index + 1} / {withImages.length}</span></figcaption>
        <button type="button" className="tg" ref={closeRef} onClick={onClose} aria-label="Close">✕</button>
        {withImages.length > 1 && (
          <>
            <button type="button" className="lb-nav prev" onClick={() => onNav(-1)} aria-label="Previous award">‹</button>
            <button type="button" className="lb-nav next" onClick={() => onNav(1)} aria-label="Next award">›</button>
          </>
        )}
      </figure>
    </div>
  );
}

export default function Achievements() {
  const [index, setIndex] = useState(null);
  const close = useCallback(() => setIndex(null), []);
  const nav = useCallback((step) => setIndex((i) => (i + step + withImages.length) % withImages.length), []);

  return (
    <section id="achievements">
      <Reveal>
        <div className="kick">Achievements</div>
        <h2>Recognised for engineering excellence</h2>
        {withImages.length > 0 && <p className="sec-lead">Click an award to view it full size.</p>}
      </Reveal>
      <div className="ach-grid">
        {achievements.map((a, i) => {
          const at = withImages.findIndex((x) => x.slug === a.slug);
          return (
            <Reveal className="gl ach" delay={stagger(i)} key={a.slug}>
              {at >= 0 ? (
                <button type="button" className="ach-img" onClick={() => setIndex(at)} aria-label={`View ${a.title}`}>
                  <img src={withImages[at].src} alt={a.title} loading="lazy" decoding="async" />
                  <span className="ach-tag">🏆 Award</span>
                </button>
              ) : (
                <div className="ach-ph"><Medal /></div>
              )}
              <div className="ach-body">
                <h3>{a.title}</h3>
                <p>{a.note}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
      {index !== null && <Lightbox index={index} onClose={close} onNav={nav} />}
    </section>
  );
}
