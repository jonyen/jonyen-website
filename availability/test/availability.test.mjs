import test from 'node:test';
import assert from 'node:assert/strict';
import { createHandler, icsBusy, mergeIntervals } from '../src/handler.js';

const NOW = Date.parse('2026-10-19T07:00:00Z'); // Monday 00:00 Pacific
const DAY = 86400_000;

const ICS = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VTIMEZONE
TZID:Pacific Standard Time
BEGIN:STANDARD
DTSTART:16010101T020000
TZOFFSETFROM:-0700
TZOFFSETTO:-0800
RRULE:FREQ=YEARLY;INTERVAL=1;BYDAY=1SU;BYMONTH=11
END:STANDARD
BEGIN:DAYLIGHT
DTSTART:16010101T020000
TZOFFSETFROM:-0800
TZOFFSETTO:-0700
RRULE:FREQ=YEARLY;INTERVAL=1;BYDAY=2SU;BYMONTH=3
END:DAYLIGHT
END:VTIMEZONE
BEGIN:VEVENT
UID:standup
SUMMARY:Busy
DTSTART;TZID=Pacific Standard Time:20261001T090000
DTEND;TZID=Pacific Standard Time:20261001T093000
RRULE:FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR
EXDATE;TZID=Pacific Standard Time:20261020T090000
X-MICROSOFT-CDO-BUSYSTATUS:BUSY
END:VEVENT
BEGIN:VEVENT
UID:standup
RECURRENCE-ID;TZID=Pacific Standard Time:20261021T090000
SUMMARY:Busy
DTSTART;TZID=Pacific Standard Time:20261021T140000
DTEND;TZID=Pacific Standard Time:20261021T143000
X-MICROSOFT-CDO-BUSYSTATUS:BUSY
END:VEVENT
BEGIN:VEVENT
UID:holiday
SUMMARY:Free
DTSTART;VALUE=DATE:20261022
DTEND;VALUE=DATE:20261023
X-MICROSOFT-CDO-BUSYSTATUS:FREE
END:VEVENT
BEGIN:VEVENT
UID:cancelled
DTSTART:20261019T200000Z
DTEND:20261019T210000Z
STATUS:CANCELLED
END:VEVENT
BEGIN:VEVENT
UID:old
DTSTART:20260101T200000Z
DTEND:20260101T210000Z
END:VEVENT
END:VCALENDAR`.replace(/\n/g, '\r\n');

const iso = (ms) => new Date(ms).toISOString();

test('expands recurrences, exdates, moved occurrences and DST-aware zones', () => {
  const busy = icsBusy(ICS, NOW, NOW + 3 * DAY).map((b) => [iso(b.start), iso(b.end)]);
  assert.deepEqual(busy, [
    ['2026-10-19T16:00:00.000Z', '2026-10-19T16:30:00.000Z'], // Mon 9:00 PDT
    // Tue skipped by EXDATE; Wed moved to 14:00
    ['2026-10-21T21:00:00.000Z', '2026-10-21T21:30:00.000Z'],
  ]);
});

test('uses standard time after the November DST change', () => {
  const from = Date.parse('2026-11-02T08:00:00Z');
  const [first] = icsBusy(ICS, from, from + DAY);
  assert.equal(iso(first.start), '2026-11-02T17:00:00.000Z'); // Mon 9:00 PST
});

test('mergeIntervals coalesces overlapping and touching blocks', () => {
  assert.deepEqual(
    mergeIntervals([
      { start: 5, end: 7 },
      { start: 1, end: 3 },
      { start: 3, end: 4 },
      { start: 6, end: 9 },
    ]),
    [{ start: 1, end: 4 }, { start: 5, end: 9 }],
  );
});

const env = {
  GOOGLE_CLIENT_ID: 'id',
  GOOGLE_CLIENT_SECRET: 'secret',
  GOOGLE_CALENDARS_PERSONAL: 'me@gmail.com',
  GOOGLE_REFRESH_PERSONAL: 'r1',
  GOOGLE_CALENDARS_ACTS2: 'me@acts2.network, shared@group.calendar.google.com',
  GOOGLE_REFRESH_ACTS2: 'r2',
  GOOGLE_SKIP_ALL_DAY: 'shared@group.calendar.google.com',
  OUTLOOK_ICS_URL: 'https://outlook.example/cal.ics',
};

function fakeFetch({ failOutlook = false } = {}) {
  const calls = [];
  const fn = async (url, init) => {
    calls.push(url);
    if (url === 'https://oauth2.googleapis.com/token') {
      const rt = new URLSearchParams(init.body.toString()).get('refresh_token');
      return Response.json({ access_token: `at-${rt}` });
    }
    if (url.endsWith('/freeBusy')) {
      const { items } = JSON.parse(init.body);
      const busyFor = {
        'me@gmail.com': [{ start: '2026-10-19T16:15:00Z', end: '2026-10-19T17:00:00Z' }],
        'me@acts2.network': [{ start: '2026-10-20T18:00:00Z', end: '2026-10-20T19:00:00Z' }],
        'shared@group.calendar.google.com': [
          { start: '2026-10-21T23:00:00Z', end: '2026-10-22T01:00:00Z' },
          { start: '2026-10-26T04:00:00Z', end: '2026-10-27T03:59:00Z' }, // all-day marker
        ],
      };
      return Response.json({ calendars: Object.fromEntries(items.map(({ id }) => [id, { busy: busyFor[id] }])) });
    }
    if (url === env.OUTLOOK_ICS_URL) {
      return failOutlook ? new Response('nope', { status: 500 }) : new Response(ICS);
    }
    throw new Error(`unexpected ${url}`);
  };
  fn.calls = calls;
  return fn;
}

const get = (worker, path = '/schedule/busy.json') =>
  worker.fetch(new Request(`https://jonyen.com${path}`), env, { waitUntil() {} });

