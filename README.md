# Hitesh Chaudhari – Portfolio (React + Vite)

## Commands
```bash
npm install
npm run dev       # local preview at http://localhost:5173
npm run lint      # check code quality
npm test          # unit tests (form validation and security helpers)
npm run build     # production build in dist/
```

## Edit content
- All text (jobs, projects, skills, contact) is in `src/data.js`.
- Your photo is `src/assets/hitesh.jpg`.
- Award images go in `src/assets/achievements/` named `heros.jpg`, `prodigy.jpg`, `super-achiever.jpg`, `tech-titan.jpg`. Cards without an image show a medal placeholder. The `sample-images/` folder has illustrative artwork you can use to preview the layout (replace with real photos before publishing).
- Link preview image (shown when you share the link): `public/og-image.png` (1200×630).

## Experience counter
Years and months of experience are calculated from today's date (hero text, "What I do" text and the stats strip). The start date is `CAREER_START` in `src/lib/experience.js` (September 2018). Within one month of a whole year it shows "about N years" and "~N"; otherwise the exact value, for example "8 years and 3 months" and "8+".

## Optional extras (all in `src/data.js`)
- `profile.github`: add your GitHub link and a GitHub icon and link appear automatically.
- `profile.calendar`: add a booking link (Cal.com, Calendly) and a "Book a 15-min call" link appears in the contact section.
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

Every push to `main` lints, tests, builds and deploys. Pull requests run the checks without deploying.

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
5. **Important for link previews and Google:** in **Settings → Secrets and variables → Actions → Variables**, create a variable named `SITE_URL` with your address, for example `https://www.yourdomain.com/`, then re-run the workflow. This sets the preview image, canonical link and sitemap to your real address.

## Search and sharing
- Link preview (WhatsApp, LinkedIn, X): `og-image.png` plus Open Graph tags. Needs `SITE_URL` (set automatically for `github.io` addresses).
- `robots.txt` and `sitemap.xml` are generated on build.
- Structured data (schema.org Person) is in `index.html`.
- Favicon, Apple touch icon, a custom 404 page and a print-friendly stylesheet are included.

## Fonts and responsive design
Design: dark blue glass look (light theme available with the toggle). Fonts: Plus Jakarta Sans (headings), Inter (text) and JetBrains Mono (small labels), bundled through `@fontsource`.
The layout adapts to desktop, laptop, tablet and phone (breakpoints at 1100, 1024, 900, 700, 520 and 380 px).

## Security measures
- **Content-Security-Policy** in the production build: only the site's own scripts, styles, fonts and images are allowed. Nothing loads from third parties.
- **Contact form** input is cleaned and URL-encoded so text cannot add extra email headers (`src/lib/security.js`, with tests).
- **External links** open only if they are `https`, with `rel="noopener noreferrer"`.
- No secrets, no backend, no tracking.
- `npm audit` runs in CI and Dependabot opens weekly update pull requests. GitHub Actions use read-only permissions except the deploy job.
- Limit: GitHub Pages cannot send HTTP security headers, so clickjacking protection (`frame-ancestors`) is not possible there.

## State management
- `ThemeContext`: theme, saved safely in localStorage.
- `Contact`: one `useReducer` holds form values, errors and status.
- `hooks.js`: `usePrefersReducedMotion`, `useInView`, `useScrollSpy`, `useTyping`, `useCopy`, `useTilt`, `useMagnetic`.
- `ErrorBoundary`: friendly fallback instead of a blank page.
