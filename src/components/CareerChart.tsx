import Reveal from './Reveal';
import { jobs } from '../data';
import { formatDuration, monthIndex, monthsBetween } from '../lib/experience';

/** A simple time chart: one bar per job, so the whole career path can be understood at a glance. */
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

  const summary = jobs
    .map((j) => `${j.company}, ${j.role}, ${formatDuration(monthsBetween(j.start, j.end))}${j.now ? ' (current)' : ''}`)
    .join('. ');

  return (
    <Reveal className="career" role="img" aria-label={`Career path. ${summary}.`}>
      <p className="career-title" aria-hidden="true">Career at a glance</p>
      <div className="career-grid" aria-hidden="true">
        <div className="c-axis">
          {showFirstYear && <span className="c-tick first" style={{ left: 0 }}>{firstYear}</span>}
          {years.map((y) => (
            <span className="c-tick" key={y} style={{ left: `${pct(y * 12)}%` }}>{y}</span>
          ))}
        </div>
        {jobs.map((j) => {
          const left = pct(monthIndex(j.start));
          const endIdx = j.end ? monthIndex(j.end) : nowIdx;
          const width = pct(endIdx) - left;
          const label = formatDuration(monthsBetween(j.start, j.end));
          // Bars that end near the right edge get their label on the left, so it is not cut off.
          const labelStyle = left + width > 86 ? { right: `calc(${100 - left}% + 8px)` } : { left: `calc(${left + width}% + 8px)` };
          return (
            <div className="c-row" key={j.company}>
              <span className="c-name">{j.company}</span>
              <span className="c-track">
                {years.map((y) => <i className="c-line" key={y} style={{ left: `${pct(y * 12)}%` }} />)}
                <span className={`c-bar${j.now ? ' now' : ''}`} style={{ left: `${left}%`, width: `${width}%` }} title={`${j.company}: ${j.period}`} />
                <span className="c-dur" style={labelStyle}>{label}</span>
              </span>
            </div>
          );
        })}
      </div>
    </Reveal>
  );
}
