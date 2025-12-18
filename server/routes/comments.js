const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Get all commments
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM comments ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Database error:', err.message);
    // Return empty array - frontend will use its local fallback data
    res.status(200).json([]);
  }
});

// Get a single comment by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM comments WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Comment not found');
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Database error:', err.message);
    // Return 404 - frontend will use its local fallback data
    res.status(404).send('Comment not found');
  }
});

// POST a new comment
router.post('/', async (req, res) => {  
  try {
    const { game_id, rating, text, author, date } = req.body;

    const result = await pool.query(
      'INSERT INTO comments (game_id, rating, text, author, date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [game_id, rating, text, author, date]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating comment : ',err.message);
    res.status(500).send('Server Error');   
  }
});      

module.exports = router;