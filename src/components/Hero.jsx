import { useRef } from 'react';
import photo from '../assets/hitesh.jpg';
import { badges, profile, roles } from '../data';
import { useTilt, useTyping } from '../hooks';
import { getExperience } from '../lib/experience';
import ExternalLink from './ExternalLink';
import MagneticLink from './MagneticLink';

const svg = { viewBox: '0 0 24 24', width: 20, height: 20, 'aria-hidden': true };
const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8 };

export default function Hero() {
  const typed = useTyping(roles);
  const experience = getExperience();
  const areaRef = useRef(null);
  const ringRef = useRef(null);
  useTilt(areaRef, ringRef);

  return (
    <div className="hero">
      <div>
        <div className="chips">
          <span className="chip">📍 Currently in {profile.location}</span>
          <span className="chip">🏠 Hometown: {profile.hometown}</span>
        </div>
        <h1>
          Hi, I'm Hitesh. I build <span className="grad">fast, scalable products</span> for millions.
        </h1>
        <p className="type" aria-live="off">{typed}</p>
        <p className="lead">
          {experience.phraseCap} of full-stack engineering across fintech and enterprise software. I lead teams, tune
          performance, and turn customer requirements into production systems.
        </p>
        <div className="cta">
          <MagneticLink className="btn" href="#contact">Say hello</MagneticLink>
          <MagneticLink className="btn o" href="#projects">See my work</MagneticLink>
        </div>
        <div className="hl">
          <span>Senior Full-Stack Engineer</span><span>Tech Lead</span><span>Forward Deployed Engineer</span>
        </div>
        <div className="soc">
          <a href={`mailto:${profile.email}`} aria-label="Email Hitesh">
            <svg {...svg} {...stroke}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
          </a>
          <ExternalLink href={profile.linkedin} aria-label="LinkedIn profile">
            <svg {...svg} fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4V21H3V9.5Zm7 0h3.8v1.6h.1c.5-1 1.8-1.9 3.7-1.9 4 0 4.4 2.6 4.4 6V21h-4v-5.2c0-1.3 0-2.8-1.8-2.8s-2.1 1.3-2.1 2.7V21h-4V9.5Z" /></svg>
          </ExternalLink>
          {profile.github && (
            <ExternalLink href={profile.github} aria-label="GitHub profile">
              <svg {...svg} fill="currentColor"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" /></svg>
            </ExternalLink>
          )}
          <a href={`tel:${profile.tel}`} aria-label="Call Hitesh">
            <svg {...svg} {...stroke}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>
          </a>
        </div>
      </div>
      <div className="card3d" ref={areaRef} aria-hidden="true">
        <div className="ring" ref={ringRef}>
          <img src={photo} alt="Portrait of Hitesh Chaudhari" width="320" height="320" decoding="async" />
        </div>
        {badges.map(([value, label]) => (
          <div className="fl" key={value}><strong>{value}</strong>{label}</div>
        ))}
      </div>
    </div>
  );
}
