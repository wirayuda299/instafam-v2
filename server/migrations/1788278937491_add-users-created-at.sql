-- Up Migration

ALTER TABLE users ADD COLUMN created_at timestamptz NOT NULL DEFAULT now();

-- Down Migration

ALTER TABLE users DROP COLUMN created_at;
