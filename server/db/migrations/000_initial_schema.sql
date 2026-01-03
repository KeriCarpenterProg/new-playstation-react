-- Initial Schema Creation
-- Date: 2025-01-01
-- Description: Creates the games and comments tables

-- Create games table
CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cover VARCHAR(500),
    elevation INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT false,
    description TEXT,
    genre VARCHAR(255),
    platforms VARCHAR(255),
    release_date VARCHAR(100),
    screenshots TEXT[],
    youtube_id TEXT,
    game_id VARCHAR(50),
    summary TEXT
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    game_id INTEGER NOT NULL,
    rating INTEGER,
    text TEXT,
    author VARCHAR(255),
    date VARCHAR(100),
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_games_name ON games(name);
CREATE INDEX IF NOT EXISTS idx_games_game_id ON games(game_id);
CREATE INDEX IF NOT EXISTS idx_comments_game_id ON comments(game_id);

