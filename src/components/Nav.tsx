import { useEffect, useState } from 'react';
import { navLinks, profile, spyIds, spyMap } from '../data';
import { useScrollSpy } from '../hooks';
import { useTheme } from '../context/ThemeContext';
import Icon from './icons';
import Logo from './Logo';

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent);

interface Props {
  onOpenPalette: () => void;
}

export default function Nav({ onOpenPalette }: Props) {
  const { theme, set } = useTheme();
  const [open, setOpen] = useState(false);
  const current = useScrollSpy(spyIds);
  const active = spyMap[current] || current;

  // Close the mobile menu with Escape, or when the window grows to desktop size.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    const onResize = () => { if (window.innerWidth >= 1200) setOpen(false); };
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => { document.removeEventListener('keydown', onKey); window.removeEventListener('resize', onResize); };
  }, [open]);

  return (
    <header className="nav">
      <nav aria-label="Main" className="nav__bar">
        <a className="brand" href="#top" aria-label="Hitesh Chaudhari, back to top">
          <Logo size={40} className="brand__logo" />
          <span className="brand__name">Hitesh <span className="brand__last">Chaudhari</span></span>
        </a>
        <ul className="nav__links">
          {navLinks.map(([id, label]) => (
            <li key={id}><a href={`#${id}`} aria-current={active === id ? 'true' : undefined}>{label}</a></li>
          ))}
        </ul>
        <div className="nav__tools">
          <div className="themeswitch" role="group" aria-label="Colour theme">
            <button type="button" aria-label="Light theme" aria-pressed={theme === 'light'} onClick={() => set('light')}><Icon name="sun" size={16} /></button>
            <button type="button" aria-label="Dark theme" aria-pressed={theme === 'dark'} onClick={() => set('dark')}><Icon name="moon" size={16} /></button>
          </div>
          {profile.resume && (
            <a className="btn btn--soft btn--sm nav__resume" href={profile.resume} download="Hitesh_Chaudhari_Resume.pdf">
              Download Resume<Icon name="download" size={16} />
            </a>
          )}
          <button type="button" className="icon-btn nav__menu-btn" aria-label="Menu" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>
            <Icon name={open ? 'close' : 'menu'} size={20} />
          </button>
        </div>
      </nav>
      <div id="mobile-menu" className="mobile-menu" data-open={open}>
        {navLinks.map(([id, label]) => (
          <a key={id} href={`#${id}`} aria-current={active === id ? 'true' : undefined} onClick={() => setOpen(false)}>{label}</a>
        ))}
        {profile.resume && (
          <a href={profile.resume} download="Hitesh_Chaudhari_Resume.pdf" onClick={() => setOpen(false)}>Download Resume <small>PDF</small></a>
        )}
        <button type="button" onClick={() => { setOpen(false); onOpenPalette(); }}>Search and shortcuts <small>{isMac ? '⌘' : 'Ctrl'} K</small></button>
      </div>
    </header>
  );
}
