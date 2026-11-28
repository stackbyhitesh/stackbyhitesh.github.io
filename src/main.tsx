import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider, getInitialTheme } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
// Fonts (Lora and DM Sans) are bundled with the site and declared in index.css, so there are no calls to Google
// and the Content-Security-Policy stays strict.
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
