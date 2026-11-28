import Counter from './Counter';
import Icon, { type IconName } from './icons';
import Reveal from './Reveal';
import { stats } from '../data';
import { getExperience } from '../lib/experience';

const ICONS: IconName[] = ['users', 'rocket', 'database', 'trophy'];

/** The numbers, right under the hero: the quickest proof of what the page is about. All values come from data.ts. */
export default function StatStrip() {
  const experience = getExperience();
  const tiles = [
    ...stats.map((s) => ({ key: s.short, to: s.n, prefix: '', suffix: s.s, label: s.short })),
    { key: 'exp', to: experience.display.to, prefix: experience.display.prefix, suffix: experience.display.suffix, label: 'Years of Experience' },
  ];
  return (
    <Reveal as="ul" className="ledger glass" aria-label="Key numbers">
      {tiles.map((t, i) => (
        <li key={t.key}>
          <span className="ledger__icon"><Icon name={ICONS[i]} size={30} /></span>
          <span className="ledger__text">
            <Counter to={t.to} prefix={t.prefix} suffix={t.suffix} />
            <span className="ledger__label">{t.label}</span>
          </span>
        </li>
      ))}
    </Reveal>
  );
}
