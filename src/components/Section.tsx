import type { ReactNode } from 'react';
import Reveal from './Reveal';

interface SectionProps {
  id: string;
  className?: string;
  /** Hairline at the top of the section. */
  divider?: boolean;
  children: ReactNode;
}

/** Every page section: consistent spacing, anchor id and a hairline at the top. */
export default function Section({ id, className = '', divider = true, children }: SectionProps) {
  return (
    <section id={id} className={`section${divider ? ' section--rule' : ''} ${className}`.trim()}>
      {children}
    </section>
  );
}

interface HeadProps {
  /** Short section name, shown in the left gutter on wide screens. */
  label: string;
  title: ReactNode;
  lead?: ReactNode;
}

/** Section heading: the name sits in the gutter, the headline takes the wide column. */
export function SectionHead({ label, title, lead }: HeadProps) {
  return (
    <Reveal className="shead">
      <p className="shead__label">{label}</p>
      <div className="shead__body">
        <h2>{title}</h2>
        {lead && <p className="lead">{lead}</p>}
      </div>
    </Reveal>
  );
}
