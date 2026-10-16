# Hitesh Chaudhari – Portfolio

A fast, accessible, single-page portfolio built with **React 18**, **TypeScript** and **Vite**. It is a static site (no backend), so it can be hosted for free on GitHub Pages.

## Tech stack
- **React 18** with function components and hooks
- **TypeScript** in strict mode (`npm run typecheck`)
- **Vite 6** for the dev server and production build
- **Vitest** for unit tests, **ESLint** (typescript-eslint, React, React Hooks) for code quality
- Plain CSS in `src/index.css` (dark design with glass accents, plus a light theme)
- Fonts bundled with `@fontsource` (Plus Jakarta Sans, Inter, JetBrains Mono), so nothing loads from third parties

## Commands
```bash
npm install
npm run dev         # local preview at http://localhost:5173
npm run typecheck   # TypeScript check (no output files)
npm run lint        # ESLint
npm test            # unit tests (Vitest)
npm run build       # typecheck + production build into dist/
npm run preview     # serve the built site locally
```

## Project structure
```
.
├── index.html                 # page shell, meta tags, structured data
├── vite.config.ts             # Vite config + CSP and SEO plugins
├── tsconfig.json              # strict TypeScript settings
├── eslint.config.js
├── public/                    # copied as-is: og-image.png, favicon.svg, 404.html, vCard
├── sample-images/             # illustrative award artwork (not used by the site)
└── src/
    ├── main.tsx               # entry point (theme, error boundary, fonts)
    ├── App.tsx                # page layout: section order
    ├── data.ts                # ALL content (typed)
    ├── types.ts               # TypeScript interfaces for the content
    ├── hooks.ts               # typed hooks (scroll spy, in-view, typing, tilt, copy…)
    ├── index.css              # styles, responsive rules, glass effects, print styles
    ├── components/            # one file per section + small shared pieces
    ├── context/ThemeContext.tsx
    ├── lib/                   # security helpers, experience calculator, storage, image loader (+ tests)
    └── assets/                # hitesh.jpg and achievements/
```

## Edit content
- All text (jobs, projects, skills, contact, awards) is in **`src/data.ts`**. The shapes are defined in **`src/types.ts`**, so your editor and `npm run typecheck` warn you about typos or missing fields.
- Your photo is `src/assets/hitesh.jpg`.
- Link preview image (shown when the link is shared): `public/og-image.png` (1200×630).

## Award images
Put images in `src/assets/achievements/`, named after the `slug` of each award in `data.ts`:
`heros.jpg`, `prodigy.jpg`, `super-achiever.jpg`, `tech-titan.jpg` (png, webp and avif also work).
Cards without an image show a medal placeholder. Clicking a card with an image opens it full size (arrow keys move between awards, Esc closes).
`sample-images/` has illustrative artwork for previewing the layout. **Replace it with your real award photos before publishing.**

## Experience counter
Years and months of experience are calculated from today's date (hero text, "What I do" text and the stats strip). The start date is `CAREER_START` in `src/lib/experience.ts` (September 2018).
Within one month of a whole year it shows "about N years" and "~N"; otherwise the exact value, for example "8 years and 3 months" and "8+".

## Optional extras (all in `src/data.ts`)
- `profile.github`: adds a GitHub icon and link.
- `profile.calendar`: adds a "Book a 15-min call" link (Cal.com, Calendly…).
- `testimonials`: add quotes (for example from LinkedIn recommendations, with permission) and a "Kind words" section appears.
- `topicOptions`: the choices in the contact form's "What's it about?" menu. The choice is added to the email subject.
- `public/hitesh-chaudhari.vcf`: the "Save my contact" card. Edit it if your details change.

## Put it live for free (GitHub Pages)
1. Create a **public** repository on github.com (for example `portfolio`).
2. In this folder run:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/portfolio.git
   git push -u origin main
   ```
3. On GitHub open **Settings → Pages** and set **Source** to **GitHub Actions**.
4. Open the **Actions** tab and wait for the workflow to turn green (about 1–2 minutes).
5. Your site is live at `https://YOUR-USERNAME.github.io/portfolio/`.

Every push to `main` runs typecheck, lint, tests, an audit and the build, then deploys. Pull requests run the same checks without deploying.

## Custom domain
1. Buy a domain from any registrar.
2. In **Settings → Pages → Custom domain** type `www.yourdomain.com` and save.
3. At your registrar add DNS records:

   | Type  | Host / Name | Value |
   |-------|-------------|-------|
   | CNAME | www         | YOUR-USERNAME.github.io |
   | A     | @           | 185.199.108.153 |
   | A     | @           | 185.199.109.153 |
   | A     | @           | 185.199.110.153 |
   | A     | @           | 185.199.111.153 |
4. When the DNS check turns green, tick **Enforce HTTPS**.
5. **For link previews and Google:** in **Settings → Secrets and variables → Actions → Variables**, create a variable named `SITE_URL` with your address, for example `https://www.yourdomain.com/`, then re-run the workflow. This sets the preview image, canonical link and sitemap to your real address.

## Search and sharing
- Link preview (WhatsApp, LinkedIn, X): `og-image.png` plus Open Graph tags. Needs `SITE_URL` (set automatically for `github.io` addresses).
- `robots.txt` and `sitemap.xml` are generated on build.
- Structured data (schema.org Person) is in `index.html`.
- Favicon, Apple touch icon, a custom 404 page and a print-friendly stylesheet are included.

## Design and responsiveness
- Dark navy design with glass accents: frosted chips, buttons, floating badges, service and project cards, contact links and menus. Big panels stay solid for smooth scrolling. A light theme is available with the toggle (your choice is remembered).
- Layout adapts to desktop, laptop, tablet and phone (breakpoints at 1100, 1024, 900, 700, 520 and 380 px). Text sizes and spacing scale smoothly.
- Respects "reduce motion", has keyboard-friendly navigation, a skip link and a focus trap in the award viewer.

## Security measures
- **Content-Security-Policy** in the production build: only the site's own scripts, styles, fonts and images are allowed. Nothing loads from third parties.
- **Contact form** input is cleaned and URL-encoded so text cannot add extra email headers (`src/lib/security.ts`, with tests).
- **External links** open only if they are `https`, with `rel="noopener noreferrer"`.
- No secrets, no backend, no tracking.
- `npm audit` runs in CI and Dependabot opens weekly update pull requests. GitHub Actions use read-only permissions except the deploy job.
- Limit: GitHub Pages cannot send HTTP security headers, so clickjacking protection (`frame-ancestors`) is not possible there.

## State management
- `ThemeContext`: theme (typed as `'dark' | 'light'`), saved safely in localStorage.
- `Contact`: one `useReducer` with typed actions holds form values, errors and status.
- `hooks.ts`: `usePrefersReducedMotion`, `useInView`, `useScrollSpy`, `useTyping`, `useCopy`, `useTilt`, `useMagnetic`.
- `ErrorBoundary`: friendly fallback instead of a blank page.
