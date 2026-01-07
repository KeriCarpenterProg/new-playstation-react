const express = require('express');
const router = express.Router();
const igdbService = require('../services/igdbService');
const pool = require('../config/database');
const { uploadGameImageToS3 } = require('../utils/s3Upload.js');

// Search for games on IGDB with optional filters
router.get('/search', async (req, res) => {
  try {
    const { query, limit, yearFrom, platforms, genres, minRating, minRatingCount } = req.query;
    console.log('=== IGDB Search Request Received ===');
    console.log('Query:', query || '(no query - filter only)');
    console.log('Year From:', yearFrom);
    console.log('Platforms:', platforms);
    console.log('Genres:', genres);
    console.log('Min Rating:', minRating);
    console.log('Min Rating Count:', minRatingCount);

    // Allow search with just filters, no query required
    const hasFilters = yearFrom || platforms || genres || minRating || minRatingCount;
    if (!query && !hasFilters) {
      return res.status(400).json({ error: 'Either a search query or filters are required' });
    }

    // Build filters object
    const filters = {};
    if (yearFrom) {
      filters.yearFrom = yearFrom;
    }
    if (platforms) {
      // platforms can be comma-separated string like "48,167"
      filters.platforms = platforms.split(',').map(p => p.trim());
    }
    if (genres) {
      // genres can be comma-separated string like "5,12,31"
      filters.genres = genres.split(',').map(g => g.trim());
    }
    if (minRating) {
      filters.minRating = parseFloat(minRating);
    }
    if (minRatingCount) {
      filters.minRatingCount = parseInt(minRatingCount);
    }

    console.log('Filters object:', filters);

    // Pass undefined (not empty string) if there's no query, so service can properly detect it
    const searchTerm = query && query.trim() ? query.trim() : undefined;
    const games = await igdbService.searchGames(searchTerm, limit ? parseInt(limit) : 10, filters);

    // Transform the data to match our frontend needs
    const transformedGames = games.map(game => igdbService.transformGameData(game));

    res.json(transformedGames);
  } catch (error) {
    console.error('Error searching IGDB:', error);
    res.status(500).json({ error: 'Failed to search games' });
  }
});

// Get a single game from IGDB by ID
router.get('/game/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const game = await igdbService.getGameById(parseInt(id));

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const transformedGame = igdbService.transformGameData(game);
    res.json(transformedGame);
  } catch (error) {
    console.error('Error fetching game from IGDB:', error);
    res.status(500).json({ error: 'Failed to fetch game' });
  }
});

// Import a game from IGDB into local database
router.post('/import/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch game data from IGDB
    const igdbGame = await igdbService.getGameById(parseInt(id));

    if (!igdbGame) {
      return res.status(404).json({ error: 'Game not found on IGDB' });
    }

    // Transform data to match local schema
    const gameData = igdbService.transformGameData(igdbGame);

    // Upload images to S3
    console.log('Uploading images to S3');
    if (gameData.cover) {
      gameData.cover = await uploadGameImageToS3(gameData.cover, gameData.game_id, 'cover');
    }
    if (gameData.screenshots && gameData.screenshots.length > 0) {
      gameData.screenshots = await Promise.all(gameData.screenshots.map((url, index) => uploadGameImageToS3(url, gameData.game_id, `screenshot-${index}`)));
    }
    if (gameData.artworks && gameData.artworks.length > 0) {
      gameData.artworks = await Promise.all(
        gameData.artworks.map((url, index) => 
          uploadGameImageToS3(url, gameData.game_id, `artwork-${index}`)
        )
      );
    }

    console.log('✅ Images uploaded to S3');
    // Check if game already exists in local database
    const existingGame = await pool.query(
      'SELECT * FROM games WHERE game_id = $1',
      [gameData.game_id]
    );

    if (existingGame.rows.length > 0) {
      return res.status(409).json({
        error: 'Game already exists in database',
        game: existingGame.rows[0]
      });
    }

    // Insert into local database
    const result = await pool.query(
      `INSERT INTO games (name, cover, release_date, description, storyline, genre, platforms, screenshots, artworks, youtube_id, category, game_modes, player_perspectives, rating, aggregated_rating, rating_count, total_rating_count, hypes, follows, url, themes, keywords, involved_companies, franchises, age_ratings, featured, elevation, game_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28)
       RETURNING *`,
      [
        gameData.name,
        gameData.cover,
        gameData.release_date,
        gameData.description,
        gameData.storyline,
        gameData.genre,
        gameData.platforms,
        gameData.screenshots,
        gameData.artworks,
        gameData.youtube_id,
        gameData.category,
        gameData.game_modes,
        gameData.player_perspectives,
        gameData.rating,
        gameData.aggregated_rating,
        gameData.rating_count,
        gameData.total_rating_count,
        gameData.hypes,
        gameData.follows,
        gameData.url,
        gameData.themes,
        gameData.keywords,
        JSON.stringify(gameData.involved_companies),
        gameData.franchises,
        JSON.stringify(gameData.age_ratings),
        gameData.featured,
        gameData.elevation,
        gameData.game_id
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error importing game:', error);
    res.status(500).json({ error: 'Failed to import game' });
  }
});

