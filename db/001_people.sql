-- People profiles. The whole profile (except id/timestamps) lives in `data` (jsonb).
CREATE TABLE IF NOT EXISTS people (
  id         text PRIMARY KEY,
  data       jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS people_created_at_idx ON people (created_at DESC);
