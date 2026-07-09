const { createClient } = require('redis');
const { LRUCache } = require('lru-cache');

class RedisService {
  constructor() {
    this.isRedisConnected = false;
    this.client = null;
    
    // In-memory fallback if Redis is unavailable
    this.fallbackCache = new LRUCache({
      max: 1000,
      ttl: 1000 * 60 * 60 * 24 * 7 // 7 days matching token lifecycle
    });
  }

  async connect() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    try {
      this.client = createClient({ url: redisUrl });
      this.client.on('error', (err) => {
        console.warn('⚠️ Redis client error, using in-memory fallback:', err.message);
        this.isRedisConnected = false;
      });
      await this.client.connect();
      this.isRedisConnected = true;
      console.log('🔌 Connected to Redis successfully');
    } catch (err) {
      console.warn('⚠️ Could not connect to Redis, using in-memory fallback:', err.message);
      this.isRedisConnected = false;
    }
  }

  async setRefreshToken(userId, tokenId, expirySeconds) {
    const key = `refresh_token:${userId}:${tokenId}`;
    if (this.isRedisConnected) {
      await this.client.set(key, 'true', { EX: expirySeconds });
    } else {
      this.fallbackCache.set(key, 'true', { ttl: expirySeconds * 1000 });
    }
  }

  async checkRefreshToken(userId, tokenId) {
    const key = `refresh_token:${userId}:${tokenId}`;
    if (this.isRedisConnected) {
      const val = await this.client.get(key);
      return val === 'true';
    }
    return this.fallbackCache.has(key);
  }

  async revokeRefreshToken(userId, tokenId) {
    const key = `refresh_token:${userId}:${tokenId}`;
    if (this.isRedisConnected) {
      await this.client.del(key);
    } else {
      this.fallbackCache.delete(key);
    }
  }
}

module.exports = new RedisService();
