#!/usr/bin/env node
/**
 * Guard against leaking contact details into the published site: scans every
 * PDF in the built bundle for phone numbers and street addresses and exits
 * non-zero if any are found.
 *
 * Requires pdftotext (poppler-utils). The PDFs are Chrome-generated with
 * compressed streams, so a naive byte scan finds nothing and would pass by
 * accident — this check refuses to run rather than give a false all-clear.
 *
 * Usage: node resume/check-public.mjs [build-dir]
 */
import { readdir, stat } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const buildDir = resolve(ROOT, process.argv[2] ?? 'build');

const PATTERNS = [
  { name: 'phone number', regex: /\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}/ },
  { name: 'street address', regex: /\b\d{2,5}\s+[A-Z][a-z]+\s+(St|Street|Ave|Avenue|Rd|Road|Dr|Drive|Blvd|Ct|Way|Ln|Lane)\b/ },
];

try {
  execFileSync('pdftotext', ['-v'], { stdio: 'ignore' });
} catch {
  console.error('pdftotext not found. Install poppler-utils (brew install poppler / apt-get install poppler-utils).');
  process.exit(2);
}

try {
  await stat(buildDir);
} catch {
  console.error(`${buildDir} does not exist — build the site first.`);
  process.exit(1);
}

async function* pdfsIn(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* pdfsIn(path);
    else if (entry.name.endsWith('.pdf')) yield path;
  }
}

let checked = 0;
let failed = false;

for await (const path of pdfsIn(buildDir)) {
  checked += 1;
  const text = execFileSync('pdftotext', [path, '-'], { encoding: 'utf8' });

  for (const { name, regex } of PATTERNS) {
    const hit = text.match(regex);
    if (hit) {
      console.error(`${path.replace(`${ROOT}/`, '')}: contains a ${name} (${hit[0].trim()})`);
      failed = true;
    }
  }
}

if (failed) {
  console.error('\nPublished PDFs must not carry contact details beyond email. Aborting.');
  process.exit(1);
}

if (checked === 0) {
  console.error(`no PDFs found under ${buildDir} — the resume build did not run`);
  process.exit(1);
}

console.log(`public PDFs clean (${checked} checked): no phone numbers or street addresses found`);
