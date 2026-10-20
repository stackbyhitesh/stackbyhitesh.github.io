interface Props {
  items: readonly string[];
  /** Scroll the other way (used for the second row). */
  reverse?: boolean;
  /** "logos": big plain text, used for the company strip. */
  variant?: 'pills' | 'logos';
}

const pill = 'rounded-full border border-line bg-card px-[22px] py-[11px] text-[.95rem] font-medium whitespace-nowrap';
const logo = 'px-[18px] font-display text-[clamp(1.25rem,1rem+1.2vw,1.9rem)] font-bold whitespace-nowrap text-muted opacity-65';

/** Endlessly scrolling row. Items are repeated twice so the loop is seamless (the copy is hidden from screen readers). */
export default function Marquee({ items, reverse = false, variant = 'pills' }: Props) {
  const item = variant === 'logos' ? logo : pill;
  return (
    <div className="mb-3.5 -mx-(--gutter) overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <div className={`flex w-max gap-3.5 ${reverse ? 'animate-marquee-rev' : 'animate-marquee'}`}>
        {[...items, ...items].map((text, i) => (
          <span className={item} key={i} aria-hidden={i >= items.length || undefined}>{text}</span>
        ))}
      </div>
    </div>
  );
}
