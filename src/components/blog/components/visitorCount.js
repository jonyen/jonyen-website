// Today's visitors for the memoji's visitor-count line. Fetched once per page
// view, on first use.
//
// First choice is the quip Worker's /quip/visitors: today's visitors (Eastern
// day) summed across every GoatCounter site behind jonyen.com and its
// subdomains. If that fails, fall back to the main site's own public counter.

const SITEWIDE_URL = '/quip/visitors';
const SITEWIDE_TIMEOUT_MS = 4000;

// "/" rather than TOTAL: GoatCounter caches TOTAL for ~20 min, and the
// homepage reports every route as "/", so the "/" count is the homepage total.
// The counter only takes a date; GoatCounter doesn't document which timezone
// it applies to that date.
const COUNTER_URL = 'https://jonyen-website.goatcounter.com/counter/%2F.json';

let request = null;

const asCount = (v) => Number(String(v ?? '').replace(/[^\d]/g, ''));

async function sitewide() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SITEWIDE_TIMEOUT_MS);
  try {
    const res = await fetch(new URL(SITEWIDE_URL, window.location.origin), { signal: controller.signal });
    if (!res.ok) return null;
    const n = asCount((await res.json())?.count);
    return n > 0 ? n : null;
  } finally {
    clearTimeout(timer);
  }
}

async function homepageOnly() {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date());
  const res = await fetch(`${COUNTER_URL}?start=${today}`);
  if (!res.ok) return null;
  const n = asCount((await res.json())?.count_unique);
  return n > 0 ? n : null;
}

// Resolves to the line, or null when the count is missing, zero or both
// fetches fail (the line is then left out silently).
export function visitorLine() {
  if (!request) {
    request = sitewide()
      .catch(() => null)
      .then(async (n) => {
        if (n) return `You're visitor #${n.toLocaleString('en-US')} on jonyen.com today!`;
        const home = await homepageOnly().catch(() => null);
        return home ? `You're visitor #${home.toLocaleString('en-US')} today!` : null;
      })
      .catch(() => null);
  }
  return request;
}
