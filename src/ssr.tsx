// Used only by scripts/prerender.mjs at build time: renders the page to an HTML string so search engines and
// link-preview bots see the real content without running JavaScript. The browser never loads this file.
import { renderToString } from 'react-dom/server';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

export const render = (): string =>
  renderToString(
    <ThemeProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ThemeProvider>
  );
