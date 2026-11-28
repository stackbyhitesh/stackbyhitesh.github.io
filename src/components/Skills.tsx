import { TechIcons } from './TechIcon';
import Tag from './TechIcon';
import Reveal, { stagger } from './Reveal';
import Section from './Section';
import { coreSkills, moreSkills, skillGroups } from '../data';

function Tile({ name }: { name: string }) {
  return (
    <li className="tile">
      <TechIcons name={name} size={30} />
      <span>{name}</span>
    </li>
  );
}

export default function Skills() {
  return (
    <Section id="skills">
      <Reveal className="skillstrip">
        <div className="mhead">
          <span className="shead__dash" aria-hidden="true" />
          <div>
            <h2 className="mhead__title">My Skills</h2>
            <p className="lead">Technologies I work with</p>
          </div>
        </div>
        <ul className="tiles" aria-label="Core technologies">
          {coreSkills.map((n) => <Tile key={n} name={n} />)}
        </ul>
        <span className="skillstrip__sep" aria-hidden="true" />
        <ul className="tiles" aria-label="Additional technologies">
          {moreSkills.map((n) => <Tile key={n} name={n} />)}
        </ul>
      </Reveal>

      <div className="skillgrid">
        {skillGroups.map((g, i) => (
          <Reveal as="article" className="skillcard glass" delay={stagger(i)} key={g.title}>
            <div className="skillcard__head">
              <h3>{g.title}</h3>
              <span className="skillcard__count">{g.tags.length} skills</span>
            </div>
            <div className="tag-list">{g.tags.map((t) => <Tag key={t} name={t} />)}</div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
