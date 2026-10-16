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
}

const ThemeContext = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    safeStorage.set(KEY, theme);
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);
  const value = useMemo(() => ({ theme, toggle }), [theme, toggle]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
