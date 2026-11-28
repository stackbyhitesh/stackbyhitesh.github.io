import { Fragment } from 'react';
import ribbon from '../assets/hero/glass-ribbon.webp';
import { hero, profile } from '../data';
import GlassRibbon from './GlassRibbon';
import Icon from './icons';

/** Splits a headline line around the accent word so only that word is highlighted. */
function withAccent(line: string, accent: string) {
  // The closing full stop is tucked in slightly: at this size the font leaves a visible gap before it.
  const stop = line.endsWith('.');
  const text = stop ? line.slice(0, -1) : line;
  const at = text.indexOf(accent);
  return (
    <>
      {at < 0 ? text : <>{text.slice(0, at)}<em>{accent}</em>{text.slice(at + accent.length)}</>}
      {stop && <span className="hero__stop">.</span>}
    </>
  );
}

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__text">
        {profile.status && (
          <p className="badge"><span className="status-dot" aria-hidden="true" />{hero.badge}</p>
        )}
        <h1 id="hero-title">
          {hero.headline.map((line) => (
            <Fragment key={line}>
              <span className="hero__line">{withAccent(line, hero.accent)}</span>
            </Fragment>
          ))}
        </h1>
        <p className="hero__roles">{hero.roles}</p>
        <p className="hero__lede">{hero.lede}</p>
        <div className="hero__cta">
          <a className="btn btn--primary" href="#projects">View My Work<Icon name="arrowRight" size={16} /></a>
          {profile.resume && (
            <a className="btn btn--ghost" href={profile.resume} download="Hitesh_Chaudhari_Resume.pdf">
              <Icon name="download" size={17} />Download Resume
            </a>
          )}
        </div>
      </div>
      {/* Decorative: an original translucent glass sculpture, rendered offline (no text, no logos). */}
      <div className="hero__art" aria-hidden="true">
        <span className="hero__cube" />
        <GlassRibbon src={ribbon} width={1100} height={782} />
      </div>
    </section>
  );
}
