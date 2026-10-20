// Renders scripts/og-image.html to the 1200x630 Open Graph / Twitter card
// images: public/og-image.png (index.html) and public/schedule/og-image.png.
// Usage: node scripts/og-image.mjs   (needs network for the Google Fonts Manrope font)
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import puppeteer from 'puppeteer';

const HERE = dirname(fileURLToPath(import.meta.url));
const TEMPLATE = join(HERE, 'og-image.html');
const CARDS = [
  { query: '', out: join(HERE, '..', 'public', 'og-image.png') },
  { query: '?page=schedule', out: join(HERE, '..', 'public', 'schedule', 'og-image.png') },
];

const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  for (const { query, out } of CARDS) {
    await page.goto(pathToFileURL(TEMPLATE).href + query, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: out, type: 'png' });
    console.log(`wrote ${out}`);
  }
} finally {
  await browser.close();
}
