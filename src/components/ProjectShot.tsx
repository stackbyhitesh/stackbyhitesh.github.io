import type { ReactElement } from 'react';
import { findProjectImage } from '../lib/projectImages';
import type { Project } from '../types';

// Interface illustrations, drawn from each project's description. They stand in until a real screenshot is added
// to src/assets/projects (named after the project slug). They contain no real data or customer information.
const sketches: Record<string, (p: Project) => ReactElement> = {
  // Two response-time curves: before caching and after.
  caching: () => (
    <>
      <path className="sk-line" d="M60 40v280h520M60 120h520M60 200h520M60 280h520" />
      <path className="sk-ink" d="M70 110C140 100 190 130 250 112S360 96 420 118 520 104 570 112" />
      <path className="sk-acc" d="M70 190C140 182 190 214 250 196S360 180 420 202 520 188 570 196" />
      <path className="sk-line" d="M250 112v84M420 118v84" strokeDasharray="4 5" />
      <rect className="sk-accsoft" x="72" y="48" width="150" height="34" rx="8" />
      <circle className="sk-accfill" cx="90" cy="65" r="4" />
      <rect className="sk-bar" x="104" y="61" width="94" height="8" rx="4" />
      <rect className="sk-fill" x="60" y="336" width="520" height="30" rx="8" />
      <rect className="sk-bar" x="76" y="347" width="60" height="8" rx="4" /><rect className="sk-bar" x="150" y="347" width="60" height="8" rx="4" /><rect className="sk-bar" x="224" y="347" width="60" height="8" rx="4" />
    </>
  ),
  // File list on the left, a chat with a suggested code block on the right.
  rag: () => (
    <>
      <rect className="sk-fill" x="30" y="30" width="150" height="340" rx="10" />
      {[56, 86, 116, 146, 176, 206].map((y, i) => <rect key={y} className={i === 2 ? 'sk-accfill' : 'sk-bar'} x={i % 2 ? 62 : 46} y={y} width={i % 2 ? 90 : 110} height="9" rx="4.5" />)}
      <rect className="sk-fill" x="204" y="30" width="400" height="60" rx="12" />
      <rect className="sk-bar" x="224" y="52" width="260" height="9" rx="4.5" /><rect className="sk-bar" x="224" y="68" width="170" height="9" rx="4.5" />
      <rect className="sk-accsoft" x="204" y="112" width="400" height="190" rx="12" />
      <circle className="sk-accfill" cx="228" cy="138" r="6" />
      {[134, 164, 190, 216, 242, 268].map((y, i) => <rect key={y} className="sk-bar" x={i % 3 === 1 ? 252 : 232} y={y} width={[210, 270, 190, 240, 150, 220][i]} height="9" rx="4.5" />)}
      <rect className="sk-line" x="204" y="322" width="400" height="48" rx="12" />
      <rect className="sk-bar" x="224" y="342" width="140" height="9" rx="4.5" />
      <circle className="sk-accfill" cx="578" cy="346" r="11" />
    </>
  ),
  // A very long table with a tiny scroll thumb, to say "thousands of rows, still smooth".
  'large-data': (p) => (
    <>
      <rect className="sk-fill" x="30" y="28" width="580" height="34" rx="8" />
      {[70, 140, 250, 380, 480].map((x) => <rect key={x} className="sk-bar" x={x} y="41" width="56" height="8" rx="4" />)}
      {Array.from({ length: 8 }, (_, r) => 76 + r * 34).map((y, r) => (
        <g key={y}>
          <path className="sk-line" d={`M30 ${y + 30}h580`} />
          {r === 3 && <rect className="sk-accsoft" x="30" y={y} width="580" height="30" rx="6" />}
          {[70, 140, 250, 380, 480].map((x, c) => <rect key={x} className="sk-bar" x={x} y={y + 10} width={[40, 76, 96, 50, 70][(c + r) % 5]} height="8" rx="4" />)}
        </g>
      ))}
      <rect className="sk-fill" x="618" y="70" width="6" height="300" rx="3" />
      <rect className="sk-accfill" x="618" y="150" width="6" height="26" rx="3" />
      <rect className="sk-veil" x="440" y="326" width="150" height="40" rx="10" fill="var(--bg)" stroke="var(--accent)" />
      <text className="sk-text sk-text--acc" x="515" y="351" textAnchor="middle">{p.big} rows</text>
    </>
  ),
  // Three board columns and a small burn-down line.
  crm: () => (
    <>
      {[0, 1, 2].map((c) => (
        <g key={c}>
          <rect className="sk-fill" x={30 + c * 150} y="30" width="138" height="340" rx="10" />
          <rect className={c === 1 ? 'sk-accfill' : 'sk-bar'} x={44 + c * 150} y="46" width="58" height="8" rx="4" />
          {Array.from({ length: 3 - (c === 2 ? 1 : 0) }, (_, k) => 70 + k * 82).map((y, k) => (
            <g key={y}>
              <rect className={c === 1 && k === 0 ? 'sk-accsoft' : 'sk-line'} x={42 + c * 150} y={y} width="114" height="70" rx="8" />
              <rect className="sk-bar" x={54 + c * 150} y={y + 14} width={[90, 70, 80][(c + k) % 3]} height="8" rx="4" />
              <rect className="sk-bar" x={54 + c * 150} y={y + 30} width={[60, 86, 50][(c + k) % 3]} height="8" rx="4" />
              <circle className="sk-ink" cx={64 + c * 150} cy={y + 54} r="6" />
            </g>
          ))}
        </g>
      ))}
      <rect className="sk-fill" x="494" y="30" width="116" height="170" rx="10" />
      <path className="sk-acc" d="M508 60 540 90 566 112 594 170" />
      <path className="sk-line" d="M508 60v120h86" />
      <rect className="sk-fill" x="494" y="214" width="116" height="156" rx="10" />
      {[0, 1, 2, 3].map((k) => <rect key={k} className="sk-bar" x="508" y={232 + k * 30} width={[84, 60, 90, 44][k]} height="8" rx="4" />)}
    </>
  ),
  // A phone with a list, and a server it syncs to later over a dashed link.
  offline: () => (
    <>
      <rect className="sk-line" x="120" y="24" width="150" height="352" rx="24" />
      <rect className="sk-fill" x="132" y="48" width="126" height="30" rx="8" />
      <circle className="sk-accfill" cx="148" cy="63" r="5" /><rect className="sk-bar" x="162" y="59" width="70" height="8" rx="4" />
      {[96, 150, 204, 258].map((y, i) => (
        <g key={y}>
          <rect className={i === 1 ? 'sk-accsoft' : 'sk-line'} x="132" y={y} width="126" height="46" rx="8" />
          <rect className="sk-bar" x="144" y={y + 12} width={[80, 64, 90, 56][i]} height="8" rx="4" /><rect className="sk-bar" x="144" y={y + 27} width={[50, 70, 40, 60][i]} height="7" rx="3.5" />
        </g>
      ))}
      <path className="sk-line" d="M280 200h190" strokeDasharray="5 7" />
      <path className="sk-acc" d="M370 186l16 14-16 14" />
      <path className="sk-ink" d="M486 236h72a26 26 0 0 0 4-51 38 38 0 0 0-72-8 30 30 0 0 0-4 59Z" />
      <rect className="sk-fill" x="458" y="276" width="140" height="34" rx="8" />
      <circle className="sk-accfill" cx="476" cy="293" r="5" /><rect className="sk-bar" x="490" y="289" width="80" height="8" rx="4" />
    </>
  ),
  // A checkout card with provider rows and a single sign-on button.
  payments: () => (
    <>
      <rect className="sk-fill" x="150" y="30" width="340" height="340" rx="16" />
      <text className="sk-text sk-text--big" x="176" y="84">Pay securely</text>
      {['Stripe', 'Razorpay', 'Bajaj Pay SDK'].map((n, i) => (
        <g key={n}>
          <rect className={i === 0 ? 'sk-accsoft' : 'sk-line'} x="176" y={108 + i * 58} width="288" height="46" rx="10" />
          <circle className={i === 0 ? 'sk-accfill' : 'sk-line'} cx="200" cy={131 + i * 58} r="7" />
          <text className="sk-text" x="222" y={136 + i * 58}>{n}</text>
        </g>
      ))}
      <rect className="sk-line" x="176" y="290" width="288" height="44" rx="10" />
      <path className="sk-ink" d="M196 316v-8a8 8 0 0 1 16 0v8M193 316h22v12h-22z" transform="translate(0 -8)" />
      <text className="sk-text" x="228" y="318">Continue with SSO</text>
    </>
  ),
};

/** The screenshot frame of a project: the real image when one exists, otherwise an interface illustration. */
export default function ProjectShot({ project }: { project: Project }) {
  const image = findProjectImage(project.slug);
  const sketch = project.slug ? sketches[project.slug] : undefined;
  return (
    <figure className="shot">
      <div className="shot__bar" aria-hidden="true">
        <span className="shot__dots"><i /><i /><i /></span>
        <span>{project.title}</span>
        {!image && sketch && <span className="shot__tag">Illustration</span>}
      </div>
      <div className="shot__view">
        {image ? (
          <img src={image} alt={`${project.title} screenshot`} loading="lazy" decoding="async" />
        ) : (
          sketch && (
            <svg viewBox="0 0 640 400" role="img" aria-label={`Interface illustration for ${project.title}`} preserveAspectRatio="xMidYMid slice">{sketch(project)}</svg>
          )
        )}
      </div>
    </figure>
  );
}
