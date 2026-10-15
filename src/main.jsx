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
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { ThemeProvider, getInitialTheme } from './context/ThemeContext.jsx';
import './index.css';

// Apply the saved theme before the first render to avoid a flash.
document.documentElement.setAttribute('data-theme', getInitialTheme());

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>
);
