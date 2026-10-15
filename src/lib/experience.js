// Career start: September 2018 (first job, Fleet Solution). Change this if you want a different start date.
export const CAREER_START = { year: 2018, month: 9 };

// Show "about N years" when the total is within this many months of a whole year.
export const APPROX_WITHIN_MONTHS = 1;

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

/**
 * Work experience since CAREER_START, calculated from today's date.
 * Examples (start Sep 2018): Sep 2026 -> "8 years", Oct 2026 -> "about 8 years" (8 years 1 month),
 * Aug 2026 -> "about 8 years" (7 years 11 months), Dec 2026 -> "8 years and 3 months".
 */
export function getExperience(now = new Date(), start = CAREER_START) {
  const total = Math.max(0, (now.getFullYear() - start.year) * 12 + (now.getMonth() + 1 - start.month));
  const years = Math.floor(total / 12);
  const months = total % 12;

  const justOver = months > 0 && months <= APPROX_WITHIN_MONTHS;
  const justUnder = months >= 12 - APPROX_WITHIN_MONTHS;
  const rounded = justUnder ? years + 1 : years;
  const approx = rounded >= 1 && (justOver || justUnder);

  let exact;
  let spoken;
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
    exact, // "8 years 1 month"
    phrase, // "about 8 years" or "8 years and 3 months"
    phraseCap: phrase.charAt(0).toUpperCase() + phrase.slice(1),
    // Big number in the stats strip: "~8", "8" or "8+"
    display: approx
      ? { prefix: '~', to: rounded, suffix: '' }
      : { prefix: '', to: years, suffix: months > 0 ? '+' : '' },
  };
}
