// The shortcuts icsBusy takes to stay fast (dropping distant events unparsed,
// trimming VTIMEZONE history, starting long series near the window) must not
// change its answer. These tests compare it with a plain expansion.
import test from 'node:test';
import assert from 'node:assert/strict';
import ICAL from 'ical.js';
import { icsBusy, dropDistantEvents } from '../src/handler.js';

const DAY = 86400_000;

// The straightforward expansion icsBusy used to do: every event parsed, every
// series walked from DTSTART, zones expanded from 1601.
function plainBusy(text, from, to) {
  const root = new ICAL.Component(ICAL.parse(text));
  for (const tz of root.getAllSubcomponents('vtimezone')) ICAL.TimezoneService.register(new ICAL.Timezone(tz));
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
    const c = event.component;
    const free = c.getFirstPropertyValue('status') === 'CANCELLED' || c.getFirstPropertyValue('transp') === 'TRANSPARENT'
      || c.getFirstPropertyValue('x-microsoft-cdo-busystatus') === 'FREE';
    if (e > from && s < to && !free) busy.push({ start: s, end: e });
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

const ZONES = {
  'Pacific Standard Time': ['-0700', '-0800', 'BYDAY=1SU;BYMONTH=11', 'BYDAY=2SU;BYMONTH=3'],
  'W. Europe Standard Time': ['+0200', '+0100', 'BYDAY=-1SU;BYMONTH=10', 'BYDAY=-1SU;BYMONTH=3'],
  'AUS Eastern Standard Time': ['+1100', '+1000', 'BYDAY=1SU;BYMONTH=4', 'BYDAY=1SU;BYMONTH=10'],
};
const vtimezone = (tzid, [dst, std, toStd, toDst]) => `BEGIN:VTIMEZONE
TZID:${tzid}
BEGIN:STANDARD
DTSTART:16010101T030000
TZOFFSETFROM:${dst}
TZOFFSETTO:${std}
RRULE:FREQ=YEARLY;INTERVAL=1;${toStd}
END:STANDARD
BEGIN:DAYLIGHT
DTSTART:16010101T020000
TZOFFSETFROM:${std}
TZOFFSETTO:${dst}
RRULE:FREQ=YEARLY;INTERVAL=1;${toDst}
END:DAYLIGHT
END:VTIMEZONE
BEGIN:VTIMEZONE
TZID:India Standard Time
BEGIN:STANDARD
DTSTART:16010101T000000
TZOFFSETFROM:+0530
TZOFFSETTO:+0530
END:STANDARD
END:VTIMEZONE`;

const pad = (n) => String(n).padStart(2, '0');
const stamp = (ms) => {
  const d = new Date(ms);
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00`;
};

// A random feed of series, exceptions and one-offs around `around`.
function randomFeed(seed, around) {
  let x = seed;
  const rnd = () => ((x = (x * 1103515245 + 12345) % 2147483648) / 2147483648);
  const pick = (list) => list[Math.floor(rnd() * list.length)];
  const tzids = [...Object.keys(ZONES), 'India Standard Time'];
  const days = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
  const when = (tzid, ms) => (tzid === 'UTC' ? `:${stamp(ms)}Z` : `;TZID=${tzid}:${stamp(ms)}`);
  const events = [];
  for (let i = 0; i < 40; i++) {
    const tzid = pick([...tzids, 'UTC']);
    const start = around - Math.floor(rnd() * 4 * 365) * DAY + Math.floor(rnd() * 48) * 1800_000;
    const length = pick([1, 2, 3, 48]) * 1800_000;
    const rule = pick([
      `FREQ=DAILY;INTERVAL=${pick([1, 2, 3])}`,
      `FREQ=DAILY;INTERVAL=${pick([1, 2, 3, 5])};BYDAY=MO,TU,WE,TH,FR`,
      `FREQ=WEEKLY;INTERVAL=${pick([1, 2, 3])};BYDAY=${pick(days)},${pick(days)}`,
      `FREQ=WEEKLY;INTERVAL=2;BYDAY=${pick(days)};WKST=${pick(['MO', 'SU'])}`,
      `FREQ=WEEKLY`,
      `FREQ=MONTHLY;INTERVAL=${pick([1, 2, 3])};BYDAY=${pick(['1', '2', '-1', '4'])}${pick(days)}`,
      `FREQ=MONTHLY;BYMONTHDAY=${pick([1, 15, 29, 31, -1])}`,
      `FREQ=MONTHLY`,
      `FREQ=YEARLY`,
      `FREQ=WEEKLY;COUNT=${pick([10, 200])}`,
    ]) + (rnd() < 0.3 ? `;UNTIL=${stamp(around + Math.floor((rnd() - 0.7) * 400) * DAY)}Z` : '');
    const uid = `s${i}`;
    let body = `BEGIN:VEVENT\nUID:${uid}\nDTSTART${when(tzid, start)}\nDTEND${when(tzid, start + length)}\nRRULE:${rule}\n`;
    if (rnd() < 0.4) body += `EXDATE${when(tzid, start + Math.floor(rnd() * 900) * DAY)}\n`;
    events.push(`${body}END:VEVENT`);
    // Exceptions: keyed on a guessed occurrence, some moved into the window
    // from long before it, some moved out of it.
    for (let k = 0; k < 3; k++) {
      const rid = rnd() < 0.5 ? start + 7 * DAY * Math.floor(rnd() * 200) : around + Math.floor((rnd() - 0.3) * 60) * DAY;
      const moved = pick([rid + 3600_000, around + Math.floor(rnd() * 30) * DAY, around + 400 * DAY, rid - 30 * DAY]);
      events.push(`BEGIN:VEVENT\nUID:${uid}\nRECURRENCE-ID${when(tzid, rid)}\nDTSTART${when(tzid, moved)}\nDTEND${when(tzid, moved + length)}\nEND:VEVENT`);
    }
  }
  for (let i = 0; i < 150; i++) {
    const tzid = pick([...tzids, 'UTC']);
    const start = around + Math.floor((rnd() - 0.5) * 240) * DAY + Math.floor(rnd() * 48) * 1800_000;
    const uid = rnd() < 0.05 ? 'dup' : `o${i}`;
    const busy = pick(['BUSY', 'BUSY', 'TENTATIVE', 'FREE']);
    events.push(rnd() < 0.1
      ? `BEGIN:VEVENT\nUID:${uid}\nDTSTART;VALUE=DATE:${stamp(start).slice(0, 8)}\nDTEND;VALUE=DATE:${stamp(start + DAY).slice(0, 8)}\nX-MICROSOFT-CDO-BUSYSTATUS:${busy}\nEND:VEVENT`
      : `BEGIN:VEVENT\nUID:${uid}\nDTSTART${when(tzid, start)}\n${rnd() < 0.1 ? 'DURATION:PT90M' : `DTEND${when(tzid, start + 3600_000)}`}\nX-MICROSOFT-CDO-BUSYSTATUS:${busy}\nEND:VEVENT`);
  }
  const zones = Object.entries(ZONES).map(([tzid, z]) => vtimezone(tzid, z)).join('\n');
  return `BEGIN:VCALENDAR\nVERSION:2.0\n${zones}\n${events.join('\n')}\nEND:VCALENDAR`.replace(/\n/g, '\r\n');
}

const sorted = (busy) => [...busy].sort((a, b) => a.start - b.start || a.end - b.end);

test('matches a plain expansion on random feeds and windows', () => {
  const windows = ['2026-10-19T07:00:00Z', '2026-03-01T08:00:00Z', '2027-03-28T00:00:00Z', '2026-12-31T23:00:00Z'];
  let compared = 0;
  for (let seed = 1; seed <= 40; seed++) {
    const from = Date.parse(windows[seed % windows.length]) + seed * 3600_000;
    const text = randomFeed(seed, from);
    const to = from + 31 * DAY;
    const expected = sorted(plainBusy(text, from, to));
    assert.deepEqual(sorted(icsBusy(text, from, to)), expected, `seed ${seed}`);
    compared += expected.length;
  }
  assert.ok(compared > 1000, `only ${compared} intervals compared`);
});

test("one series' moved occurrence does not hide another series at the same time", () => {
  const ics = `BEGIN:VCALENDAR
BEGIN:VEVENT
UID:a
DTSTART:20260105T170000Z
DTEND:20260105T173000Z
RRULE:FREQ=WEEKLY;BYDAY=MO
END:VEVENT
BEGIN:VEVENT
UID:a
RECURRENCE-ID:20261019T170000Z
DTSTART:20261023T170000Z
DTEND:20261023T173000Z
END:VEVENT
BEGIN:VEVENT
UID:b
DTSTART:20260105T170000Z
DTEND:20260105T180000Z
RRULE:FREQ=WEEKLY;BYDAY=MO
END:VEVENT
END:VCALENDAR`.replace(/\n/g, '\r\n');
  const from = Date.parse('2026-10-19T00:00:00Z');
  const busy = icsBusy(ics, from, from + 7 * DAY).map((b) => new Date(b.start).toISOString());
  assert.deepEqual(busy.sort(), ['2026-10-19T17:00:00.000Z', '2026-10-23T17:00:00.000Z']);
});

test('trimmed time zones give the same offset for every hour from the next year on', () => {
  const zones = Object.entries(ZONES).map(([tzid, z]) => vtimezone(tzid, z)).join('\n');
  const text = `BEGIN:VCALENDAR\n${zones}\nBEGIN:VEVENT\nUID:x\nDTSTART:20260101T000000Z\nEND:VEVENT\nEND:VCALENDAR`.replace(/\n/g, '\r\n');
  const from = Date.parse('2026-06-01T00:00:00Z');
  // icsBusy trims and registers the zones under their TZIDs.
  icsBusy(text, from, from + DAY);
  const full = new ICAL.Component(ICAL.parse(text)).getAllSubcomponents('vtimezone').map((tz) => new ICAL.Timezone(tz));
  const pairs = Object.keys(ZONES).map((tzid) => [ICAL.TimezoneService.get(tzid), full.find((zone) => zone.tzid === tzid)]);
  assert.ok(pairs.every(([trimmed]) => trimmed.changes.length < 100), 'zones were trimmed');
  for (let ms = Date.UTC(2025, 0, 1); ms < Date.UTC(2031, 0, 1); ms += 3600_000) {
    const d = new Date(ms);
    const fields = { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate(), hour: d.getUTCHours() };
    for (const [trimmed, untrimmed] of pairs) {
      assert.equal(ICAL.Time.fromData(fields, trimmed).toUnixTime(), ICAL.Time.fromData(fields, untrimmed).toUnixTime(), `${trimmed.tzid} ${d.toISOString()}`);
    }
  }
});

test('dropDistantEvents keeps anything it cannot rule out', () => {
  const from = Date.parse('2026-10-19T07:00:00Z');
  const to = from + 31 * DAY;
  const ev = (lines) => `BEGIN:VEVENT\r\n${lines.join('\r\n')}\r\nEND:VEVENT\r\n`;
  const kept = (block) => dropDistantEvents(`BEGIN:VCALENDAR\r\n${block}END:VCALENDAR`, from, to).includes(block);
  // Dropped: one-offs clearly before or after the window.
  assert.equal(kept(ev(['UID:a', 'DTSTART;TZID=Pacific Standard Time:20260101T090000', 'DTEND;TZID=Pacific Standard Time:20260101T100000'])), false);
  assert.equal(kept(ev(['UID:a', 'DTSTART:20270101T090000Z', 'DTEND:20270101T100000Z'])), false);
  // Kept: near the window edge, recurring, DURATION, folded DTEND, shared UID.
  assert.equal(kept(ev(['UID:a', 'DTSTART:20261017T090000Z', 'DTEND:20261017T100000Z'])), true);
  assert.equal(kept(ev(['UID:a', 'DTSTART:20200101T090000Z', 'DTEND:20200101T100000Z', 'RRULE:FREQ=DAILY'])), true);
  assert.equal(kept(ev(['UID:a', 'DTSTART:20200101T090000Z', 'DURATION:P5000D'])), true);
  assert.equal(kept(ev(['UID:a', 'DTSTART:20200101T090000Z', 'DTEND;TZID=Pacific Standard Time:2020', ' 0101T100000'])), true);
  const twice = ev(['UID:a', 'DTSTART:20200101T090000Z', 'DTEND:20200101T100000Z']);
  assert.ok(dropDistantEvents(`BEGIN:VCALENDAR\r\n${twice}${ev(['UID:a', 'DTSTART:20261020T090000Z'])}END:VCALENDAR`, from, to).includes(twice));
  // Exceptions: kept if either the original or the moved time could matter.
  assert.equal(kept(ev(['UID:a', 'RECURRENCE-ID:20200101T090000Z', 'DTSTART:20200102T090000Z', 'DTEND:20200102T100000Z'])), false);
  assert.equal(kept(ev(['UID:a', 'RECURRENCE-ID:20200101T090000Z', 'DTSTART:20261020T090000Z', 'DTEND:20261020T100000Z'])), true);
  assert.equal(kept(ev(['UID:a', 'RECURRENCE-ID:20200101T090000Z', 'DTSTART:20280101T090000Z', 'DTEND:20280101T100000Z'])), true);
  assert.equal(kept(ev(['UID:a', 'RECURRENCE-ID;RANGE=THISANDFUTURE:20200101T090000Z', 'DTSTART:20200102T090000Z', 'DTEND:20200102T100000Z'])), true);
});
