import { achievements } from '../data';

// Finds every image in src/assets/achievements. Upper- and lower-case extensions both work.
const files = import.meta.glob<string>(
  '../assets/achievements/*.{jpg,jpeg,png,webp,avif,gif,JPG,JPEG,PNG,WEBP,AVIF,GIF}',
  { eager: true, import: 'default' }
);

/** "Super Achiever.PNG" -> "superachiever", "Hero's.jpg" -> "heros", "tech_titan.webp" -> "techtitan" */
export const normalizeKey = (name: string): string =>
  name.toLowerCase().replace(/\.[^.]+$/, '').replace(/[^a-z0-9]/g, '');

const byKey: Record<string, string> = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [normalizeKey(path.split('/').pop() ?? path), url])
);

/** Image URL for an award `slug` (spaces, dashes, underscores and capital letters are ignored), or undefined. */
export const findAchievementImage = (slug: string): string | undefined => byKey[normalizeKey(slug)];

// While developing, say which award images were found and which are missing.
if (import.meta.env.DEV) {
  const found = achievements.filter((a) => findAchievementImage(a.slug)).map((a) => a.slug);
  const missing = achievements.filter((a) => !findAchievementImage(a.slug)).map((a) => a.slug);
  console.info(
    `[achievements] images found: ${found.join(', ') || 'none'}. Missing: ${missing.join(', ') || 'none'}. ` +
      `Put them in src/assets/achievements/ (for example prodigy.jpg).`
  );
}
