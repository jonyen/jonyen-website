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
 * GET /schedule/          -> the GitHub Pages page, with the stored busy.json
 *                            inlined as <script id="busy-data"> so the first
 *                            paint already shows free times
 *
 * A cron rebuilds the feed every 10 minutes into the BUSY KV namespace. KV is
 * shared by every data centre, unlike caches.default, so visitors read a
 * recent build instead of waiting on the calendar APIs. Only a missing or
 * stale build is made on request, and never for the page: it is served
 * without the inline data and fetches busy.json instead.
 *
 * If a source fails the others are still served with incomplete: true, so the
 * page can warn that some busy times may be missing. Error details stay in the
 * Worker logs.
 */
import ICAL from 'ical.js';

const WINDOW_DAYS = 31;
const CACHE_SECONDS = 600;
// Three missed cron runs before a stored build counts as absent.
const STALE_MS = 30 * 60_000;
const STORE_KEY = 'busy';
const ALL_DAY_MS = 20 * 3600_000;
const DAY_MS = 86400_000;

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  // Browsers re-check after a minute; the Worker's own cache (s-maxage) keeps
  // calendar API calls to one round per CACHE_SECONDS.
  'Cache-Control': `public, max-age=60, s-maxage=${CACHE_SECONDS}`,
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

// An ICAL.Time's wall-clock fields read as if they were UTC. No zone is more
// than 14 hours from UTC, so the real instant is within a day of this; that is
// enough to rule out occurrences far outside the window without the costly
// zone conversion in toUnixTime.
const wallMs = (t) => Date.UTC(t.year, t.month - 1, t.day, t.hour, t.minute, t.second);

/**
 * Outlook starts every VTIMEZONE rule in 1601, and ical.js expands each one
 * year by year from its DTSTART, about 4 ms per zone per request. A yearly rule
 * such as BYMONTH=11;BYDAY=1SU falls on the same day whatever year it starts
 * in, so starting it in `year` gives the same offsets from `year` + 1 on.
 */
function trimTimezone(vtimezone, year) {
  for (const sub of vtimezone.getAllSubcomponents()) {
    const prop = sub.getFirstProperty('dtstart');
    const rule = sub.getFirstPropertyValue('rrule');
    if (!prop || !rule || sub.hasProperty('rdate') || sub.getAllProperties('rrule').length !== 1) continue;
    if (rule.freq !== 'YEARLY' || rule.count || (rule.interval || 1) !== 1 || (rule.until && rule.until.year < year)) continue;
    const dtstart = prop.getFirstValue();
    if (dtstart.year >= year || (dtstart.month === 2 && dtstart.day === 29)) continue;
    const moved = dtstart.clone();
    moved.year = year;
    prop.setValue(moved);
  }
}

/**
 * How far apart a rule repeats exactly in wall-clock time, as { days } or
 * { months }, or null if the rule is not that simple. DAILY/WEEKLY rules with
 * INTERVAL, plain weekday BYDAY, WKST and UNTIL repeat every INTERVAL days or
 * weeks (BYDAY only filters the days a DAILY rule steps through).
 * MONTHLY rules with BYDAY (1WE, -1FR) or BYMONTHDAY pick the same days in
 * every month, so they repeat every INTERVAL months. COUNT, other BY* parts
 * and RDATEs all depend on where the series started.
 */
function recurrencePeriod(event) {
  const comp = event.component;
  if (comp.hasProperty('rdate') || comp.getAllProperties('rrule').length !== 1) return null;
  const rule = comp.getFirstPropertyValue('rrule');
  if (rule.count) return null;
  const interval = rule.interval || 1;
  const parts = Object.keys(rule.parts);
  if (rule.freq === 'MONTHLY') {
    if (!parts.length || parts.some((p) => p !== 'BYDAY' && p !== 'BYMONTHDAY')) return null;
    return { months: interval };
  }
  if (rule.freq !== 'DAILY' && rule.freq !== 'WEEKLY') return null;
  if (parts.some((p) => p !== 'BYDAY') || (rule.parts.BYDAY ?? []).some((d) => !/^[A-Z]{2}$/.test(d))) return null;
  return { days: rule.freq === 'WEEKLY' ? 7 * interval : interval };
}

/**
 * Where to start expanding a recurring event. Long-running series would
 * otherwise be walked from DTSTART, years of occurrences that all end before
 * the window. Jumping a whole number of periods keeps every occurrence near
 * the window identical; the jump stops two days short of the window and of any
 * exception, which could move an old occurrence into it. A monthly series
 * restarts on the 1st, so its first month keeps every day the rule picks.
 */
