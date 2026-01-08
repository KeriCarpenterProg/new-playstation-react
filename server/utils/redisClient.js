const redis = require('redis');

// Create Redis client with Railway URL or localhost fallback
const redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Track connection state
let isConnected = false;

// Error handling
redisClient.on('error', (err) => {
    console.error('❌ Redis Client Error:', err);
    isConnected = false;
});

redisClient.on('connect', () => {
    isConnected = true;
    console.log('✅ Redis connected');
});

redisClient.on('ready', () => {
    isConnected = true;
    console.log('✅ Redis ready');
});

// Connect to Redis (don't block if it fails)
redisClient.connect()
    .catch((err) => {
        console.error('❌ Redis connection failed:', err);
        console.log('⚠️  Continuing without Redis cache...');
    });

// Export with connection check helper
module.exports = redisClient;