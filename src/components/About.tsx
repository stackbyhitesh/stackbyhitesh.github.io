import MagneticLink from './MagneticLink';
import Reveal, { stagger } from './Reveal';
import Section from './Section';
import { services } from '../data';
import { getExperience } from '../lib/experience';

export default function About() {
  const experience = getExperience();
  return (
    <Section id="about" divider={false} className="blob [--blob-y:18%] [--blob:var(--a)] after:right-0 md:after:-right-[6%]">
      <div className="grid items-start gap-[clamp(28px,5vw,56px)] lg:grid-cols-[.85fr_1.15fr]">
        <Reveal className="lg:sticky lg:top-[110px]">
          <div className="kick">What I do</div>
          <h2 className="mb-5 text-[clamp(1.75rem,1rem+2.2vw,2.75rem)] font-extrabold">Full-stack delivery, with a performance mindset</h2>
          <p className="mb-7 max-w-[60ch] text-muted lg:max-w-[44ch]">
            I care about how software feels under real load. With {experience.phrase} of experience, I've shipped
            enterprise web and mobile products, led a team of 6, and worked with customers to turn requirements into
            production systems.
          </p>
          <MagneticLink className="btn btn-primary" href="#projects">See selected work</MagneticLink>
        </Reveal>
        <div className="grid gap-5 xs:grid-cols-2">
          {services.map((s, i) => (
            <Reveal className="card card-glass flex flex-col" delay={stagger(i)} key={s.title}>
              <div className="mb-[18px] grid size-[46px] place-items-center rounded-[14px] glass text-[22px]">{s.icon}</div>
              <h3>{s.title}</h3>
              <p className="mb-[22px]">{s.text}</p>
              <div className="mt-auto border-t border-line pt-4 text-[.9rem] font-semibold text-accent2">{s.result}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
