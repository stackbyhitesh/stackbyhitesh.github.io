import Reveal from './Reveal';
import Section, { SectionHead } from './Section';
import { steps } from '../data';

export default function Process() {
  return (
    <Section id="process">
      <SectionHead label="How I work" title="From requirement to reliable release" />
      <Reveal as="ol" className="steps">
        {steps.map(([title, text], i) => (
          <li key={title} className="step">
            <span className="step__n">{i + 1}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </li>
        ))}
      </Reveal>
    </Section>
  );
}
