// Small line icons used by the contact section. 24x24 grid, drawn with currentColor.
const paths = {
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />,
  chat: <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  building: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 7h.01M15 7h.01M9 11h.01M15 11h.01M10 21v-4h4v4" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
  send: <><path d="m22 2-11 11" /><path d="m22 2-7 20-4-9-9-4 20-7Z" /></>,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  copy: <><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h9" /></>,
  arrow: <path d="M7 17 17 7M8 7h9v9" />,
};
const filled = {
  linkedin: <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4V21H3V9.5Zm7 0h3.8v1.6h.1c.5-1 1.8-1.9 3.7-1.9 4 0 4.4 2.6 4.4 6V21h-4v-5.2c0-1.3 0-2.8-1.8-2.8s-2.1 1.3-2.1 2.7V21h-4V9.5Z" />,
  github: <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />,
};

export type IconName = keyof typeof paths | keyof typeof filled;

export default function Icon({ name, size = 18, className = '' }: { name: IconName; size?: number; className?: string }) {
  const solid = name in filled;
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" className={className}
      fill={solid ? 'currentColor' : 'none'} stroke={solid ? 'none' : 'currentColor'} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      {solid ? filled[name as keyof typeof filled] : paths[name as keyof typeof paths]}
    </svg>
  );
}
