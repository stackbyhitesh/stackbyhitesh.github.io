import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Content-Security-Policy for the production build.
// GitHub Pages cannot send HTTP headers, so the policy is added as a <meta> tag.
// Everything (scripts, styles, fonts, images) is served from the site itself, so the policy is strict.
// The only outside address the page may talk to is the contact-form mail service (FormSubmit).
// It is only added for `vite build` because the dev server needs inline scripts for hot reload.
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' https://formsubmit.co",
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
// Defaults to the live site; set the SITE_URL environment variable to build for another address.
const rawSite = (process.env.SITE_URL ?? 'https://stackbyhitesh.github.io/').trim();
const SITE = rawSite ? rawSite.replace(/\/*$/, '/') : '';

const IMAGE_ALT = 'Hitesh Chaudhari, senior full-stack engineer and tech lead. Portfolio preview card.';

// Structured data (JSON-LD) so Google can understand who the site is about.
const jsonLd = () =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${SITE}#hitesh`,
        name: 'Hitesh Chaudhari',
        url: SITE,
        image: `${SITE}og-image.png`,
        jobTitle: 'Senior Full-Stack Engineer and Tech Lead',
        description: 'Senior full-stack engineer and tech lead building fast, scalable web and mobile products.',
        worksFor: { '@type': 'Organization', name: 'OpenText' },
        address: { '@type': 'PostalAddress', addressLocality: 'Bengaluru', addressRegion: 'Karnataka', addressCountry: 'IN' },
        homeLocation: { '@type': 'Place', name: 'Mumbai, India' },
        knowsAbout: ['Full-stack development', 'React', 'Node.js', 'TypeScript', 'Performance engineering', 'AI-assisted development'],
        sameAs: ['https://linkedin.com/in/eng-hitesh-chaudhari'],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE}#website`,
        url: SITE,
        name: 'Hitesh Chaudhari | Portfolio',
        inLanguage: 'en',
        publisher: { '@id': `${SITE}#hitesh` },
      },
    ],
  });

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
            `<meta property="og:image:type" content="image/png" />`,
            `<meta property="og:image:width" content="1200" />`,
            `<meta property="og:image:height" content="630" />`,
            `<meta property="og:image:alt" content="${IMAGE_ALT}" />`,
            `<meta name="twitter:image" content="${SITE}og-image.png" />`,
            `<meta name="twitter:image:alt" content="${IMAGE_ALT}" />`,
            `<script type="application/ld+json">${jsonLd().replace(/</g, '\\u003c')}</script>`,
          ].join('\n    ')
        : ''
    ),
  generateBundle() {
    this.emitFile({
      type: 'asset',
      fileName: 'robots.txt',
      source: `User-agent: *\nAllow: /\n${SITE ? `\nSitemap: ${SITE}sitemap.xml\n` : ''}`,
    });
    if (SITE) {
      const today = new Date().toISOString().slice(0, 10);
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${SITE}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>1.0</priority></url></urlset>\n`,
      });
    }
  },
});

// base './' keeps the built site working from any path (user site at the root, or a project site under /repo-name/)
export default defineConfig({
  plugins: [react(), tailwindcss(), injectCsp(), seo()],
  base: './',
});
