import type { ContactInput } from './security';
import { safeStorage } from './storage';

/** Free form-to-email service. The access key is public by design (it can only send mail to its owner). */
export const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

export type ContactValues = Required<ContactInput>;
export type SendResult = { ok: true } | { ok: false; error: string };

/** Web3Forms keys are UUIDs. Anything else (empty, placeholder) means "not set up yet". */
export const isValidAccessKey = (key: unknown): key is string =>
  typeof key === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(key.trim());

interface SendOptions {
  accessKey: string;
  endpoint?: string;
  timeoutMs?: number;
  /** Replaceable in tests. */
  fetchImpl?: typeof fetch;
}

/** Sends the message to the mail service. Never throws: always returns { ok } with a friendly error. */
export async function sendContact(
  values: ContactValues,
  { accessKey, endpoint = WEB3FORMS_ENDPOINT, timeoutMs = 12_000, fetchImpl = fetch }: SendOptions
): Promise<SendResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetchImpl(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: accessKey.trim(),
        subject: `Portfolio message from ${values.name}${values.topic ? ' – ' + values.topic : ''}`,
        from_name: 'Portfolio website',
        name: values.name,
        email: values.email, // used as the Reply-To address
        company: values.company || '(not given)',
        topic: values.topic,
        message: values.message,
        botcheck: false,
      }),
      signal: controller.signal,
    });
    const data = (await res.json().catch(() => null)) as { success?: boolean; message?: string } | null;
    if (res.ok && data?.success) return { ok: true };
    return { ok: false, error: data?.message || `The mail service replied with an error (${res.status}).` };
  } catch (err) {
    const timedOut = err instanceof DOMException && err.name === 'AbortError';
    return { ok: false, error: timedOut ? 'The request took too long.' : "Couldn't reach the mail service. Please check your connection." };
  } finally {
    clearTimeout(timer);
  }
}

// ---- Draft (so a half-written message survives a reload) and a short cooldown against double sends ----
const DRAFT_KEY = 'contact-draft';
const SENT_KEY = 'contact-last-sent';
export const COOLDOWN_MS = 60_000;

export const emptyValues = (topic: string): ContactValues => ({ name: '', email: '', company: '', topic, message: '' });

/** Reads the saved draft. Unknown or malformed data is ignored. */
export function loadDraft(fallback: ContactValues): ContactValues {
  try {
    const raw = JSON.parse(safeStorage.get(DRAFT_KEY) ?? 'null') as Partial<Record<keyof ContactValues, unknown>> | null;
    if (!raw || typeof raw !== 'object') return fallback;
    const pick = (k: keyof ContactValues) => (typeof raw[k] === 'string' ? (raw[k] as string) : fallback[k]);
    return { name: pick('name'), email: pick('email'), company: pick('company'), topic: pick('topic'), message: pick('message') };
  } catch {
    return fallback;
  }
}
export const saveDraft = (values: ContactValues): void => safeStorage.set(DRAFT_KEY, JSON.stringify(values));
export const clearDraft = (): void => safeStorage.remove(DRAFT_KEY);

export const markSent = (now = Date.now()): void => safeStorage.set(SENT_KEY, String(now));
/** Milliseconds left before another message may be sent (0 = go ahead). */
export function cooldownLeft(now = Date.now()): number {
  const last = Number(safeStorage.get(SENT_KEY));
  return Number.isFinite(last) && last > 0 ? Math.max(0, COOLDOWN_MS - (now - last)) : 0;
}
