import { projects } from '../data';

// Finds every image in src/assets/projects. Name a file after the project's `slug` in src/data.ts
// (for example caching.png) and it replaces the interface illustration automatically.
const files = import.meta.glob<string>(
  '../assets/projects/*.{jpg,jpeg,png,webp,avif,gif,JPG,JPEG,PNG,WEBP,AVIF,GIF}',
  { eager: true, import: 'default' }
);

const bySlug: Record<string, string> = {};
for (const [path, url] of Object.entries(files)) {
  const base = (path.split('/').pop() ?? '').replace(/\.[^.]+$/, '').toLowerCase();
  bySlug[base] = url;
}

/** Screenshot URL for a project, or undefined when none has been added yet. */
export const findProjectImage = (slug: string | undefined): string | undefined => (slug ? bySlug[slug.toLowerCase()] : undefined);

if (import.meta.env.DEV) {
  const missing = projects.filter((p) => !findProjectImage(p.slug)).map((p) => p.slug ?? p.title);
  console.info(`[projects] screenshots found: ${Object.keys(bySlug).join(', ') || 'none'}. Still showing illustrations: ${missing.join(', ') || 'none'}.`);
}
