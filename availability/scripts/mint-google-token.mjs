/**
 * Mints a Google refresh token that can read free/busy times and nothing else
 * (scope calendar.freebusy), then stores it in Doppler without printing it.
 *
 *   doppler run --project personal --config prd -- \
 *     node availability/scripts/mint-google-token.mjs <email> <DOPPLER_KEY>
 *
 * Uses the Desktop OAuth client in SCHEDULE_GOOGLE_CLIENT_ID/_SECRET, so any
 * http://127.0.0.1:<port>/ redirect is accepted without registering it.
 */
import { createServer } from 'node:http';
import { spawn, spawnSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';

const [email, dopplerKey] = process.argv.slice(2);
if (!email || !dopplerKey) {
  console.error('usage: mint-google-token.mjs <email> <DOPPLER_KEY>');
  process.exit(2);
}
const clientId = process.env.SCHEDULE_GOOGLE_CLIENT_ID;
const clientSecret = process.env.SCHEDULE_GOOGLE_CLIENT_SECRET;
if (!clientId || !clientSecret) {
  console.error('SCHEDULE_GOOGLE_CLIENT_ID / SCHEDULE_GOOGLE_CLIENT_SECRET not set');
  process.exit(2);
}

const state = randomBytes(16).toString('hex');
const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  if (url.pathname !== '/') return res.writeHead(404).end();
  const code = url.searchParams.get('code');
  if (url.searchParams.get('state') !== state || !code) {
    res.writeHead(400).end('Sign-in failed or was cancelled.');
    console.error('error:', url.searchParams.get('error') ?? 'state mismatch');
    process.exit(1);
  }
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });
  const body = await tokenRes.json();
  if (!body.refresh_token) {
    res.writeHead(500).end('No refresh token returned.');
    console.error('token exchange failed:', body.error, body.error_description);
    process.exit(1);
  }
  if (body.scope.trim() !== 'https://www.googleapis.com/auth/calendar.freebusy') {
    console.error('unexpected scope granted:', body.scope);
    process.exit(1);
  }
  const set = spawnSync(
    'doppler',
    ['secrets', 'set', dopplerKey, '--project', 'personal', '--config', 'prd', '--silent'],
    { input: body.refresh_token, stdio: ['pipe', 'inherit', 'inherit'] },
  );
  res.writeHead(200).end('Done. You can close this tab.');
  console.log(set.status === 0 ? `stored ${dopplerKey} for ${email}` : 'doppler set failed');
  process.exit(set.status ?? 1);
});

let redirectUri;
server.listen(0, '127.0.0.1', () => {
  redirectUri = `http://127.0.0.1:${server.address().port}/`;
  const auth = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  auth.search = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/calendar.freebusy',
    access_type: 'offline',
    prompt: 'consent',
    login_hint: email,
    state,
  });
  console.log(`Open this URL signed in as ${email}:\n${auth}`);
  spawn('open', [auth.toString()], { stdio: 'ignore', detached: true });
});
