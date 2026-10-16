import Reveal from './Reveal';
import { steps } from '../data';

export default function Process() {
  return (
    <section id="process">
      <Reveal>
        <div className="kick">How I work</div>
        <h2>From requirement to reliable release</h2>
      </Reveal>
      <Reveal className="pr">
        {steps.map(([title, text], i) => (
          <div key={title}>
            <i>{String(i + 1).padStart(2, '0')}</i>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
