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
