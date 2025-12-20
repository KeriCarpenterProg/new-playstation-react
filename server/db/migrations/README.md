# Database Migrations

This folder contains SQL migration scripts for updating the database schema.

## How to Run Migrations

### Option 1: Using psql (Recommended)
```bash
psql $DATABASE_URL -f server/db/migrations/001_update_youtube_id_to_array.sql
```

### Option 2: Using Node.js
```javascript
const pool = require('../config/database');
const fs = require('fs');

async function runMigration() {
  const sql = fs.readFileSync('./migrations/001_update_youtube_id_to_array.sql', 'utf8');
  await pool.query(sql);
  console.log('Migration completed!');
}

runMigration();
```

### Option 3: Manual execution
1. Connect to your database:
   ```bash
   psql $DATABASE_URL
   ```

2. Copy and paste the SQL from the migration file

3. Verify the change:
   ```sql
   \d games
   ```

## Migration History

| # | Name | Date | Description |
|---|------|------|-------------|
| 001 | update_youtube_id_to_array | 2024-12-20 | Convert youtube_id from TEXT to TEXT[] to support multiple videos per game |

## Important Notes

- **Always backup your database before running migrations in production**
- Test migrations on a development/staging environment first
- The migrations are designed to preserve existing data
- Each migration includes rollback instructions if needed

## Current Schema Changes

### games table - youtube_id column
- **Before**: `TEXT` (single video ID)
- **After**: `TEXT[]` (array of video IDs)
- **Migration**: Converts existing single values to single-element arrays
- **Default**: Empty array `[]`

