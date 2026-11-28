import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { safeStorage } from '../lib/storage';
import type { Theme } from '../types';

const KEY = 'theme';
const THEMES: readonly Theme[] = ['dark', 'light'];

/** Saved choice if there is one, otherwise the dark design. */
export const getInitialTheme = (): Theme => {
  const saved = safeStorage.get(KEY);
  return THEMES.includes(saved as Theme) ? (saved as Theme) : 'dark';
};

interface ThemeValue {
  theme: Theme;
  toggle: () => void;
  set: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    safeStorage.set(KEY, theme);
  }, [theme]);

  // Setting the theme directly (instead of only toggling) lets the nav show a two-button switch.
  const set = useCallback((next: Theme) => {
    // A short class lets colours cross-fade instead of snapping. It is removed again so normal hover speeds are untouched.
    const root = document.documentElement;
    root.classList.add('theme-fade');
    window.setTimeout(() => root.classList.remove('theme-fade'), 450);
    setTheme(next);
  }, []);
  const toggle = useCallback(() => set(theme === 'dark' ? 'light' : 'dark'), [set, theme]);
  const value = useMemo(() => ({ theme, toggle, set }), [theme, toggle, set]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