function expansionStart(event, from, durationMs, exceptionMs) {
  const start = event.startDate;
  const period = recurrencePeriod(event);
  if (!period || event.rangeExceptions.length) return start;
  const limit = Math.min(from - durationMs, ...exceptionMs) - 2 * DAY_MS;
  const shifted = start.clone();
  if (period.days) {
    const periods = Math.floor((limit - wallMs(start)) / (period.days * DAY_MS));
    if (periods <= 0) return start;
    shifted.adjust(periods * period.days, 0, 0, 0);
  } else {
    const limitDate = new Date(limit);
    // Months from DTSTART's month to the month before the limit's.
    const span = limitDate.getUTCFullYear() * 12 + limitDate.getUTCMonth() - (start.year * 12 + start.month - 1) - 1;
    const periods = Math.floor(span / period.months);
    if (periods <= 0) return start;
    const month = start.year * 12 + start.month - 1 + periods * period.months;
    shifted.day = 1;
    shifted.year = Math.floor(month / 12);
    shifted.month = (month % 12) + 1;
  }
  return shifted;
}

const VEVENT = /^BEGIN:VEVENT\r?\n[\s\S]*?^END:VEVENT\r?$\n?/gim;
const propertyTest = (name) => new RegExp(`^${name}[;:]`, 'im');
const IS_RECURRING = /^(?:RRULE|RDATE)[;:]/im;
const IS_EXCEPTION = propertyTest('RECURRENCE-ID');
const HAS_DURATION = propertyTest('DURATION');
const HAS_DTEND = propertyTest('DTEND');
const IS_RANGE = /^RECURRENCE-ID;[^\r\n]*RANGE=/im;
// The date of an unfolded DTSTART/DTEND/RECURRENCE-ID line, as YYYYMMDD, or
// undefined when the line is missing or folded in a way this does not follow.
const dateLine = (name) => new RegExp(`^${name}(?:;[^\r\n]*?)?:(\\d{8})(?=T|\r?$)`, 'im');
const DTSTART = dateLine('DTSTART');
const DTEND = dateLine('DTEND');
const RECURRENCE_ID = dateLine('RECURRENCE-ID');
const lineDate = (block, re) => re.exec(block)?.[1];
const unfoldedUid = (block) => /^UID:(.*(?:\r?\n[ \t].*)*)/im.exec(block)?.[1].replace(/\r?\n[ \t]/g, '').trim();
const dateKey = (ms) => new Date(ms).toISOString().slice(0, 10).replaceAll('-', '');

/**
 * Drops VEVENTs that cannot reach the window before ical.js parses them, since
 * a published feed carries months of past one-off meetings. Dates are compared
 * with two days to spare for time zones. Anything this cannot read for sure,
 * every recurring master, range exceptions, and events whose UID appears more
 * than once (they interact through the masters map) are kept.
 */
export function dropDistantEvents(text, from, to) {
  const before = dateKey(from - 2 * DAY_MS);
  const after = dateKey(to + 2 * DAY_MS);
  const blocks = text.match(VEVENT) ?? [];
  const uidCount = new Map();
  for (const block of blocks) {
    const uid = unfoldedUid(block);
    uidCount.set(uid, (uidCount.get(uid) ?? 0) + 1);
  }
  // Starts after the window, or (if it has a readable end) ends before it.
  const startsAfter = (block) => lineDate(block, DTSTART) > after;
  const endsBefore = (block) => {
    if (HAS_DURATION.test(block)) return false;
    // Without DTEND the event ends at DTSTART, or a day later for a DATE.
    const last = HAS_DTEND.test(block) ? lineDate(block, DTEND) : lineDate(block, DTSTART);
    return last !== undefined && last < before;
  };
  return text.replace(VEVENT, (block) => {
    if (IS_RECURRING.test(block)) return block;
    if (IS_EXCEPTION.test(block)) {
      if (IS_RANGE.test(block)) return block;
      // An exception counts both where it was and where it moved to. One that
      // moved an old occurrence past the window still ends the expansion
      // there, so it is kept.
      const rid = lineDate(block, RECURRENCE_ID);
      if (rid > after && startsAfter(block)) return '';
      if (rid < before && endsBefore(block)) return '';
      return block;
    }
    const uid = unfoldedUid(block);
    if (uid === undefined || uidCount.get(uid) !== 1) return block;
    return startsAfter(block) || endsBefore(block) ? '' : block;
  });
}

