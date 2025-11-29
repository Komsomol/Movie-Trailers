/**
 * @module getData
 * @description Orchestrates the data fetching pipeline for a single YouTube channel.
 * Coordinates channel details retrieval, video fetching, and trailer filtering
 * into a single operation.
 *
 * Pipeline:
 * 1. Get channel details (uploads playlist ID)
 * 2. Fetch videos from uploads playlist
 * 3. Filter videos to find official trailers
 * 4. Return filtered trailer array
 *
 * @example
 * const getData = require('./getData');
 *
 * // Fetch trailers for a single channel
 * const trailers = await getData('UCjmJDM5pRKbUlVIzDYYWb6g', 'Warner Bros. Pictures');
 * console.log(`Found ${trailers.length} trailers`);
 */

const youtubeApi = require('./services/youtubeApi');
const filterTrailers = require('./filterTrailers');
const logger = require('./utils/logger');
const config = require('./config');

/**
 * @typedef {Object} Trailer
 * @property {string} channel - Studio/channel name
 * @property {string} name - Trailer title
 * @property {string} date - Formatted date string (e.g., "Friday, January 15th, 2025")
 * @property {string} dateString - ISO 8601 date string for sorting
 * @property {string} link - YouTube video ID
 * @property {string} thumbnail - Thumbnail URL
 */

/**
 * Fetches and filters trailer data for a single YouTube channel.
 * Uses the YouTube API service to get channel details and videos,
 * then filters to find official trailers within the configured date range.
 *
 * This function is designed to be fault-tolerant - it returns an empty array
 * on any error rather than throwing, allowing parallel requests to continue
 * even if one channel fails.
 *
 * @async
 * @param {string} channelID - The YouTube channel ID
 * @param {string} channelName - The display name of the channel (for logging and output)
 * @returns {Promise<Trailer[]>} Array of filtered trailer objects, or empty array on error
 *
 * @example
 * // Successful fetch
 * const trailers = await getData('UCjmJDM5pRKbUlVIzDYYWb6g', 'Warner Bros. Pictures');
 * // Returns: [{ channel: 'Warner Bros. Pictures', name: 'Movie - Official Trailer', ... }]
 *
 * @example
 * // Error handling - returns empty array instead of throwing
 * const trailers = await getData('invalid-id', 'Unknown Channel');
 * // Returns: [] (error logged internally)
 *
 * @example
 * // Using with Promise.allSettled for multiple channels
 * const channels = [
 *   { id: 'UC123', name: 'Studio A' },
 *   { id: 'UC456', name: 'Studio B' }
 * ];
 * const results = await Promise.allSettled(
 *   channels.map(ch => getData(ch.id, ch.name))
 * );
 */
const getData = async (channelID, channelName) => {
  try {
    // Validate inputs
    if (!channelID || !channelName) {
      logger.warn('getData called with missing parameters', {
        channelID: !!channelID,
        channelName: !!channelName
      });
      return [];
    }

    logger.debug(`Fetching data for channel: ${channelName}`, { channelID });

    // Fetch channel details and videos in a single combined operation
    // Uses getChannelWithVideos for cleaner code (internally makes 2 API calls)
    const { videos: videosResponse } = await youtubeApi.getChannelWithVideos(
      channelID,
      channelName
    );

    // Filter videos to find official trailers
    const trailers = filterTrailers(
      videosResponse,
      channelName,
      config.trailers.daysRange
    );

    logger.debug(`getData completed for ${channelName}`, {
      channelID,
      trailersFound: trailers.length
    });

    return trailers;
  } catch (error) {
    // Log the error but don't throw - return empty array for fault tolerance
    logger.error(`Error in getData for ${channelName}`, {
      channelID,
      error: error.message,
      errorCode: error.code,
      stack: error.stack
    });
    return [];
  }
};

module.exports = getData;
