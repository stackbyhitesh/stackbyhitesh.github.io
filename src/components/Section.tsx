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
  title: ReactNode;
  lead?: ReactNode;
  /** Optional control on the right, for example a "View all" button. */
  action?: ReactNode;
}

/** Section heading: a short green dash, the title, and one line of context. The dash is the only decoration. */
export function SectionHead({ title, lead, action }: HeadProps) {
  return (
    <Reveal className="shead">
      <span className="shead__dash" aria-hidden="true" />
      <div className="shead__body">
        <h2>{title}</h2>
        {lead && <p className="lead">{lead}</p>}
      </div>
      {action && <div className="shead__action">{action}</div>}
    </Reveal>
  );
}
