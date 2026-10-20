import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Fonts are bundled with the site (no calls to Google), which keeps the Content-Security-Policy strict.
import '@fontsource/plus-jakarta-sans/latin-600.css';
import '@fontsource/plus-jakarta-sans/latin-700.css';
import '@fontsource/plus-jakarta-sans/latin-800.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/jetbrains-mono/latin-500.css';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider, getInitialTheme } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import './index.css';

// Apply the saved theme before the first render to avoid a flash.
document.documentElement.setAttribute('data-theme', getInitialTheme());

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root not found');

createRoot(container).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>
);
