import Marquee from './Marquee';
import Reveal from './Reveal';
import { companies } from '../data';

const items = companies.flatMap((c) => [c, '✦']);

export default function Trust() {
  return (
    <Reveal className="trust">
      <p>Software engineering experience across</p>
      <Marquee items={items} />
    </Reveal>
  );
}
