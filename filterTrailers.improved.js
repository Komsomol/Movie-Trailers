const { format, sub, isWithinInterval, parseISO } = require('date-fns');
const { utcToZonedTime, formatInTimeZone } = require('date-fns-tz');
const logger = require('./utils/logger');

/**
 * Check if a given date falls within the specified range (last N days)
 * @param {string} isoDate - ISO 8601 date string
 * @param {number} days - Number of days to look back (default: 30)
 * @returns {boolean}
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
    logger.error(`Error checking date range for ${isoDate}:`, error);
    return false;
  }
};

// Keywords to exclude and to search for in titles
const EXCLUDED_KEYWORDS = [
  'blu-ray',
  'season',
  'episode',
  'marvel comics',
  'teaser trailer',
  'teaser',
  'red band'
];

const SEARCH_KEYWORDS = ['official trailer'];

/**
 * Filter and retrieve only trailer videos based on title and date range
 * @param {Object} file - YouTube API response with items array
 * @param {string} channelName - Name of the YouTube channel
 * @param {number} daysRange - Number of days to look back (default: 30)
 * @returns {Array} - Array of filtered video objects
 */
const getTrailersOnly = (file, channelName, daysRange = 30) => {
  try {
    // Validate input
    if (!file || !file.items || !Array.isArray(file.items)) {
      logger.warn(`Invalid file structure for channel: ${channelName}`);
      return [];
    }

    if (!channelName) {
      logger.warn('Channel name is required');
      return [];
    }

    // OPTIMIZATION: Calculate date range once instead of for each video
    const today = new Date();
    const pastDate = sub(today, { days: daysRange });

    const filteredVideos = file.items.reduce((videos, item) => {
      try {
        // Validate item structure
        if (!item.snippet || !item.snippet.title || !item.snippet.publishedAt) {
          logger.debug('Skipping item with missing snippet data');
          return videos;
        }

        const title = item.snippet.title.toLowerCase();

        // OPTIMIZATION: Early exit if title doesn't contain search keywords
        const isTargeted = SEARCH_KEYWORDS.some(keyword => title.includes(keyword));
        if (!isTargeted) return videos;

        // Check if title contains excluded keywords
        const isExcluded = EXCLUDED_KEYWORDS.some(keyword => title.includes(keyword));
        if (isExcluded) return videos;

        // OPTIMIZATION: Parse date once and reuse
        const videoDate = parseISO(item.snippet.publishedAt);

        // Check if video is within date range (using pre-calculated dates)
        const isInDateRange = isWithinInterval(videoDate, { start: pastDate, end: today });

        if (isInDateRange) {
          const videoObj = {
            channel: channelName,
            name: item.snippet.title,
            date: formatInTimeZone(videoDate, 'UTC', 'PPPP'),
            dateString: videoDate.toISOString(),
            link: item.snippet.resourceId?.videoId || '',
            thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || ''
          };

          videos.push(videoObj);
        }

        return videos;
      } catch (itemError) {
        logger.error(`Error processing item from ${channelName}:`, itemError);
        return videos;
      }
    }, []);

    logger.info(`Filtered ${filteredVideos.length} trailers from ${channelName}`);
    return filteredVideos;

  } catch (error) {
    logger.error(`Error in getTrailersOnly for ${channelName}:`, error);
    return [];
  }
};

module.exports = getTrailersOnly;
module.exports.checkDateRange = checkDateRange;
module.exports.EXCLUDED_KEYWORDS = EXCLUDED_KEYWORDS;
module.exports.SEARCH_KEYWORDS = SEARCH_KEYWORDS;
