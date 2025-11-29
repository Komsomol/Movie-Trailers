/**
 * @module filterTrailers
 * @description Filters YouTube video data to extract only official movie trailers.
 * Uses keyword matching and date range filtering to identify relevant trailers
 * from channel upload data.
 *
 * Filtering Logic:
 * 1. Title must contain "official trailer" (case-insensitive)
 * 2. Title must NOT contain excluded keywords (blu-ray, teaser, etc.)
 * 3. Video must be published within the configured date range
 *
 * @example
 * const filterTrailers = require('./filterTrailers.improved');
 *
 * // Filter videos from YouTube API response
 * const trailers = filterTrailers(youtubeResponse, 'Warner Bros', 30);
 *
 * // Access exported constants
 * const { EXCLUDED_KEYWORDS, SEARCH_KEYWORDS } = require('./filterTrailers.improved');
 */

const { sub, isWithinInterval, parseISO } = require('date-fns');
const { formatInTimeZone } = require('date-fns-tz');
const logger = require('./utils/logger');
const { EXCLUDED_KEYWORDS, SEARCH_KEYWORDS } = require('./constants');

/**
 * @typedef {Object} YouTubeVideoItem
 * @property {Object} snippet - Video metadata from YouTube API
 * @property {string} snippet.title - Video title
 * @property {string} snippet.publishedAt - ISO 8601 publish date
 * @property {Object} [snippet.resourceId] - Resource identifier
 * @property {string} [snippet.resourceId.videoId] - YouTube video ID
 * @property {Object} [snippet.thumbnails] - Thumbnail images
 * @property {Object} [snippet.thumbnails.high] - High quality thumbnail
 * @property {string} [snippet.thumbnails.high.url] - High quality thumbnail URL
 * @property {Object} [snippet.thumbnails.default] - Default thumbnail
 * @property {string} [snippet.thumbnails.default.url] - Default thumbnail URL
 */

/**
 * @typedef {Object} YouTubeAPIResponse
 * @property {YouTubeVideoItem[]} items - Array of video items
 */

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
 * Checks if a given date falls within the specified range (last N days).
 *
 * @param {string} isoDate - ISO 8601 date string to check
 * @param {number} [days=30] - Number of days to look back from today
 * @returns {boolean} True if the date is within range, false otherwise
 *
 * @example
 * // Check if video was published in the last 30 days
 * const isRecent = checkDateRange('2025-01-15T10:00:00Z', 30);
 *
 * @example
 * // Check with custom range
 * const isVeryRecent = checkDateRange('2025-01-15T10:00:00Z', 7);
 */
const checkDateRange = (isoDate, days = 30) => {
  try {
    const date = parseISO(isoDate);
    const today = new Date();
    const pastDate = sub(today, { days });

    return isWithinInterval(date, {
      start: pastDate,
      end: today
    });
  } catch (error) {
    logger.error('Error checking date range', {
      isoDate,
      days,
      error: error.message
    });
    return false;
  }
};

/**
 * Checks if a video title matches the search criteria.
 * The title must contain at least one search keyword.
 *
 * @private
 * @param {string} title - Lowercase video title
 * @returns {boolean} True if title contains a search keyword
 */
const matchesSearchKeywords = (title) => {
  return SEARCH_KEYWORDS.some((keyword) => title.includes(keyword));
};

/**
 * Checks if a video title contains any excluded keywords.
 * Excluded keywords indicate content we don't want (teasers, blu-ray releases, etc.)
 *
 * @private
 * @param {string} title - Lowercase video title
 * @returns {boolean} True if title contains an excluded keyword
 */
const containsExcludedKeyword = (title) => {
  return EXCLUDED_KEYWORDS.some((keyword) => title.includes(keyword));
};

/**
 * Transforms a YouTube video item into a Trailer object.
 *
 * @private
 * @param {YouTubeVideoItem} item - YouTube video item from API
 * @param {string} channelName - Name of the source channel
 * @param {Date} videoDate - Parsed video publish date
 * @returns {Trailer} Formatted trailer object
 */
