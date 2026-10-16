import Counter from './Counter';
import MagneticLink from './MagneticLink';
import Reveal, { stagger } from './Reveal';
import { services, stats } from '../data';
import { getExperience } from '../lib/experience';

export default function About() {
  const experience = getExperience();
  return (
    <section id="about">
      <div className="ab">
        <Reveal className="intro">
          <div className="kick">What I do</div>
          <h2>Full-stack delivery, with a performance mindset</h2>
          <p>
            I care about how software feels under real load. With {experience.phrase} of experience, I've shipped
            enterprise web and mobile products, led a team of 6, and worked with customers to turn requirements into
            production systems.
          </p>
          <MagneticLink className="btn" href="#projects">See selected work</MagneticLink>
        </Reveal>
        <div className="cards">
          {services.map((s, i) => (
            <Reveal className="gl" delay={stagger(i)} key={s.title}>
              <div className="ic">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <div className="mt">{s.result}</div>
            </Reveal>
          ))}
        </div>
      </div>
      <div className="band">
        <Reveal>
          <Counter to={experience.display.to} prefix={experience.display.prefix} suffix={experience.display.suffix} />
          <span>years of experience</span>
          <small>{experience.exact}</small>
        </Reveal>
        {stats.map((s, i) => (
          <Reveal delay={stagger(i + 1)} key={s.label}>
            <Counter to={s.n} suffix={s.s} />
            <span>{s.label}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
