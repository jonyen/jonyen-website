/**
 * Request handling for the expiring resume links, kept free of any bundling
 * concerns so it can be exercised directly in tests.
 *
 * Link shape:  https://jonyen.com/resume/dl/<variant>/<expiry>/<signature>
 *   variant    generic | frontend | fullstack
 *   expiry     unix seconds after which the link stops working
 *   signature  base64url HMAC-SHA256 of "<variant>.<expiry>" using LINK_SECRET
 *
 * Nothing is stored per link, so an individual link cannot be revoked; rotate
 * LINK_SECRET to invalidate every outstanding link at once.
 */

const FILENAMES = {
  generic: 'Jonathan Yen Resume.pdf',
  frontend: 'Jonathan Yen Resume (Frontend).pdf',
  fullstack: 'Jonathan Yen Resume (Full Stack).pdf',
};

const SECURITY_HEADERS = {
  'Cache-Control': 'no-store, private',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
  'X-Content-Type-Options': 'nosniff',
};

function page(status, title, message) {
  return new Response(
    `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>body{font:16px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
margin:0;display:grid;place-items:center;min-height:100vh;color:#16181d}
main{max-width:32rem;padding:2rem;text-align:center}h1{font-size:1.25rem;margin:0 0 .5rem}
p{margin:0;color:#4b5158}a{color:#0b5fff}</style></head>
<body><main><h1>${title}</h1><p>${message}</p></main></body></html>`,
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8', ...SECURITY_HEADERS } },
  );
}

const base64url = (bytes) =>
  btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

async function sign(secret, payload) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return base64url(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload)));
}

/** Constant-time comparison, so signature checking leaks no timing. */
function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

const notFound = () =>
  page(404, 'Link not found', 'Check the link you were sent, or request a new one.');

export function createHandler({ getPdf }) {
  return {
    async fetch(request, env) {
      const url = new URL(request.url);
      const match = url.pathname.match(/^\/resume\/dl\/([^/]+)\/(\d+)\/([A-Za-z0-9_-]+)\/?$/);
      if (!match) return notFound();

      const [, variant, expiryRaw, signature] = match;
      if (!Object.hasOwn(FILENAMES, variant)) return notFound();

      const expiry = Number(expiryRaw);
      const expected = await sign(env.LINK_SECRET, `${variant}.${expiry}`);
      if (!timingSafeEqual(signature, expected)) {
        return page(403, 'Link not valid', 'This download link could not be verified.');
      }

      if (Date.now() / 1000 > expiry) {
        return page(
          410,
          'Link expired',
          'This download link has expired. Ask Jonathan for a fresh one — or grab the public copy at <a href="https://jonyen.com/resume">jonyen.com/resume</a>.',
        );
      }

      const pdf = await getPdf(variant);
      if (!pdf) return page(404, 'Resume unavailable', 'This resume has not been published yet.');

      return new Response(pdf, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="${FILENAMES[variant]}"`,
          ...SECURITY_HEADERS,
        },
      });
    },
  };
}
