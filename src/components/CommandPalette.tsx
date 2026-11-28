import { useEffect, useMemo, useRef, useState } from 'react';
import { profile, sections } from '../data';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { filterCommands, type Command } from '../lib/commands';
import { isSafeExternalUrl } from '../lib/security';

interface Props {
  open: boolean;
  onClose: () => void;
  onToggle: () => void;
}

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent);

/** Quick menu: press Ctrl/⌘ + K (or "/") to jump to a section, switch theme, copy the email and more. */
export default function CommandPalette({ open, onClose, onToggle }: Props) {
  const { theme, toggle: toggleTheme } = useTheme();
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const commands = useMemo<Command[]>(() => {
    const openLink = (url: string) => { if (isSafeExternalUrl(url)) window.open(url, '_blank', 'noopener,noreferrer'); };
    const list: Command[] = [
      ...sections.map(([id, label]): Command => ({
        id: `go-${id}`, label: `Go to ${label}`, group: 'Go to',
        run: () => document.getElementById(id)?.scrollIntoView(),
      })),
      { id: 'theme', label: `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`, group: 'Action', keywords: 'dark light mode appearance', run: toggleTheme },
      {
        id: 'copy-email', label: 'Copy email address', group: 'Action', keywords: 'mail gmail',
        run: () => { navigator.clipboard.writeText(profile.email).then(() => toast('Email copied'), () => toast(profile.email)); },
      },
      ...(profile.resume
        ? [{
            id: 'resume', label: 'Download resume (PDF)', group: 'Action', keywords: 'cv curriculum vitae',
            run: () => {
              const a = document.createElement('a');
              a.href = profile.resume;
              a.download = 'Hitesh_Chaudhari_Resume.pdf';
              document.body.appendChild(a);
              a.click();
              a.remove();
            },
          } satisfies Command]
        : []),
      { id: 'email', label: 'Write an email', group: 'Link', keywords: 'mail contact', run: () => { window.location.href = `mailto:${profile.email}`; } },
      { id: 'call', label: 'Call Hitesh', group: 'Link', keywords: 'phone', run: () => { window.location.href = `tel:${profile.tel}`; } },
      { id: 'whatsapp', label: 'Chat on WhatsApp', group: 'Link', keywords: 'message', run: () => openLink(profile.whatsapp) },
      { id: 'linkedin', label: 'Open LinkedIn', group: 'Link', keywords: 'social profile', run: () => openLink(profile.linkedin) },
    ];
    if (profile.github) list.push({ id: 'github', label: 'Open GitHub', group: 'Link', keywords: 'code repos', run: () => openLink(profile.github) });
    if (profile.calendar) list.push({ id: 'book', label: 'Book a 15-min call', group: 'Link', keywords: 'meeting calendar schedule', run: () => openLink(profile.calendar) });
    return list;
  }, [theme, toggleTheme, toast]);

  const results = useMemo(() => filterCommands(commands, query), [commands, query]);

  // Global shortcuts: Ctrl/⌘ + K toggles the menu, "/" opens it (unless the visitor is typing in a field).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); onToggle(); return; }
      const el = e.target as HTMLElement | null;
      const typing = el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
      if (e.key === '/' && !typing && !open && !e.metaKey && !e.ctrlKey && !e.altKey) { e.preventDefault(); onToggle(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onToggle]);

  // Reset and focus every time it opens; lock page scroll while open; give focus back on close.
  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActive(0);
    const opener = document.activeElement as HTMLElement | null;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    inputRef.current?.focus();
    return () => { document.body.style.overflow = previous; opener?.focus?.(); };
  }, [open]);

  useEffect(() => { setActive(0); }, [query]);
  useEffect(() => { listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' }); }, [active]);

  if (!open) return null;

  const run = (command: Command | undefined) => {
    if (!command) return;
    onClose();
    // Wait for the menu to close (it restores focus and page scroll) before acting.
    setTimeout(command.run, 30);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); onClose(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => (results.length ? (i + 1) % results.length : 0)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); run(results[active]); }
    else if (e.key === 'Tab') e.preventDefault(); // keep focus in the input
  };

  return (
    <div className="palette-veil print-hide" onMouseDown={onClose}>
      <div role="dialog" aria-modal="true" aria-label="Quick menu" onKeyDown={onKeyDown} onMouseDown={(e) => e.stopPropagation()} className="palette glass">
        <div className="palette__search">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            role="combobox"
            aria-expanded="true"
            aria-controls="cmd-list"
            aria-activedescendant={results[active] ? `cmd-${results[active].id}` : undefined}
            aria-label="Search sections and actions"
            placeholder="Jump to a section or run an action…"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd>Esc</kbd>
        </div>
        <ul id="cmd-list" role="listbox" ref={listRef} className="palette__list">
          {results.map((c, i) => (
            <li key={c.id} id={`cmd-${c.id}`} role="option" aria-selected={i === active} onMouseMove={() => setActive(i)} onClick={() => run(c)} className="palette__item">
              <span>{c.label}</span>
              <small>{c.group}</small>
            </li>
          ))}
          {results.length === 0 && <li className="palette__empty" role="presentation">Nothing matches "{query}".</li>}
        </ul>
        <p className="palette__foot">
          <span>↑ ↓ to move, Enter to select</span>
          <span>{isMac ? '⌘' : 'Ctrl'} K or / to open</span>
        </p>
      </div>
    </div>
  );
}
