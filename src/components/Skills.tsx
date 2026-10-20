import Marquee from './Marquee';
import Reveal, { stagger } from './Reveal';
import Section from './Section';
import { marquee, skillGroups } from '../data';
import { h2 } from '../ui';

export default function Skills() {
  return (
    <Section id="skills">
      <Reveal>
        <div className="kick">Skills</div>
        <h2 className={h2}>Tools I use every day</h2>
      </Reveal>
      <div className="print:hidden">
        {marquee.map((row, i) => <Marquee key={row[0]} items={row} reverse={i % 2 === 1} />)}
      </div>
      <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((g, i) => (
          <Reveal className="card" delay={stagger(i)} key={g.title}>
            <h3 className="mb-3 text-[1.05rem]">{g.title}</h3>
            <div className="tag-list">{g.tags.map((t) => <span key={t}>{t}</span>)}</div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
