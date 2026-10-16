import { describe, expect, it } from 'vitest';
import { assignImages, fuzzyMatch, normalizeKey, type ImageFile } from './awardMatch';

const awards = [
  { slug: 'heros', title: "Hero's Award" },
  { slug: 'prodigy', title: 'Prodigy Award' },
  { slug: 'super-achiever', title: 'Super Achiever Award' },
  { slug: 'tech-titan', title: 'Tech Titan Award' },
];
const f = (name: string): ImageFile => ({ name, url: `/img/${name}` });

describe('normalizeKey', () => {
  it('ignores case, spaces, dashes, underscores and the extension', () => {
    expect(normalizeKey('Super Achiever.PNG')).toBe('superachiever');
    expect(normalizeKey('tech_titan.webp')).toBe('techtitan');
    expect(normalizeKey("Hero's.jpg")).toBe('heros');
  });
});

describe('fuzzyMatch', () => {
  it('accepts near names', () => {
    expect(fuzzyMatch('hero', 'heros')).toBe(true);
    expect(fuzzyMatch('heroes', 'heros')).toBe(true);
    expect(fuzzyMatch('achiever', 'superachiever')).toBe(true);
  });
  it('rejects unrelated or very short names', () => {
    expect(fuzzyMatch('img1234', 'heros')).toBe(false);
    expect(fuzzyMatch('abc', 'abcd')).toBe(false);
  });
});

describe('assignImages', () => {
  it('matches exact names', () => {
    const r = assignImages(awards, [f('prodigy.jpg'), f('heros.png')]);
    expect(r.prodigy).toBe('/img/prodigy.jpg');
    expect(r.heros).toBe('/img/heros.png');
  });
  it('matches loose names such as Hero.png and titan.JPG', () => {
    const r = assignImages(awards, [f('Hero.png'), f('titan.JPG'), f('Prodigy copy.jpg')]);
    expect(r.heros).toBe('/img/Hero.png');
    expect(r['tech-titan']).toBe('/img/titan.JPG');
    expect(r.prodigy).toBe('/img/Prodigy copy.jpg');
  });
  it('uses the explicit file option for any file name', () => {
    const r = assignImages([{ ...awards[1], file: 'IMG_1234.jpg' }], [f('IMG_1234.jpg')]);
    expect(r.prodigy).toBe('/img/IMG_1234.jpg');
  });
  it('leaves unrelated files unused and never reuses a file', () => {
    const r = assignImages(awards, [f('IMG_9.jpg'), f('titan.jpg')]);
    expect(Object.keys(r)).toEqual(['tech-titan']);
  });
});