/** Expands an ICS feed (recurrences, exceptions, VTIMEZONEs) into busy intervals. */
export function icsBusy(text, from, to) {
  const root = new ICAL.Component(ICAL.parse(dropDistantEvents(text, from, to)));
  const recentYear = new Date(from).getUTCFullYear() - 2;
  for (const tz of root.getAllSubcomponents('vtimezone')) {
    trimTimezone(tz, recentYear);
    ICAL.TimezoneService.register(new ICAL.Timezone(tz));
  }

  const masters = new Map();
  const exceptions = [];
  for (const comp of root.getAllSubcomponents('vevent')) {
    const event = new ICAL.Event(comp, { exceptions: [] });
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
      const { startDate, endDate } = event;
      if (wallMs(endDate) + DAY_MS > from && wallMs(startDate) - DAY_MS < to) add(startDate, endDate, event);
      continue;
    }
    // Occurrences that end well before the window are skipped unless an
    // exception might move them into it. Exceptions that themselves end well
    // before the window cannot, so only the others are kept.
    const duration = event.duration;
    const durationMs = duration.toSeconds() * 1000;
    const related = Object.values(event.exceptions);
    const allExceptionMs = related.map((ex) => wallMs(ex.recurrenceId));
    const exceptionMs = allExceptionMs.filter((_, i) => wallMs(related[i].endDate) + DAY_MS > from);
    const canSkip = event.rangeExceptions.length === 0;
    const it = event.iterator(expansionStart(event, from, durationMs, exceptionMs));
    for (let next = it.next(), n = 0; next && n < 5000; next = it.next(), n++) {
      const wall = wallMs(next);
      if (canSkip && wall + durationMs + DAY_MS <= from && exceptionMs.every((ms) => Math.abs(ms - wall) > DAY_MS)) continue;
      let d;
      if (canSkip && allExceptionMs.every((ms) => Math.abs(ms - wall) > DAY_MS)) {
        // No exception is keyed anywhere near this occurrence, so this is what
        // getOccurrenceDetails returns, without its lookups under a UTC copy.
        const endDate = next.clone();
        endDate.addDuration(duration);
        d = { startDate: next, endDate, item: event };
      } else {
        d = event.getOccurrenceDetails(next);
      }
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

  // The last complete build as JSON text, or null if there is none or it is stale.
  async function stored(env) {
    const text = await env.BUSY?.get(STORE_KEY);
    if (!text) return null;
    return now() - Date.parse(JSON.parse(text).generatedAt) < STALE_MS ? text : null;
  }

  // Inlines the stored feed into the page. Without one, or if KV fails, the
  // page goes out as is and fetches busy.json itself.
  async function page(request, env) {
    const [res, text] = await Promise.all([fetchImpl(request), stored(env).catch(() => null)]);
    if (!text || !res.ok || !(res.headers.get('Content-Type') ?? '').startsWith('text/html')) return res;
    // "<" never appears in the feed, but escaping it keeps "</script>" out for good.
    const tag = `<script id="busy-data" type="application/json">${text.replace(/</g, '\\u003c')}</script>`;
    const html = (await res.text()).replace('</head>', `${tag}\n</head>`);
    const headers = new Headers(res.headers);
    // The body no longer matches the origin's validators, and the inline data
    // should be no older than the feed, so browsers re-fetch every visit.
    headers.delete('ETag');
    headers.delete('Last-Modified');
    headers.delete('Content-Length');
    headers.set('Cache-Control', 'no-cache');
    return new Response(html, { status: res.status, headers });
  }

  return {
    async fetch(request, env, ctx) {
      const url = new URL(request.url);
      if (url.pathname === '/schedule/') return request.method === 'GET' ? page(request, env) : fetchImpl(request);
      if (url.pathname !== '/schedule/busy.json') return new Response('Not found', { status: 404 });
      if (request.method !== 'GET') return new Response('Method not allowed', { status: 405 });

      const key = new Request(url.origin + url.pathname);
      const hit = cache && (await cache.match(key));
      if (hit) return hit;

      let text = await stored(env);
      let complete = true;
      if (!text) {
        const body = await build(env);
        text = JSON.stringify(body);
        complete = !body.incomplete;
        if (complete && env.BUSY) ctx?.waitUntil(env.BUSY.put(STORE_KEY, text));
      }
      const res = new Response(text, { headers: JSON_HEADERS });
      // A partial answer is not cached, so the next request retries the failed source.
      if (cache && complete) ctx?.waitUntil(cache.put(key, res.clone()));
      return res;
    },

    async scheduled(controller, env) {
      const body = await build(env);
      // A partial build would replace a complete one, so the last good one stays.
      if (body.incomplete) return;
      await env.BUSY.put(STORE_KEY, JSON.stringify(body));
    },
  };
}
