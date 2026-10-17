// Lines the memoji can make up on the spot with Chrome's built-in model
// (Gemini Nano, via the Prompt API). Used only when the model is already on
// the visitor's device: availability() must say "available", so a visit never
// starts a model download. Anything else falls back to the fixed sayings.

export const MODEL_CREDIT = 'Powered by Gemini Nano in Chrome, on your device';

const LM_OPTIONS = {
  expectedInputs: [{ type: 'text', languages: ['en'] }],
  expectedOutputs: [{ type: 'text', languages: ['en'] }],
};

const SYSTEM_PROMPT = [
  'You write one witty line for the speech bubble of a cartoon avatar on the personal website of',
  'Jonathan Yen, a full stack engineer in the Washington DC metro area. Speak as Jonathan, in the',
  'first person. Light, clean humour; puns welcome. Now and then (not often) a gentle Christian',
  'touch. Never mention employers or companies he has worked for, politics, or anything edgy.',
  'At most 20 words. Reply with the line only: no quotes, no emoji, no hashtags, no links, no markdown.',
].join(' ');

// Employers and other names the line must never contain.
const BLOCKLIST = /datavault|dvlt|atlassian|mercor|medallia|\bibm\b|aspera|cvent|employer/i;
const MAX_CHARS = 140;

const HOME_TZ = 'America/New_York';
const DAY_MS = 86400000;

let session = null; // Promise of a LanguageModel session, created once per page view.
let pending = null; // Promise of the next generated line.
let ready = null; // The next generated line, once it has arrived.
let off = false; // The model isn't usable on this device; stop trying.
let nextFreePhrase; // undefined: not fetched yet; null: unknown.
const recent = [];

async function modelAvailable() {
  if (!('LanguageModel' in window)) return false;
  try {
    return (await window.LanguageModel.availability(LM_OPTIONS)) === 'available';
  } catch {
    return false;
  }
}

// Start the session and fetch the first line in the background. Safe to call
// often; hover, focus and click all call it. create() may need a user gesture,
// so a refusal before the first click leaves room to try again on the click.
export function warmUp() {
  if (off || session) return;
  session = (async () => {
    if (!(await modelAvailable())) {
      off = true;
      return null;
    }
    return window.LanguageModel.create({
      ...LM_OPTIONS,
      initialPrompts: [{ role: 'system', content: SYSTEM_PROMPT }],
    });
  })().catch((err) => {
    if (err?.name === 'NotAllowedError') session = null;
    else off = true;
    return null;
  });
  prefetch();
}

// The next generated line if one is waiting, else null. Taking it starts the
// next one, so the following click has a line ready too.
export function takeModelLine() {
  if (!ready) return null;
  const line = ready;
  ready = null;
  prefetch();
  return line;
}

function prefetch() {
  if (off || pending || ready) return;
  pending = generate()
    .then((line) => {
      if (line) ready = line;
    })
    .catch(() => {})
    .finally(() => {
      pending = null;
    });
}

async function generate() {
  const base = await session;
  if (!base) return null;
  // Each line comes from a fresh clone, so the conversation never grows.
  const s = await base.clone();
  try {
    const raw = await s.prompt(await promptText());
    const line = clean(raw);
    if (line) {
      recent.push(line);
      if (recent.length > 5) recent.shift();
    }
    return line;
  } finally {
    s.destroy();
  }
}

async function promptText() {
  const now = new Date();
  const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(now);
  const hour = now.getHours();
  const part = hour < 5 ? 'late night' : hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : hour < 21 ? 'evening' : 'night';
  const lines = [`It is ${weekday} ${part} for the visitor.`];
  const free = await nextFree();
  if (free) lines.push(`Jonathan's next free slot: ${free}.`);
  if (recent.length) lines.push(`Don't repeat these: ${recent.join(' / ')}`);
  lines.push('Write one new line.');
  return lines.join('\n');
}

// Quotes, markdown and stray whitespace come off; anything too long, empty,
// link-like or on the blocklist is dropped so a fixed saying shows instead.
export function clean(raw) {
  if (typeof raw !== 'string') return null;
  let line = raw
    .replace(/[*_`#>~]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^["'“”‘’]+|["'“”‘’]+$/g, '')
    .trim();
  if (!line || line.length > MAX_CHARS) return null;
  if (/https?:|www\.|\]\(|\.(com|org|net)\b/i.test(line)) return null;
  if (BLOCKLIST.test(line)) return null;
  return line;
}

// "Tue 2pm ET" for Jonathan's next 30+ minute gap, weekdays 8am to 9pm
// Eastern, worked out from /schedule/busy.json the way the schedule page does.
async function nextFree() {
  if (nextFreePhrase !== undefined) return nextFreePhrase;
  nextFreePhrase = null;
  try {
    const res = await fetch('/schedule/busy.json');
    if (!res.ok) return null;
    const data = await res.json();
    nextFreePhrase = firstGap(
      data.busy.map((b) => [Date.parse(b.start), Date.parse(b.end)]),
      Date.parse(data.to),
    );
  } catch {
    // Leave it out of the prompt.
  }
  return nextFreePhrase;
}

function firstGap(busy, dataEnd) {
  const now = Date.now();
  const parts = (ms) =>
    Object.fromEntries(
      new Intl.DateTimeFormat('en-US', { timeZone: HOME_TZ, year: 'numeric', month: 'numeric', day: 'numeric' })
        .formatToParts(ms)
        .map((x) => [x.type, x.value]),
    );
  const p = parts(now);
  const today = Date.UTC(+p.year, p.month - 1, +p.day);
  for (let i = 0; i < 14; i++) {
    const day = new Date(today + i * DAY_MS);
    if (day.getUTCDay() % 6 === 0) continue;
    const start = Math.max(zoned(day, 8), now);
    const end = Math.min(zoned(day, 21), dataEnd);
    let cursor = start;
    for (const [s, e] of busy.filter(([s, e]) => e > start && s < end).sort((a, b) => a[0] - b[0])) {
      if (s - cursor >= 30 * 60000) break;
      cursor = Math.max(cursor, e);
    }
    if (end - cursor >= 30 * 60000) return label(cursor, i === 0);
  }
  return null;
}

// UTC instant of wall-clock h:00 Eastern on the given UTC-midnight day.
function zoned(day, h) {
  const guess = Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), h);
  const offset = (ms) => {
    const q = Object.fromEntries(
      new Intl.DateTimeFormat('en-US', {
        timeZone: HOME_TZ, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
      })
        .formatToParts(ms)
        .map((x) => [x.type, x.value]),
    );
    return Date.UTC(q.year, q.month - 1, q.day, q.hour, q.minute, q.second) - Math.floor(ms / 1000) * 1000;
  };
  return guess - offset(guess - offset(guess));
}

function label(ms, isToday) {
  // Round up to the next half hour so the phrase reads like a bookable time.
  const t = Math.ceil(ms / 1800000) * 1800000;
  const q = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', { timeZone: HOME_TZ, weekday: 'short', hour: 'numeric', minute: '2-digit', hour12: true })
      .formatToParts(t)
      .map((x) => [x.type, x.value]),
  );
  const time = `${q.hour}${q.minute === '00' ? '' : `:${q.minute}`}${q.dayPeriod.toLowerCase()}`;
  return `${isToday ? 'today' : q.weekday} ${time} ET`;
}
