import Tag from './TechIcon';
import Reveal, { stagger } from './Reveal';
import Section, { SectionHead } from './Section';
import { skillGroups } from '../data';

export default function Skills() {
  return (
    <Section id="skills">
      <SectionHead label="Skills" title="Tools I use every day" />
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