test('merges all three sources and exposes only start/end', async () => {
  const worker = createHandler({ fetchImpl: fakeFetch(), now: () => NOW });
  const res = await get(worker);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.incomplete, false);
  assert.deepEqual(body.busy.slice(0, 2), [
    { start: '2026-10-19T16:00:00.000Z', end: '2026-10-19T17:00:00.000Z' },
    { start: '2026-10-20T18:00:00.000Z', end: '2026-10-20T19:00:00.000Z' },
  ]);
  assert.ok(body.busy.some((b) => b.start === '2026-10-21T23:00:00.000Z'), 'shared calendar counted');
  assert.ok(!body.busy.some((b) => b.start === '2026-10-26T04:00:00.000Z'), 'all-day block on a skip calendar ignored');
  for (const b of body.busy) assert.deepEqual(Object.keys(b), ['start', 'end']);
});

test('a failed source still serves the rest, marked incomplete and not cached', async () => {
  let puts = 0;
  const cache = { match: async () => undefined, put: async () => puts++ };
  const worker = createHandler({ fetchImpl: fakeFetch({ failOutlook: true }), now: () => NOW, cache });
  const realError = console.error;
  console.error = () => {};
  const body = await (await get(worker)).json();
  console.error = realError;
  assert.equal(body.incomplete, true);
  assert.equal(body.busy.length, 3);
  assert.equal(puts, 0);
});

test('404 for other paths', async () => {
  const worker = createHandler({ fetchImpl: fakeFetch(), now: () => NOW });
  assert.equal((await get(worker, '/schedule/other')).status, 404);
});

function fakeKv(initial = {}) {
  const store = new Map(Object.entries(initial));
  return {
    store,
    get: async (key) => store.get(key) ?? null,
    put: async (key, value) => { store.set(key, value); },
  };
}

const feed = (generatedAt) => JSON.stringify({ generatedAt: iso(generatedAt), from: iso(generatedAt), to: iso(generatedAt + 31 * DAY), incomplete: false, busy: [] });

