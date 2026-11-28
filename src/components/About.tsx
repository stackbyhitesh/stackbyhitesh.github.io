import photo from '../assets/hitesh.jpg';
import Icon from './icons';
import Reveal, { stagger } from './Reveal';
import Section, { SectionHead } from './Section';
import Trust from './Trust';
import { profile, services, strengths } from '../data';
import { getExperience } from '../lib/experience';

export default function About() {
  const experience = getExperience();
  return (
    <Section id="about">
      <SectionHead title="Full-stack delivery, with a performance mindset" />
      <div className="about">
        <Reveal as="figure" className="about__photo">
          <img src={photo} alt="Hitesh Chaudhari, senior full-stack software engineer in Bengaluru" width="460" height="575" loading="lazy" decoding="async" />
          <figcaption>{profile.location}, from {profile.hometown}</figcaption>
        </Reveal>
        <Reveal className="about__copy">
          <p className="about__lead">
            I care about how software feels under real load. With {experience.phrase} of experience, I've shipped
            enterprise web and mobile products, led a team of 6, and worked with customers to turn requirements into
            production systems.
          </p>
          <p>
            Today I'm a Senior Software Engineer at OpenText, owning a large enterprise data platform end to end: Node.js
            APIs and Redis caching underneath, a fast, accessible interface on top, and AI tooling that cuts repetitive
            coding time. Before that I led a team of 6 at Bajaj Finserv on modules used by over 110 million people.
          </p>
          <ul className="strengths" aria-label="Areas of strength">
            {strengths.map((s) => (
              <li key={s}><Icon name="check" size={16} />{s}</li>
            ))}
          </ul>
          <Trust />
        </Reveal>
      </div>
      <ul className="services">
        {services.map((s, i) => (
          <Reveal as="li" className="service" delay={stagger(i)} key={s.title}>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
            <p className="service__result">{s.result}</p>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
