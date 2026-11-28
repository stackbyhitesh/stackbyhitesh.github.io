import { useMemo, useState } from 'react';
import ProjectShot from './ProjectShot';
import Tag from './TechIcon';
import Reveal, { stagger } from './Reveal';
import Section, { SectionHead } from './Section';
import { projects } from '../data';
import { ALL, filterProjects, projectCategories } from '../lib/projects';

export default function Projects() {
  const [category, setCategory] = useState(ALL);
  const categories = useMemo(() => projectCategories(projects), []);
  const shown = useMemo(() => filterProjects(projects, category), [category]);

  return (
    <Section id="projects">
      <SectionHead label="Selected work" title="Things I've built and shipped" />
      <div className="filters print-hide" role="group" aria-label="Filter projects by topic">
        {categories.map((c) => (
          <button key={c} type="button" aria-pressed={category === c} onClick={() => setCategory(c)}>{c}</button>
        ))}
      </div>
      <p className="sr-only" role="status">Showing {shown.length} of {projects.length} projects</p>
      <div className="projects">
        {shown.map((p, i) => (
          <Reveal as="article" className={`project${i === 0 ? ' project--feature' : ''}`} delay={stagger(i)} key={p.title}>
            <ProjectShot project={p} />
            <div className="project__body">
              <div className="project__metric">{p.big}</div>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
              <div className="tag-list">{p.tags.map((t) => <Tag key={t} name={t} />)}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
