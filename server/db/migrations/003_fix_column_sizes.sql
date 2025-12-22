-- Migration: Fix column size issues
-- Date: 2024-12-21
-- Description: Fix VARCHAR columns that are too small for IGDB data

-- Fix youtube_id: should be TEXT[] to support multiple videos
-- This handles the case where migration 001 didn't run or failed
ALTER TABLE games 
ALTER COLUMN youtube_id TYPE TEXT[] 
USING CASE 
  WHEN youtube_id IS NULL THEN ARRAY[]::TEXT[]
  WHEN youtube_id = '' THEN ARRAY[]::TEXT[]
  ELSE ARRAY[youtube_id]::TEXT[]
END;

ALTER TABLE games 
ALTER COLUMN youtube_id SET DEFAULT ARRAY[]::TEXT[];

-- Fix game_id: increase from VARCHAR(50) to VARCHAR(255) for longer IGDB IDs
ALTER TABLE games
ALTER COLUMN game_id TYPE VARCHAR(255);

-- Fix name: ensure it's large enough (already 255, should be fine)
-- Fix cover: ensure it's large enough for long URLs (already 500, should be fine)

-- Note: URL is already VARCHAR(500) from migration 002, which should be sufficient

