const express = require('express');
const router = express.Router();

const { Ollama } = require('ollama');

const pool = require('../config/database');

const ollama = new Ollama({ host: 'http://localhost:11434' });
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/', async (req, res) => {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        // 1. Search for relevant games
        const relevantGames = await searchRelevantGames(message);
        const systemPrompt = buildSystemPrompt(relevantGames);

        // 2. If production, generate response using Groq
        let response;

        if (true) {
          response = await groq.chat.completions.create({
            "model": "llama-3.3-70b-versatile",
            "temperature": 1,
            "max_completion_tokens": 1024,
            "top_p": 1,
            "stream": false,
            "stop": null,
            messages: [
                { role: 'system', content: systemPrompt },
                ...conversationHistory, 
                { role: 'user', content: message }
            ],
          });
        } else {
        // 2. Generate response using Ollama
        response = await ollama.chat({
            model: 'llama3',
            messages: [
                { role: 'system', content: systemPrompt },
                ...conversationHistory, 
                { role: 'user', content: message }
            ],
            stream: false
        });
      }
      const responseContent = response?.choices?.[0]?.message?.content || response?.message?.content;

      if (!responseContent) {
        console.error('Groq response missing content:', response);
        return res.status(500).json({ error: 'Failed to generate response' });
      }

        res.json({ 
            response: responseContent, 
            gameContext: relevantGames 
        });

    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Failed to process chat message',
            details: error.message });
    } finally {
        console.log('Chat request completed');
    }
});

async function searchRelevantGames(query) {
    try {
       const lowerQuery = query.toLowerCase();

       // Extract keywords (we'll create this helper function in the next steps)
       const keywords = extractKeywords(lowerQuery);
       if(keywords.length === 0) {
        return [];
       }

      // Search across multiple fields
    const searchQuery = `
    SELECT 
      id, game_id, name, genre, platforms, 
      description, rating, aggregated_rating, 
      release_date, franchises, themes
    FROM games 
    WHERE 
      LOWER(name) LIKE ANY($1) OR
      LOWER(description) LIKE ANY($1) OR
      LOWER(storyline) LIKE ANY($1) OR
      genre::text ILIKE ANY($1) OR
      franchises::text ILIKE ANY($1) OR
      themes::text ILIKE ANY($1)
    LIMIT 5
  `;
  const searchPatterns = keywords.map(k => `%${k}%`);
  const result = await pool.query(searchQuery, [searchPatterns]);

  return result.rows;
} catch (error) {
  console.error('Game search error:', error);
  return [];
}
}

// Extract meaningful keywords from user query

function extractKeywords(query) {
    // Common words to exclude
    const stopWords = ['what', 'is', 'are', 'the', 'a', 'an', 'can', 'you', 'tell', 'me', 'about', 'should', 'i', 'play', 'game', 'games'];

    const words = query
    .toLowerCase()
    .replace(/[^\w\s]/g,'')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word));

    return [...new Set(words)];  // Remove duplicates and return unique words
}

// Build system prompt with game database context
function buildSystemPrompt(gameContext) {
    let prompt = `You are a helpful PlayStation gaming assistant.  You help users discover and learn about PlayStation games.`;

    if (gameContext && gameContext.length > 0) {
        prompt += `\n\nHere are some relevant games from the database:\n\n`;
    gameContext.forEach((game, index) => {
      prompt += `${index + 1}. **${game.name}**\n`;
      if (game.description) {
        prompt += `   Description: ${game.description.substring(0, 200)}...\n`;
      }
      if (game.genre) {
        // Normalize genre - handle both array and string formats
        const genres = Array.isArray(game.genre) ? game.genre : 
                      (typeof game.genre === 'string' ? [game.genre] : []);
        if (genres.length > 0) {
          prompt += `   Genres: ${genres.join(', ')}\n`;
        }
      }
      if (game.rating) {
        prompt += `   Rating: ${Math.round(game.rating)}/100\n`;
      }
      if (game.release_date) {
        const date = new Date(parseInt(game.release_date) * 1000);
        prompt += `   Released: ${date.getFullYear()}\n`;
      }
      prompt += `\n`;
    });

    prompt += `\nUse this information to provide accurate, helpful responses about these games.`;
} else {
  prompt += `\n\nNo specific games were found in the database. Provide general PlayStation gaming knowledge.`;
}
    return prompt;
}

module.exports = router;