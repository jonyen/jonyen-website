import indexHtml from '../index.html?raw';

// Every module the app ships, read as text. Test files are left out because
// this one has to name the strings it looks for.
const sources = import.meta.glob(['./**/*.js', '!./**/*.test.js'], {
  query: '?raw',
  import: 'default',
  eager: true,
});

const GOATCOUNTER_TAGS = /<script\b[^>]*\bdata-goatcounter="[^"]*"[^>]*><\/script>/g;

describe('visit counting', () => {
  it('loads GoatCounter once, for the jonyen-website site, pinned by SRI', () => {
    const tags = indexHtml.match(GOATCOUNTER_TAGS) ?? [];
    expect(tags).toHaveLength(1);
    const tag = tags[0];
    expect(tag).toContain('data-goatcounter="https://jonyen-website.goatcounter.com/count"');
    expect(tag).toContain('src="https://gc.zgo.at/count.v5.js"');
    expect(tag).toContain('crossorigin="anonymous"');
    expect(tag).toContain(
      'integrity="sha384-atnOLvQb9t+jTSipvd75X2yginT4PjVbqDdlJAmxMm+wYElFmeR6EmLP5bYeoRVQ"',
    );
    // One path for every route, so a visitor who moves between pages counts once.
    const settings = tag.match(/data-goatcounter-settings='([^']*)'/);
    expect(JSON.parse(settings[1])).toEqual({ path: '/' });
  });

  it('carries no Google Analytics anywhere', () => {
    expect(indexHtml).not.toMatch(/googletagmanager|gtag|GA_TRACKING/);
    expect(Object.keys(sources).length).toBeGreaterThan(10);
    const offenders = Object.entries(sources)
      .filter(([, text]) => /googletagmanager|gtag|GA_TRACKING/.test(text))
      .map(([file]) => file);
    expect(offenders).toEqual([]);
  });
});
