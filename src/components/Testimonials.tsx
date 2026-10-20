import Reveal, { stagger } from './Reveal';
import Section from './Section';
import { testimonials } from '../data';
import { h2 } from '../ui';

/** Renders nothing until you add entries to `testimonials` in src/data.ts. */
export default function Testimonials() {
  if (testimonials.length === 0) return null;
  return (
    <Section id="kind-words">
      <Reveal>
        <div className="kick">Kind words</div>
        <h2 className={h2}>What people say</h2>
      </Reveal>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal as="figure" className="card m-0" delay={stagger(i)} key={t.name}>
            <blockquote className="m-0 mb-[18px] text-[1.05rem] leading-[1.6]">{t.quote}</blockquote>
            <figcaption className="font-semibold">{t.name}<span className="block text-[.9rem] font-normal text-muted">{t.role}</span></figcaption>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
