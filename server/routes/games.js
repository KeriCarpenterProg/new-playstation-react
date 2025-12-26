const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get all games
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM games ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Database error:', err.message);
    // Return empty array - frontend will use its local fallback data
    res.status(200).json([]);
  }
});

// Get a single game by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM games WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Game not found');
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Database error:', err.message);
    // Return 404 - frontend will use its local fallback data
    res.status(404).send('Game not found');
  }
});

// POST a new game
router.post('/', async (req, res) => {  
  try {
    const { name, image, elevation, featured, description, genre, platforms, release_date, screenshots, youtube_id } = req.body;

    const result = await pool.query(
      'INSERT INTO games (name, image, elevation, featured, description, genre, platforms, release_date, screenshots, youtube_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [name, image, elevation, featured, description, genre, platforms, release_date, screenshots, youtube_id]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating game: ',err.message);
    res.status(500).send('Server Error');   
  }
});

// DELETE a game by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM games WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    res.status(200).json({ 
      message: 'Game deleted successfully',
      game: result.rows[0]
    });
  } catch (err) {
    console.error('Error deleting game:', err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;