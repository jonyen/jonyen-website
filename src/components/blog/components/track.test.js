import { vi } from 'vitest';
import { resetTracking, track, trackOnce } from './track';

describe('track', () => {
  let count;

  beforeEach(() => {
    vi.useFakeTimers();
    resetTracking();
    count = vi.fn();
    window.goatcounter = { count };
  });

  afterEach(() => {
    delete window.goatcounter;
    vi.useRealTimers();
  });

  const paths = () => count.mock.calls.map(([arg]) => arg.path);

  it('sends a lone event at once', () => {
    track('memoji-click', 'Memoji: bubble shown');
    expect(count).toHaveBeenCalledWith({ path: 'memoji-click', title: 'Memoji: bubble shown', event: true });
  });

  it('spaces a burst out to stay under GoatCounter\'s rate limit', () => {
    trackOnce('memoji-open', 'Memoji: first bubble');
    track('memoji-click');
    track('memoji-line-fixed');
    expect(paths()).toEqual(['memoji-open']);
    vi.advanceTimersByTime(499);
    expect(paths()).toEqual(['memoji-open']);
    vi.advanceTimersByTime(1);
    expect(paths()).toEqual(['memoji-open', 'memoji-click']);
    vi.advanceTimersByTime(500);
    expect(paths()).toEqual(['memoji-open', 'memoji-click', 'memoji-line-fixed']);
  });

  it('keeps every event of rapid clicking at least 500ms apart', () => {
    const times = [];
    count.mockImplementation(() => times.push(Date.now()));
    for (let i = 0; i < 10; i += 1) {
      track('memoji-click');
      track('memoji-line-fixed');
      vi.advanceTimersByTime(300);
    }
    vi.advanceTimersByTime(20000);
    expect(times).toHaveLength(20);
    const gaps = times.slice(1).map((t, i) => t - times[i]);
    expect(Math.min(...gaps)).toBeGreaterThanOrEqual(500);
  });

  it('drops events once 20 are waiting', () => {
    // The first goes out at once; the next 20 wait; the rest are dropped.
    for (let i = 0; i < 30; i += 1) track(`e${i}`);
    vi.advanceTimersByTime(60000);
    expect(count).toHaveBeenCalledTimes(21);
  });

  it('holds events until count.js has loaded', () => {
    delete window.goatcounter;
    const script = document.createElement('script');
    script.dataset.goatcounter = 'https://jonyen-website.goatcounter.com/count';
    document.head.appendChild(script);
    track('memoji-click');
    track('memoji-line-fixed');
    window.goatcounter = { count };
    script.dispatchEvent(new Event('load'));
    vi.advanceTimersByTime(500);
    expect(paths()).toEqual(['memoji-click', 'memoji-line-fixed']);
    script.remove();
  });

  it('sends trackOnce paths only once', () => {
    trackOnce('memoji-open');
    trackOnce('memoji-open');
    vi.advanceTimersByTime(5000);
    expect(paths()).toEqual(['memoji-open']);
  });
});
