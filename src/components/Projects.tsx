import Reveal, { stagger } from './Reveal';
import { projects } from '../data';

export default function Projects() {
  return (
    <section id="projects">
      <Reveal>
        <div className="kick">Selected work</div>
        <h2>Things I've built and shipped</h2>
      </Reveal>
      <div className="g4">
        {projects.map((p, i) => (
          <Reveal className="gl pj" delay={stagger(i)} key={p.title}>
            <div className="big">{p.big}</div>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
            <div className="tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
