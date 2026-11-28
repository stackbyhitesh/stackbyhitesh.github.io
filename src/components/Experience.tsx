import Tag from './TechIcon';
import Reveal from './Reveal';
import Section, { SectionHead } from './Section';
import { jobs } from '../data';
import { formatDuration, getExperience, jobId, monthsBetween } from '../lib/experience';

/** "Bajaj Finserv" -> "BF", "VPGP (EasyNow)" -> "VP", "OpenText" -> "OT". A plain monogram stands in for company logos. */
function initials(company: string): string {
  const words = company.replace(/\(.*\)/, '').trim().split(/\s+/);
  if (words.length > 1) return words.slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  const capitals = words[0].match(/[A-Z]/g) ?? [];
  return (capitals.length > 1 ? capitals.slice(0, 2).join('') : words[0].slice(0, 2)).toUpperCase();
}

const VISIBLE_POINTS = 3;

export default function Experience() {
  return (
    <Section id="work">
      <SectionHead
        title="Where I've made an impact"
        lead={`${jobs.length} companies, ${getExperience().exact}: from junior developer to tech lead.`}
      />
      <ol className="timeline">
        {jobs.map((job) => {
          const rest = job.points.slice(VISIBLE_POINTS);
          return (
            <Reveal as="li" key={job.company + job.period} id={jobId(job.company)} className="tl">
              <span className={`tl__dot${job.now ? ' tl__dot--now' : ''}`} aria-hidden="true" />
              <article className="tl__card glass">
                <header className="tl__head">
                  <span className="tl__logo" aria-hidden="true">{initials(job.company)}</span>
                  <div className="tl__who">
                    <h3>{job.company}</h3>
                    <p>{job.role}{job.meta ? `, ${job.meta}` : ''}</p>
                  </div>
                  <p className="tl__when">
                    <time>{job.period}</time>
                    <span>{formatDuration(monthsBetween(job.start, job.end))}</span>
                    {job.now && <b className="tl__now">Current</b>}
                  </p>
                </header>
                <p className="tl__summary">{job.summary}</p>
                <ul className="tl__results" aria-label="Impact">
                  {job.results.map((r) => (
                    <li key={r.value + r.label}><strong>{r.value}</strong><span>{r.label}</span></li>
                  ))}
                </ul>
                <ul className="tl__points" aria-label="Key contributions">
                  {job.points.slice(0, VISIBLE_POINTS).map((p) => <li key={p}>{p}</li>)}
                </ul>
                {rest.length > 0 && (
                  <details className="tl__more">
                    <summary>Show {rest.length} more contribution{rest.length > 1 ? 's' : ''}</summary>
                    <ul className="tl__points">{rest.map((p) => <li key={p}>{p}</li>)}</ul>
                  </details>
                )}
                <div className="tag-list">{job.tags.map((t) => <Tag key={t} name={t} />)}</div>
              </article>
            </Reveal>
          );
        })}
      </ol>
    </Section>
  );
}
