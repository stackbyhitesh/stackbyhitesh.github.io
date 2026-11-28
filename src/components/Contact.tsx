import { useEffect, useReducer, useRef, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { profile, topicOptions, topics } from '../data';
import { useCopy } from '../hooks';
import { clearDraft, cooldownLeft, emptyValues, loadDraft, markSent, saveDraft, sendContact, type ContactValues } from '../lib/contact';
import { LIMITS, buildMailto, validateContact, type ContactErrors } from '../lib/security';
import ExternalLink from './ExternalLink';
import Icon, { type IconName } from './icons';
import Reveal from './Reveal';
import Section from './Section';

// Form state lives in one reducer: field values, validation errors and status.
type Status = 'idle' | 'invalid' | 'sending' | 'sent' | 'error';
interface State {
  values: ContactValues;
  errors: ContactErrors;
  status: Status;
  message: string;
  /** Who the confirmation is addressed to after a successful send. */
  sentTo: { name: string; email: string } | null;
}
type Action =
  | { type: 'change'; field: keyof ContactValues; value: string }
  | { type: 'invalid'; errors: ContactErrors }
  | { type: 'sending' }
  | { type: 'sent'; to: { name: string; email: string } }
  | { type: 'error'; message: string }
  | { type: 'reset' };

const blank = emptyValues(topicOptions[0]);
const init = (): State => ({ values: loadDraft(blank), errors: {}, status: 'idle', message: '', sentTo: null });

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'change': {
      const values = { ...state.values, [action.field]: action.value };
      // After a failed submit, re-check on every keystroke so errors clear as soon as they are fixed.
      const errors = state.status === 'invalid' ? validateContact(values).errors : state.errors;
      return { ...state, values, errors };
    }
    case 'invalid': return { ...state, errors: action.errors, status: 'invalid', message: '' };
    case 'sending': return { ...state, errors: {}, status: 'sending', message: '' };
    case 'sent': return { ...state, values: blank, errors: {}, status: 'sent', message: '', sentTo: action.to };
    case 'error': return { ...state, status: 'error', message: action.message };
    case 'reset': return { ...state, status: 'idle', message: '', sentTo: null };
    default: return state;
  }
}

// ---- Small pieces ----
function LinkRow({ icon, title, action }: { icon: IconName; title: string; action: string }) {
  return (
    <>
      <span className="linkrow__icon"><Icon name={icon} size={18} /></span>
      <span className="linkrow__title">{title}</span>
      <span className="linkrow__act">{action}<Icon name="arrow" size={14} /></span>
    </>
  );
}

/** Label + input with a small icon inside the field. */
function Field({ label, icon, error, id, children }: { label: string; icon: IconName; error?: string; id: string; children: ReactNode }) {
  return (
    <label className="label">
      {label}
      <span className="fieldwrap">
        <Icon name={icon} size={17} />
        {children}
      </span>
      {error && <span className="err" id={`err-${id}`} role="alert">{error}</span>}
    </label>
  );
}
const inputCls = 'field';

