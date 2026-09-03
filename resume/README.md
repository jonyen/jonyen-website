# Resume

The resume is data (`data/*.json`) rendered to PDF by headless Chrome. Nothing
about it is hand-maintained in binary form, which is what makes it possible to
publish one version and hand out another.

## Two variants of every resume

| Variant | Contact line | Where it goes |
| --- | --- | --- |
| `public` | email, site, GitHub, LinkedIn | committed nowhere, rendered at build time into `public/resume/`, served from jonyen.com |
| `full` | the above **plus** the phone number from `RESUME_PHONE` | bundled into the `resume-links` Worker at deploy, reachable only through an expiring signed link |

The phone number lives in GitHub Actions secrets and in Doppler. It is not in
this repository, and `resume/check-public.mjs` fails the build if a phone number
or street address ever shows up in a published PDF.

## Three resumes

`generic` (the default at /resume), `frontend`, and `fullstack`. Each is a JSON
file under `data/`; `data/common.json` holds the name, contact handles, and
education shared by all three.

## Commands

```sh
npm run resume:public    # render the phone-free PDFs into public/resume
npm run resume:full      # render the full PDFs into dist/resume-full (needs RESUME_PHONE)
npm run resume:link      # mint an expiring download link (needs LINK_SECRET)
npm run test:worker      # unit-test the link signing and expiry logic
```

`npm run build` runs `resume:public` automatically via `prebuild`, so the
committed site and the rendered PDFs cannot drift apart.

## Editing

Edit the JSON, run `npm run resume:public`, open the PDF. Layout lives in
`templates/resume.css` — it is print CSS, so `@page` margins and `break-inside`
are the levers that matter. Push to `main` and the deploy workflow publishes.

## Sharing a resume with a phone number on it

```sh
doppler run -p personal -c prd -- npm run resume:link -- --variant fullstack --days 7
```

That prints a URL like
`https://jonyen.com/resume/dl/fullstack/1788966935/<signature>` which serves the
full PDF until the expiry passes, then returns a 410 page pointing at the public
copy.

Links are stateless signatures, not database rows: an individual link cannot be
revoked, and anyone the link is forwarded to can use it until it expires.
Rotating `RESUME_LINK_SECRET` invalidates every outstanding link at once.

## Bots

`public/robots.txt` disallows `/resume` for every crawler and blocks the known AI
training crawlers site-wide, and each redirect page carries a `noindex` meta tag.
The Worker sets `X-Robots-Tag: noindex` on the expiring downloads itself.

Two limits worth knowing:

- The PDFs cannot carry a meta tag, and GitHub Pages cannot set response headers,
  so `robots.txt` is the only signal covering them. To add a real
  `X-Robots-Tag: noindex` header, create a Cloudflare Transform Rule on
  `/resume/*` — a dashboard action.
- `robots.txt` is a request. Compliant crawlers honour it; scrapers do not.
  Actual blocking is a Cloudflare edge concern (Security > Bots, and the "Block
  AI Scrapers and Crawlers" toggle).

Disallowing `/resume` also keeps the resume out of Google. Anyone who lands on
jonyen.com still finds it; searching for it directly will not surface it. Drop
the two `Disallow: /resume` lines to reverse that.
