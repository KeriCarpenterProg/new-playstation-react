const pool = require('../config/database');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  try {
    console.log('🔄 Running database migration...\n');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, 'migrations', '001_update_youtube_id_to_array.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    // Extract only the ALTER statements (skip comments and notes)
    const statements = sql
      .split(';')
      .filter(stmt => stmt.trim().startsWith('ALTER TABLE'))
      .map(stmt => stmt.trim() + ';');
    
    console.log('Found', statements.length, 'migration statements\n');
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      await pool.query(statements[i]);
      console.log('✅ Success\n');
    }
    
    // Verify the change
    console.log('Verifying schema change...');
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'games' AND column_name = 'youtube_id'
    `);
    
    if (result.rows.length > 0) {
      console.log('✅ Migration completed successfully!\n');
      console.log('youtube_id column details:');
      console.log('  Type:', result.rows[0].data_type);
      console.log('  Nullable:', result.rows[0].is_nullable);
      console.log('  Default:', result.rows[0].column_default || 'none');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

// Check if DATABASE_URL is configured
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set');
  console.log('\nPlease set DATABASE_URL in your .env file or run:');
  console.log('  DATABASE_URL=your_connection_string node db/migrate.js');
  process.exit(1);
}

runMigration();

