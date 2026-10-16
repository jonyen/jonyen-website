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
  GOOGLE_EMAIL_PERSONAL: 'me@gmail.com',
  GOOGLE_REFRESH_PERSONAL: 'r1',
  GOOGLE_EMAIL_ACTS2: 'me@acts2.network',
  GOOGLE_REFRESH_ACTS2: 'r2',
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
      const id = items[0].id;
      const busy =
        id === 'me@gmail.com'
          ? [{ start: '2026-10-19T16:15:00Z', end: '2026-10-19T17:00:00Z' }]
          : [{ start: '2026-10-20T18:00:00Z', end: '2026-10-20T19:00:00Z' }];
      return Response.json({ calendars: { [id]: { busy } } });
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
  assert.equal(body.busy.length, 2);
  assert.equal(puts, 0);
});

test('404 for other paths', async () => {
  const worker = createHandler({ fetchImpl: fakeFetch(), now: () => NOW });
  assert.equal((await get(worker, '/schedule/other')).status, 404);
});
