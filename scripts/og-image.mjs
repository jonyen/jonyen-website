// Renders scripts/og-image.html to public/og-image.png (1200x630), the
// Open Graph / Twitter card image referenced from index.html.
// Usage: node scripts/og-image.mjs   (needs network for the Fontshare fonts)
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import puppeteer from 'puppeteer';

const HERE = dirname(fileURLToPath(import.meta.url));
const TEMPLATE = join(HERE, 'og-image.html');
const OUT = join(HERE, '..', 'public', 'og-image.png');

const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(TEMPLATE).href, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: OUT, type: 'png' });
  console.log(`wrote ${OUT}`);
} finally {
  await browser.close();
}
