import { useEffect, useState } from 'react';
import { useInView, usePrefersReducedMotion } from '../hooks';

interface CounterProps {
  to: number;
  prefix?: string;
  suffix?: string;
}

/** Number that counts up from 0 when it scrolls into view. */
export default function Counter({ to, prefix = '', suffix = '' }: CounterProps) {
  const reduced = usePrefersReducedMotion();
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.6 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (reduced) { setValue(to); return; }
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / 1400);
      setValue(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, to]);

  return (
    <b ref={ref} className="text-grad mb-2 block font-display text-[clamp(2rem,1rem+3vw,3.25rem)] leading-none font-extrabold tracking-[-.03em]">
      {prefix}{value}{suffix}
    </b>
  );
}
