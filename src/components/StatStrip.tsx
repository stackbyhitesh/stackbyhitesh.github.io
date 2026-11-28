import Counter from './Counter';
import Reveal from './Reveal';
import { stats } from '../data';
import { getExperience } from '../lib/experience';

/** The numbers, right under the hero: the quickest proof of what the page is about. */
export default function StatStrip() {
  const experience = getExperience();
  const tiles = [
    { key: 'exp', to: experience.display.to, prefix: experience.display.prefix, suffix: experience.display.suffix, label: 'years of experience', note: experience.exact },
    ...stats.map((s) => ({ key: s.label, to: s.n, prefix: '', suffix: s.s, label: s.label, note: '' })),
  ];
  return (
    <Reveal as="ul" className="ledger" aria-label="Key numbers">
      {tiles.map((t) => (
        <li key={t.key}>
          <Counter to={t.to} prefix={t.prefix} suffix={t.suffix} />
          <span className="ledger__label">{t.label}</span>
          {t.note && <small className="ledger__note">{t.note}</small>}
        </li>
      ))}
    </Reveal>
  );
}
