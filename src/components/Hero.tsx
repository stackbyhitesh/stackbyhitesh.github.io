import { useRef } from 'react';
import photo from '../assets/hitesh.jpg';
import { badges, profile, roles } from '../data';
import { useTilt, useTyping } from '../hooks';
import { getExperience } from '../lib/experience';
import ExternalLink from './ExternalLink';
import MagneticLink from './MagneticLink';

const svg = { viewBox: '0 0 24 24', width: 20, height: 20, 'aria-hidden': true };
const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8 };
const socialLink =
  'glass grid size-11 place-items-center rounded-full text-muted transition duration-200 hover:-translate-y-[3px] hover:border-accent2 hover:text-accent2';

// Where each floating badge sits (desktop, then tighter on tablets and phones).
const badgePositions = [
  'top-0 right-0 xs:top-[4%] md:-right-[2%]',
  'bottom-[14%] left-0 [animation-delay:-2s] xs:bottom-[18%] md:-left-[6%]',
  'bottom-0 right-[4%] [animation-delay:-3.5s]',
];

export default function Hero() {
  const typed = useTyping(roles);
  const experience = getExperience();
  const areaRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  useTilt(areaRef, ringRef);

  return (
    <div className="grid items-center gap-[clamp(24px,4vw,48px)] pt-6 pb-[clamp(32px,6vw,64px)] md:min-h-[min(780px,calc(100svh-80px))] md:grid-cols-[1.3fr_.7fr] md:pt-[clamp(32px,6vw,64px)] [@media(max-height:520px)_and_(orientation:landscape)]:min-h-0">
      <div>
        <div className="mb-[clamp(18px,3vw,26px)] flex flex-wrap gap-2.5">
          <span className="glass inline-flex items-center gap-2.5 rounded-full px-4 py-[7px] font-mono text-[.78rem] font-medium text-muted">📍 Currently in {profile.location}</span>
          <span className="glass inline-flex items-center gap-2.5 rounded-full px-4 py-[7px] font-mono text-[.78rem] font-medium text-muted">🏠 Hometown: {profile.hometown}</span>
        </div>
        <h1 className="text-[clamp(2.2rem,1rem+4.2vw,4.5rem)] leading-[1.04] font-extrabold tracking-[-.035em]">
          <span className="block">Hi, I'm Hitesh.</span> I build <span className="text-grad-anim animate-sheen">fast, scalable products</span> for millions.
        </h1>
        <p
          className="mt-[22px] min-h-[1.7em] font-mono text-[clamp(.95rem,.6rem+1.1vw,1.3rem)] font-medium text-ink after:ml-1 after:inline-block after:h-[1.1em] after:w-0.5 after:animate-blink after:bg-accent2 after:align-[-3px]"
          aria-live="off"
        >
          {typed}
        </p>
        <p className="mt-[18px] mb-[clamp(22px,3vw,32px)] max-w-[52ch] text-muted">
          {experience.phraseCap} of full-stack engineering across fintech and enterprise software. I lead teams, tune
          performance, and turn customer requirements into production systems.
        </p>
        <div className="flex flex-wrap gap-3">
          <MagneticLink className="btn btn-primary max-xs:flex-[1_1_100%]" href="#contact">Say hello</MagneticLink>
          <MagneticLink className="btn btn-ghost max-xs:flex-[1_1_100%]" href="#projects">See my work</MagneticLink>
        </div>
        <div className="mt-[26px] flex flex-wrap gap-2.5">
          {['Senior Full-Stack Engineer', 'Tech Lead', 'Forward Deployed Engineer'].map((t) => (
            <span key={t} className="glass rounded-full px-3.5 py-1.5 text-[.85rem] text-muted max-[380px]:px-[11px] max-[380px]:py-[5px] max-[380px]:text-[.78rem]">{t}</span>
          ))}
        </div>
        <div className="mt-[22px] flex gap-3 print:hidden">
          <a className={socialLink} href={`mailto:${profile.email}`} aria-label="Email Hitesh">
            <svg {...svg} {...stroke}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
          </a>
          <ExternalLink className={socialLink} href={profile.linkedin} aria-label="LinkedIn profile">
            <svg {...svg} fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4V21H3V9.5Zm7 0h3.8v1.6h.1c.5-1 1.8-1.9 3.7-1.9 4 0 4.4 2.6 4.4 6V21h-4v-5.2c0-1.3 0-2.8-1.8-2.8s-2.1 1.3-2.1 2.7V21h-4V9.5Z" /></svg>
          </ExternalLink>
          {profile.github && (
            <ExternalLink className={socialLink} href={profile.github} aria-label="GitHub profile">
              <svg {...svg} fill="currentColor"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" /></svg>
            </ExternalLink>
          )}
          <a className={socialLink} href={`tel:${profile.tel}`} aria-label="Call Hitesh">
            <svg {...svg} {...stroke}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>
          </a>
        </div>
      </div>
      <div
        className="relative grid h-[clamp(300px,52vw,440px)] place-items-center max-md:order-first max-md:mx-auto max-md:w-[min(100%,440px)] print:hidden"
        ref={areaRef}
        aria-hidden="true"
      >
        <div
          className="ring-photo relative aspect-square w-[clamp(200px,44vw,320px)] rounded-full p-[7px] transition-transform duration-250 ease-out [transform:perspective(900px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))]"
          ref={ringRef}
        >
          <img className="relative z-[1] block size-full rounded-full border-[5px] border-bg object-cover object-[50%_20%]" src={photo} alt="Portrait of Hitesh Chaudhari" width="320" height="320" decoding="async" />
        </div>
        {badges.map(([value, label], i) => (
          <div
            key={value}
            className={`glass-2 absolute z-[2] animate-float rounded-2xl px-3 py-2 text-[.72rem] leading-[1.3] shadow-[inset_0_1px_0_var(--glass-hi),0_24px_44px_-24px_rgba(0,0,0,.55)] xs:px-4 xs:py-3 xs:text-[.85rem] ${badgePositions[i]}`}
          >
            <strong className="block font-display text-base font-extrabold xs:text-[1.35rem]">{value}</strong>{label}
          </div>
        ))}
      </div>
    </div>
  );
}
