/**
 * @module routes
 * @description Express router configuration for the Movie-Trailers application.
 * Defines the main routes for serving both HTML pages and JSON API responses.
 *
 * Routes:
 * - GET / : Renders the main HTML page with trailer data using Pug template
 * - GET /api : Returns trailer data as JSON for the Vue frontend
 *
 * @example
 * const routes = require('./routes/routes');
 * app.use('/', routes);
 */

const express = require('express');
const router = express.Router();
const getContent = require('../getContent');
const logger = require('../utils/logger');
const { HTTP_STATUS, ERROR_CODES } = require('../constants');

/**
 * Request timing middleware.
 * Logs the timestamp of each incoming request for debugging and monitoring.
 *
 * @function timeLog
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
const timeLog = (req, res, next) => {
  logger.debug(`Request received`, {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path
  });
  next();
};

router.use(timeLog);

/**
 * Formats error response in a consistent structure.
 *
 * @private
 * @param {string} errorType - Type of error (e.g., 'API Error', 'Server Error')
 * @param {string} message - Human-readable error message
 * @param {string} code - Machine-readable error code
 * @returns {{error: string, message: string, code: string}}
 */
const formatErrorResponse = (errorType, message, code) => ({
  error: errorType,
  message,
  code
});

/**
 * GET / - Renders the main HTML page with trailers.
 * Fetches trailer data from YouTube channels and renders using Pug template.
 *
 * @name GetHomePage
 * @route {GET} /
 * @returns {HTML} Rendered Pug template with trailer data
 * @returns {Object} 500 - Error response if fetching fails
 *
 * @example
 * // Success: Returns rendered HTML page
 * GET /
 *
 * // Error response format:
 * {
 *   "error": "API Error",
 *   "message": "YouTube API validation failed",
 *   "code": "API_KEY_INVALID"
 * }
 */
router.get('/', async (req, res) => {
  try {
    const result = await getContent();

    // Check for API validation failure
    if (result.apiValid === false) {
      logger.error('API validation failed on home page', {
        error: result.error
      });
      return res.status(HTTP_STATUS.INTERNAL_ERROR).json(
        formatErrorResponse(
          'API Error',
          result.error?.message || 'YouTube API validation failed',
          ERROR_CODES.API_KEY_INVALID
        )
      );
    }

    // Render the Pug template with trailer data
    res.render('index', { data: result });
  } catch (error) {
    logger.error('Error rendering home page', {
      error: error.message,
      stack: error.stack
    });
    res.status(HTTP_STATUS.INTERNAL_ERROR).json(
      formatErrorResponse(
        'Server Error',
        error.message || 'Failed to load trailers',
        ERROR_CODES.INTERNAL_ERROR
      )
    );
  }
});

/**
 * GET /api - Returns trailer data as JSON.
 * Primary endpoint for the Vue frontend to fetch trailer data.
 * Returns an array of trailer objects sorted by date (newest first).
 *
 * @name GetApiEndpoint
 * @route {GET} /api
 * @returns {Object[]} 200 - Array of trailer objects
 * @returns {Object} 500 - Error response if fetching fails
 *
 * @example
 * // Success response:
 * [
 *   {
 *     "channel": "Warner Bros. Pictures",
 *     "name": "Movie Title - Official Trailer",
 *     "date": "Friday, January 15th, 2025",
 *     "dateString": "2025-01-15T10:00:00.000Z",
 *     "link": "dQw4w9WgXcQ",
 *     "thumbnail": "https://i.ytimg.com/vi/..."
 *   }
 * ]
 *
 * // Error response:
 * {
 *   "error": "API Error",
 *   "message": "YouTube API validation failed",
 *   "code": "API_KEY_INVALID"
 * }
 */
router.get('/api', async (req, res) => {
  try {
    const result = await getContent();

    // Check for API validation failure
    if (result.apiValid === false) {
      logger.error('API validation failed on /api endpoint', {
        error: result.error
      });
      return res.status(HTTP_STATUS.INTERNAL_ERROR).json(
        formatErrorResponse(
          'API Error',
          result.error?.message || 'YouTube API validation failed',
          ERROR_CODES.API_KEY_INVALID
        )
      );
    }

    // Set cache headers to reduce server load (5 min browser cache)
    res.set('Cache-Control', 'public, max-age=300');

    // Return trailer data as JSON
    res.json(result);
  } catch (error) {
    logger.error('Error fetching API data', {
      error: error.message,
      stack: error.stack
    });
    res.status(HTTP_STATUS.INTERNAL_ERROR).json(
      formatErrorResponse(
        'Server Error',
        error.message || 'Failed to fetch trailers',
        ERROR_CODES.INTERNAL_ERROR
      )
    );
  }
});

module.exports = router;
