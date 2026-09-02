#!/usr/bin/env node
/**
 * Mints an expiring download link for the full resume (the variant that
 * includes the phone number).
 *
 * Usage:
 *   npm run resume:link                          # generic, 7 days
 *   npm run resume:link -- --variant fullstack --days 14
 *
 * LINK_SECRET must match the secret bound to the resume-links Worker:
 *   doppler run -p personal -c prd_resume -- npm run resume:link
 */
import { createHmac } from 'node:crypto';

const VARIANTS = ['generic', 'frontend', 'fullstack'];
const DEFAULT_DAYS = 7;
const BASE_URL = process.env.RESUME_LINK_BASE ?? 'https://jonyen.com';

function parseArgs(argv) {
  const args = { variant: 'generic', days: DEFAULT_DAYS };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--variant') args.variant = argv[++i];
    else if (argv[i] === '--days') args.days = Number(argv[++i]);
    else throw new Error(`unknown argument: ${argv[i]}`);
  }
  if (!VARIANTS.includes(args.variant)) {
    throw new Error(`--variant must be one of ${VARIANTS.join(', ')}`);
  }
  if (!Number.isFinite(args.days) || args.days <= 0) {
    throw new Error('--days must be a positive number');
  }
  return args;
}

const secret = process.env.LINK_SECRET;
if (!secret) {
  console.error('LINK_SECRET is not set. Run under Doppler, or export it for this shell.');
  process.exit(1);
}

const { variant, days } = parseArgs(process.argv.slice(2));
const expiry = Math.floor(Date.now() / 1000 + days * 86400);
const signature = createHmac('sha256', secret)
  .update(`${variant}.${expiry}`)
  .digest('base64url');

console.log(`${BASE_URL}/resume/dl/${variant}/${expiry}/${signature}`);
console.log(`expires ${new Date(expiry * 1000).toLocaleString()} (${days} day${days === 1 ? '' : 's'})`);
