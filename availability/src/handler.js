/**
 * Busy-time feed for jonyen.com/schedule. Merges three calendars into one list
 * of busy intervals, with no titles, attendees or locations:
 *
 *   - two Google accounts, read with refresh tokens limited to the
 *     calendar.freebusy scope (they can see busy times and nothing else).
 *     Each account lists its calendars in GOOGLE_CALENDARS_<ACCOUNT>,
 *     comma-separated, so shared calendars it can see count too. Calendars in
 *     GOOGLE_SKIP_ALL_DAY drop blocks of 20 hours or more: freeBusy carries no
 *     titles, so all-day markers like "E-Sabbath & Family Night" are told
 *     apart by length alone.
 *   - work Outlook, read from a published "Can view when I'm busy" ICS feed
 *
 * GET /schedule/busy.json -> { generatedAt, from, to, incomplete, busy: [{ start, end }] }
 *
 * If a source fails the others are still served with incomplete: true, so the
 * page can warn that some busy times may be missing. Error details stay in the
 * Worker logs.
 */
import ICAL from 'ical.js';

const WINDOW_DAYS = 14;
const CACHE_SECONDS = 600;
const ALL_DAY_MS = 20 * 3600_000;

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': `public, max-age=${CACHE_SECONDS}`,
  'X-Robots-Tag': 'noindex',
  'X-Content-Type-Options': 'nosniff',
};

async function googleAccessToken(env, refreshToken, fetchImpl) {
  const res = await fetchImpl('https://oauth2.googleapis.com/token', {
    method: 'POST',
    body: new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  if (!res.ok) throw new Error(`google token ${res.status}`);
  return (await res.json()).access_token;
}

export async function googleBusy(env, calendarIds, refreshToken, from, to, fetchImpl, skipAllDay = []) {
  const token = await googleAccessToken(env, refreshToken, fetchImpl);
  const res = await fetchImpl('https://www.googleapis.com/calendar/v3/freeBusy', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      timeMin: new Date(from).toISOString(),
      timeMax: new Date(to).toISOString(),
      items: calendarIds.map((id) => ({ id })),
    }),
  });
  if (!res.ok) throw new Error(`google freeBusy ${res.status}`);
  const { calendars } = await res.json();
  return calendarIds.flatMap((id) => {
    const cal = calendars?.[id];
    if (!cal || cal.errors?.length) throw new Error(`google freeBusy calendar error ${cal?.errors?.[0]?.reason}`);
    const busy = cal.busy.map((b) => ({ start: Date.parse(b.start), end: Date.parse(b.end) }));
    return skipAllDay.includes(id) ? busy.filter((b) => b.end - b.start < ALL_DAY_MS) : busy;
  });
}

function isBusy(event) {
  const comp = event.component;
  if (comp.getFirstPropertyValue('status') === 'CANCELLED') return false;
  if (comp.getFirstPropertyValue('transp') === 'TRANSPARENT') return false;
  const status = comp.getFirstPropertyValue('x-microsoft-cdo-busystatus');
  return status !== 'FREE';
}

/** Expands an ICS feed (recurrences, exceptions, VTIMEZONEs) into busy intervals. */
export function icsBusy(text, from, to) {
  const root = new ICAL.Component(ICAL.parse(text));
  for (const tz of root.getAllSubcomponents('vtimezone')) {
    ICAL.TimezoneService.register(new ICAL.Timezone(tz));
  }

  const masters = new Map();
  const exceptions = [];
  for (const comp of root.getAllSubcomponents('vevent')) {
    const event = new ICAL.Event(comp);
    if (event.isRecurrenceException()) exceptions.push(event);
    else masters.set(event.uid, event);
  }
  for (const ex of exceptions) {
    const master = masters.get(ex.uid);
    if (master) master.relateException(ex);
    else masters.set(`${ex.uid}#${ex.recurrenceId}`, ex);
  }

  const busy = [];
  const add = (start, end, event) => {
    const s = start.toUnixTime() * 1000;
    const e = end.toUnixTime() * 1000;
    if (e > from && s < to && isBusy(event)) busy.push({ start: s, end: e });
  };

  for (const event of masters.values()) {
    if (!event.isRecurring()) {
      add(event.startDate, event.endDate, event);
      continue;
    }
    const it = event.iterator();
    for (let next = it.next(), n = 0; next && n < 5000; next = it.next(), n++) {
      const d = event.getOccurrenceDetails(next);
      if (d.startDate.toUnixTime() * 1000 >= to) break;
      add(d.startDate, d.endDate, d.item);
    }
  }
  return busy;
}

export function mergeIntervals(intervals) {
  const sorted = [...intervals].sort((a, b) => a.start - b.start);
  const out = [];
  for (const iv of sorted) {
    const last = out[out.length - 1];
    if (last && iv.start <= last.end) last.end = Math.max(last.end, iv.end);
    else out.push({ ...iv });
  }
  return out;
}

const calendarList = (value) => value.split(',').map((id) => id.trim()).filter(Boolean);

export function createHandler({ fetchImpl = fetch, now = Date.now, cache = null } = {}) {
  async function build(env) {
    const from = now();
    const to = from + WINDOW_DAYS * 86400_000;
    const sources = [
      () => googleBusy(env, calendarList(env.GOOGLE_CALENDARS_PERSONAL), env.GOOGLE_REFRESH_PERSONAL, from, to, fetchImpl),
      () => googleBusy(env, calendarList(env.GOOGLE_CALENDARS_ACTS2), env.GOOGLE_REFRESH_ACTS2, from, to, fetchImpl, calendarList(env.GOOGLE_SKIP_ALL_DAY ?? '')),
      async () => {
        const res = await fetchImpl(env.OUTLOOK_ICS_URL);
        if (!res.ok) throw new Error(`outlook ics ${res.status}`);
        return icsBusy(await res.text(), from, to);
      },
    ];
    const results = await Promise.allSettled(sources.map((s) => s()));
    const busy = [];
    let incomplete = false;
    results.forEach((r, i) => {
      if (r.status === 'fulfilled') busy.push(...r.value);
      else {
        incomplete = true;
        console.error(`source ${i} failed:`, r.reason?.message);
      }
    });
    const clipped = mergeIntervals(busy)
      .map((b) => ({ start: Math.max(b.start, from), end: Math.min(b.end, to) }))
      .filter((b) => b.end > b.start);
    return {
      generatedAt: new Date(from).toISOString(),
      from: new Date(from).toISOString(),
      to: new Date(to).toISOString(),
      incomplete,
      busy: clipped.map((b) => ({
        start: new Date(b.start).toISOString(),
        end: new Date(b.end).toISOString(),
      })),
    };
  }

  return {
    async fetch(request, env, ctx) {
      const url = new URL(request.url);
      if (url.pathname !== '/schedule/busy.json') return new Response('Not found', { status: 404 });
      if (request.method !== 'GET') return new Response('Method not allowed', { status: 405 });

      const key = new Request(url.origin + url.pathname);
      const hit = cache && (await cache.match(key));
      if (hit) return hit;

      const body = await build(env);
      const res = new Response(JSON.stringify(body), { headers: JSON_HEADERS });
      // A partial answer is not cached, so the next request retries the failed source.
      if (cache && !body.incomplete) ctx?.waitUntil(cache.put(key, res.clone()));
      return res;
    },
  };
}
