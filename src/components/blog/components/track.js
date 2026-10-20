// GoatCounter custom events for the memoji easter egg. Each event's path is
// its name (no leading "/"), so it never touches the "/" pageview count that
// visitorCount.js reads. Nothing personal is sent: a path and a title.
//
// count.js loads async, so an event that comes in before it has arrived waits
// in a short queue and is sent when the script loads. If the script is blocked
// (ad blockers), events are dropped. Nothing here throws or blocks the page.
//
// GoatCounter answers 429 to more than about 4 requests a second from one IP,
// and one memoji click makes up to three events. So events go out one at a
// time, SEND_GAP_MS apart, leaving room for the pageview count.js sends itself.
// A full queue drops new events rather than letting them pile up.

const QUEUE_MAX = 20;
const SEND_GAP_MS = 500;
let queue = [];
let waiting = false;
let timer = null;
let lastSent = -Infinity;
const once = new Set();

const send = (path, title) => {
  try {
    window.goatcounter.count({ path, title, event: true });
  } catch {
    // Analytics must never break the page.
  }
};

// Send the next queued event once the gap since the last one has passed.
const drain = () => {
  timer = null;
  if (!queue.length || !window.goatcounter?.count) return;
  const wait = lastSent + SEND_GAP_MS - Date.now();
  if (wait > 0) {
    timer = setTimeout(drain, wait);
    return;
  }
  const [path, title] = queue.shift();
  lastSent = Date.now();
  send(path, title);
  if (queue.length) timer = setTimeout(drain, SEND_GAP_MS);
};

export function track(path, title = path) {
  if (typeof window === 'undefined') return;
  if (queue.length < QUEUE_MAX) queue.push([path, title]);
  if (window.goatcounter?.count) {
    if (!timer) drain();
    return;
  }
  if (waiting) return;
  const script = document.querySelector('script[data-goatcounter]');
  if (!script) return;
  waiting = true;
  script.addEventListener('load', drain, { once: true });
}

// Like track(), but at most once per page view.
export function trackOnce(path, title) {
  if (once.has(path)) return;
  once.add(path);
  track(path, title);
}

// For tests: forget queued events, timers and once-only paths.
export function resetTracking() {
  clearTimeout(timer);
  queue = [];
  waiting = false;
  timer = null;
  lastSent = -Infinity;
  once.clear();
}