const createTrailerObject = (item, channelName, videoDate) => ({
  channel: channelName,
  name: item.snippet.title,
  date: formatInTimeZone(videoDate, 'UTC', 'PPPP'),
  dateString: videoDate.toISOString(),
  link: item.snippet.resourceId?.videoId || '',
  thumbnail:
    item.snippet.thumbnails?.high?.url ||
    item.snippet.thumbnails?.default?.url ||
    ''
});

/**
 * Filters and retrieves only official trailer videos based on title and date range.
 *
 * This function processes YouTube API response data and extracts videos that:
 * - Have "official trailer" in the title
 * - Don't contain excluded keywords (teaser, blu-ray, etc.)
 * - Were published within the specified date range
 *
 * Performance optimizations:
 * - Date range is calculated once, not per video
 * - Early exit on keyword match failures
 * - Uses reduce for single-pass filtering
 *
 * @param {YouTubeAPIResponse} file - YouTube API response with items array
 * @param {string} channelName - Name of the YouTube channel (for output and logging)
 * @param {number} [daysRange=30] - Number of days to look back (default: 30)
 * @returns {Trailer[]} Array of filtered trailer objects
 *
 * @example
 * // Basic usage with YouTube API response
 * const trailers = getTrailersOnly(youtubeResponse, 'Warner Bros. Pictures');
 *
 * @example
 * // Custom date range (last 7 days only)
 * const recentTrailers = getTrailersOnly(youtubeResponse, 'Universal Pictures', 7);
 *
 * @example
 * // Handling empty or invalid input
 * const empty = getTrailersOnly(null, 'Channel'); // Returns []
 * const noItems = getTrailersOnly({}, 'Channel'); // Returns []
 */
const getTrailersOnly = (file, channelName, daysRange = 30) => {
  try {
    // Validate input: file must have items array
    if (!file || !file.items || !Array.isArray(file.items)) {
      logger.warn('Invalid file structure for filtering', {
        channelName,
        hasFile: !!file,
        hasItems: !!file?.items,
        isArray: Array.isArray(file?.items)
      });
      return [];
    }

    // Validate input: channel name is required
    if (!channelName) {
      logger.warn('Channel name is required for filtering');
      return [];
    }

    // Pre-calculate date range (optimization: calculate once, not per video)
    const today = new Date();
    const pastDate = sub(today, { days: daysRange });

    // Process all items in a single pass using reduce
    const filteredVideos = file.items.reduce((videos, item) => {
      try {
        // Validate item structure
        if (!item.snippet || !item.snippet.title || !item.snippet.publishedAt) {
          logger.debug('Skipping item with missing snippet data', {
            hasSnippet: !!item.snippet,
            hasTitle: !!item.snippet?.title,
            hasDate: !!item.snippet?.publishedAt
          });
          return videos;
        }

        const title = item.snippet.title.toLowerCase();

        // Early exit: must contain search keywords
        if (!matchesSearchKeywords(title)) {
          return videos;
        }

        // Early exit: must not contain excluded keywords
        if (containsExcludedKeyword(title)) {
          return videos;
        }

        // Parse date once for efficiency
        const videoDate = parseISO(item.snippet.publishedAt);

        // Check if video is within the date range
        const isInDateRange = isWithinInterval(videoDate, {
          start: pastDate,
          end: today
        });

        if (isInDateRange) {
          videos.push(createTrailerObject(item, channelName, videoDate));
        }

        return videos;
      } catch (itemError) {
        logger.error('Error processing video item', {
          channelName,
          title: item.snippet?.title,
          error: itemError.message
        });
        return videos;
      }
    }, []);

    // Log results at debug level (info is too noisy for per-channel logging)
    logger.debug(`Filtered trailers from ${channelName}`, {
      channelName,
      inputCount: file.items.length,
      outputCount: filteredVideos.length,
      daysRange
    });

    return filteredVideos;
  } catch (error) {
    logger.error('Error in getTrailersOnly', {
      channelName,
      error: error.message,
      stack: error.stack
    });
    return [];
  }
};

module.exports = getTrailersOnly;
module.exports.checkDateRange = checkDateRange;
// Re-export constants from central location for backwards compatibility
module.exports.EXCLUDED_KEYWORDS = EXCLUDED_KEYWORDS;
module.exports.SEARCH_KEYWORDS = SEARCH_KEYWORDS;
