import { describe, expect, it } from 'vitest';
import { pickSection } from '../hooks';

const tops = (o: Record<string, number | null>) => Object.entries(o).map(([id, top]) => ({ id, top }));

describe('pickSection', () => {
  it('starts on the fallback (Home) when no section has reached the reading line', () => {
    expect(pickSection(tops({ top: 40, skills: 600, about: 1400 }), 300, false, 'top')).toBe('top');
  });
  it('picks the section closest above the line, whatever order the list is in', () => {
    // projects is listed after about but sits above it on the page
    expect(pickSection(tops({ about: 120, projects: -300, work: 900 }), 300, false, 'top')).toBe('about');
    expect(pickSection(tops({ about: -800, projects: -100, work: 900 }), 300, false, 'top')).toBe('projects');
  });
  it('ignores sections that are not on the page', () => {
    expect(pickSection(tops({ top: -500, skills: null, about: 700 }), 300, false, 'top')).toBe('top');
  });
  it('selects Contact at the very bottom even if it is short', () => {
    expect(pickSection(tops({ faq: -200, contact: 400 }), 300, true, 'top')).toBe('contact');
  });
});
