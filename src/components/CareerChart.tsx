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
    <Reveal className="print-box mb-[clamp(28px,4vw,40px)] rounded-3xl border border-line bg-card px-[clamp(16px,2.6vw,28px)] pt-5 pb-[22px]" role="img" aria-label={`Career path. ${summary}.`}>
      <p className="mb-3.5 font-mono text-[.74rem] font-medium tracking-[.12em] text-muted uppercase" aria-hidden="true">Career at a glance</p>
      <div className="grid gap-2" aria-hidden="true">
        <div className="relative h-[18px] sm:ml-[162px]">
          {showFirstYear && <span className="absolute top-0 left-0 font-mono text-[.7rem] font-medium text-muted">{firstYear}</span>}
          {years.map((y) => (
            <span className="absolute top-0 -translate-x-1/2 font-mono text-[.7rem] font-medium text-muted" key={y} style={{ left: `${pct(y * 12)}%` }}>{y}</span>
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
            <div className="grid items-center gap-1 sm:grid-cols-[150px_1fr] sm:gap-3" key={j.company}>
              <span className="text-[.85rem] leading-tight font-semibold sm:text-[.9rem]">{j.company}</span>
              <span className="relative h-4">
                {years.map((y) => <i className="absolute -top-1 -bottom-1 w-px bg-line" key={y} style={{ left: `${pct(y * 12)}%` }} />)}
                <span
                  className={`absolute inset-y-0.5 min-w-1.5 rounded-full ${j.now ? 'bg-[linear-gradient(90deg,#ff9a3c,var(--c))]' : 'bg-[linear-gradient(90deg,var(--a),var(--b))]'}`}
                  style={{ left: `${left}%`, width: `${width}%` }}
                  title={`${j.company}: ${j.period}`}
                />
                <span className="absolute top-0 font-mono text-[.72rem] leading-4 whitespace-nowrap text-muted" style={labelStyle}>{label}</span>
              </span>
            </div>
          );
        })}
      </div>
    </Reveal>
  );
}
