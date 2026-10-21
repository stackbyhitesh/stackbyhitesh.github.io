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
const linkRow =
  'group glass flex min-w-0 cursor-pointer items-center gap-3.5 rounded-2xl bg-[linear-gradient(145deg,var(--glass-2),var(--glass))] px-4 py-3.5 text-left text-[.95rem] font-medium text-ink no-underline transition duration-200 hover:translate-x-1 hover:border-accent2';

function LinkRow({ icon, title, action }: { icon: IconName; title: string; action: string }) {
  return (
    <>
      <span className="grid size-10 flex-none place-items-center rounded-xl bg-accent/15 text-accent2 transition-colors group-hover:bg-accent2/20"><Icon name={icon} /></span>
      <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">{title}</span>
      <span className="flex flex-none items-center gap-1 text-[.85rem] font-semibold text-accent2">{action}<Icon name="arrow" size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
    </>
  );
}

const errCls = 'mt-1.5 block text-[.8rem] text-[#c0262d] dark:text-[#ff8d8d]';

/** Label + input with a small icon inside the field. */
function Field({ label, icon, error, id, children }: { label: string; icon: IconName; error?: string; id: string; children: ReactNode }) {
  return (
    <label className="block text-[.85rem] font-medium text-muted">
      {label}
      <span className="relative mt-1.5 block text-ink">
        <Icon name={icon} size={17} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" />
        {children}
      </span>
      {error && <span className={errCls} id={`err-${id}`} role="alert">{error}</span>}
    </label>
  );
}
const inputCls = 'field mt-0 pl-11';

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
      <Reveal className="print-box relative grid gap-[clamp(28px,5vw,48px)] overflow-hidden rounded-[clamp(22px,3vw,32px)] border border-line bg-[linear-gradient(135deg,color-mix(in_srgb,var(--a)_26%,var(--bg2)),color-mix(in_srgb,var(--b)_16%,var(--bg2)))] p-[clamp(20px,5vw,56px)] before:pointer-events-none before:absolute before:-top-28 before:-right-24 before:size-80 before:rounded-full before:bg-accent2/25 before:blur-3xl after:pointer-events-none after:absolute after:-bottom-32 after:-left-24 after:size-80 after:rounded-full after:bg-accent/30 after:blur-3xl md:grid-cols-[1fr_1.05fr] [&>*]:relative [&>*]:z-[1]">
        <div>
          <div className="kick">Contact</div>
          <h2 className="mb-4 max-w-[14ch] text-[clamp(2rem,1rem+3vw,3.4rem)] font-extrabold">Let's build something <span className="text-grad">great</span>.</h2>
          <p className="mb-5 max-w-[46ch] text-muted">Happy to chat about engineering, performance and AI-assisted development, or just to say hello. Send a message, or reach me directly:</p>
          <div className="tag-list mb-6">{topics.map((t) => <span key={t}>{t}</span>)}</div>
          <div className="grid gap-2.5">
            <button type="button" className={linkRow} onClick={copyEmail}><LinkRow icon="mail" title={profile.email} action={copyLabel} /></button>
            <a className={linkRow} href={`tel:${profile.tel}`}><LinkRow icon="phone" title={profile.phone} action="Call" /></a>
            <ExternalLink className={linkRow} href={profile.whatsapp}><LinkRow icon="chat" title="WhatsApp" action="Chat" /></ExternalLink>
            {profile.resume && <a className={linkRow} href={profile.resume} download="Hitesh_Chaudhari_Resume.pdf"><LinkRow icon="file" title="Resume (PDF)" action="Download" /></a>}
            <ExternalLink className={linkRow} href={profile.linkedin}><LinkRow icon="linkedin" title="LinkedIn" action="Connect" /></ExternalLink>
            {profile.github && <ExternalLink className={linkRow} href={profile.github}><LinkRow icon="github" title="GitHub" action="Follow" /></ExternalLink>}
            {profile.calendar && <ExternalLink className={linkRow} href={profile.calendar}><LinkRow icon="calendar" title="Book a 15-min call" action="Schedule" /></ExternalLink>}
          </div>
        </div>

        <div className="glass-2 self-start rounded-3xl p-[clamp(20px,3vw,34px)] print:hidden">
          {status === 'sent' && sentTo ? (
            <div className="grid content-center gap-3 py-6 text-center" role="status">
              <div className="animate-pop mx-auto grid size-16 place-items-center rounded-full bg-accent2/20 text-accent2 shadow-[0_0_0_8px_color-mix(in_srgb,var(--b)_12%,transparent)]">
                <Icon name="check" size={32} />
              </div>
              <h3 className="text-[1.5rem]">Message sent. Thank you, {sentTo.name.split(' ')[0]}!</h3>
              <p className="mx-auto max-w-[36ch] text-muted">I'll reply to <strong className="text-ink [overflow-wrap:anywhere]">{sentTo.email}</strong> as soon as I can.</p>
              <button type="button" className="btn btn-ghost mx-auto mt-3" onClick={() => dispatch({ type: 'reset' })}>Send another message</button>
            </div>
          ) : (
            <form className="grid gap-4" onSubmit={submit} noValidate>
              <div>
                <h3 className="text-[1.35rem]">Send me a message</h3>
                <p className="mt-1 text-[.9rem] text-muted">It goes straight to my inbox.</p>
              </div>
              <div className="grid items-start gap-4 xs:grid-cols-2">
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

              <fieldset className="m-0 min-w-0 border-0 p-0">
                <legend className="mb-2 p-0 text-[.85rem] font-medium text-muted">What's it about?</legend>
                <div className="flex flex-wrap gap-2">
                  {topicOptions.map((t) => (
                    <label key={t} className="cursor-pointer">
                      <input type="radio" name="topic" className="peer sr-only" value={t} checked={values.topic === t} onChange={() => dispatch({ type: 'change', field: 'topic', value: t })} />
                      <span className="block rounded-full border border-line bg-card px-3.5 py-2 text-[.85rem] text-muted transition-colors peer-checked:primary-grad peer-checked:border-transparent peer-checked:text-white peer-checked:shadow-[0_8px_20px_-10px_var(--a)] peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent2 hover:text-ink peer-checked:hover:text-white">{t}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="block text-[.85rem] font-medium text-muted">
                Your message
                <textarea className="field min-h-[130px] resize-y" rows={5} value={values.message} onChange={change('message')} maxLength={LIMITS.message}
                  placeholder="Tell me a little about what you have in mind…"
                  aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'err-message' : undefined} />
                <span className="mt-1 flex justify-between gap-3">
                  <span>{errors.message && <span className={errCls} id="err-message" role="alert">{errors.message}</span>}</span>
                  <span className="font-mono text-[.72rem] text-muted">{values.message.length}/{LIMITS.message}</span>
                </span>
              </label>

              {/* Hidden spam trap: people never see or fill this in, bots often do. */}
              <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
                <label>Leave this empty<input ref={trap} name="website" tabIndex={-1} autoComplete="off" /></label>
              </div>

              <button className="btn btn-primary w-full gap-2.5 py-4 text-[1.02rem]" type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? (
                  <><span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />Sending…</>
                ) : (
                  <>Send message <Icon name="send" size={18} /></>
                )}
              </button>

              <div aria-live="polite">
                {status === 'error' && (
                  <p className="m-0 rounded-xl border border-[#ff6b6b]/50 bg-card px-3.5 py-3 text-[.92rem] text-ink" role="alert">
                    {message} Your message is saved here, so you can try again, or{' '}
                    <a className="text-accent2 underline" href={buildMailto(profile.email, values)}>email me directly</a>.
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </Reveal>
    </Section>
  );
}
