-- Run this in the Supabase SQL editor to set up the database schema.

-- Users table (replaces in-memory userService store)
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  username   TEXT NOT NULL,
  email      TEXT UNIQUE NOT NULL,
  password   TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Validation records table
CREATE TABLE IF NOT EXISTS validation_records (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  filename       TEXT NOT NULL,
  storage_path   TEXT NOT NULL,
  status         TEXT NOT NULL DEFAULT 'processing'
                 CHECK (status IN ('processing', 'complete', 'error')),
  overall_result TEXT CHECK (overall_result IN ('PASS', 'FAIL')),
  results        JSONB,
  error_message  TEXT,
  page_count     INTEGER,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Index for dashboard queries
CREATE INDEX IF NOT EXISTS idx_validation_records_user_date
  ON validation_records(user_id, created_at DESC);

-- Storage bucket setup (run in Supabase dashboard or via API):
-- 1. Create a private bucket named "batch-records"
-- 2. Enable RLS on the bucket

-- Example JSONB query to find FAIL tolerance records:
-- SELECT id, filename, results->'rules'->'tolerance_check' AS tolerance
-- FROM validation_records
-- WHERE user_id = $1
--   AND results->'rules'->'tolerance_check'->>'result' = 'FAIL';
