const dotenv = require('dotenv');
dotenv.config();

class IGDBService {
  constructor() {
    this.clientId = process.env.IGDB_CLIENT_ID;
    this.clientSecret = process.env.IGDB_CLIENT_SECRET;
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  // Get access token from Twitch
  async getAccessToken() {
    // Return cached token if still valid
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await fetch(
        `https://id.twitch.tv/oauth2/token?client_id=${this.clientId}&client_secret=${this.clientSecret}&grant_type=client_credentials`,
        { method: 'POST' }
      );

      if (!response.ok) {
        throw new Error(`Failed to get access token: ${response.statusText}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      // Set expiry to 1 hour before actual expiry for safety
      this.tokenExpiry = Date.now() + (data.expires_in - 3600) * 1000;

      console.log('IGDB access token obtained successfully');
      return this.accessToken;
    } catch (error) {
      console.error('Error getting IGDB access token:', error);
      throw error;
    }
  }

  // Make a request to IGDB API
  async makeRequest(endpoint, body) {
    const token = await this.getAccessToken();

    try {
      const response = await fetch(`https://api.igdb.com/v4/${endpoint}`, {
        method: 'POST',
        headers: {
          'Client-ID': this.clientId,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'text/plain'
        },
        body: body
      });

      if (!response.ok) {
        // Try to get error details from response
        const errorText = await response.text();
        console.error(`IGDB API error response:`, errorText);
        throw new Error(`IGDB API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error making IGDB request to ${endpoint}:`, error);
      console.error(`Request body was:`, body);
      throw error;
    }
  }

  // Search for games by name with optional filters
  async searchGames(searchTerm, limit = 10, filters = {}) {
    let query = '';
    
    // Build where clause conditions
    const conditions = [];

    // Use search ONLY if we have a non-empty search term
    // Check for null, undefined, empty string, or whitespace-only strings
    const hasSearchTerm = searchTerm != null && typeof searchTerm === 'string' && searchTerm.trim().length > 0;
    
    if (hasSearchTerm) {
      query = `search "${searchTerm.trim()}";\n`;
    }
    
    query += `fields name, cover.url, first_release_date, summary, genres.name, platforms.name, screenshots.url, videos.video_id;\n`;

    // Year filter - search for games released after a certain year
    if (filters.yearFrom) {
      const timestamp = Math.floor(new Date(`${filters.yearFrom}-01-01`).getTime() / 1000);
      conditions.push(`first_release_date >= ${timestamp}`);
    }

    // Platform filter - filter by specific platforms
    if (filters.platforms && filters.platforms.length > 0) {
      // For multiple platforms, check if game is on ANY of them
      const platformConditions = filters.platforms.map(p => `platforms = ${p}`).join(' | ');
      conditions.push(`(${platformConditions})`);
    }

    // Add where clause if we have conditions
    // Note: If no search term and no filters, this will return all games (limited by limit)
    if (conditions.length > 0) {
      query += `where ${conditions.join(' & ')};\n`;
    }

    query += `limit ${limit};`;

    console.log('=== IGDB SERVICE ===');
    console.log('Search Term:', searchTerm);
    console.log('Filters:', JSON.stringify(filters, null, 2));
    console.log('Query:', query);

    const results = await this.makeRequest('games', query);

    console.log('Results count:', results.length);
    if (results.length > 0) {
      console.log('First result:', results[0].name, results[0].first_release_date);
    }

    return results;
  }

  // Get detailed game information by IGDB game ID
  async getGameById(igdbGameId) {
    const query = `
      fields name, cover.url, first_release_date, summary, genres.name, platforms.name, screenshots.url, videos.video_id, rating, aggregated_rating;
      where id = ${igdbGameId};
    `;

    const results = await this.makeRequest('games', query);
    return results.length > 0 ? results[0] : null;
  }

  // Get multiple games by IDs
  async getGamesByIds(igdbGameIds) {
    const idsString = igdbGameIds.join(',');
    const query = `
      fields name, cover.url, first_release_date, summary, genres.name, platforms.name, screenshots.url, videos.video_id;
      where id = (${idsString});
      limit ${igdbGameIds.length};
    `;

    return await this.makeRequest('games', query);
  }

  // Transform IGDB game data to match local database schema
  transformGameData(igdbGame) {
    // Helper function to fix image URLs
    const fixImageUrl = (url) => {
      if (!url) return null;
      const fixedUrl = url.replace('t_thumb', 't_original');
      return fixedUrl.startsWith('//') ? `https:${fixedUrl}` : fixedUrl;
    };

    return {
      game_id: igdbGame.id.toString(),
      name: igdbGame.name,
      cover: fixImageUrl(igdbGame.cover?.url),
      release_date: igdbGame.first_release_date || null,
      description: igdbGame.summary || '',
      genre: igdbGame.genres?.map(g => g.name) || [],
      platforms: igdbGame.platforms?.map(p => p.name) || [],
      screenshots: igdbGame.screenshots?.map(s => fixImageUrl(s.url)) || [],
      youtube_id: igdbGame.videos?.[0]?.video_id || null,
      featured: false,
      elevation: 0
    };
  }
}

// Export a singleton instance
module.exports = new IGDBService();
