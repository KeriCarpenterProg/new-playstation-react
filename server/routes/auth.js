const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const pool = require('../config/database');
const multer = require('multer');
const { uploadUserPictureFromUrl, uploadUserPictureFromBuffer } = require('../utils/pictureUpload');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const signToken = (user) => 
    jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

const upload = multer({ storage: multer.memoryStorage() });

const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) return res.status(401).json({ error: 'Missing authorization token' });

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
        return next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
 };


router.post('/register', async (req, res) => {
    try {
      const { email, password, first_name, last_name } = req.body || {};
      if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
      if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
  
      const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (existing.rows.length) return res.status(409).json({ error: 'Email already in use' });
  
      const passwordHash = await bcrypt.hash(password, 12);
      const result = await pool.query(
        'INSERT INTO users (email, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id, email, first_name, last_name, picture_url, created_at',
        [email, passwordHash, first_name || null, last_name || null]
      );
  
      const user = result.rows[0];
      const token = signToken(user);
      return res.status(201).json({ user, token });
    } catch (err) {
      console.error('Register error:', err.message);
      return res.status(500).json({ error: 'Server error' });
    }
  });

  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body || {};
      if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  
      const result = await pool.query(
        'SELECT id, email, first_name, last_name, picture_url, password_hash FROM users WHERE email = $1',
        [email]
      );
  
      if (!result.rows.length) return res.status(401).json({ error: 'Invalid credentials' });
  
      const user = result.rows[0];
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
  
      const token = signToken(user);
      return res.status(200).json({ 
        user: { 
          id: user.id, 
          email: user.email, 
          first_name: user.first_name, 
          last_name: user.last_name,
          picture_url: user.picture_url 
        }, 
        token 
      });
    } catch (err) {
      console.error('Login error:', err.message);
      return res.status(500).json({ error: 'Server error' });
    }
  });

  router.get('/me', requireAuth, async (req, res) => {
    try {
      const result = await pool.query(
        'SELECT id, email, first_name, last_name, picture_url, created_at FROM users WHERE id = $1',
        [req.user.userId]
      );
      if (!result.rows.length) return res.status(404).json({ error: 'User not found' });
      return res.status(200).json({ user: result.rows[0] });
    } catch (err) {
      console.error('Me error:', err.message);
      return res.status(500).json({ error: 'Server error' });
    }
  });

  // Update profile picture (two-step)
  router.post('/picture', requireAuth, upload.single('picture'), async (req, res) => {
    try {
      const { picture_url } = req.body || {};

      let finalUrl = null;

      if (req.file) {
        finalUrl = await uploadUserPictureFromBuffer(
          req.file.buffer,
          req.user.userId,
          req.file.mimetype || 'image/jpeg'
        );
      } else if (picture_url && picture_url.trim()) {
        // Accept a URL for testing (e.g., randomuser.me)
        finalUrl = await uploadUserPictureFromUrl(picture_url.trim(), req.user.userId);
      } else {
        return res.status(400).json({ error: 'Provide a picture file or picture_url' });
      }

      const result = await pool.query(
        'UPDATE users SET picture_url = $1 WHERE id = $2 RETURNING id, email, first_name, last_name, picture_url, created_at',
        [finalUrl, req.user.userId]
      );

      return res.status(200).json({ user: result.rows[0] });
    } catch (err) {
      console.error('Picture update error:', err.message);
      return res.status(500).json({ error: 'Server error' });
    }
  });
  
  module.exports = router;