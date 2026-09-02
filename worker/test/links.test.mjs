import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { createHandler } from '../src/handler.js';

const SECRET = 'test-secret';
const PDF = new TextEncoder().encode('%PDF-fake').buffer;

const env = { LINK_SECRET: SECRET };
const worker = createHandler({
  getPdf: async (variant) => (variant === 'fullstack' ? PDF : null),
});

const sign = (variant, expiry) =>
  createHmac('sha256', SECRET).update(`${variant}.${expiry}`).digest('base64url');

const get = (path) => worker.fetch(new Request(`https://jonyen.com${path}`), env);
const link = (variant, expiry) => `/resume/dl/${variant}/${expiry}/${sign(variant, expiry)}`;

const future = () => Math.floor(Date.now() / 1000) + 3600;
const past = () => Math.floor(Date.now() / 1000) - 10;

test('serves the PDF for a valid, unexpired link', async () => {
  const res = await get(link('fullstack', future()));
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('content-type'), 'application/pdf');
  assert.equal(res.headers.get('cache-control'), 'no-store, private');
  assert.match(res.headers.get('x-robots-tag'), /noindex/);
});

test('rejects an expired link with 410', async () => {
  const res = await get(link('fullstack', past()));
  assert.equal(res.status, 410);
});

test('rejects a forged signature', async () => {
  const res = await get(`/resume/dl/fullstack/${future()}/${'A'.repeat(43)}`);
  assert.equal(res.status, 403);
});

test('rejects an expiry extended after signing', async () => {
  const expiry = future();
  const res = await get(`/resume/dl/fullstack/${expiry + 99999}/${sign('fullstack', expiry)}`);
  assert.equal(res.status, 403);
});

test('rejects an unknown variant before checking the signature', async () => {
  const expiry = future();
  const res = await get(`/resume/dl/nope/${expiry}/${sign('nope', expiry)}`);
  assert.equal(res.status, 404);
});

test('404s when the variant has no PDF uploaded', async () => {
  const res = await get(link('generic', future()));
  assert.equal(res.status, 404);
});

test('404s on a malformed path', async () => {
  const res = await get('/resume/dl/whatever');
  assert.equal(res.status, 404);
});
