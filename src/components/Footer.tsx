import { profile } from '../data';

export default function Footer() {
  return (
    <footer>
      <div className="cta2 wrap">
        <h2>Let's stay <span className="grad">connected</span>.</h2>
        <a className="m" href={`mailto:${profile.email}`}>{profile.email}</a>
        <a className="up" href="#top">Back to top ↑</a>
      </div>
      © {new Date().getFullYear()} {profile.name} · {profile.location}, India
    </footer>
  );
}
