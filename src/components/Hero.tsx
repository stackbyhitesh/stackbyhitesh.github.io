import { useRef } from 'react';
import photo from '../assets/hitesh.jpg';
import { badges, profile, roles } from '../data';
import { useTilt, useTyping } from '../hooks';
import { getExperience } from '../lib/experience';
import ExternalLink from './ExternalLink';
import Icon from './icons';
import MagneticLink from './MagneticLink';

const titles = ['Full-Stack Engineer', 'Senior Software Engineer', 'Tech Lead', 'Forward Deployed Engineer'];

export default function Hero() {
  const typed = useTyping(roles);
  const experience = getExperience();
  const areaRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  useTilt(areaRef, frameRef);

  return (
    <div className="hero">
      <div className="hero__text">
        <p className="hero__hello">Hi, I'm Hitesh.</p>
        <h1>Full-stack engineer building fast, scalable products.</h1>
        <p className="hero__role" aria-live="off">{typed}</p>
        <p className="hero__lede">
          Senior software engineer in {profile.location}, India, with {experience.phrase} of full-stack engineering across fintech
          and enterprise software. I build React and Node.js products, tune performance, and turn customer requirements into
          production systems. I'm open to new full-time roles.
        </p>
        <div className="hero__cta">
          <MagneticLink className="btn btn--primary" href="#contact">Hire me</MagneticLink>
          <MagneticLink className="btn btn--ghost" href="#projects">See my work</MagneticLink>
          {profile.resume && (
            <MagneticLink className="btn btn--ghost" href={profile.resume} download="Hitesh_Chaudhari_Resume.pdf">
              <Icon name="download" size={18} />Resume
            </MagneticLink>
          )}
        </div>
        <ul className="hero__titles" aria-label="Roles">
          {titles.map((t) => <li key={t}>{t}</li>)}
        </ul>
        <div className="hero__social">
          <a href={`mailto:${profile.email}`} aria-label="Email Hitesh"><Icon name="mail" size={20} /></a>
          <ExternalLink href={profile.linkedin} aria-label="LinkedIn profile"><Icon name="linkedin" size={20} /></ExternalLink>
          {profile.github && <ExternalLink href={profile.github} aria-label="GitHub profile"><Icon name="github" size={20} /></ExternalLink>}
          <a href={`tel:${profile.tel}`} aria-label="Call Hitesh"><Icon name="phone" size={20} /></a>
        </div>
      </div>
      <div className="hero__figure" ref={areaRef}>
        <figure className="portrait">
          <div className="portrait__frame" ref={frameRef}>
            <img src={photo} alt="Hitesh Chaudhari, senior full-stack software engineer in Bengaluru" width="460" height="575" decoding="async" />
            <figcaption className="portrait__card glass">
              <div className="portrait__status">
                {profile.status && <><span className="status-dot" aria-hidden="true" />{profile.status}</>}
                <span className="portrait__where">{profile.location}, from {profile.hometown}</span>
              </div>
              <div className="portrait__badges">
                {badges.map(([value, label]) => <div key={value}><strong>{value}</strong><span>{label}</span></div>)}
              </div>
            </figcaption>
          </div>
        </figure>
      </div>
    </div>
  );
}
