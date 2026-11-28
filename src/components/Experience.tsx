import CareerChart, { jobId } from './CareerChart';
import Tag from './TechIcon';
import Section, { SectionHead } from './Section';
import Reveal from './Reveal';
import { jobs } from '../data';
import { formatDuration, monthsBetween } from '../lib/experience';

export default function Experience() {
  return (
    <Section id="work">
      <SectionHead
        label="Experience"
        title="Where I've made an impact"
        lead={<>From junior developer to tech lead: what I did in each role, and what changed because of it.</>}
      />
      <CareerChart />
      <div className="jobpanels">
        {jobs.map((job) => (
          <Reveal as="article" key={job.company + job.period} id={jobId(job.company)} className="jobpanel glass">
            <header className="jobpanel__head">
              <div>
                <h3>{job.company}</h3>
                <p className="job__role">{job.role}{job.meta ? `, ${job.meta}` : ''}</p>
              </div>
              <p className="jobpanel__when">
                <em>{job.period}</em>
                <span>{formatDuration(monthsBetween(job.start, job.end))}</span>
                {job.now && <span className="job__now">Current</span>}
              </p>
            </header>
            <div className="jobpanel__grid">
              <div>
                <p className="job__summary">{job.summary}</p>
                <p className="job__label">Impact</p>
                <ul className="results">
                  {job.results.map((r) => (
                    <li key={r.value + r.label}><strong>{r.value}</strong><span>{r.label}</span></li>
                  ))}
                </ul>
                <p className="job__label">Stack</p>
                <div className="tag-list">{job.tags.map((t) => <Tag key={t} name={t} />)}</div>
              </div>
              <div>
                <p className="job__label job__label--first">What I did</p>
                <ul className="dolist">
                  {job.points.map((p) => <li key={p}>{p}</li>)}
                </ul>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
