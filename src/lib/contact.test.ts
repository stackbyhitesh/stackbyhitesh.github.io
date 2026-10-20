import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { COOLDOWN_MS, cooldownLeft, markSent, sendContact, type ContactValues } from './contact';

const values: ContactValues = { name: 'Asha', email: 'asha@example.com', company: '', topic: 'A project idea', message: 'Loved your portfolio!' };
const TO = 'owner@example.com';
const reply = (body: unknown, status = 200) => Promise.resolve(new Response(JSON.stringify(body), { status }));

describe('sendContact', () => {
  const send = (fetchImpl: unknown) => sendContact(values, { to: TO, fetchImpl: fetchImpl as typeof fetch });

  it('posts JSON to the owner address with the visitor as reply-to', async () => {
    const fetchImpl = vi.fn(() => reply({ success: 'true', message: 'ok' }));
    expect(await send(fetchImpl)).toEqual({ ok: true });
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://formsubmit.co/ajax/owner@example.com');
    expect(JSON.parse(String(init.body))).toMatchObject({ name: 'Asha', email: 'asha@example.com', message: 'Loved your portfolio!', _captcha: 'false' });
  });
  it('accepts a real boolean success too', async () => {
    expect(await send(() => reply({ success: true }))).toEqual({ ok: true });
  });
  it('returns the service message on failure', async () => {
    expect(await send(() => reply({ success: 'false', message: 'Something broke' }, 400))).toEqual({ ok: false, error: 'Something broke' });
  });
  it('explains the one-time activation step', async () => {
    const result = await send(() => reply({ success: 'false', message: 'This form needs Activation. Check your email.' }));
    expect(result.ok).toBe(false);
    expect(!result.ok && result.error).toMatch(/activat/i);
  });
  it('turns a network error into a friendly message (never throws)', async () => {
    expect((await send(() => Promise.reject(new TypeError('Failed to fetch')))).ok).toBe(false);
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
