import Marquee from './Marquee';
import Reveal from './Reveal';
import { companies } from '../data';

const items = companies.flatMap((c) => [c, '✦']);

export default function Trust() {
  return (
    <Reveal className="pt-[34px] pb-2.5 text-center">
      <p className="mb-[18px] font-mono text-[.78rem] font-medium tracking-[.08em] text-muted uppercase">Software engineering experience across</p>
      <Marquee items={items} variant="logos" />
    </Reveal>
  );
}
