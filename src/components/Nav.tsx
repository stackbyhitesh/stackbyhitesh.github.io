import { useEffect, useState } from 'react';
import { navLinks, profile, spyIds, spyMap } from '../data';
import { useScrollSpy } from '../hooks';
import { useTheme } from '../context/ThemeContext';
import Logo from './Logo';
import MagneticLink from './MagneticLink';

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent);
const svgProps = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true } as const;

interface Props {
  onOpenPalette: () => void;
}

export default function Nav({ onOpenPalette }: Props) {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const current = useScrollSpy(spyIds);
  const active = spyMap[current] || current;

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
    <nav aria-label="Main" className="nav glass">
      <div className="nav__bar">
        <a className="brand" href="#top" aria-label="Hitesh Chaudhari, back to top">
          <Logo size={36} className="brand__logo" />
          <span className="brand__name">Hitesh <span className="brand__last">Chaudhari</span></span>
        </a>
        <ul className="nav__links">
          {navLinks.map(([id, label]) => (
            <li key={id}><a href={`#${id}`} aria-current={active === id ? 'true' : undefined}>{label}</a></li>
          ))}
        </ul>
        <div className="nav__tools">
          <button type="button" className="kbd-btn" onClick={onOpenPalette} aria-label={`Open quick menu (${isMac ? '⌘' : 'Ctrl'} K)`}>
            <svg {...svgProps} width={15} height={15}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            {isMac ? '⌘' : 'Ctrl'} K
          </button>
          <button type="button" className="icon-btn" onClick={toggle} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
            {theme === 'dark'
              ? <svg {...svgProps}><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" /></svg>
              : <svg {...svgProps}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>}
          </button>
          <MagneticLink className={`btn btn--primary btn--sm${current === 'contact' ? ' ulink--on' : ''}`} href="#contact">Connect</MagneticLink>
          <button type="button" className="icon-btn nav__menu-btn" aria-label="Menu" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>
            {open ? <svg {...svgProps}><path d="M6 6l12 12M18 6 6 18" /></svg> : <svg {...svgProps}><path d="M4 8h16M4 16h16" /></svg>}
          </button>
        </div>
      </div>
      <div id="mobile-menu" className="mobile-menu" data-open={open}>
        {navLinks.map(([id, label]) => (
          <a key={id} href={`#${id}`} aria-current={active === id ? 'true' : undefined} onClick={() => setOpen(false)}>{label}</a>
        ))}
        {profile.resume && (
          <a href={profile.resume} download="Hitesh_Chaudhari_Resume.pdf" onClick={() => setOpen(false)}>Resume <small>PDF</small></a>
        )}
        <button type="button" onClick={() => { setOpen(false); onOpenPalette(); }}>Search and shortcuts <small>{isMac ? '⌘' : 'Ctrl'} K</small></button>
      </div>
    </nav>
  );
}
