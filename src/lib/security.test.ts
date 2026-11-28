import { describe, expect, it } from 'vitest';
import { buildMailto, cleanLine, cleanText, isEmail, isSafeExternalUrl, validateContact } from './security';

const base = { name: 'X', email: 'x@y.com', company: '', message: 'hello there, friend' };

describe('cleanLine', () => {
  it('removes line breaks and control characters', () => {
    expect(cleanLine('Ravi\r\nBcc: x@y.com\u0000', 80)).toBe('Ravi Bcc: x@y.com');
  });
  it('limits length', () => {
    expect(cleanLine('a'.repeat(200), 80)).toHaveLength(80);
  });
});

describe('cleanText', () => {
  it('keeps new lines but normalises them', () => {
    expect(cleanText('a\r\nb\u0001', 100)).toBe('a\nb');
  });
});

describe('isEmail', () => {
  it('accepts normal addresses', () => {
    expect(isEmail('asha@example.com')).toBe(true);
    expect(isEmail('a.b+c@mail.co.in')).toBe(true);
  });
  it('rejects broken ones', () => {
    for (const bad of ['', 'asha', 'asha@', '@example.com', 'a b@example.com', 'asha@example']) expect(isEmail(bad)).toBe(false);
  });
});

describe('validateContact', () => {
  it('requires a name, a valid email and a message', () => {
    const { errors } = validateContact({ name: '', email: 'nope', company: '', message: 'hi' });
    expect(errors.name).toBeTruthy();
    expect(errors.email).toBeTruthy();
    expect(errors.message).toBeTruthy();
  });
  it('accepts valid input and returns cleaned values', () => {
    const { errors, values } = validateContact({ name: '  Asha  ', email: ' asha@example.com ', company: 'Acme', message: 'Great portfolio, nice work!' });
    expect(errors).toEqual({});
    expect(values.name).toBe('Asha');
    expect(values.email).toBe('asha@example.com');
  });
});

describe('buildMailto', () => {
  it('encodes user text so it cannot inject headers', () => {
    const url = buildMailto('a@b.com', { ...base, message: 'hello\nBcc: evil@x.com' });
    expect(url.startsWith('mailto:a@b.com?subject=')).toBe(true);
    expect(url).not.toContain('\n');
    expect(url).toContain('%0ABcc%3A');
  });
  it('includes the topic, company and reply address', () => {
    const url = buildMailto('a@b.com', { ...base, company: 'Acme', topic: 'A project idea' });
    expect(decodeURIComponent(url)).toContain('subject=Hello Hitesh – A project idea (Acme)');
    expect(decodeURIComponent(url)).toContain('x@y.com');
  });
});

describe('isSafeExternalUrl', () => {
  it('allows https only', () => {
    expect(isSafeExternalUrl('https://linkedin.com/in/x')).toBe(true);
    expect(isSafeExternalUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeExternalUrl('http://example.com')).toBe(false);
    expect(isSafeExternalUrl('not a url')).toBe(false);
  });
});
