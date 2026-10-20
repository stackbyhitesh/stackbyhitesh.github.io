import { useMemo, useState } from 'react';
import Reveal, { stagger } from './Reveal';
import Section from './Section';
import { projects } from '../data';
import { ALL, filterProjects, projectCategories } from '../lib/projects';
import { h2 } from '../ui';

export default function Projects() {
  const [category, setCategory] = useState(ALL);
  const categories = useMemo(() => projectCategories(projects), []);
  const shown = useMemo(() => filterProjects(projects, category), [category]);

  return (
    <Section id="projects" className="blob [--blob-y:26%] [--blob:var(--b)] after:left-0 md:after:-left-[8%]">
      <Reveal>
        <div className="kick">Selected work</div>
        <h2 className={h2}>Things I've built and shipped</h2>
      </Reveal>
      <div className="mb-7 flex flex-wrap gap-2 print:hidden" role="group" aria-label="Filter projects by topic">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
            className={`cursor-pointer rounded-full border px-4 py-2 font-mono text-[.8rem] font-medium transition-colors ${
              category === c ? 'primary-grad border-transparent text-white shadow-[0_8px_20px_-10px_var(--a)]' : 'glass text-muted hover:text-ink'
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <p className="sr-only" role="status">Showing {shown.length} of {projects.length} projects</p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p, i) => (
          <Reveal className="card card-glass flex flex-col gap-3" delay={stagger(i)} key={p.title}>
            <div className="text-grad font-display text-[clamp(1.8rem,1.4rem+1.2vw,2.3rem)] leading-none font-extrabold tracking-[-.03em]">{p.big}</div>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
            <div className="tag-list mt-auto pt-1.5">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
