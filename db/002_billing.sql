-- Subscription end date per person + payment history.
ALTER TABLE people ADD COLUMN IF NOT EXISTS paid_until timestamptz;

-- Existing profiles get 30 days so nothing goes dark on deploy.
UPDATE people SET paid_until = now() + interval '30 days' WHERE paid_until IS NULL;

CREATE TABLE IF NOT EXISTS payments (
  id          bigserial PRIMARY KEY,
  person_id   text NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  months      integer NOT NULL CHECK (months > 0),
  amount      integer NOT NULL CHECK (amount >= 0),
  paid_until  timestamptz NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS payments_person_idx ON payments (person_id, created_at DESC);
