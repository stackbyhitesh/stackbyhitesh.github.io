import { describe, expect, it } from 'vitest';
import { formatDuration, getExperience, monthsBetween } from './experience';

const at = (y: number, m: number) => getExperience(new Date(y, m - 1, 15)); // month is 1-12

describe('getExperience (career start Sep 2018)', () => {
  it('shows an exact whole year without "about"', () => {
    const e = at(2026, 9);
    expect(e.approx).toBe(false);
    expect(e.phrase).toBe('8 years');
    expect(e.display).toEqual({ prefix: '', to: 8, suffix: '' });
  });
  it('says "about" one month after a whole year', () => {
    const e = at(2026, 10);
    expect(e.approx).toBe(true);
    expect(e.exact).toBe('8 years 1 month');
    expect(e.phrase).toBe('about 8 years');
    expect(e.display).toEqual({ prefix: '~', to: 8, suffix: '' });
  });
  it('rounds up one month before a whole year', () => {
    const e = at(2026, 8);
    expect(e.approx).toBe(true);
    expect(e.exact).toBe('7 years 11 months');
    expect(e.display.to).toBe(8);
  });
  it('shows exact years and months in between', () => {
    const e = at(2026, 12);
    expect(e.approx).toBe(false);
    expect(e.phrase).toBe('8 years and 3 months');
    expect(e.display).toEqual({ prefix: '', to: 8, suffix: '+' });
  });
  it('never says "about 0 years"', () => {
    const e = at(2018, 10);
    expect(e.approx).toBe(false);
    expect(e.phrase).toBe('1 month');
  });
  it('capitalises the phrase for the start of a sentence', () => {
    expect(at(2026, 10).phraseCap).toBe('About 8 years');
  });
});

describe('job durations', () => {
  it('counts months between two dates', () => {
    expect(monthsBetween('2023-03', '2025-11')).toBe(32);
    expect(monthsBetween('2025-11', undefined, new Date(2026, 9, 15))).toBe(11);
  });
  it('formats years and months', () => {
    expect(formatDuration(32)).toBe('2 yrs 8 mo');
    expect(formatDuration(11)).toBe('11 mo');
    expect(formatDuration(24)).toBe('2 yrs');
    expect(formatDuration(13)).toBe('1 yr 1 mo');
  });
});