export default function Contact() {
  const [copyLabel, copyEmail] = useCopy(profile.email);
  const [{ values, errors, status, message, sentTo }, dispatch] = useReducer(reducer, undefined, init);
  const trap = useRef<HTMLInputElement>(null);

  const change = (field: keyof ContactValues) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    dispatch({ type: 'change', field, value: e.target.value });

  // Save what the visitor has typed, so a reload or an accidental tab close does not lose the message.
  useEffect(() => {
    if (status === 'sent') return;
    const t = setTimeout(() => {
      if (values.name || values.email || values.company || values.message) saveDraft(values);
      else clearDraft();
    }, 400);
    return () => clearTimeout(t);
  }, [values, status]);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'sending') return;
    const result = validateContact(values);
    if (Object.keys(result.errors).length) {
      dispatch({ type: 'invalid', errors: result.errors });
      return;
    }
    const to = { name: result.values.name, email: result.values.email };
    if (trap.current?.value) { dispatch({ type: 'sent', to }); return; } // hidden field filled in: a bot. Pretend it worked.

    const wait = cooldownLeft();
    if (wait > 0) {
      dispatch({ type: 'error', message: `Your last message was just sent. Please wait ${Math.ceil(wait / 1000)} seconds before sending another.` });
      return;
    }
    dispatch({ type: 'sending' });
    const res = await sendContact(result.values, { to: profile.email });
    if (res.ok) {
      markSent();
      clearDraft();
      dispatch({ type: 'sent', to });
    } else {
      dispatch({ type: 'error', message: res.error });
    }
  };

  return (
    <Section id="contact">
      <div className="contact">
        <Reveal>
          <p className="shead__label">Contact</p>
          <h2>Let's build something great.</h2>
          <p className="contact__lede">I'm open to new full-time roles in senior full-stack engineering, tech lead and forward deployed engineering. Tell me about the role and your team, or reach me directly:</p>
          <div className="tag-list">{topics.map((t) => <span key={t}>{t}</span>)}</div>
          <div className="links">
            <button type="button" className="linkrow" onClick={copyEmail}><LinkRow icon="mail" title={profile.email} action={copyLabel} /></button>
            <a className="linkrow" href={`tel:${profile.tel}`}><LinkRow icon="phone" title={profile.phone} action="Call" /></a>
            <ExternalLink className="linkrow" href={profile.whatsapp}><LinkRow icon="chat" title="WhatsApp" action="Chat" /></ExternalLink>
            {profile.resume && <a className="linkrow" href={profile.resume} download="Hitesh_Chaudhari_Resume.pdf"><LinkRow icon="file" title="Resume (PDF)" action="Download" /></a>}
            <ExternalLink className="linkrow" href={profile.linkedin}><LinkRow icon="linkedin" title="LinkedIn" action="Connect" /></ExternalLink>
            {profile.github && <ExternalLink className="linkrow" href={profile.github}><LinkRow icon="github" title="GitHub" action="Follow" /></ExternalLink>}
            {profile.calendar && <ExternalLink className="linkrow" href={profile.calendar}><LinkRow icon="calendar" title="Book a 15-min call" action="Schedule" /></ExternalLink>}
          </div>
        </Reveal>

        <Reveal className="formcard glass print-hide" delay={90}>
          {status === 'sent' && sentTo ? (
            <div className="sent" role="status">
              <div className="sent__tick"><Icon name="check" size={30} /></div>
              <h3>Message sent. Thank you, {sentTo.name.split(' ')[0]}!</h3>
              <p>I'll reply to <strong>{sentTo.email}</strong> as soon as I can.</p>
              <button type="button" className="btn btn--ghost" onClick={() => dispatch({ type: 'reset' })}>Send another message</button>
            </div>
          ) : (
            <form className="form" onSubmit={submit} noValidate>
              <div>
                <h3>Send me a message</h3>
                <p className="formcard__sub">It goes straight to my inbox.</p>
              </div>
              <div className="form__row">
                <Field label="Your name" icon="user" error={errors.name} id="name">
                  <input className={inputCls} value={values.name} onChange={change('name')} maxLength={LIMITS.name} autoComplete="name" placeholder="Asha Rao"
                    aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'err-name' : undefined} />
                </Field>
                <Field label="Your email" icon="mail" error={errors.email} id="email">
                  <input className={inputCls} type="email" inputMode="email" value={values.email} onChange={change('email')} maxLength={LIMITS.email} autoComplete="email" placeholder="you@email.com"
                    aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'err-email' : undefined} />
                </Field>
              </div>
              <Field label="Company (optional)" icon="building" id="company">
                <input className={inputCls} value={values.company} onChange={change('company')} maxLength={LIMITS.company} autoComplete="organization" placeholder="Where you work" />
              </Field>

              <fieldset className="topics">
                <legend>What's it about?</legend>
                <div>
                  {topicOptions.map((t) => (
                    <label key={t}>
                      <input type="radio" name="topic" value={t} checked={values.topic === t} onChange={() => dispatch({ type: 'change', field: 'topic', value: t })} />
                      <span>{t}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="label">
                Your message
                <textarea className="field" rows={5} value={values.message} onChange={change('message')} maxLength={LIMITS.message}
                  placeholder="Tell me about the role and your team…"
                  aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'err-message' : undefined} />
                <span className="form__meta">
                  <span>{errors.message && <span className="err" id="err-message" role="alert">{errors.message}</span>}</span>
                  <span>{values.message.length}/{LIMITS.message}</span>
                </span>
              </label>

              {/* Hidden spam trap: people never see or fill this in, bots often do. */}
              <div className="trap" aria-hidden="true">
                <label>Leave this empty<input ref={trap} name="website" tabIndex={-1} autoComplete="off" /></label>
              </div>

              <button className="btn btn--primary" type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? (
                  <><span className="spinner" aria-hidden="true" />Sending…</>
                ) : (
                  <>Send message <Icon name="send" size={18} /></>
                )}
              </button>

              <div aria-live="polite">
                {status === 'error' && (
                  <p className="alert" role="alert">
                    {message} Your message is saved here, so you can try again, or{' '}
                    <a href={buildMailto(profile.email, values)}>email me directly</a>.
                  </p>
                )}
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </Section>
  );
}
