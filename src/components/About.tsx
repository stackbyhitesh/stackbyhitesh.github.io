import MagneticLink from './MagneticLink';
import Reveal, { stagger } from './Reveal';
import Section, { SectionHead } from './Section';
import { services } from '../data';
import { getExperience } from '../lib/experience';

export default function About() {
  const experience = getExperience();
  return (
    <Section id="about" divider={false}>
      <SectionHead label="What I do" title="Full-stack delivery, with a performance mindset" />
      <div className="about">
        <Reveal className="about__intro">
          <p>
            I care about how software feels under real load. With {experience.phrase} of experience, I've shipped
            enterprise web and mobile products, led a team of 6, and worked with customers to turn requirements into
            production systems.
          </p>
          <MagneticLink className="btn btn--primary" href="#projects">See selected work</MagneticLink>
        </Reveal>
        <div className="services">
          {services.map((s, i) => (
            <Reveal className="service" delay={stagger(i)} key={s.title}>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <p className="service__result">{s.result}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
