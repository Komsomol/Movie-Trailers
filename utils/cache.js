/**
 * @module utils/cache
 * @description In-memory cache implementation using node-cache.
 * Provides TTL-based caching for API responses to reduce YouTube API calls
 * and improve response times.
 *
 * Features:
 * - Automatic TTL expiration (default: 5 minutes)
 * - Periodic cleanup of expired keys
 * - Event logging for cache operations
 * - No cloning for better performance with large objects
 *
 * @example
 * const cache = require('./utils/cache');
 *
 * // Set a value with default TTL (5 minutes)
 * cache.set('trailers', trailerArray);
 *
 * // Set a value with custom TTL (10 minutes)
 * cache.set('trailers', trailerArray, 600);
 *
 * // Get a value (returns undefined if not found or expired)
 * const cached = cache.get('trailers');
 *
 * // Check if key exists
 * if (cache.has('trailers')) { ... }
 *
 * // Delete a specific key
 * cache.del('trailers');
 *
 * // Get cache statistics
 * const stats = cache.getStats();
 */

const NodeCache = require('node-cache');
const logger = require('./logger');
const config = require('../config');

/**
 * Cache configuration options.
 *
 * @typedef {Object} CacheOptions
 * @property {number} stdTTL - Standard TTL in seconds for all entries (default: from config or 300)
 * @property {number} checkperiod - Period in seconds for automatic delete check (default: from config or 60)
 * @property {boolean} useClones - Whether to clone values on get/set (default: false for performance)
 * @property {boolean} deleteOnExpire - Whether to delete entries on expire (default: true)
 */

/**
 * Cache statistics object.
 *
 * @typedef {Object} CacheStats
 * @property {number} hits - Number of cache hits
 * @property {number} misses - Number of cache misses
 * @property {number} keys - Current number of keys in cache
 * @property {number} ksize - Approximate key size in bytes
 * @property {number} vsize - Approximate value size in bytes
 */

/**
 * Application cache instance.
 * Configured with TTL-based expiration and performance optimizations.
 *
 * @type {NodeCache}
 *
 * @example
 * // Store trailer data
 * cache.set('trailer_content', trailers, 300);
 *
 * // Retrieve with fallback
 * const data = cache.get('trailer_content') || await fetchFreshData();
 *
 * // Multiple operations
 * cache.mset([
 *   { key: 'key1', val: 'value1', ttl: 300 },
 *   { key: 'key2', val: 'value2', ttl: 600 }
 * ]);
 *
 * // Get multiple keys
 * const values = cache.mget(['key1', 'key2']);
 */
const cache = new NodeCache({
  stdTTL: config.cache.ttl,
  checkperiod: config.cache.checkPeriod,
  useClones: false,
  deleteOnExpire: true
});

/**
 * Event handler for cache SET operations.
 * Logs when a new key is added to the cache.
 *
 * @event NodeCache#set
 * @param {string} key - The cache key that was set
 * @param {*} value - The value that was stored
 */
cache.on('set', (key, value) => {
  const itemCount = Array.isArray(value) ? value.length : 1;
  logger.debug(`Cache SET: ${key}`, {
    key,
    itemCount,
    ttl: cache.getTtl(key)
  });
});

/**
 * Event handler for cache key expiration.
 * Logs when a key expires and is removed from the cache.
 *
 * @event NodeCache#expired
 * @param {string} key - The cache key that expired
 * @param {*} value - The value that was removed
 */
cache.on('expired', (key, value) => {
  logger.debug(`Cache EXPIRED: ${key}`, { key });
});

/**
 * Event handler for cache DELETE operations.
 * Logs when a key is manually deleted from the cache.
 *
 * @event NodeCache#del
 * @param {string} key - The cache key that was deleted
 * @param {*} value - The value that was removed
 */
cache.on('del', (key, value) => {
  logger.debug(`Cache DEL: ${key}`, { key });
});

/**
 * Clears all entries from the cache.
 * Useful for forcing a refresh of all cached data.
 *
 * @function flushAll
 * @returns {void}
 *
 * @example
 * // Clear all cached data
 * cache.flushAll();
 * logger.info('Cache cleared');
 */

/**
 * Gets cache statistics.
 * Returns information about cache performance and usage.
 *
 * @function getStats
 * @returns {CacheStats} Cache statistics object
 *
 * @example
 * const stats = cache.getStats();
 * console.log(`Cache hits: ${stats.hits}, misses: ${stats.misses}`);
 * console.log(`Hit rate: ${(stats.hits / (stats.hits + stats.misses) * 100).toFixed(2)}%`);
 */

module.exports = cache;
