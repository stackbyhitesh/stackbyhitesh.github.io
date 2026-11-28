import { achievements } from '../data';
import { assignImages, type ImageFile } from './awardMatch';

// Finds every image in src/assets/achievements. Upper- and lower-case extensions both work.
const files = import.meta.glob<string>(
  '../assets/achievements/*.{jpg,jpeg,png,webp,avif,gif,JPG,JPEG,PNG,WEBP,AVIF,GIF}',
  { eager: true, import: 'default' }
);

const imageFiles: ImageFile[] = Object.entries(files).map(([path, url]) => ({
  name: path.split('/').pop() ?? path,
  url,
}));

/** Award slug -> image URL (only for awards that have an image). */
export const achievementImages: Record<string, string> = assignImages(achievements, imageFiles);

/** Image URL for an award `slug`, or undefined. */
export const findAchievementImage = (slug: string): string | undefined => achievementImages[slug];

// While developing, say which images were found and which awards or files are left over.
if (import.meta.env.DEV) {
  const missing = achievements.filter((a) => !achievementImages[a.slug]).map((a) => a.slug);
  const usedUrls = new Set(Object.values(achievementImages));
  const unmatched = imageFiles.filter((f) => !usedUrls.has(f.url)).map((f) => f.name);
  console.info(
    `[achievements] ${imageFiles.length} image file(s) in src/assets/achievements. ` +
      `Matched awards: ${Object.keys(achievementImages).join(', ') || 'none'}. ` +
      `Awards without image: ${missing.join(', ') || 'none'}. ` +
      `Files not matched to any award: ${unmatched.join(', ') || 'none'}. ` +
      `Rename a file after its award (prodigy.jpg), or set \`file: 'name.jpg'\` on the award in src/data.ts.`
  );
}
