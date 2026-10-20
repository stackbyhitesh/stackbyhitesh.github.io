import type { CSSProperties, ElementType, HTMLAttributes, PointerEvent, ReactNode } from 'react';
import { useInView, usePrefersReducedMotion } from '../hooks';

const IS_CARD = /(^|\s)card(\s|$)/;
export const stagger = (index: number): number => (index % 4) * 80;

// Cards get a soft light that follows the pointer.
function moveGlow(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--x', `${e.clientX - r.left}px`);
  el.style.setProperty('--y', `${e.clientY - r.top}px`);
}

type RevealProps = HTMLAttributes<HTMLElement> & {
  /** HTML tag to render, for example "article" or "li". Defaults to "div". */
  as?: ElementType;
  /** Extra delay in milliseconds before the fade-in starts. */
  delay?: number;
  children?: ReactNode;
};

/** Wraps any element and fades it in once it scrolls into view. */
export default function Reveal({ as: Tag = 'div', className = '', delay = 0, children, style, ...rest }: RevealProps) {
  const reduced = usePrefersReducedMotion();
  const [ref, inView] = useInView<HTMLElement>();
  const shown = reduced || inView;
  return (
    <Tag
      ref={ref}
      className={`reveal${shown ? ' in' : ''} ${className}`.trim()}
      style={delay ? ({ ...style, '--d': `${delay}ms` } as CSSProperties) : style}
      onPointerMove={IS_CARD.test(className) ? moveGlow : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
