/**
 * @module getContent
 * @description Main content aggregation module that fetches and processes
 * trailer data from all configured YouTube channels.
 *
 * This module is the core of the Movie-Trailers application, responsible for:
 * - Validating the YouTube API key
 * - Fetching trailers from all configured channels in parallel
 * - Deduplicating and sorting results
 * - Caching results to reduce API calls
 *
 * @example
 * const getContent = require('./getContent');
 *
 * // Fetch trailers (uses cache if available)
 * const trailers = await getContent();
 *
 * // Force refresh (skip cache)
 * const freshTrailers = await getContent(true);
 *
 * // Clear cache manually
 * getContent.clearCache();
 */

const channelList = require('./data/channels');
const getData = require('./getData');
const { compareDesc, parseISO } = require('date-fns');
const cache = require('./utils/cache');
const logger = require('./utils/logger');
const config = require('./config');
const youtubeApi = require('./services/youtubeApi');
const { CACHE_KEYS } = require('./constants');

/**
 * In-flight request promise for request deduplication.
 * Prevents duplicate API calls when concurrent requests arrive before cache is set.
 * @type {Promise<Trailer[]|APIValidationResult>|null}
 * @private
 */
let inFlightRequest = null;

/**
 * @typedef {Object} Trailer
 * @property {string} channel - Studio/channel name
 * @property {string} name - Trailer title
 * @property {string} date - Formatted date string
 * @property {string} dateString - ISO 8601 date string for sorting
 * @property {string} link - YouTube video ID
 * @property {string} thumbnail - Thumbnail URL
 */

/**
 * @typedef {Object} APIValidationResult
 * @property {boolean} apiValid - Whether the API key is valid
 * @property {Object|null} error - Error details if validation failed
 * @property {string} [error.message] - Error message
 */

/**
 * @typedef {Object} FetchStats
 * @property {number} totalChannels - Total number of channels attempted
 * @property {number} successfulChannels - Number of channels that returned data
 * @property {number} failedChannels - Number of channels that failed
 * @property {number} totalTrailers - Total trailers found
 * @property {number} duplicatesRemoved - Number of duplicate trailers removed
 * @property {number} durationMs - Time taken to fetch in milliseconds
 */

/**
 * Fetches data for a single channel with error handling.
 * Wraps getData to ensure errors don't propagate and break parallel fetching.
 *
 * @private
 * @async
 * @param {string} channelID - YouTube channel ID
 * @param {string} channelName - Channel display name
 * @returns {Promise<Trailer[]>} Array of trailers or empty array on error
 */
const fetchChannelData = async (channelID, channelName) => {
  try {
    const result = await getData(channelID, channelName);
    return result || [];
  } catch (error) {
    logger.error(`Error fetching data for ${channelName}`, {
      channelID,
      error: error.message
    });
    return [];
  }
};

/**
 * Validates the YouTube API key by making a test request.
 * Uses the YouTube API service for consistent error handling.
 *
 * @async
 * @returns {Promise<APIValidationResult>} Validation result with status and error details
 *
 * @example
 * const validation = await checkIfYTkeyisValid();
 * if (!validation.apiValid) {
 *   console.error('API key invalid:', validation.error.message);
 * }
 */
const checkIfYTkeyisValid = async () => {
  return youtubeApi.validateApiKey();
};

/**
 * Sorts trailers by date in descending order (newest first).
 *
 * @private
 * @param {Trailer[]} trailers - Array of trailer objects
 * @returns {Trailer[]} Sorted array of trailers
 */
const sortByDate = (trailers) => {
  return trailers.sort((a, b) => {
    try {
      const dateA = parseISO(a.dateString);
      const dateB = parseISO(b.dateString);
      return compareDesc(dateA, dateB);
    } catch (error) {
      logger.error('Error sorting dates', {
        error: error.message,
        dateA: a.dateString,
        dateB: b.dateString
      });
      return 0;
    }
  });
};

/**
 * Removes duplicate trailers based on channel and title.
 * Keeps the first occurrence (newest, since array is pre-sorted).
 *
 * @private
 * @param {Trailer[]} trailers - Sorted array of trailer objects
 * @returns {Trailer[]} Deduplicated array of trailers
 */
const deduplicateTrailers = (trailers) => {
  const seen = new Map();
  return trailers.filter((trailer) => {
    const key = `${trailer.channel}:${trailer.name}`;
    if (seen.has(key)) {
      logger.debug(`Removing duplicate trailer`, {
        title: trailer.name,
        channel: trailer.channel
      });
      return false;
    }
    seen.set(key, true);
    return true;
  });
};

/**
 * Internal implementation of getContent that performs the actual data fetching.
 * This function is called by the public getContent wrapper which handles deduplication.
 *
 * @private
 * @async
 * @param {boolean} forceRefresh - Skip cache and force a fresh fetch
 * @returns {Promise<Trailer[]|APIValidationResult>} Array of trailers or validation error object
 */
