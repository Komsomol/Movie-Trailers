const channelList = require('./data/channels');
const getData = require('./getData.improved');
const { compareDesc, parseISO } = require('date-fns');
const fetch = require('node-fetch');
const cache = require('./utils/cache');
const logger = require('./utils/logger');

require('dotenv').config();

const apiKey = process.env.YT_API_KEY;
const CACHE_KEY = 'trailer_content';
const CACHE_TTL = 300; // 5 minutes

/**
 * Fetch data for a single channel with error handling
 * @param {string} channelID - YouTube channel ID
 * @param {string} channelName - Channel display name
 * @returns {Promise<Array>} Array of videos or empty array on error
 */
const hitAPI = async (channelID, channelName) => {
  try {
    const result = await getData(channelID, channelName);
    return result || [];
  } catch (error) {
    logger.error(`Error fetching data for ${channelName} (${channelID}):`, error);
    return [];
  }
};

/**
 * Validate YouTube API key by making a test request
 * @returns {Promise<Object>} Object with apiValid boolean and error details
 */
const checkIfYTkeyisValid = async () => {
  if (!apiKey) {
    logger.error('YT_API_KEY is not configured');
    return {
      apiValid: false,
      error: { message: 'YT_API_KEY environment variable is not set' }
    };
  }

  const query = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=YouTube+Data+API&type=video&maxResults=1&key=${apiKey}`;

  try {
    const res = await fetch(query);
    const data = await res.json();

    if (data.error) {
      logger.error('YouTube API key validation failed:', data.error);
      return { apiValid: false, error: data };
    }

    logger.info('YouTube API key validated successfully');
    return { apiValid: true, error: null };

  } catch (error) {
    logger.error('Error validating YouTube API key:', error);
    return {
      apiValid: false,
      error: { message: error.message }
    };
  }
};

/**
 * Fetch trailer content from all configured channels
 * Implements caching and parallel requests with error handling
 * @param {boolean} forceRefresh - Skip cache and force refresh
 * @returns {Promise<Array|Object>} Array of trailers or error object
 */
const getContent = async (forceRefresh = false) => {
  try {
    // Check cache first unless force refresh
    if (!forceRefresh) {
      const cached = cache.get(CACHE_KEY);
      if (cached) {
        logger.info('Returning cached trailer content');
        return cached;
      }
    }

    // Validate API key
    const apiValidation = await checkIfYTkeyisValid();
    if (!apiValidation.apiValid) {
      return apiValidation;
    }

    logger.info(`Fetching trailers from ${channelList.length} channels...`);
    const startTime = Date.now();

    // Fetch from all channels in parallel
    const promises = channelList.map(channel =>
      hitAPI(channel.channelID, channel.name)
    );

    const results = await Promise.allSettled(promises);

    // Process results, filtering out errors
    const successfulResults = results
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value)
      .filter(videos => Array.isArray(videos) && videos.length > 0);

    // Log failed requests
    const failedCount = results.filter(result => result.status === 'rejected').length;
    if (failedCount > 0) {
      logger.warn(`${failedCount} channels failed to fetch`);
    }

    // Flatten array of arrays
    const flattened = successfulResults.flat();

    // Sort by date (newest first)
    const sorted = flattened.sort((a, b) => {
      try {
        const dateA = parseISO(a.dateString);
        const dateB = parseISO(b.dateString);
        return compareDesc(dateA, dateB);
      } catch (error) {
        logger.error('Error sorting dates:', error);
        return 0;
      }
    });

    // Deduplicate: Remove duplicate trailers with same title from same channel
    // Keep the first occurrence (newest since already sorted)
    const seen = new Map();
    const deduplicated = sorted.filter(trailer => {
      const key = `${trailer.channel}:${trailer.name}`;
      if (seen.has(key)) {
        logger.debug(`Removing duplicate: ${trailer.name} from ${trailer.channel}`);
        return false;
      }
      seen.set(key, true);
      return true;
    });

    const duration = Date.now() - startTime;
    const duplicatesRemoved = sorted.length - deduplicated.length;
    logger.info(`Fetched ${deduplicated.length} trailers in ${duration}ms${duplicatesRemoved > 0 ? ` (${duplicatesRemoved} duplicates removed)` : ''}`);

    // Cache the results
    cache.set(CACHE_KEY, deduplicated, CACHE_TTL);

    return deduplicated;

  } catch (error) {
    logger.error('Error in getContent:', error);
    throw error;
  }
};

/**
 * Clear the trailer content cache
 */
const clearCache = () => {
  cache.del(CACHE_KEY);
  logger.info('Cache cleared');
};

module.exports = getContent;
module.exports.clearCache = clearCache;
module.exports.checkIfYTkeyisValid = checkIfYTkeyisValid;