test('the cron stores a complete build in KV, and busy.json serves it without calendar calls', async () => {
  const BUSY = fakeKv();
  await createHandler({ fetchImpl: fakeFetch(), now: () => NOW }).scheduled({}, { ...env, BUSY });
  assert.equal(JSON.parse(BUSY.store.get('busy')).generatedAt, iso(NOW));

  const fetchImpl = fakeFetch();
  const worker = createHandler({ fetchImpl, now: () => NOW + 5 * 60_000 });
  const res = await worker.fetch(new Request('https://jonyen.com/schedule/busy.json'), { ...env, BUSY }, { waitUntil() {} });
  assert.equal((await res.json()).generatedAt, iso(NOW));
  assert.equal(fetchImpl.calls.length, 0);
});

test('a partial cron build keeps the last complete one', async () => {
  const BUSY = fakeKv({ busy: feed(NOW - 10 * 60_000) });
  const realError = console.error;
  console.error = () => {};
  await createHandler({ fetchImpl: fakeFetch({ failOutlook: true }), now: () => NOW }).scheduled({}, { ...env, BUSY });
  console.error = realError;
  assert.equal(JSON.parse(BUSY.store.get('busy')).generatedAt, iso(NOW - 10 * 60_000));
});

test('a stale stored build is rebuilt on request and stored again', async () => {
  const BUSY = fakeKv({ busy: feed(NOW - 31 * 60_000) });
  const pending = [];
  const worker = createHandler({ fetchImpl: fakeFetch(), now: () => NOW });
  const res = await worker.fetch(new Request('https://jonyen.com/schedule/busy.json'), { ...env, BUSY }, { waitUntil: (p) => pending.push(p) });
  assert.equal((await res.json()).generatedAt, iso(NOW));
  await Promise.all(pending);
  assert.equal(JSON.parse(BUSY.store.get('busy')).generatedAt, iso(NOW));
});

const PAGE = '<!DOCTYPE html><html><head><title>Schedule</title></head><body></body></html>';
function originFetch(type = 'text/html; charset=utf-8') {
  return async (req) => {
    assert.equal(new URL(req.url).pathname, '/schedule/');
    return new Response(PAGE, { headers: { 'Content-Type': type, ETag: '"abc"', 'Cache-Control': 'max-age=600' } });
  };
}
const getPage = (worker, BUSY) => worker.fetch(new Request('https://jonyen.com/schedule/'), { ...env, BUSY }, { waitUntil() {} });

test('/schedule/ inlines the stored feed into the head', async () => {
  const text = feed(NOW).replace('"busy":[]', '"busy":[],"x":"</script>"');
  const worker = createHandler({ fetchImpl: originFetch(), now: () => NOW });
  const res = await getPage(worker, fakeKv({ busy: text }));
  const html = await res.text();
  const [, inline] = html.match(/<script id="busy-data" type="application\/json">(.*?)<\/script>\n<\/head>/);
  assert.deepEqual(JSON.parse(inline), JSON.parse(text));
  assert.equal(res.headers.get('ETag'), null);
  assert.equal(res.headers.get('Cache-Control'), 'no-cache');
});

test('/schedule/ goes out unchanged without a fresh stored feed or for non-HTML', async () => {
  for (const [BUSY, type] of [
    [fakeKv(), undefined],
    [fakeKv({ busy: feed(NOW - 31 * 60_000) }), undefined],
    [{ get: async () => { throw new Error('kv down'); } }, undefined],
    [fakeKv({ busy: feed(NOW) }), 'text/plain'],
  ]) {
    const worker = createHandler({ fetchImpl: originFetch(type), now: () => NOW });
    const res = await getPage(worker, BUSY);
    assert.equal(await res.text(), PAGE);
    assert.equal(res.headers.get('ETag'), '"abc"');
  }
});
