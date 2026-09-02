#!/usr/bin/env node
/**
 * Renders the resume data in resume/data into PDFs.
 *
 * Two variants of each resume are produced:
 *   public — no phone number; this is what ships to jonyen.com
 *   full   — includes the phone number from RESUME_PHONE; served only through
 *            expiring links by the resume-links Worker, never committed
 *
 * Usage:
 *   node resume/build.mjs --variant public --out public/resume
 *   RESUME_PHONE='(555) 555-5555' node resume/build.mjs --variant full --out dist/resume-full
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const RESUMES = ['generic', 'frontend', 'fullstack'];

function parseArgs(argv) {
  const args = { variant: 'public', out: null };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--variant') args.variant = argv[++i];
    else if (argv[i] === '--out') args.out = argv[++i];
    else throw new Error(`unknown argument: ${argv[i]}`);
  }
  if (!['public', 'full'].includes(args.variant)) {
    throw new Error(`--variant must be "public" or "full", got "${args.variant}"`);
  }
  if (!args.out) throw new Error('--out is required');
  return args;
}

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));

function contactLine(common, resume, phone) {
  const parts = [common.contact.email];
  if (phone) parts.push(phone);
  parts.push(common.contact.site, common.contact.github, common.contact.linkedin);
  parts.push(...(resume.extraContact ?? []));
  return parts.map((part) => `<span>${escapeHtml(part)}</span>`).join('');
}

function renderJob(job) {
  const subtitle = job.subtitle
    ? `<div class="job-subtitle">${escapeHtml(job.subtitle)}</div>`
    : '';
  const bullets = job.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join('');
  return `
    <div class="job">
      <div class="job-head">
        <div class="who">${escapeHtml(job.company)} <span class="role">— ${escapeHtml(job.role)}</span></div>
        <div class="dates">${escapeHtml(job.dates)}</div>
      </div>
      ${subtitle}
      <ul>${bullets}</ul>
    </div>`;
}

function renderHtml({ common, resume, css, phone }) {
  const skills = resume.skills
    .map((s) => `<dt>${escapeHtml(s.label)}</dt><dd>${escapeHtml(s.value)}</dd>`)
    .join('');
  const education = common.education.map((e) => `<li>${escapeHtml(e)}</li>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${escapeHtml(common.name)} — ${escapeHtml(resume.title)}</title>
<style>${css}</style>
</head>
<body>
  <header>
    <h1>${escapeHtml(common.name)}</h1>
    <div class="contact">${contactLine(common, resume, phone)}</div>
  </header>

  <div class="role-title">${escapeHtml(resume.title)}</div>
  <p class="summary">${escapeHtml(resume.summary)}</p>

  <h2>Skills</h2>
  <dl class="skills">${skills}</dl>

  <h2>Professional Experience</h2>
  ${resume.experience.map(renderJob).join('')}

  <h2>Education</h2>
  <ul class="education">${education}</ul>
</body>
</html>`;
}

async function main() {
  const { variant, out } = parseArgs(process.argv.slice(2));
  const phone = variant === 'full' ? process.env.RESUME_PHONE : '';

  if (variant === 'full' && !phone) {
    throw new Error('RESUME_PHONE must be set when building the full variant');
  }

  const outDir = resolve(ROOT, out);
  await mkdir(outDir, { recursive: true });

  const common = JSON.parse(await readFile(join(HERE, 'data/common.json'), 'utf8'));
  const css = await readFile(join(HERE, 'templates/resume.css'), 'utf8');

  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--font-render-hinting=none'] });
  try {
    for (const name of RESUMES) {
      const resume = JSON.parse(await readFile(join(HERE, `data/${name}.json`), 'utf8'));
      const html = renderHtml({ common, resume, css, phone });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'load' });
      const pdf = await page.pdf({ format: 'letter', printBackground: true, preferCSSPageSize: true });
      await page.close();

      const target = join(outDir, `${resume.slug}.pdf`);
      await writeFile(target, pdf);
      console.log(`${variant.padEnd(6)} ${resume.slug}.pdf  ${(pdf.length / 1024).toFixed(0)} KB`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
