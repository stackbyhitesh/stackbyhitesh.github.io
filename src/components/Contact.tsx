import { useEffect, useReducer, useRef, type ChangeEvent, type FormEvent } from 'react';
import { WEB3FORMS_KEY, profile, topicOptions, topics, vcardUrl } from '../data';
import { useCopy } from '../hooks';
import {
  clearDraft, cooldownLeft, emptyValues, isValidAccessKey, loadDraft, markSent, saveDraft, sendContact, type ContactValues,
} from '../lib/contact';
import { LIMITS, buildMailto, validateContact, type ContactErrors } from '../lib/security';
import ExternalLink from './ExternalLink';
import Reveal from './Reveal';
import Section from './Section';

// Form state lives in one reducer: field values, validation errors and status.
type Status = 'idle' | 'invalid' | 'sending' | 'sent' | 'error' | 'mailto';
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
  | { type: 'mailto' }
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
    case 'mailto': return { ...state, errors: {}, status: 'mailto', message: '' };
    case 'reset': return { ...state, status: 'idle', message: '', sentTo: null };
    default: return state;
  }
}

const linkRow =
  'glass flex min-w-0 cursor-pointer flex-wrap justify-between gap-x-3 gap-y-1 rounded-[14px] bg-[linear-gradient(145deg,var(--glass-2),var(--glass))] px-[18px] py-[15px] text-left text-[.95rem] font-medium text-ink no-underline transition duration-200 [overflow-wrap:anywhere] hover:translate-x-1.5 hover:border-accent2 max-xs:p-3.5';
const labelCls = 'block text-[.88rem] text-muted';
const errCls = 'mt-1.5 block text-[.8rem] text-[#c0262d] dark:text-[#ff8d8d]';

