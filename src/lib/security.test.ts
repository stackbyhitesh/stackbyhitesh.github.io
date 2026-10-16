import { describe, expect, it } from 'vitest';
import { buildMailto, cleanLine, cleanText, isSafeExternalUrl, validateContact } from './security';

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

describe('validateContact', () => {
  it('requires a name and a message', () => {
    const { errors } = validateContact({ name: '', company: '', message: 'hi' });
    expect(errors.name).toBeTruthy();
    expect(errors.message).toBeTruthy();
  });
  it('accepts valid input and returns cleaned values', () => {
    const { errors, values } = validateContact({ name: '  Asha  ', company: 'Acme', message: 'Great portfolio, nice work!' });
    expect(errors).toEqual({});
    expect(values.name).toBe('Asha');
  });
});

describe('buildMailto', () => {
  it('encodes user text so it cannot inject headers', () => {
    const url = buildMailto('a@b.com', { name: 'X', company: '', message: 'hello\nBcc: evil@x.com' });
    expect(url.startsWith('mailto:a@b.com?subject=')).toBe(true);
    expect(url).not.toContain('\n');
    expect(url).toContain('%0ABcc%3A');
  });
});

describe('buildMailto subject', () => {
  it('includes the topic and company', () => {
    const url = buildMailto('a@b.com', { name: 'X', company: 'Acme', topic: 'A project idea', message: 'hello there' });
    expect(decodeURIComponent(url)).toContain('subject=Hello Hitesh – A project idea (Acme)');
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
