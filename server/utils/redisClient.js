const redis = require('redis');

// Create Redis client with Railway URL or localhost fallback
const redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Error handling
redisClient.on('error', (err) => {
    console.error('❌ Redis Client Error:', err);
});

// Connect to Redis
redisClient.connect()
    .then(() => console.log('✅ Redis connected'))
    .catch((err) => console.error('❌ Redis connection failed:', err));

module.exports = redisClient;