import CareerChart from './CareerChart';
import Reveal, { stagger } from './Reveal';
import Section from './Section';
import { jobs } from '../data';
import { formatDuration, monthsBetween } from '../lib/experience';
import { h2, lead } from '../ui';

export default function Experience() {
  return (
    <Section id="work">
      <Reveal>
        <div className="kick">Experience</div>
        <h2 className={h2}>Where I've made an impact</h2>
        <p className={lead}>
          A plain-English summary of each role: what I do, and what changed because of it. Open "What I did" on any card
          for the details.
        </p>
      </Reveal>
      <CareerChart />
      <div className="relative grid gap-[22px] pl-[clamp(26px,4vw,34px)] before:absolute before:top-2 before:bottom-2 before:left-2 before:w-0.5 before:bg-linear-to-b before:from-accent before:via-accent2 before:to-transparent">
        {jobs.map((job, i) => (
          <Reveal as="article" key={job.company + job.period} className="card relative" delay={stagger(i)}>
            {/* Timeline dot */}
            <span
              aria-hidden="true"
              className={`absolute top-[30px] -left-[clamp(26px,4vw,34px)] size-[18px] rounded-full border-4 bg-bg ${job.now ? 'border-warm shadow-[0_0_0_6px_color-mix(in_srgb,var(--c)_25%,transparent)]' : 'border-accent2'}`}
            />
            <header className="flex flex-wrap items-start justify-between gap-x-5 gap-y-2">
              <div>
                <h3 className="text-[clamp(1.3rem,1.05rem+1vw,1.7rem)]">{job.company}</h3>
                <p className="mt-1 text-[.95rem] text-muted">{job.role}{job.meta ? ` · ${job.meta}` : ''}</p>
              </div>
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 font-mono text-[.8rem] font-medium">
                <em className="not-italic">{job.period}</em>
                <span className="text-muted before:content-['·_']">{formatDuration(monthsBetween(job.start, job.end))}</span>
                {job.now && <span className="rounded-full bg-warm/20 px-2.5 py-[3px] text-[.7rem] font-semibold text-warm">Current</span>}
              </div>
            </header>
            <p className="mt-4 mb-[18px] max-w-[62ch] text-[clamp(1rem,.95rem+.25vw,1.12rem)] leading-[1.55] text-ink">{job.summary}</p>
            <ul className="m-0 mb-[18px] grid list-none grid-cols-[repeat(auto-fit,minmax(135px,1fr))] gap-2.5 p-0">
              {job.results.map((r) => (
                <li key={r.value + r.label} className="rounded-[14px] border border-line bg-accent/10 px-3.5 py-3">
                  <strong className="block font-display text-[clamp(1.25rem,1.1rem+.6vw,1.55rem)] leading-[1.1] font-extrabold [overflow-wrap:anywhere]">{r.value}</strong>
                  <span className="mt-1 block text-[.8rem] leading-[1.3] text-muted">{r.label}</span>
                </li>
              ))}
            </ul>
            <details className="group border-t border-line pt-1" open={job.now}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg py-3 text-[.95rem] font-semibold focus-visible:outline-3 focus-visible:outline-accent focus-visible:outline-offset-2 [&::-webkit-details-marker]:hidden after:grid after:size-7 after:flex-none after:place-items-center after:rounded-full after:border after:border-line after:text-[1.1rem] after:leading-none after:content-['+'] group-open:after:content-['−']">
                What I did
              </summary>
              <ul className="mt-1 mb-4 list-disc pl-[18px] text-[.96rem] text-muted sm:pl-5">
                {job.points.map((p) => <li className="mb-[9px]" key={p}>{p}</li>)}
              </ul>
              <p className="mb-2 font-mono text-[.72rem] font-medium tracking-[.1em] text-muted uppercase">Tech used</p>
              <div className="tag-list">{job.tags.map((t) => <span key={t}>{t}</span>)}</div>
            </details>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
