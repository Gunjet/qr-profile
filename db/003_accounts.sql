-- Self-service accounts: users log in with phone + password, own one profile,
-- and submit payment requests that an admin confirms.

CREATE TABLE IF NOT EXISTS users (
  id            text PRIMARY KEY,
  phone         text NOT NULL UNIQUE,
  name          text NOT NULL,
  password_hash text NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash text PRIMARY KEY,           -- sha256 of the cookie token
  user_id    text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions (user_id);

-- NULL owner = profile created by an admin.
ALTER TABLE people ADD COLUMN IF NOT EXISTS owner_id text UNIQUE REFERENCES users(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS payment_requests (
  id         bigserial PRIMARY KEY,
  person_id  text NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  months     integer NOT NULL CHECK (months > 0),
  amount     integer NOT NULL CHECK (amount >= 0),
  status     text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  decided_at timestamptz
);
-- At most one open request per profile.
CREATE UNIQUE INDEX IF NOT EXISTS payment_requests_one_pending
  ON payment_requests (person_id) WHERE status = 'pending';