const _fetchContent = async (forceRefresh) => {
  // Check cache first unless force refresh requested
  if (!forceRefresh) {
    const cached = cache.get(CACHE_KEYS.TRAILER_CONTENT);
    if (cached) {
      logger.info('Returning cached trailer content', {
        trailerCount: cached.length
      });
      return cached;
    }
  }

  // Validate API key before making requests
  const apiValidation = await checkIfYTkeyisValid();
  if (!apiValidation.valid) {
    return {
      apiValid: false,
      error: apiValidation.error
    };
  }

  logger.info(`Fetching trailers from ${channelList.length} channels...`);
  const startTime = Date.now();

  // Fetch from all channels in parallel
  // Using Promise.allSettled to handle individual channel failures gracefully
  const promises = channelList.map((channel) =>
    fetchChannelData(channel.channelID, channel.name)
  );

  const results = await Promise.allSettled(promises);

  // Process results, filtering out errors and empty results
  const successfulResults = results
    .filter((result) => result.status === 'fulfilled')
    .map((result) => result.value)
    .filter((videos) => Array.isArray(videos) && videos.length > 0);

  // Log statistics about failed channels
  const failedCount = results.filter(
    (result) => result.status === 'rejected'
  ).length;
  if (failedCount > 0) {
    logger.warn(`${failedCount} channels failed to fetch`, {
      failed: failedCount,
      total: channelList.length
    });
  }

  // Flatten array of arrays into single array
  const flattened = successfulResults.flat();

  // Sort by date (newest first)
  const sorted = sortByDate(flattened);

  // Remove duplicates (same title from same channel)
  const deduplicated = deduplicateTrailers(sorted);

  // Calculate and log statistics
  const duration = Date.now() - startTime;
  const duplicatesRemoved = sorted.length - deduplicated.length;

  /** @type {FetchStats} */
  const stats = {
    totalChannels: channelList.length,
    successfulChannels: successfulResults.length,
    failedChannels: failedCount,
    totalTrailers: deduplicated.length,
    duplicatesRemoved,
    durationMs: duration
  };

  logger.info(`Trailer fetch completed`, stats);

  // Cache the results
  cache.set(CACHE_KEYS.TRAILER_CONTENT, deduplicated, config.cache.ttl);

  return deduplicated;
};

/**
 * Fetches trailer content from all configured YouTube channels.
 * Implements caching, parallel fetching, deduplication, sorting, and request deduplication.
 *
 * This is the main entry point for fetching trailer data. It:
 * 1. Checks for in-flight requests to prevent duplicate API calls
 * 2. Checks the cache for existing data
 * 3. Validates the YouTube API key
 * 4. Fetches from all channels in parallel using Promise.allSettled
 * 5. Filters, sorts, and deduplicates the results
 * 6. Caches the results for future requests
 *
 * @async
 * @param {boolean} [forceRefresh=false] - Skip cache and force a fresh fetch
 * @returns {Promise<Trailer[]|APIValidationResult>} Array of trailers or validation error object
 *
 * @example
 * // Normal usage - uses cache if available
 * const trailers = await getContent();
 * if (trailers.apiValid === false) {
 *   console.error('API validation failed:', trailers.error);
 * } else {
 *   console.log(`Found ${trailers.length} trailers`);
 * }
 *
 * @example
 * // Force refresh - bypasses cache
 * const freshTrailers = await getContent(true);
 */
const getContent = async (forceRefresh = false) => {
  try {
    // Request deduplication: if there's already a request in flight, return its promise
    // This prevents duplicate API calls when concurrent requests arrive before cache is set
    if (inFlightRequest && !forceRefresh) {
      logger.debug('Returning in-flight request promise (request deduplication)');
      return inFlightRequest;
    }

    // Create and store the promise for the fetch operation
    inFlightRequest = _fetchContent(forceRefresh);

    // Wait for the result
    const result = await inFlightRequest;

    // Clear the in-flight request
    inFlightRequest = null;

    return result;
  } catch (error) {
    // Clear the in-flight request on error
    inFlightRequest = null;

    logger.error('Error in getContent', {
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
};

/**
 * Clears the trailer content cache.
 * Use this to force a fresh fetch on the next request.
 *
 * @returns {void}
 *
 * @example
 * // Clear cache before fetching
 * getContent.clearCache();
 * const freshTrailers = await getContent();
 */
const clearCache = () => {
  cache.del(CACHE_KEYS.TRAILER_CONTENT);
  logger.info('Trailer cache cleared');
};

/**
 * Gets current cache statistics.
 *
 * @returns {Object} Cache statistics including hits, misses, and keys
 *
 * @example
 * const stats = getContent.getCacheStats();
 * console.log(`Cache hit rate: ${stats.hits / (stats.hits + stats.misses) * 100}%`);
 */
const getCacheStats = () => {
  return cache.getStats();
};

module.exports = getContent;
module.exports.clearCache = clearCache;
module.exports.getCacheStats = getCacheStats;
module.exports.checkIfYTkeyisValid = checkIfYTkeyisValid;
