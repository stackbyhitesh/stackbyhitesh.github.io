import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { safeStorage } from '../lib/storage';

const KEY = 'theme';
const THEMES = ['dark', 'light'];

/** Saved choice if there is one, otherwise the dark design. */
export const getInitialTheme = () => {
  const saved = safeStorage.get(KEY);
  return THEMES.includes(saved) ? saved : 'dark';
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    safeStorage.set(KEY, theme);
  }, [theme]);

  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);
  const value = useMemo(() => ({ theme, toggle }), [theme, toggle]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
