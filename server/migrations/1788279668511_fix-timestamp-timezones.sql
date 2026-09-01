-- Up Migration
-- Columns were created as `timestamp` (no timezone). Postgres's session
-- timezone is UTC, so the stored wall-clock values are already UTC --
-- reinterpret them as such when widening to `timestamptz` so existing rows
-- keep their real instant instead of shifting.

ALTER TABLE posts ALTER COLUMN createdAt TYPE timestamptz USING createdAt AT TIME ZONE 'UTC';
ALTER TABLE posts ALTER COLUMN createdAt SET DEFAULT now();

ALTER TABLE messages ALTER COLUMN createdAt TYPE timestamptz USING createdAt AT TIME ZONE 'UTC';
ALTER TABLE messages ALTER COLUMN createdAt SET DEFAULT now();
ALTER TABLE messages ALTER COLUMN updatedAt TYPE timestamptz USING updatedAt AT TIME ZONE 'UTC';
ALTER TABLE messages ALTER COLUMN updatedAt SET DEFAULT now();

ALTER TABLE comments ALTER COLUMN createdAt TYPE timestamptz USING createdAt AT TIME ZONE 'UTC';
ALTER TABLE comments ALTER COLUMN createdAt SET DEFAULT now();
ALTER TABLE comments ALTER COLUMN updatedAt TYPE timestamptz USING updatedAt AT TIME ZONE 'UTC';
ALTER TABLE comments ALTER COLUMN updatedAt SET DEFAULT now();

ALTER TABLE report ALTER COLUMN reportedAt TYPE timestamptz USING reportedAt AT TIME ZONE 'UTC';
ALTER TABLE report ALTER COLUMN reportedAt SET DEFAULT now();

-- Down Migration

ALTER TABLE posts ALTER COLUMN createdAt TYPE timestamp;
ALTER TABLE posts ALTER COLUMN createdAt SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE messages ALTER COLUMN createdAt TYPE timestamp;
ALTER TABLE messages ALTER COLUMN createdAt SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE messages ALTER COLUMN updatedAt TYPE timestamp;
ALTER TABLE messages ALTER COLUMN updatedAt SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE comments ALTER COLUMN createdAt TYPE timestamp;
ALTER TABLE comments ALTER COLUMN createdAt SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE comments ALTER COLUMN updatedAt TYPE timestamp;
ALTER TABLE comments ALTER COLUMN updatedAt SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE report ALTER COLUMN reportedAt TYPE timestamp;
ALTER TABLE report ALTER COLUMN reportedAt SET DEFAULT CURRENT_TIMESTAMP;
