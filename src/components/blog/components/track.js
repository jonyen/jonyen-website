// GoatCounter custom events for the memoji easter egg. Each event's path is
// its name (no leading "/"), so it never touches the "/" pageview count that
// visitorCount.js reads. Nothing personal is sent: a path and a title.
//
// count.js loads async, so an event that comes in before it has arrived waits
// in a short queue and is sent when the script loads. If the script is blocked
// (ad blockers), events are dropped. Nothing here throws or blocks the page.

const QUEUE_MAX = 20;
let queue = [];
let waiting = false;
const once = new Set();

const send = (path, title) => {
  try {
    window.goatcounter.count({ path, title, event: true });
  } catch {
    // Analytics must never break the page.
  }
};

const flush = () => {
  const pending = queue;
  queue = [];
  if (window.goatcounter?.count) pending.forEach(([path, title]) => send(path, title));
};

export function track(path, title = path) {
  if (typeof window === 'undefined') return;
  if (window.goatcounter?.count) {
    send(path, title);
    return;
  }
  if (queue.length < QUEUE_MAX) queue.push([path, title]);
  if (waiting) return;
  const script = document.querySelector('script[data-goatcounter]');
  if (!script) return;
  waiting = true;
  script.addEventListener('load', flush, { once: true });
}

// Like track(), but at most once per page view.
export function trackOnce(path, title) {
  if (once.has(path)) return;
  once.add(path);
  track(path, title);
}
