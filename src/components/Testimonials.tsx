import Reveal, { stagger } from './Reveal';
import Section, { SectionHead } from './Section';
import { testimonials } from '../data';

/** Renders nothing until you add entries to `testimonials` in src/data.ts. */
export default function Testimonials() {
  if (testimonials.length === 0) return null;
  return (
    <Section id="kind-words">
      <SectionHead label="Kind words" title="What people say" />
      <div className="quotes">
        {testimonials.map((t, i) => (
          <Reveal as="figure" className="quote" delay={stagger(i)} key={t.name}>
            <blockquote>{t.quote}</blockquote>
            <figcaption>{t.name}<span>{t.role}</span></figcaption>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
