interface Props {
  size?: number;
  /** Extra class names for the tile. */
  className?: string;
}

/** The "H" monogram: a rounded tile with a geometric letter drawn as vector shapes, so it stays crisp at any size and needs no font. */
export default function Logo({ size = 38, className }: Props) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <rect className="logo__tile" x=".5" y=".5" width="39" height="39" rx="11" />
      <path className="logo__mark" d="M11.5 10h4.6v7.2h7.8V10h4.6v20h-4.6v-8.4h-7.8V30h-4.6z" />
    </svg>
  );
}
