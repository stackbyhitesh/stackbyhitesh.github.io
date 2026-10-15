import { useReducer } from 'react';
import { profile, topicOptions, topics, vcardUrl } from '../data';
import { useCopy } from '../hooks';
import { LIMITS, buildMailto, validateContact } from '../lib/security';
import ExternalLink from './ExternalLink';
import Reveal from './Reveal';

// Form state lives in one reducer: field values, validation errors and status.
const initialState = { values: { name: '', company: '', topic: topicOptions[0], message: '' }, errors: {}, status: 'idle' };

function reducer(state, action) {
  switch (action.type) {
    case 'change': {
      const values = { ...state.values, [action.field]: action.value };
      // After a failed submit, re-check on every keystroke so errors clear as soon as they are fixed.
      const errors = state.status === 'invalid' ? validateContact(values).errors : state.errors;
      return { ...state, values, errors };
    }
    case 'invalid':
      return { ...state, errors: action.errors, status: 'invalid' };
    case 'sent':
      return { ...state, errors: {}, status: 'sent' };
    default:
      return state;
  }
}

export default function Contact() {
  const [copyLabel, copyEmail] = useCopy(profile.email);
  const [{ values, errors, status }, dispatch] = useReducer(reducer, initialState);
  const change = (field) => (e) => dispatch({ type: 'change', field, value: e.target.value });

  // No server needed: this opens the visitor's email app with a pre-filled message.
  const submit = (e) => {
    e.preventDefault();
    const result = validateContact(values);
    if (Object.keys(result.errors).length) {
      dispatch({ type: 'invalid', errors: result.errors });
      return;
    }
    dispatch({ type: 'sent' });
    window.location.href = buildMailto(profile.email, result.values);
  };

  return (
    <section id="contact">
      <Reveal className="ct">
        <div>
          <h2>Let's connect.</h2>
          <div className="tags" style={{ margin: '0 0 18px', padding: 0 }}>
            {topics.map((t) => <span key={t}>{t}</span>)}
          </div>
          <p>Happy to chat about engineering, performance and AI-assisted development, or just to say hello. Send a message or reach me directly:</p>
          <div className="lk">
            <button type="button" onClick={copyEmail}>{profile.email} <span>{copyLabel}</span></button>
            <a href={`tel:${profile.tel}`}>{profile.phone} <span>Call</span></a>
            <ExternalLink href={profile.whatsapp}>WhatsApp <span>Chat</span></ExternalLink>
            <ExternalLink href={profile.linkedin}>LinkedIn <span>Connect</span></ExternalLink>
            {profile.github && <ExternalLink href={profile.github}>GitHub <span>Follow</span></ExternalLink>}
            {profile.calendar && <ExternalLink href={profile.calendar}>Book a 15-min call <span>Schedule</span></ExternalLink>}
            <a href={vcardUrl} download>Save my contact <span>Download</span></a>
          </div>
        </div>
        <form onSubmit={submit} noValidate>
          <div className="row2">
            <label>
              Your name
              <input value={values.name} onChange={change('name')} maxLength={LIMITS.name} autoComplete="name"
                aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'err-name' : undefined} />
              {errors.name && <span className="err" id="err-name" role="alert">{errors.name}</span>}
            </label>
            <label>
              Company (optional)
              <input value={values.company} onChange={change('company')} maxLength={LIMITS.company} autoComplete="organization" />
            </label>
          </div>
          <label>
            What's it about?
            <select value={values.topic} onChange={change('topic')}>
              {topicOptions.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label>
            Your message
            <textarea rows="4" value={values.message} onChange={change('message')} maxLength={LIMITS.message}
              aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'err-message' : undefined} />
            <span className="cnt">{values.message.length}/{LIMITS.message}</span>
            {errors.message && <span className="err" id="err-message" role="alert">{errors.message}</span>}
          </label>
          <button className="btn" type="submit">Send message</button>
          {status === 'sent' && (
            <p className="ok" role="status">
              Opening your email app. If nothing opens, write to <a href={`mailto:${profile.email}`}>{profile.email}</a>.
            </p>
          )}
        </form>
      </Reveal>
    </section>
  );
}
