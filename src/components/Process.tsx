import Reveal from './Reveal';
import Section from './Section';
import { steps } from '../data';
import { h2 } from '../ui';

export default function Process() {
  return (
    <Section id="process">
      <Reveal>
        <div className="kick">How I work</div>
        <h2 className={h2}>From requirement to reliable release</h2>
      </Reveal>
      <Reveal className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,210px),1fr))] gap-3.5 xl:grid-cols-5 xl:gap-0 xl:overflow-hidden xl:rounded-[22px] xl:border xl:border-line xl:bg-card">
        {steps.map(([title, text], i) => (
          <div key={title} className="rounded-[18px] border border-line bg-card p-6 xl:rounded-none xl:border-0 xl:border-l xl:bg-transparent xl:px-[22px] xl:py-[30px] xl:first:border-l-0">
            <i className="mb-4 block font-mono text-[.85rem] font-medium text-accent2 not-italic">{String(i + 1).padStart(2, '0')}</i>
            <h3 className="mb-2 text-[1.2rem]">{title}</h3>
            <p className="text-[.92rem] text-muted">{text}</p>
          </div>
        ))}
      </Reveal>
    </Section>
  );
}
