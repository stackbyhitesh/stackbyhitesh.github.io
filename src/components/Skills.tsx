import Marquee from './Marquee';
import Reveal, { stagger } from './Reveal';
import { marquee, skillGroups } from '../data';

export default function Skills() {
  return (
    <section id="skills">
      <Reveal>
        <div className="kick">Skills</div>
        <h2>Tools I use every day</h2>
      </Reveal>
      {marquee.map((row) => <Marquee key={row[0]} items={row} />)}
      <div className="g4 sk">
        {skillGroups.map((g, i) => (
          <Reveal className="gl" delay={stagger(i)} key={g.title}>
            <h3>{g.title}</h3>
            <div className="tags">{g.tags.map((t) => <span key={t}>{t}</span>)}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
