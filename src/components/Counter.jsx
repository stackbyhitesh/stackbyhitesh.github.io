import { useEffect, useState } from 'react';
import { useInView, usePrefersReducedMotion } from '../hooks';

/** Number that counts up from 0 when it scrolls into view. */
export default function Counter({ to, prefix = '', suffix = '' }) {
  const reduced = usePrefersReducedMotion();
  const [ref, inView] = useInView({ threshold: 0.6 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (reduced) { setValue(to); return; }
    if (!inView) return;
    let raf;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - start) / 1400);
      setValue(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, to]);

  return <b ref={ref}>{prefix}{value}{suffix}</b>;
}
