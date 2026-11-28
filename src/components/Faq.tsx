import Reveal, { stagger } from './Reveal';
import Section, { SectionHead } from './Section';
import { faqs } from '../faqs';

/** Plain-language answers to what recruiters and hiring managers ask. The same text is sent to search engines as FAQ data. */
export default function Faq() {
  return (
    <Section id="faq" divider={false} className="section--tight">
      <SectionHead label="Hiring FAQ" title="Hiring me for a full-time role" />
      <div className="faqs">
        {faqs.map((f, i) => (
          <Reveal className="faq-wrap" delay={stagger(i)} key={f.q}>
            <details className="faq">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
