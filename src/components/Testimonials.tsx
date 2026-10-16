import Reveal, { stagger } from './Reveal';
import { testimonials } from '../data';

/** Renders nothing until you add entries to `testimonials` in src/data.js. */
export default function Testimonials() {
  if (testimonials.length === 0) return null;
  return (
    <section id="kind-words">
      <Reveal>
        <div className="kick">Kind words</div>
        <h2>What people say</h2>
      </Reveal>
      <div className="g4">
        {testimonials.map((t, i) => (
          <Reveal as="figure" className="gl tq" delay={stagger(i)} key={t.name}>
            <blockquote>{t.quote}</blockquote>
            <figcaption>{t.name}<span>{t.role}</span></figcaption>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
