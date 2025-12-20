# Migration: Multiple Videos Per Game

## Summary
Updated the database to store **multiple YouTube video IDs** per game instead of just one.

## Changes Made

### 1. Backend Code
- ✅ **`server/services/igdbService.js`**: Updated `transformGameData()` to capture all videos
- ✅ **`server/db/seed.js`**: Updated to handle video arrays

### 2. Database Schema
- **Column**: `games.youtube_id`
- **Before**: `TEXT` (single video)
- **After**: `TEXT[]` (array of videos)

## How to Apply Migration

### If you have a PostgreSQL database configured:

**Option A: Run the migration script**
```bash
cd server
node db/migrate.js
```

**Option B: Manual SQL**
```bash
psql $DATABASE_URL -f server/db/migrations/001_update_youtube_id_to_array.sql
```

### If you DON'T have a database yet:
No action needed! When you set up your database, the schema will automatically support arrays.

## Testing the Changes

### 1. Test importing a game with multiple videos from IGDB
```bash
# Start the servers
npm start  # frontend
cd server && npm start  # backend

# Go to http://localhost:3000/import
# Search for and import a game that has trailers
```

### 2. Check the database
```sql
SELECT name, youtube_id FROM games WHERE youtube_id IS NOT NULL;
```

You should see arrays like: `{video_id_1, video_id_2, ...}`

### 3. Re-seed the database (optional)
```bash
cd server
node db/seed.js
```

This will populate the database with the local GAMES.js data, including the game with 8 videos (ID: 10).

## Frontend Changes (Future Enhancement)

Currently, videos aren't displayed in the UI. To display them, you could:

1. Add a video carousel to the SingleGamePage
2. Show video thumbnails in the import results
3. Create a dedicated videos section

Example:
```jsx
{game.youtube_id && game.youtube_id.length > 0 && (
  <div>
    <h3>Videos</h3>
    {game.youtube_id.map((videoId, idx) => (
      <iframe
        key={idx}
        src={`https://www.youtube.com/embed/${videoId}`}
        title={`Video ${idx + 1}`}
      />
    ))}
  </div>
)}
```

## Rollback (if needed)

If you need to revert to single video:
```sql
ALTER TABLE games 
ALTER COLUMN youtube_id TYPE TEXT 
USING youtube_id[1];
```

**Warning**: This will keep only the first video and discard the rest.

## Notes
- ✅ Existing data is preserved (converted to single-element arrays)
- ✅ Empty/null values converted to empty arrays `[]`
- ✅ No data loss during migration
- ✅ Backward compatible with import/export functions

