import Reveal from './Reveal';
import { companies } from '../data';

export default function Trust() {
  return (
    <Reveal as="ul" className="trusted" aria-label="Companies worked with">
      <li className="trusted__lead">Software engineering experience across</li>
      {companies.map((c) => <li key={c}>{c}</li>)}
    </Reveal>
  );
}
