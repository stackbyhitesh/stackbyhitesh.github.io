import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { COOLDOWN_MS, cooldownLeft, isValidAccessKey, markSent, sendContact, type ContactValues } from './contact';

const values: ContactValues = { name: 'Asha', email: 'asha@example.com', company: '', topic: 'A project idea', message: 'Loved your portfolio!' };
const KEY = '1a2b3c4d-1234-5678-9abc-def012345678';
const reply = (body: unknown, status = 200) => Promise.resolve(new Response(JSON.stringify(body), { status }));

describe('isValidAccessKey', () => {
  it('accepts a UUID and rejects placeholders', () => {
    expect(isValidAccessKey(KEY)).toBe(true);
    expect(isValidAccessKey('')).toBe(false);
    expect(isValidAccessKey('PASTE-YOUR-KEY-HERE')).toBe(false);
    expect(isValidAccessKey(undefined)).toBe(false);
  });
});

describe('sendContact', () => {
  it('posts JSON with the access key and reply-to email', async () => {
    const fetchImpl = vi.fn(() => reply({ success: true }));
    const result = await sendContact(values, { accessKey: KEY, fetchImpl: fetchImpl as unknown as typeof fetch });
    expect(result).toEqual({ ok: true });
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://api.web3forms.com/submit');
    const body = JSON.parse(String(init.body));
    expect(body).toMatchObject({ access_key: KEY, name: 'Asha', email: 'asha@example.com', message: 'Loved your portfolio!' });
  });
  it('returns the service message on failure', async () => {
    const fetchImpl = () => reply({ success: false, message: 'Invalid access key' }, 400);
    const result = await sendContact(values, { accessKey: KEY, fetchImpl: fetchImpl as unknown as typeof fetch });
    expect(result).toEqual({ ok: false, error: 'Invalid access key' });
  });
  it('turns a network error into a friendly message (never throws)', async () => {
    const fetchImpl = () => Promise.reject(new TypeError('Failed to fetch'));
    const result = await sendContact(values, { accessKey: KEY, fetchImpl: fetchImpl as unknown as typeof fetch });
    expect(result.ok).toBe(false);
  });
});

describe('cooldownLeft', () => {
  const store = new Map<string, string>();
  beforeEach(() => {
    store.clear();
    vi.stubGlobal('window', { localStorage: { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => void store.set(k, v), removeItem: (k: string) => void store.delete(k) } });
  });
  afterEach(() => vi.unstubAllGlobals());

  it('is 0 when nothing was sent', () => expect(cooldownLeft()).toBe(0));
  it('counts down after a send', () => {
    markSent(1_000);
    expect(cooldownLeft(1_000 + 10_000)).toBe(COOLDOWN_MS - 10_000);
    expect(cooldownLeft(1_000 + COOLDOWN_MS + 1)).toBe(0);
  });
});
