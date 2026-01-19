const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Import routes
const gamesRoutes = require('./routes/games');
const commentsRoutes = require('./routes/comments');
const igdbRoutes = require('./routes/igdb');
const chatRoutes = require('./routes/chat');
const mlRoutes = require('./routes/ml');
console.log('Routes imported successfully');

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Use routes
app.use('/games', gamesRoutes);
app.use('/comments', commentsRoutes);
app.use('/chat', chatRoutes);
app.use('/igdb', igdbRoutes);
app.use('/ml', mlRoutes);
console.log('Routes mounted: /games, /comments, /chat, /igdb, /ml');

// Start server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});