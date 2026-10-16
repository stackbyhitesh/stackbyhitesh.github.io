import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// Content-Security-Policy for the production build.
// GitHub Pages cannot send HTTP headers, so the policy is added as a <meta> tag.
// Everything (scripts, styles, fonts, images) is served from the site itself, so the policy is strict.
// It is only added for `vite build` because the dev server needs inline scripts for hot reload.
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join('; ');

const injectCsp = (): Plugin => ({
  name: 'inject-csp',
  apply: 'build',
  transformIndexHtml: (html) =>
    html.replace('<!--CSP-->', `<meta http-equiv="Content-Security-Policy" content="${CSP}" />`),
});

// Public site address, used for the link-preview image, canonical link and sitemap.
// Set the SITE_URL environment variable when building (the GitHub workflow does this for you).
const rawSite = (process.env.SITE_URL ?? '').trim();
const SITE = rawSite ? rawSite.replace(/\/*$/, '/') : '';

const seo = (): Plugin => ({
  name: 'seo',
  apply: 'build',
  transformIndexHtml: (html) =>
    html.replace(
      '<!--SOCIAL-->',
      SITE
        ? [
            `<link rel="canonical" href="${SITE}" />`,
            `<meta property="og:url" content="${SITE}" />`,
            `<meta property="og:image" content="${SITE}og-image.png" />`,
            `<meta name="twitter:image" content="${SITE}og-image.png" />`,
          ].join('\n    ')
        : ''
    ),
  generateBundle() {
    this.emitFile({
      type: 'asset',
      fileName: 'robots.txt',
      source: `User-agent: *\nAllow: /\n${SITE ? `Sitemap: ${SITE}sitemap.xml\n` : ''}`,
    });
    if (SITE) {
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${SITE}</loc></url></urlset>\n`,
      });
    }
  },
});

// base './' makes the built site work under any GitHub Pages URL (user.github.io/repo-name/)
export default defineConfig({
  plugins: [react(), injectCsp(), seo()],
  base: './',
});
