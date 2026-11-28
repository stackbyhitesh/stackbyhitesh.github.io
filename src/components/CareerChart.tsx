import { jobs } from '../data';
import { formatDuration, getExperience, monthIndex, monthsBetween } from '../lib/experience';

export const jobId = (company: string): string => 'job-' + company.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** The career as a time chart, one bar per job. Each row jumps to that role below. */
export default function CareerChart() {
  const now = new Date();
  const nowIdx = now.getFullYear() * 12 + now.getMonth() + 1;
  const min = Math.min(...jobs.map((j) => monthIndex(j.start)));
  const total = nowIdx - min;
  const pct = (idx: number) => ((idx - min) / total) * 100;
  const firstYear = Math.floor(min / 12);
  const years = Array.from({ length: now.getFullYear() - firstYear }, (_, i) => firstYear + 1 + i);
  // Hide the first year label when the next year starts right after it (they would overlap).
  const showFirstYear = years.length === 0 || pct(years[0] * 12) > 9;

  return (
    <div className="career glass">
      <div className="career__head">
        <p className="career__title">Career at a glance</p>
        <p className="career__facts">{jobs.length} companies, {getExperience().exact}</p>
      </div>
      <div className="career__grid">
        <div className="career__years" aria-hidden="true">
          {showFirstYear && <span style={{ left: 0 }}>{firstYear}</span>}
          {years.map((y) => <span key={y} style={{ left: `${pct(y * 12)}%` }}>{y}</span>)}
        </div>
        <div className="career__list">
          {jobs.map((j) => {
            const left = pct(monthIndex(j.start));
            const endIdx = j.end ? monthIndex(j.end) : nowIdx;
            const width = pct(endIdx) - left;
            const label = formatDuration(monthsBetween(j.start, j.end));
            // Bars that end near the right edge get their label on the left, so it is not cut off.
            const labelStyle = left + width > 86 ? { right: `calc(${100 - left}% + 8px)` } : { left: `calc(${left + width}% + 8px)` };
            return (
              <a key={j.company} href={`#${jobId(j.company)}`} className="career__row" aria-label={`${j.company}, ${j.role}, ${label}. Jump to this role.`}>
                <span className="career__name">{j.company}<small>{j.role}</small></span>
                <span className="career__track" aria-hidden="true">
                  {years.map((y) => <i key={y} style={{ left: `${pct(y * 12)}%` }} />)}
                  <span className={`career__bar${j.now ? ' career__bar--now' : ''}`} style={{ left: `${left}%`, width: `${width}%` }} />
                  <span className="career__dur" style={labelStyle}>{label}</span>
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