// Batch import multiple games
router.post('/import-batch', async (req, res) => {
  try {
    const { gameIds } = req.body;

    if (!gameIds || !Array.isArray(gameIds)) {
      return res.status(400).json({ error: 'gameIds array is required' });
    }

    const results = {
      imported: [],
      skipped: [],
      errors: []
    };

    for (const gameId of gameIds) {
      try {
        // Fetch from IGDB
        const igdbGame = await igdbService.getGameById(parseInt(gameId));

        if (!igdbGame) {
          results.errors.push({ gameId, error: 'Not found on IGDB' });
          continue;
        }

        const gameData = igdbService.transformGameData(igdbGame);

        // Upload images to S3
console.log(`Uploading images for ${gameData.name}...`);
if (gameData.cover) {
  gameData.cover = await uploadGameImageToS3(gameData.cover, gameData.game_id, 'cover');
}
if (gameData.screenshots && gameData.screenshots.length > 0) {
  gameData.screenshots = await Promise.all(
    gameData.screenshots.map((url, index) => 
      uploadGameImageToS3(url, gameData.game_id, `screenshot-${index}`)
    )
  );
}
if (gameData.artworks && gameData.artworks.length > 0) {
  gameData.artworks = await Promise.all(
    gameData.artworks.map((url, index) => 
      uploadGameImageToS3(url, gameData.game_id, `artwork-${index}`)
    )
  );
}

        // Check if exists
        const existingGame = await pool.query(
          'SELECT * FROM games WHERE game_id = $1',
          [gameData.game_id]
        );

        if (existingGame.rows.length > 0) {
          results.skipped.push({ gameId, name: gameData.name });
          continue;
        }

        // Insert
        const result = await pool.query(
          `INSERT INTO games (name, cover, release_date, description, storyline, genre, platforms, screenshots, artworks, youtube_id, category, game_modes, player_perspectives, rating, aggregated_rating, rating_count, total_rating_count, hypes, follows, url, themes, keywords, involved_companies, franchises, age_ratings, featured, elevation, game_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28)
           RETURNING *`,
          [
            gameData.name,
            gameData.cover,
            gameData.release_date,
            gameData.description,
            gameData.storyline,
            gameData.genre,
            gameData.platforms,
            gameData.screenshots,
            gameData.artworks,
            gameData.youtube_id,
            gameData.category,
            gameData.game_modes,
            gameData.player_perspectives,
            gameData.rating,
            gameData.aggregated_rating,
            gameData.rating_count,
            gameData.total_rating_count,
            gameData.hypes,
            gameData.follows,
            gameData.url,
            gameData.themes,
            gameData.keywords,
            JSON.stringify(gameData.involved_companies),
            gameData.franchises,
            JSON.stringify(gameData.age_ratings),
            gameData.featured,
            gameData.elevation,
            gameData.game_id
          ]
        );

        results.imported.push(result.rows[0]);
      } catch (error) {
        results.errors.push({ gameId, error: error.message });
      }
    }

    res.json(results);
  } catch (error) {
    console.error('Error batch importing games:', error);
    res.status(500).json({ error: 'Failed to batch import games' });
  }
});

module.exports = router;
