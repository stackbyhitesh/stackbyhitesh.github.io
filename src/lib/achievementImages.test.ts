import { describe, expect, it } from 'vitest';
import { normalizeKey } from './achievementImages';

describe('normalizeKey', () => {
  it('ignores case, spaces, dashes, underscores and the extension', () => {
    expect(normalizeKey('Super Achiever.PNG')).toBe('superachiever');
    expect(normalizeKey('super-achiever')).toBe('superachiever');
    expect(normalizeKey('tech_titan.webp')).toBe('techtitan');
  });
  it('handles apostrophes', () => {
    expect(normalizeKey("Hero's.jpg")).toBe('heros');
    expect(normalizeKey('heros')).toBe('heros');
  });
});
