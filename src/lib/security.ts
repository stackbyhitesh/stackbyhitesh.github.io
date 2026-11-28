export const LIMITS = { name: 80, email: 120, company: 80, message: 2000 } as const;

export interface ContactInput {
  name: string;
  email: string;
  company: string;
  message: string;
  topic?: string;
}
export type ContactErrors = Partial<Record<'name' | 'email' | 'message', string>>;

/** Simple shape check (something@something.tld). The mail service does the real verification. */
export const isEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

/** Single-line text: removes control characters (blocks line/header injection), collapses spaces, trims, limits length. */
export const cleanLine = (value: unknown, max: number): string =>
  // eslint-disable-next-line no-control-regex
  String(value ?? '').replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);

/** Multi-line text: keeps new lines, removes other control characters, trims, limits length. */
export const cleanText = (value: unknown, max: number): string =>
  String(value ?? '')
    .replace(/\r\n?/g, '\n')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, '')
    .trim()
    .slice(0, max);

/** Validates and cleans the contact form. Returns { errors, values } where values is safe to use. */
export function validateContact({ name, email, company, message, topic }: ContactInput): { errors: ContactErrors; values: Required<ContactInput> } {
  const values = {
    name: cleanLine(name, LIMITS.name),
    email: cleanLine(email, LIMITS.email),
    company: cleanLine(company, LIMITS.company),
    topic: cleanLine(topic, 60),
    message: cleanText(message, LIMITS.message),
  };
  const errors: ContactErrors = {};
  if (values.name.length < 2) errors.name = 'Please enter your name (at least 2 characters).';
  if (!isEmail(values.email)) errors.email = 'Please enter a valid email so I can reply to you.';
  if (values.message.length < 10) errors.message = "Please write at least 10 characters so I know what it's about.";
  return { errors, values };
}

/** Builds a mailto: link. Every part is URL-encoded, so user text cannot add extra headers. */
export function buildMailto(to: string, { name, email, company, message, topic }: ContactInput): string {
  const subject = `Hello Hitesh${topic ? ' – ' + topic : ''}${company ? ' (' + company + ')' : ''}`;
  const body = `${message}\n\nRegards,\n${name}${company ? '\n' + company : ''}${email ? '\n' + email : ''}`;
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Only https links are allowed to open in a new tab. */
export function isSafeExternalUrl(url: string): boolean {
  try { return new URL(url).protocol === 'https:'; } catch { return false; }
}
