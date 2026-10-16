import Reveal, { stagger } from './Reveal';
import { education } from '../data';

export default function Education() {
  return (
    <section id="edu" style={{ paddingTop: 20 }}>
      <Reveal>
        <div className="kick">Education</div>
      </Reveal>
      <div className="aw">
        {education.map(([degree, school], i) => (
          <Reveal className="gl" delay={stagger(i)} key={degree}>
            <h3>{degree}</h3>
            <p>{school}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
