// Today's unique visitors from GoatCounter's public counter, for the memoji's
// "You're visitor #N today!" line. Fetched once per page view, on first use.
// The counter only takes a date, so "today" is the Eastern date; GoatCounter
// doesn't document which timezone it applies to that date.

const COUNTER_URL = 'https://jonyen-website.goatcounter.com/counter/TOTAL.json';

let request = null;

// Resolves to the line, or null when the count is missing, zero or the fetch
// fails (the line is then left out silently).
export function visitorLine() {
  if (!request) {
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date());
    request = fetch(`${COUNTER_URL}?start=${today}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const n = Number(String(data?.count_unique ?? '').replace(/[^\d]/g, ''));
        return n > 0 ? `You're visitor #${n.toLocaleString('en-US')} today!` : null;
      })
      .catch(() => null);
  }
  return request;
}
