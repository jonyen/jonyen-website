// Uptime check for jonyen.com, run every 15 minutes by .github/workflows/monitor.yml.
// Exits non-zero (failing the workflow, which emails the repo owner) when any
// page is down or the /schedule/ busy feed has gone stale.
//
// Each URL is requested exactly as a visitor would type it. Cloudflare routes
// match on the bare path, so a cache-busting query string can land on a
// different Worker than real visitors do and hide an outage (in November 2026
// /schedule/ returned 526 while /schedule/?x=1 returned 200).

const BASE = process.env.MONITOR_BASE_URL ?? 'https://jonyen.com';
// cron-hub rebuilds busy.json every 10 minutes; the Worker treats 30 as stale.
const BUSY_MAX_AGE_MS = 30 * 60_000;
const TIMEOUT_MS = 20_000;

const PAGES = [
  { path: '/', expect: '<title>Jonathan Yen' },
  { path: '/resume/', expect: '<title>Jonathan Yen Resume' },
  { path: '/schedule/', expect: '<title>Schedule - Jonathan Yen' },
  { path: '/lastcard/', expect: '<title>Last Card' },
];

async function get(path) {
  const res = await fetch(BASE + path, {
    headers: { 'User-Agent': 'jonyen-website-monitor' },
    redirect: 'follow',
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  return { status: res.status, body: await res.text() };
}

async function checkPage({ path, expect }) {
  const { status, body } = await get(path);
  if (status !== 200) return `${path}: HTTP ${status}`;
  if (!body.includes(expect)) return `${path}: missing "${expect}"`;
  return null;
}

async function checkBusyFeed() {
  const path = '/schedule/busy.json';
  const { status, body } = await get(path);
  if (status !== 200) return `${path}: HTTP ${status}`;
  let feed;
  try {
    feed = JSON.parse(body);
  } catch {
    return `${path}: not JSON`;
  }
  const age = Date.now() - Date.parse(feed.generatedAt);
  if (!(age < BUSY_MAX_AGE_MS)) return `${path}: generatedAt ${feed.generatedAt} is stale`;
  if (feed.incomplete) return `${path}: incomplete (a calendar source is failing)`;
  return null;
}

const checks = [...PAGES.map((p) => [p.path, () => checkPage(p)]), ['/schedule/busy.json', checkBusyFeed]];
const results = await Promise.all(
  checks.map(async ([name, run]) => {
    try {
      return [name, await run()];
    } catch (err) {
      return [name, `${name}: ${err.message}`];
    }
  }),
);

let failed = 0;
for (const [name, problem] of results) {
  if (problem) {
    failed++;
    console.error(`FAIL ${problem}`);
    if (process.env.GITHUB_ACTIONS) console.log(`::error title=${name}::${problem}`);
  } else {
    console.log(`ok   ${name}`);
  }
}
process.exit(failed ? 1 : 0);
