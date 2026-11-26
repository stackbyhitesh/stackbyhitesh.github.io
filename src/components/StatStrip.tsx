import Counter from './Counter';
import Icon, { type IconName } from './icons';
import Reveal, { stagger } from './Reveal';
import { stats } from '../data';
import { getExperience } from '../lib/experience';

// One icon per tile, in the same order as the numbers below.
const icons: readonly IconName[] = ['briefcase', 'users', 'rocket', 'bolt'];

/** The numbers, right under the hero: the quickest proof of what the page is about. */
export default function StatStrip() {
  const experience = getExperience();
  const tiles = [
    { key: 'exp', to: experience.display.to, prefix: experience.display.prefix, suffix: experience.display.suffix, label: 'years of experience', note: experience.exact },
    ...stats.map((s) => ({ key: s.label, to: s.n, prefix: '', suffix: s.s, label: s.label, note: '' })),
  ];
  return (
    <div className="grid grid-cols-1 gap-4 pb-2 xs:grid-cols-2 lg:grid-cols-4" role="list" aria-label="Key numbers">
      {tiles.map((t, i) => {
        return (
          <Reveal key={t.key} delay={stagger(i)} className="panel flex items-center gap-4 p-[clamp(16px,2vw,22px)]" role="listitem">
            <span className="icon-disc"><Icon name={icons[i % icons.length]} size={24} /></span>
            <div className="min-w-0">
              <Counter to={t.to} prefix={t.prefix} suffix={t.suffix} size="md" />
              <span className="block text-[.9rem] leading-snug text-muted">{t.label}</span>
              {t.note && <small className="mt-0.5 block font-mono text-[.68rem] font-medium text-muted opacity-80">{t.note}</small>}
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
