import Reveal, { stagger } from './Reveal';
import Section from './Section';
import { faqs } from '../faqs';
import { h2 } from '../ui';

/** Plain-language answers to what clients ask before hiring. The same text is sent to search engines as FAQ data. */
export default function Faq() {
  return (
    <Section id="faq" divider={false} className="pt-5">
      <Reveal>
        <div className="kick">Freelance FAQ</div>
        <h2 className={h2}>Hiring a freelance software engineer</h2>
      </Reveal>
      <div className="grid gap-4 lg:grid-cols-2">
        {faqs.map((f, i) => (
          <Reveal className="card !p-0" delay={stagger(i)} key={f.q}>
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-[clamp(18px,2.2vw,26px)] py-[18px] font-display text-[1.02rem] font-bold marker:hidden [&::-webkit-details-marker]:hidden">
                <span>{f.q}</span>
                <span aria-hidden="true" className="grid size-7 flex-none place-items-center rounded-full border border-line text-accent2 transition-transform duration-200 group-open:rotate-45">+</span>
              </summary>
              <p className="px-[clamp(18px,2.2vw,26px)] pb-5 text-[.96rem] leading-relaxed text-muted">{f.a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
