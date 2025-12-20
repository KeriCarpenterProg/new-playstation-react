-- Migration: Update youtube_id column to support multiple videos
-- Date: 2024-12-20
-- Description: Changes youtube_id from TEXT to TEXT[] to store multiple YouTube video IDs per game

-- Step 1: Check the current column type
-- Run: \d games to verify current schema

-- Step 2: Backup existing data (optional but recommended)
-- Run: CREATE TABLE games_backup AS SELECT * FROM games;

-- Step 3: Convert youtube_id from TEXT to TEXT[]
ALTER TABLE games 
ALTER COLUMN youtube_id TYPE TEXT[] 
USING CASE 
  WHEN youtube_id IS NULL THEN ARRAY[]::TEXT[]
  WHEN youtube_id = '' THEN ARRAY[]::TEXT[]
  ELSE ARRAY[youtube_id]::TEXT[]
END;

-- Step 4: Set default value for new rows
ALTER TABLE games 
ALTER COLUMN youtube_id SET DEFAULT ARRAY[]::TEXT[];

-- Verify the change
-- Run: \d games
-- The youtube_id column should now show as: text[]

-- Note: If you need to rollback:
-- ALTER TABLE games ALTER COLUMN youtube_id TYPE TEXT USING youtube_id[1];