export default function Contact() {
  const [copyLabel, copyEmail] = useCopy(profile.email);
  const [{ values, errors, status, message, sentTo }, dispatch] = useReducer(reducer, undefined, init);
  const trap = useRef<HTMLInputElement>(null);
  const configured = isValidAccessKey(WEB3FORMS_KEY);

  const change = (field: keyof ContactValues) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
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

    // No access key yet: fall back to the visitor's mail app so the form still works.
    if (!configured) {
      dispatch({ type: 'mailto' });
      window.location.href = buildMailto(profile.email, result.values);
      return;
    }
    const wait = cooldownLeft();
    if (wait > 0) {
      dispatch({ type: 'error', message: `Your last message was just sent. Please wait ${Math.ceil(wait / 1000)} seconds before sending another.` });
      return;
    }
    dispatch({ type: 'sending' });
    const res = await sendContact(result.values, { accessKey: WEB3FORMS_KEY });
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
      <Reveal className="print-box grid gap-[clamp(28px,5vw,44px)] rounded-[clamp(22px,3vw,30px)] border border-line bg-[linear-gradient(135deg,color-mix(in_srgb,var(--a)_26%,var(--bg2)),color-mix(in_srgb,var(--b)_16%,var(--bg2)))] p-[clamp(22px,5vw,52px)] md:grid-cols-2">
        <div>
          <h2 className="mb-4 max-w-[20ch] text-[clamp(1.75rem,1rem+2.6vw,3rem)] font-extrabold">Let's connect.</h2>
          <div className="tag-list mb-[18px]">{topics.map((t) => <span key={t}>{t}</span>)}</div>
          <p className="mb-6 text-muted">Happy to chat about engineering, performance and AI-assisted development, or just to say hello. Send a message or reach me directly:</p>
          <div className="grid gap-2.5">
            <button type="button" className={linkRow} onClick={copyEmail}>{profile.email} <span className="font-semibold text-accent2">{copyLabel}</span></button>
            <a className={linkRow} href={`tel:${profile.tel}`}>{profile.phone} <span className="font-semibold text-accent2">Call</span></a>
            <ExternalLink className={linkRow} href={profile.whatsapp}>WhatsApp <span className="font-semibold text-accent2">Chat</span></ExternalLink>
            <ExternalLink className={linkRow} href={profile.linkedin}>LinkedIn <span className="font-semibold text-accent2">Connect</span></ExternalLink>
            {profile.github && <ExternalLink className={linkRow} href={profile.github}>GitHub <span className="font-semibold text-accent2">Follow</span></ExternalLink>}
            {profile.calendar && <ExternalLink className={linkRow} href={profile.calendar}>Book a 15-min call <span className="font-semibold text-accent2">Schedule</span></ExternalLink>}
            <a className={linkRow} href={vcardUrl} download>Save my contact <span className="font-semibold text-accent2">Download</span></a>
            <button type="button" className={`${linkRow} print:hidden`} onClick={() => window.print()}>Save this page as PDF <span className="font-semibold text-accent2">Print</span></button>
          </div>
        </div>

        {status === 'sent' && sentTo ? (
          <div className="glass grid content-center gap-3 rounded-[22px] p-[clamp(20px,3vw,32px)] text-center print:hidden" role="status">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-accent2/20 text-accent2" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
            </div>
            <h3 className="text-[1.4rem]">Message sent. Thank you, {sentTo.name.split(' ')[0]}!</h3>
            <p className="text-muted">I'll reply to <strong className="text-ink [overflow-wrap:anywhere]">{sentTo.email}</strong> as soon as I can.</p>
            <button type="button" className="btn btn-ghost mx-auto mt-2" onClick={() => dispatch({ type: 'reset' })}>Send another message</button>
          </div>
        ) : (
          <form className="grid gap-3.5 print:hidden" onSubmit={submit} noValidate>
            <div className="grid items-start gap-3.5 xs:grid-cols-2">
              <label className={labelCls}>
                Your name
                <input className="field" value={values.name} onChange={change('name')} maxLength={LIMITS.name} autoComplete="name"
                  aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'err-name' : undefined} />
                {errors.name && <span className={errCls} id="err-name" role="alert">{errors.name}</span>}
              </label>
              <label className={labelCls}>
                Your email
                <input className="field" type="email" inputMode="email" value={values.email} onChange={change('email')} maxLength={LIMITS.email} autoComplete="email"
                  aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'err-email' : undefined} />
                {errors.email && <span className={errCls} id="err-email" role="alert">{errors.email}</span>}
              </label>
            </div>
            <div className="grid items-start gap-3.5 xs:grid-cols-2">
              <label className={labelCls}>
                Company (optional)
                <input className="field" value={values.company} onChange={change('company')} maxLength={LIMITS.company} autoComplete="organization" />
              </label>
              <label className={labelCls}>
                What's it about?
                <select className="field field-select" value={values.topic} onChange={change('topic')}>
                  {topicOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
            </div>
            <label className={labelCls}>
              Your message
              <textarea className="field min-h-[120px] resize-y" rows={4} value={values.message} onChange={change('message')} maxLength={LIMITS.message}
                aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'err-message' : undefined} />
              <span className="mt-1 block text-right font-mono text-[.72rem] text-muted">{values.message.length}/{LIMITS.message}</span>
              {errors.message && <span className={errCls} id="err-message" role="alert">{errors.message}</span>}
            </label>

            {/* Hidden spam trap: people never see or fill this in, bots often do. */}
            <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
              <label>Leave this empty<input ref={trap} name="website" tabIndex={-1} autoComplete="off" /></label>
            </div>

            <button className="btn btn-primary w-full" type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send message'}
            </button>

            <div aria-live="polite">
              {status === 'error' && (
                <p className="m-0 rounded-xl border border-[#ff6b6b]/50 bg-card px-3.5 py-3 text-[.92rem] text-ink" role="alert">
                  {message} Your message is saved here, so you can try again, or{' '}
                  <a className="text-accent2 underline" href={buildMailto(profile.email, values)}>email me directly</a>.
                </p>
              )}
              {status === 'mailto' && (
                <p className="m-0 rounded-xl border border-line bg-card px-3.5 py-3 text-[.92rem] text-ink" role="status">
                  Opening your email app. If nothing opens, write to <a className="text-accent2 underline" href={`mailto:${profile.email}`}>{profile.email}</a>.
                </p>
              )}
            </div>
          </form>
        )}
      </Reveal>
    </Section>
  );
}
