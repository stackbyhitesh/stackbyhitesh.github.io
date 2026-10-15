import { useInView, usePrefersReducedMotion } from '../hooks';

const HAS_GLOW = /(^|\s)gl(\s|$)/;
export const stagger = (index) => (index % 4) * 80;

// Cards (class "gl") get a soft light that follows the pointer.
function moveGlow(e) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--x', `${e.clientX - r.left}px`);
  el.style.setProperty('--y', `${e.clientY - r.top}px`);
}

/** Wraps any element and fades it in once it scrolls into view. */
export default function Reveal({ as: Tag = 'div', className = '', delay = 0, children, ...rest }) {
  const reduced = usePrefersReducedMotion();
  const [ref, inView] = useInView();
  const shown = reduced || inView;
  return (
    <Tag
      ref={ref}
      className={`${className} rv${shown ? ' in' : ''}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      onPointerMove={HAS_GLOW.test(className) ? moveGlow : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
