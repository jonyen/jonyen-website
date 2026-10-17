-- One row per UTC day: how many quips were generated. The daily cap reads it.
-- Apply once: npx wrangler d1 execute jonyen-quip --remote --file=schema.sql
CREATE TABLE IF NOT EXISTS daily_count (
  day TEXT PRIMARY KEY,
  n INTEGER NOT NULL
);

-- Quips per visitor per minute, the exact backstop behind the rate-limit
-- binding. ip is a truncated SHA-256 of the address, never the address itself;
-- rows older than a few minutes are pruned.
CREATE TABLE IF NOT EXISTS ip_minute (
  ip TEXT NOT NULL,
  minute INTEGER NOT NULL,
  n INTEGER NOT NULL,
  PRIMARY KEY (ip, minute)
);

-- Every line Workers AI generated, kept or not, logged by the Worker. No
-- visitor data: no IPs, user agents or the visitor's recent lines. Rows older
-- than 180 days are deleted as new ones are written. source leaves room for
-- other generators (e.g. on-device Gemini Nano) later.
CREATE TABLE IF NOT EXISTS quips (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts TEXT NOT NULL,              -- UTC ISO 8601
  source TEXT NOT NULL,          -- 'workers-ai' for now
  model TEXT,
  text TEXT,                     -- the line as generated, after whitespace/markdown clean-up
  accepted INTEGER NOT NULL,     -- 1 if shown (or offered) to the visitor
  reject_reason TEXT,            -- null, or empty | too_long | link | blocklist | starts_with_i | timeout | error
  latency_ms INTEGER,
  topic_hint TEXT,
  style_hint TEXT
);
CREATE INDEX IF NOT EXISTS quips_ts ON quips (ts);
