import { useEffect, useState } from 'react';
import { navLinks, spyIds, spyMap } from '../data';
import { useScrollSpy } from '../hooks';
import { useTheme } from '../context/ThemeContext';
import MagneticLink from './MagneticLink';

export default function Nav() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const current = useScrollSpy(spyIds);
  const active = spyMap[current] || current;
  const cls = (id: string) => (active === id ? 'on' : undefined);

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
    <nav aria-label="Main">
      <div className="wrap">
        <a className="logo" href="#top">Hitesh<span>.dev</span></a>
        <ul>
          {navLinks.map(([id, label]) => (
            <li key={id}><a className={cls(id)} href={`#${id}`} aria-current={active === id ? 'true' : undefined}>{label}</a></li>
          ))}
          <li>
            <button className="tg" onClick={toggle} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
              {theme === 'dark' ? '☾' : '☀'}
            </button>
          </li>
          <li><MagneticLink className={`btn${current === 'contact' ? ' on' : ''}`} href="#contact">Connect</MagneticLink></li>
          <li className="mb">
            <button className="tg" aria-label="Menu" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>
              {open ? '✕' : '☰'}
            </button>
          </li>
        </ul>
      </div>
      <div id="mobile-menu" className={`mp${open ? ' open' : ''}`}>
        {navLinks.map(([id, label]) => (
          <a key={id} className={cls(id)} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>
        ))}
      </div>
    </nav>
  );
}
