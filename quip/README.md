# jonyen-quip

A Cloudflare Worker that serves `GET jonyen.com/quip`: one-line quips for the memoji's speech bubble on the homepage, written by Gemma 4 on Workers AI. The page uses it when the visitor's browser has no on-device model.

- **Code:** `src/handler.js`
- **Tests:** `test/quip.test.mjs`, run with `npm run test:worker` from the repo root.
- **Bindings and limits:** `wrangler.toml`.

## Visitor count

`GET jonyen.com/quip/visitors` returns `{ count, sites, partial }`: today's visitors (Eastern day, from midnight America/New_York) summed across every GoatCounter site behind jonyen.com and its subdomains. The homepage memoji uses it for "You're visitor #N across jonyen.com today!", and falls back to the homepage's own public counter if it fails.

- **Sites:** `GOATCOUNTER_SITES` in `src/handler.js`. It mirrors `GOATCOUNTER_SITES` in `~/Projects/usage-stats/src/collectors/goatcounter.ts`; add a new site to both.
- **How it sums:** each site's `/api/v0/stats/total?start=<Eastern midnight>`, fetched in parallel with a 4-second timeout each. A site that fails is left out and `partial` is `true`; if none answer, the endpoint returns 502.
- **Caveat:** each site counts its own unique visitors, so someone who visits two sites counts twice. Ad blockers hide some visitors.
- **Cache:** the sum is cached for 5 minutes per data centre (Cache API), keyed by the day.
- **Rate limit:** 30 a minute per visitor, in the same D1 `ip_minute` table under its own salt, so it never uses up quips or the daily quip cap.
- **Secret:** `GOATCOUNTER_TOKEN`, a GoatCounter read token. The source of truth is Doppler `usage-stats/prd` `GOATCOUNTER_TOKEN`. To set or rotate it, pipe it without printing it:

  ```sh
  doppler secrets get GOATCOUNTER_TOKEN --project usage-stats --config prd --plain \
    | npx wrangler secret put GOATCOUNTER_TOKEN --config quip/wrangler.toml
  ```

  Worker secrets survive deploys, so the CI deploy job doesn't need it.

## Deploy

CI deploys on every push to `main` (job `deploy-quip`). To deploy by hand, run this from the repo root:

```sh
npx wrangler deploy --config quip/wrangler.toml
```

Always pass `--config quip/wrangler.toml`. Run without it from the repo root, wrangler's auto-setup rewrites the site's `package.json`, `.gitignore` and lockfile.

The `jonyen.com/quip*` route lives outside `wrangler.toml`; it was created once with the Cloudflare API. The `*` is needed: a pattern without it doesn't match requests that have a query string.

## The quip log

Every line the model generates goes into the D1 table `quips` (database `jonyen-quip`). That includes lines that were rejected and retried. Each row records:

| Column | Meaning |
|---|---|
| `ts` | When generation started (UTC, ISO 8601) |
| `source` | `workers-ai` |
| `model` | Workers AI model ID |
| `text` | The line after whitespace and markdown clean-up; null on a timeout or error |
| `accepted` | 1 if it was returned to the page |
| `reject_reason` | null, or `empty`, `too_long`, `link`, `blocklist`, `starts_with_i`, `timeout` or `error` |
| `latency_ms` | Model call time |
| `topic_hint`, `style_hint` | The random topic and opening style in the prompt |

No visitor data is logged: no IPs, user agents or the visitor's recent lines. Logging runs after the response is sent (`ctx.waitUntil`), and a failed write is swallowed, so the log can never break a quip.

**Retention:** rows older than 180 days are deleted. There's no cron. About one log write in 50 also runs `DELETE FROM quips WHERE ts < <now − 180 days>`. That's plenty at a few hundred rows a day, and needs no extra trigger.

### Reading it

There's no public read endpoint. Use wrangler with the laptop's Cloudflare login, from the repo root:

```sh
# Latest 50 lines
npx wrangler d1 execute jonyen-quip --remote --config quip/wrangler.toml \
  --command "select ts, accepted, reject_reason, latency_ms, text from quips order by ts desc limit 50"

# Rejections by reason, last 7 days
npx wrangler d1 execute jonyen-quip --remote --config quip/wrangler.toml \
  --command "select reject_reason, count(*) n from quips where ts > strftime('%Y-%m-%dT%H:%M:%fZ','now','-7 days') group by 1 order by n desc"
```

`npm run quip:log` runs the first query.
