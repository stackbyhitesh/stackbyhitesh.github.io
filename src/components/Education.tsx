import Reveal from './Reveal';
import Section, { SectionHead } from './Section';
import { education } from '../data';

export default function Education() {
  return (
    <Section id="edu" divider={false} className="section--tight">
      <SectionHead label="Education" title="Where I studied" />
      <Reveal as="ul" className="edu">
        {education.map(([degree, school]) => (
          <li key={degree}>
            <h3>{degree}</h3>
            <p>{school}</p>
          </li>
        ))}
      </Reveal>
    </Section>
  );
}
