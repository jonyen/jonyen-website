import test from 'node:test';
import assert from 'node:assert/strict';
import { createHandler } from '../src/handler.js';

const env = { ASSETS: { fetch: async (req) => new Response(`asset ${new URL(req.url).pathname}`) } };

test('www redirects to the apex, keeping path and query', async () => {
  const res = await createHandler().fetch(new Request('https://www.jonyen.com/schedule/?a=1'), env);
  assert.equal(res.status, 301);
  assert.equal(res.headers.get('Location'), 'https://jonyen.com/schedule/?a=1');
});

test('the apex is served from static assets', async () => {
  const res = await createHandler().fetch(new Request('https://jonyen.com/resume/'), env);
  assert.equal(await res.text(), 'asset /resume/');
});
