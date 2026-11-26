import { techIconKeys, techIcons } from '../lib/techIcons';

interface IconsProps {
  /** Technology name exactly as written in data.ts. Unknown names render nothing. */
  name: string;
  size?: number;
}

/** The brand logo(s) for a technology, drawn as inline SVG. Decorative: the name next to it is the accessible label. */
export function TechIcons({ name, size = 14 }: IconsProps) {
  const keys = techIconKeys(name);
  if (!keys.length) return null;
  return (
    <>
      {keys.map((k) => {
        const icon = techIcons[k];
        if (!icon) return null;
        if (icon.stroke) {
          // Concept icon: line drawing in the accent colour. The markup is generated (not user input).
          return (
            <svg
              key={k}
              viewBox={icon.vb}
              width={size}
              height={size}
              aria-hidden="true"
              focusable="false"
              className="shrink-0 text-accent2"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              dangerouslySetInnerHTML={{ __html: icon.body ?? '' }}
            />
          );
        }
        return (
          <svg
            key={k}
            viewBox={icon.vb}
            width={size}
            height={size}
            aria-hidden="true"
            focusable="false"
            className="shrink-0"
            fill={icon.color === 'ink' ? 'currentColor' : icon.color}
          >
            {icon.paths.map((p, i) => <path key={i} d={p.d} fillRule={p.evenodd ? 'evenodd' : undefined} />)}
          </svg>
        );
      })}
    </>
  );
}

/** A small tag: the logo (when there is one) followed by the name. Styled by `.tag-list > span`. */
export default function Tag({ name }: { name: string }) {
  return <span><TechIcons name={name} />{name}</span>;
}
