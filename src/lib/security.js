export const LIMITS = { name: 80, company: 80, message: 2000 };

/** Single-line text: removes control characters (blocks line/header injection), collapses spaces, trims, limits length. */
export const cleanLine = (value, max) =>
  // eslint-disable-next-line no-control-regex
  String(value ?? '').replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);

/** Multi-line text: keeps new lines, removes other control characters, trims, limits length. */
export const cleanText = (value, max) =>
  String(value ?? '')
    .replace(/\r\n?/g, '\n')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, '')
    .trim()
    .slice(0, max);

/** Validates and cleans the contact form. Returns { errors, values } where values is safe to use. */
export function validateContact({ name, company, message, topic }) {
  const values = {
    name: cleanLine(name, LIMITS.name),
    company: cleanLine(company, LIMITS.company),
    topic: cleanLine(topic, 60),
    message: cleanText(message, LIMITS.message),
  };
  const errors = {};
  if (values.name.length < 2) errors.name = 'Please enter your name (at least 2 characters).';
  if (values.message.length < 10) errors.message = "Please write at least 10 characters so I know what it's about.";
  return { errors, values };
}

/** Builds a mailto: link. Every part is URL-encoded, so user text cannot add extra headers. */
export function buildMailto(to, { name, company, message, topic }) {
  const subject = `Hello Hitesh${topic ? ' – ' + topic : ''}${company ? ' (' + company + ')' : ''}`;
  const body = `${message}\n\nRegards,\n${name}${company ? '\n' + company : ''}`;
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Only https links are allowed to open in a new tab. */
export function isSafeExternalUrl(url) {
  try { return new URL(url).protocol === 'https:'; } catch { return false; }
}
