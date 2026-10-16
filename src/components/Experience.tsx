import CareerChart from './CareerChart';
import Reveal, { stagger } from './Reveal';
import { jobs } from '../data';
import { formatDuration, monthsBetween } from '../lib/experience';

export default function Experience() {
  return (
    <section id="work">
      <Reveal>
        <div className="kick">Experience</div>
        <h2>Where I've made an impact</h2>
        <p className="sec-lead">
          A plain-English summary of each role: what I do, and what changed because of it. Open "What I did" on any card
          for the details.
        </p>
      </Reveal>
      <CareerChart />
      <div className="tl">
        {jobs.map((job, i) => (
          <Reveal as="article" key={job.company + job.period} className={`job gl${job.now ? ' now' : ''}`} delay={stagger(i)}>
            <header className="job-head">
              <div>
                <h3>{job.company}</h3>
                <p className="role">{job.role}{job.meta ? ` · ${job.meta}` : ''}</p>
              </div>
              <div className="job-when">
                <em>{job.period}</em>
                <span className="dur">{formatDuration(monthsBetween(job.start, job.end))}</span>
                {job.now && <span className="badge">Current</span>}
              </div>
            </header>
            <p className="job-sum">{job.summary}</p>
            <ul className="results">
              {job.results.map((r) => (
                <li key={r.value + r.label}><strong>{r.value}</strong><span>{r.label}</span></li>
              ))}
            </ul>
            <details className="job-more" open={job.now}>
              <summary>What I did</summary>
              <ul className="points">{job.points.map((p) => <li key={p}>{p}</li>)}</ul>
              <p className="tags-label">Tech used</p>
              <div className="tags">{job.tags.map((t) => <span key={t}>{t}</span>)}</div>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
