import { navLinks, profile } from '../data';
import { useToast } from '../context/ToastContext';
import ExternalLink from './ExternalLink';
import Icon from './icons';
import Logo from './Logo';
import MagneticLink from './MagneticLink';

export default function Footer() {
  const toast = useToast();

  // Opens the phone's share sheet when available; otherwise copies the link.
  const share = async () => {
    const data = { title: `${profile.name} · Portfolio`, text: 'Have a look at this portfolio.', url: window.location.href.split('#')[0] };
    try {
      if (typeof navigator.share === 'function') await navigator.share(data);
      else { await navigator.clipboard.writeText(data.url); toast('Link copied'); }
    } catch (err) {
      if (!(err instanceof DOMException && err.name === 'AbortError')) toast('Could not share. Copy the address from the browser bar.');
    }
  };

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__cta glass">
          <div>
            <h2>Let's stay connected.</h2>
            <p>I'm open to new full-time roles in senior full-stack engineering, tech lead and forward deployed engineering. A short note is all it takes to start.</p>
          </div>
          <div className="footer__actions">
            <MagneticLink className="btn btn--primary" href={`mailto:${profile.email}`}><Icon name="mail" size={18} />Email me</MagneticLink>
            {profile.resume && (
              <MagneticLink className="btn btn--ghost print-hide" href={profile.resume} download="Hitesh_Chaudhari_Resume.pdf"><Icon name="download" size={18} />Resume</MagneticLink>
            )}
          </div>
        </div>

        <div className="footer__grid">
          <div className="footer__brand">
            <a className="brand" href="#top" aria-label="Hitesh Chaudhari, back to top">
              <Logo size={40} className="brand__logo" />
              <span className="brand__name">Hitesh Chaudhari</span>
            </a>
            <p>Senior full-stack software engineer and tech lead in {profile.location}, India. React, Node.js, TypeScript, performance and AI-assisted development.</p>
            {profile.status && <p className="footer__status"><span className="status-dot" aria-hidden="true" />{profile.status}</p>}
          </div>
          <nav aria-label="Footer">
            <p className="footer__title">Explore</p>
            <ul>
              {navLinks.map(([id, label]) => <li key={id}><a className="ulink" href={`#${id}`}>{label}</a></li>)}
              <li><a className="ulink" href="#contact">Contact</a></li>
            </ul>
          </nav>
          <div>
            <p className="footer__title">Get in touch</p>
            <ul>
              <li><a className="ulink" href={`mailto:${profile.email}`}>{profile.email}</a></li>
              <li><a className="ulink" href={`tel:${profile.tel}`}>{profile.phone}</a></li>
              <li><ExternalLink className="ulink" href={profile.whatsapp}>WhatsApp</ExternalLink></li>
              {profile.calendar && <li><ExternalLink className="ulink" href={profile.calendar}>Book a 15-min call</ExternalLink></li>}
            </ul>
          </div>
          <div>
            <p className="footer__title">Elsewhere</p>
            <ul>
              <li><ExternalLink className="ulink" href={profile.linkedin}>LinkedIn</ExternalLink></li>
              {profile.github && <li><ExternalLink className="ulink" href={profile.github}>GitHub</ExternalLink></li>}
              {profile.resume && <li className="print-hide"><a className="ulink" href={profile.resume} download="Hitesh_Chaudhari_Resume.pdf">Resume (PDF)</a></li>}
              <li className="print-hide"><button type="button" className="ulink" onClick={share}>Share this site</button></li>
            </ul>
          </div>
        </div>

        <div className="footer__base">
          <p>© {new Date().getFullYear()} {profile.name}. Based in {profile.location}, India.</p>
          <a className="footer__top print-hide" href="#top">Back to top<svg className="footer__up" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 14 6-6 6 6" /></svg></a>
        </div>
      </div>
    </footer>
  );
}
