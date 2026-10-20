import Reveal, { stagger } from './Reveal';
import Section from './Section';
import { education } from '../data';

export default function Education() {
  return (
    <Section id="edu" divider={false} className="pt-5">
      <Reveal>
        <div className="kick">Education</div>
      </Reveal>
      <div className="grid gap-5 sm:grid-cols-2">
        {education.map(([degree, school], i) => (
          <Reveal className="card" delay={stagger(i)} key={degree}>
            <h3>{degree}</h3>
            <p className="text-muted">{school}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
