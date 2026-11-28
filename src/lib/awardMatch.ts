import type { Achievement } from '../types';

export interface ImageFile {
  /** File name with extension, for example "Hero.png" */
  name: string;
  url: string;
}

/** "Super Achiever.PNG" -> "superachiever", "Hero's.jpg" -> "heros", "tech_titan.webp" -> "techtitan" */
export const normalizeKey = (name: string): string =>
  name.toLowerCase().replace(/\.[^.]+$/, '').replace(/[^a-z0-9]/g, '');

/** Same, for text that has no file extension (award titles and slugs). */
const textKey = (text: string): string => text.toLowerCase().replace(/[^a-z0-9]/g, '');

function editDistance(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return row[b.length];
}

/** Loose match: one contains the other, or they differ by a single letter ("hero" ~ "heros", "heroes" ~ "heros"). */
export function fuzzyMatch(fileKey: string, candidate: string): boolean {
  if (fileKey === candidate) return true;
  if (Math.min(fileKey.length, candidate.length) < 4) return false;
  return fileKey.includes(candidate) || candidate.includes(fileKey) || editDistance(fileKey, candidate) <= 1;
}

type AwardInfo = Pick<Achievement, 'slug' | 'title' | 'file'>;

/**
 * Decides which image belongs to which award. Returns a map of award slug -> image URL.
 * Order of attempts: 1) the `file` set in data.ts, 2) exact name, 3) loose name match.
 * A file is never used for two awards.
 */
export function assignImages(awards: readonly AwardInfo[], files: readonly ImageFile[]): Record<string, string> {
  const result: Record<string, string> = {};
  const used = new Set<string>();
  const take = (slug: string, file: ImageFile | undefined) => {
    if (!file) return false;
    result[slug] = file.url;
    used.add(file.name);
    return true;
  };
  const names = (a: AwardInfo) => [textKey(a.slug), textKey(a.title.replace(/\baward\b/i, ''))].filter(Boolean);
  const free = () => files.filter((f) => !used.has(f.name));

  for (const a of awards) {
    if (a.file) take(a.slug, files.find((f) => f.name.toLowerCase() === a.file!.toLowerCase()));
  }
  for (const a of awards) {
    if (!result[a.slug]) take(a.slug, free().find((f) => names(a).includes(normalizeKey(f.name))));
  }
  for (const a of awards) {
    if (!result[a.slug]) take(a.slug, free().find((f) => names(a).some((n) => fuzzyMatch(normalizeKey(f.name), n))));
  }
  return result;
}
