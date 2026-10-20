import type { ReactNode } from 'react';

interface Props {
  id: string;
  className?: string;
  /** Thin gradient line at the top of the section. */
  divider?: boolean;
  children: ReactNode;
}

/** Every page section: consistent spacing, anchor id and top divider line. */
export default function Section({ id, className = '', divider = true, children }: Props) {
  const line = divider
    ? 'before:absolute before:inset-x-[8%] before:top-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-line before:to-transparent'
    : '';
  return (
    <section id={id} className={`relative py-(--section) ${line} ${className}`.trim()}>
      {children}
    </section>
  );
}
