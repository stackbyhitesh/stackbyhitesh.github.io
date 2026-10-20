import { useEffect, useState } from 'react';
import { navLinks, spyIds, spyMap } from '../data';
import { useScrollSpy } from '../hooks';
import { useTheme } from '../context/ThemeContext';
import { navLink, navLinkOn } from '../ui';
import MagneticLink from './MagneticLink';

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent);

interface Props {
  onOpenPalette: () => void;
}

export default function Nav({ onOpenPalette }: Props) {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const current = useScrollSpy(spyIds);
  const active = spyMap[current] || current;
  const cls = (id: string) => `${navLink} ${active === id ? navLinkOn : ''}`;

  // Close the mobile menu with Escape, or when the window grows to desktop size.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    const onResize = () => { if (window.innerWidth > 900) setOpen(false); };
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => { document.removeEventListener('keydown', onKey); window.removeEventListener('resize', onResize); };
  }, [open]);

  return (
    <nav
      aria-label="Main"
      className="sticky top-[calc(env(safe-area-inset-top,0px)+10px)] z-10 mx-auto mt-3 w-[calc(100%-2*var(--gutter))] max-w-[1040px] rounded-full border border-line bg-bg/70 shadow-[0_18px_40px_-24px_#000] backdrop-blur-[14px] print:hidden"
    >
      <div className="flex h-[58px] items-center justify-between pr-2 pl-4 xs:pr-3 xs:pl-6">
        <a className="font-display text-[1.1rem] font-extrabold tracking-[-.02em] no-underline xs:text-[1.25rem]" href="#top">
          Hitesh<span className="text-grad">.dev</span>
        </a>
        <ul className="m-0 flex list-none items-center gap-0.5 p-0 xs:gap-1">
          {navLinks.map(([id, label]) => (
            <li key={id} className="hidden md:block">
              <a className={cls(id)} href={`#${id}`} aria-current={active === id ? 'true' : undefined}>{label}</a>
            </li>
          ))}
          <li className="hidden md:block">
            <button
              type="button"
              onClick={onOpenPalette}
              aria-label={`Open quick menu (${isMac ? '⌘' : 'Ctrl'} K)`}
              className="flex h-10 items-center gap-2 rounded-full border border-line bg-card px-3 font-mono text-[.72rem] text-muted transition-colors hover:border-accent2 hover:text-ink"
            >
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
              {isMac ? '⌘' : 'Ctrl'} K
            </button>
          </li>
          <li>
            <button type="button" className="icon-btn" onClick={toggle} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
              {theme === 'dark' ? '☾' : '☀'}
            </button>
          </li>
          <li>
            <MagneticLink
              className={`btn btn-primary px-4 py-2 text-[.92rem] xs:px-5 xs:py-[9px] ${current === 'contact' ? 'shadow-[0_0_0_3px_color-mix(in_srgb,var(--b)_55%,transparent)]' : ''}`}
              href="#contact"
            >
              Connect
            </MagneticLink>
          </li>
          <li className="md:hidden">
            <button type="button" className="icon-btn" aria-label="Menu" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>
              {open ? '✕' : '☰'}
            </button>
          </li>
        </ul>
      </div>
      <div
        id="mobile-menu"
        className={`glass absolute inset-x-0 top-[calc(100%+8px)] flex-col rounded-[22px] bg-bg2/90 p-2.5 shadow-[0_24px_50px_-20px_#000] md:hidden ${open ? 'flex' : 'hidden'}`}
      >
        {navLinks.map(([id, label]) => (
          <a
            key={id}
            className={`rounded-xl px-4 py-3.5 no-underline hover:bg-card ${active === id ? navLinkOn : 'text-ink'}`}
            href={`#${id}`}
            onClick={() => setOpen(false)}
          >
            {label}
          </a>
        ))}
        <button
          type="button"
          className="flex items-center justify-between rounded-xl px-4 py-3.5 text-left text-ink hover:bg-card"
          onClick={() => { setOpen(false); onOpenPalette(); }}
        >
          Search and shortcuts <span className="font-mono text-[.75rem] text-muted">⌕</span>
        </button>
      </div>
    </nav>
  );
}
