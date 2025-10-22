import redisClient from "../../config/redis";

export class CacheService {

  /**
   * Get value from cache
   * @param {string} key - The key of the cache entry to get (e.g., "users_{id}")
   * @returns {Promise<T|null>} - Returns true if deleted successfully, false if an error occurs
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set value in cache with optional TTL (in seconds)
   * @param {string} key - The key of the cache entry to add (e.g., "users_{id}")
   * @param {any} value - The value to store in the cache (will be JSON serialized)
   * @param {number} [ttl] - Optional time-to-live in seconds before the cache entry expires
   * @returns {Promise<boolean>} - Returns true if successfully, false if an error occurs
   */
  async set(key: string, value: any, ttl?: number): Promise<boolean> {
    try {
      const serialized = JSON.stringify(value);
      if (ttl) {
        await redisClient.setEx(key, ttl, serialized);
      } else {
        await redisClient.set(key, serialized);
      }
      return true;
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete value from cache
   * @param {string} key - The key of the cache entry to delete (e.g., "users_{id}")
   * @returns {Promise<boolean>} - Returns true if successfully, false if an error occurs
   */
  async delete(key: string): Promise<boolean> {
    try {
      await redisClient.del(key);
      return true;
    } catch (error) {
      console.error(`Cache delete error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete multiple keys matching a pattern
   * @param {string} key - The key of the cache entry to delete (e.g., "users_*")
   * @returns {Promise<number>} - Returns true if successfully, false if an error occurs
   */
  async deletePattern(pattern: string): Promise<number> {
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length === 0) return 0;
      return await redisClient.del(keys);
    } catch (error) {
      console.error(`Cache delete pattern error for ${pattern}:`, error);
      return 0;
    }
  }

  /**
   * Check if key exists
   * @param {string} key - The key of the cache entry to exite (e.g., "users_{id}")
   * @returns {Promise<boolean>} - Returns true if successfully, false if an error occurs
   */
  async exists(key: string): Promise<boolean> {
    try {
      const result = await redisClient.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`Cache exists error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Set expiration time for a key
   * @param {string} key - The key of the cache entry to expire (e.g., "users_{id}")
   * @param {number} [ttl] - Optional time-to-live in seconds before the cache entry expires
   * @returns {Promise<boolean>} - Returns true if successfully, false if an error occurs
   */
  async expire(key: string, ttl: number): Promise<boolean> {
    try {
      await redisClient.expire(key, ttl);
      return true;
    } catch (error) {
      console.error(`Cache expire error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Get or set a value in the cache using the cache-aside pattern.
   *
   * If the value exists in the cache, it is returned immediately.
   * Otherwise, the provided fetch function is called to retrieve fresh data,
   * which is then stored in the cache before returning.
   *
   * @param {string} key - The key of the cache entry (e.g., "users_{id}")
   * @param {() => Promise<T>} fetchFunction - Function that fetches the data if not found in cache
   * @param {number} [ttl] - Optional time-to-live (in seconds) for the cache entry
   * @returns {Promise<T>} - The cached or freshly fetched data
   * @example
   * // Example usage:
   * const user = await cacheService.getOrSet(
   *   `user_${id}`,
   *   async () => await userRepository.findById(id),
   *   300 // cache for 5 minutes
   * );
   */
  async getOrSet<T>(
    key: string,
    fetchFunction: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    // Try to get from cache
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // If not in cache, fetch data
    const data = await fetchFunction();

    // Store in cache
    await this.set(key, data, ttl);

    return data;
  }

  /**
   * Clear all cache
   * @returns {Promise<boolean>} - Returns true if successfully, false if an error occurs
   */
  async flushAll(): Promise<boolean> {
    try {
      await redisClient.flushAll();
      return true;
    } catch (error) {
      console.error("Cache flush error:", error);
      return false;
    }
  }
}

export default new CacheService();
