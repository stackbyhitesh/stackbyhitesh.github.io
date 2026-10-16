export interface CareerStart {
  year: number;
  /** 1 to 12 */
  month: number;
}

// Career start: September 2018 (first job, Fleet Solution). Change this if you want a different start date.
export const CAREER_START: CareerStart = { year: 2018, month: 9 };

// Show "about N years" when the total is within this many months of a whole year.
export const APPROX_WITHIN_MONTHS = 1;

export interface Experience {
  years: number;
  months: number;
  approx: boolean;
  /** "8 years 1 month" */
  exact: string;
  /** "about 8 years" or "8 years and 3 months" */
  phrase: string;
  /** Same as `phrase`, capitalised for the start of a sentence. */
  phraseCap: string;
  /** Big number in the stats strip: "~8", "8" or "8+" */
  display: { prefix: string; to: number; suffix: string };
}

const plural = (n: number, word: string): string => `${n} ${word}${n === 1 ? '' : 's'}`;

/**
 * Work experience since CAREER_START, calculated from today's date.
 * Examples (start Sep 2018): Sep 2026 -> "8 years", Oct 2026 -> "about 8 years" (8 years 1 month),
 * Aug 2026 -> "about 8 years" (7 years 11 months), Dec 2026 -> "8 years and 3 months".
 */
export function getExperience(now: Date = new Date(), start: CareerStart = CAREER_START): Experience {
  const total = Math.max(0, (now.getFullYear() - start.year) * 12 + (now.getMonth() + 1 - start.month));
  const years = Math.floor(total / 12);
  const months = total % 12;

  const justOver = months > 0 && months <= APPROX_WITHIN_MONTHS;
  const justUnder = months >= 12 - APPROX_WITHIN_MONTHS;
  const rounded = justUnder ? years + 1 : years;
  const approx = rounded >= 1 && (justOver || justUnder);

  let exact: string;
  let spoken: string;
  if (months === 0) exact = spoken = plural(years, 'year');
  else if (years === 0) exact = spoken = plural(months, 'month');
  else {
    exact = `${plural(years, 'year')} ${plural(months, 'month')}`;
    spoken = `${plural(years, 'year')} and ${plural(months, 'month')}`;
  }
  const phrase = approx ? `about ${plural(rounded, 'year')}` : spoken;

  return {
    years,
    months,
    approx,
    exact,
    phrase,
    phraseCap: phrase.charAt(0).toUpperCase() + phrase.slice(1),
    display: approx
      ? { prefix: '~', to: rounded, suffix: '' }
      : { prefix: '', to: years, suffix: months > 0 ? '+' : '' },
  };
}

/** "2025-11" -> a number of months, so dates can be subtracted. */
export const monthIndex = (ym: string): number => {
  const [y, m] = ym.split('-').map(Number);
  return y * 12 + (m - 1);
};

/** Whole months from `start` to `end` ("YYYY-MM"), or to today when `end` is left out. */
export function monthsBetween(start: string, end?: string, now: Date = new Date()): number {
  const endIdx = end ? monthIndex(end) : now.getFullYear() * 12 + now.getMonth();
  return Math.max(0, endIdx - monthIndex(start));
}

/** 32 -> "2 yrs 8 mo", 11 -> "11 mo", 24 -> "2 yrs" */
export function formatDuration(months: number): string {
  const y = Math.floor(months / 12);
  const m = months % 12;
  const parts: string[] = [];
  if (y) parts.push(`${y} yr${y > 1 ? 's' : ''}`);
  if (m || !y) parts.push(`${m} mo`);
  return parts.join(' ');
}
