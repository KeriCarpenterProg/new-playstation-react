require('dotenv').config();

const pool = require('../config/database');
const fs = require('fs');
const path = require('path');

// Import the data from my React app
const GAMES = require('../../src/app/shared/GAMES').default;
const COMMENTS = require('../../src/app/shared/COMMENTS').default;

// DEBUG: Check what connection string is being used
console.log('DATABASE_URL from .env:', process.env.DATABASE_URL);

async function seedDatabase() {
  try {
    console.log('Seeding database...');

    // Clear existing data
    console.log('Clearing existing data...');
    await pool.query('DELETE FROM comments');
    await pool.query('DELETE FROM games');
    await pool.query('ALTER SEQUENCE games_id_seq RESTART WITH 1');
    await pool.query('ALTER SEQUENCE comments_id_seq RESTART WITH 1');

    // Insert games
console.log(`Inserting ${GAMES.length} games...`);
for (const game of GAMES) {
  await pool.query(
    'INSERT INTO games (id, name, cover, elevation, featured, description, genre, platforms, release_date, screenshots, youtube_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
    [
      game.id,  // Add ID to preserve 0-10
      game.name,
      game.cover,  // GAMES.js uses 'cover', not 'image'
      game.elevation || 0,
      game.featured || false,
      game.summary,  // GAMES.js uses 'summary', not 'description'
      game.genre,
      game.platforms,
      game.release,  // GAMES.js uses 'release', not 'release_date'
      game.screenshots,
      game.videos ? game.videos.map(v => v.replace('https://www.youtube.com/embed/', '')) : []  // Extract all YouTube IDs
    ]
  );
  console.log(`  ✓ Inserted: ${game.name} (ID: ${game.id})`);
}


// Insert comments
console.log(`\nInserting ${COMMENTS.length} comments...`);
let successCount = 0;
for (const comment of COMMENTS) {
  try {
    await pool.query(
      `INSERT INTO comments (id, game_id, rating, text, author, date) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        comment.id,
        comment.gameId,
        comment.rating,
        comment.text,
        comment.author,
        comment.date
      ]
    );
    successCount++;
    console.log(`  ✓ Inserted comment #${comment.id} for game ${comment.gameId}`);
  } catch (error) {
    console.log(`  ✗ Skipped comment #${comment.id} (game ${comment.gameId} doesn't exist)`);
  }
}
console.log(`\n✅ Database seeded successfully! (${GAMES.length} games, ${successCount} comments)`);


    } catch (err) {
    console.error('Error seeding database: ', err.message);
    process.exit(1);

  } finally {
    pool.end();
  }
}

seedDatabase();