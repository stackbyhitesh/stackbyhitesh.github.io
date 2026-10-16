import Reveal, { stagger } from './Reveal';
import { jobs } from '../data';

export default function Experience() {
  return (
    <section id="work">
      <Reveal>
        <div className="kick">Experience</div>
        <h2>Where I've made an impact</h2>
      </Reveal>
      <div className="tl">
        {jobs.map((job, i) => (
          <Reveal as="article" key={job.title} className={`job gl${job.now ? ' now' : ''}`} delay={stagger(i)}>
            <h3>{job.title}</h3>
            <div className="m">
              <em>{job.period}</em>
              {job.meta && <span>{job.meta}</span>}
            </div>
            <ul>{job.points.map((p) => <li key={p}>{p}</li>)}</ul>
            <div className="tags">{job.tags.map((t) => <span key={t}>{t}</span>)}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
