# Hitesh Chaudhari – Portfolio

A fast, accessible, single-page portfolio built with **React 18**, **TypeScript** and **Vite**. It is a static site (no backend), so it can be hosted for free on GitHub Pages.

## Tech stack
- **React 18** with function components and hooks
- **TypeScript** in strict mode (`npm run typecheck`)
- **Vite 6** for the dev server and production build
- **Vitest** for unit tests, **ESLint** (typescript-eslint, React, React Hooks) for code quality
- **Tailwind CSS v4** (`@tailwindcss/vite`): styling is utility classes in the components. `src/index.css` only holds the design tokens (dark and light), animations and a few reusable classes (`card`, `btn`, `glass`)
- Fonts bundled with `@fontsource` (Plus Jakarta Sans, Inter, JetBrains Mono), so nothing loads from third parties (the only outside call is the contact form to FormSubmit)

## Live address
The site is published at **https://stackbyhitesh.github.io/**. That address is the default for the canonical link, link-preview image, sitemap and robots.txt (`vite.config.ts` and the deploy workflow). For a different address, set a repository variable named `SITE_URL`.

## Contact form (free email, no key, no mail app)
Messages are sent to `profile.email` (`src/data.ts`) through [FormSubmit](https://formsubmit.co). It is free and needs no sign-up.

**One-time step after the site is live:** open the site, send yourself a test message from the form, then open the email FormSubmit sends to your inbox (check spam) and click **Activate Form**. From then on every message lands in your inbox, with the visitor's email as the Reply-To address.

Extras: a hidden spam trap, a 60-second cooldown, drafts saved in the browser, and a clear error with an "email me directly" link if sending fails. FormSubmit puts your address in the form's web address, so it is visible to anyone who inspects the page (it is already shown on the site).

## New in v2
- Tailwind CSS rewrite of every component (same design, dark and light themes)
- Working contact form (above) with email field, topic chips, and loading, success and error states
- Quick menu: press **Ctrl/⌘ + K** or **/** to jump to a section, switch theme, copy your email and open your links
- Project filter buttons (categories are set per project in `src/data.ts`)
- Back-to-top button with a scroll-progress ring, and "Share this site" in the footer

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

## Experience section ("Where I've made an impact")
Each job in `src/data.ts` has these fields (typed in `src/types.ts`):
- `summary`: one plain-language sentence that explains the role to anyone.
- `results`: the headline numbers shown as small tiles (for example `{ value: '−18%', label: 'API response time' }`).
- `points`: the details, shown when "What I did" is opened. Explain technical terms in plain words and put the tool name in brackets.
- `tags`: the technologies, shown under "Tech used".
- `start` / `end` (`"YYYY-MM"`; leave `end` out for the current job): these draw the "Career at a glance" chart and calculate each duration automatically.
- `period`: the dates as written on the card.

## Award images
Put images in `src/assets/achievements/`, named after the `slug` of each award in `data.ts`:
`heros.jpg`, `prodigy.jpg`, `super-achiever.jpg`, `tech-titan.jpg` (png, webp and avif also work).
Cards without an image show a medal placeholder. Clicking a card with an image opens it full size (arrow keys move between awards, Esc closes).
`sample-images/` has illustrative artwork for previewing the layout. **Replace it with your real award photos before publishing.**

**Images not showing?** The "Click an award to view it full size" line only appears when at least one image is found.
1. The image must be inside `src/assets/achievements/` (not `sample-images/` and not `public/`).
2. Name it after the award: `heros`, `prodigy`, `super-achiever`, `tech-titan`. Capital letters, spaces, dashes and underscores are ignored, so `Super Achiever.PNG` works, and close names such as `Hero.png`, `titan.jpg` or `Prodigy copy.jpg` are matched too. Supported types: jpg, jpeg, png, webp, avif, gif.
3. **Any file name:** if a file has an unrelated name (for example `IMG_1234.jpg`), set it on the award in `src/data.ts`:
   `{ slug: 'prodigy', title: 'Prodigy Award', note: '…', file: 'IMG_1234.jpg' }`
4. Commit and push the images: `git add src/assets/achievements`, commit, push. Files that exist only on your computer do not appear on the live site.
5. **Check the deploy:** on GitHub open the **Actions** tab. If the latest run is red, the live site was not updated, so new images (and any other changes) are not live yet.
6. While running `npm run dev`, the browser console lists how many image files were found, which awards matched, and which files were left over.
7. Quick test: copy the four files from `sample-images/` into `src/assets/achievements/`.

## Experience counter
Years and months of experience are calculated from today's date (hero text, "What I do" text and the stats strip). The start date is `CAREER_START` in `src/lib/experience.ts` (September 2018).
Within one month of a whole year it shows "about N years" and "~N"; otherwise the exact value, for example "8 years and 3 months" and "8+".

## Optional extras (all in `src/data.ts`)
- `profile.github`: adds a GitHub icon and link.
- `profile.calendar`: adds a "Book a 15-min call" link (Cal.com, Calendly…).
- `testimonials`: add quotes (for example from LinkedIn recommendations, with permission) and a "Kind words" section appears.
- `topicOptions`: the choices in the contact form's "What's it about?" menu. The choice is added to the email subject.

## Updating an existing repository from the older JavaScript version
If you copy this project over an older version of the site, delete the old JavaScript files first. Leftovers such as `vite.config.js` or `src/**/*.jsx` sit next to the new `.ts` / `.tsx` files and break lint, typecheck or the build.
```bash
git rm -f vite.config.js
git ls-files 'src/*.js' 'src/*.jsx' | xargs git rm -f
```
(On Windows without `xargs`, delete those files in your editor.) Then run `npm install`, `npm run typecheck`, `npm run lint` and `npm test` before pushing.

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
5. Your site is live at `https://stackbyhitesh.github.io/`.

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
- Title, description, keywords, canonical link, Open Graph / Twitter tags and JSON-LD (Person and WebSite) are set in `index.html` and `vite.config.ts`. `robots.txt` and `sitemap.xml` are generated on every build.
- Icons live in `public/`: `favicon.svg`, `favicon.ico`, PNG sizes, `apple-touch-icon.png` and `site.webmanifest` (with a maskable icon for Android).
- After deploying, add `https://stackbyhitesh.github.io/` to [Google Search Console](https://search.google.com/search-console) and submit `sitemap.xml` so Google finds the site faster.
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
