/**
 * @module constants
 * @description Shared constants used throughout the Movie-Trailers application.
 * Centralizes all magic strings and values to ensure consistency and easy maintenance.
 *
 * @example
 * const { EXCLUDED_KEYWORDS, HTTP_STATUS } = require('./constants');
 *
 * if (title.includes(EXCLUDED_KEYWORDS[0])) {
 *   // Skip this video
 * }
 *
 * res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Not found' });
 */

/**
 * Keywords to exclude from trailer titles.
 * Videos with titles containing any of these keywords will be filtered out.
 *
 * @type {string[]}
 * @constant
 *
 * @example
 * const title = 'Movie Name - Official Trailer (Blu-ray)';
 * const isExcluded = EXCLUDED_KEYWORDS.some(kw => title.toLowerCase().includes(kw));
 * // isExcluded === true (contains 'blu-ray')
 */
const EXCLUDED_KEYWORDS = [
  'blu-ray',
  'season',
  'episode',
  'marvel comics',
  'teaser trailer',
  'teaser',
  'red band'
];

/**
 * Keywords to search for in trailer titles.
 * Only videos with titles containing at least one of these keywords will be included.
 *
 * @type {string[]}
 * @constant
 *
 * @example
 * const title = 'Movie Name - Official Trailer';
 * const isTargeted = SEARCH_KEYWORDS.some(kw => title.toLowerCase().includes(kw));
 * // isTargeted === true (contains 'official trailer')
 */
const SEARCH_KEYWORDS = ['official trailer', 'final trailer'];

/**
 * Cache key constants used with node-cache.
 * Ensures consistent key naming across the application.
 *
 * @type {Object.<string, string>}
 * @constant
 * @property {string} TRAILER_CONTENT - Key for storing cached trailer data
 * @property {string} API_VALIDATION - Key for storing API key validation status
 *
 * @example
 * const cache = require('./utils/cache');
 * cache.set(CACHE_KEYS.TRAILER_CONTENT, trailers, 300);
 */
const CACHE_KEYS = {
  TRAILER_CONTENT: 'trailer_content',
  API_VALIDATION: 'api_validation'
};

/**
 * Standard HTTP status codes used in API responses.
 * Provides meaningful names for status codes to improve code readability.
 *
 * @type {Object.<string, number>}
 * @constant
 * @property {number} OK - 200: Request succeeded
 * @property {number} CREATED - 201: Resource created successfully
 * @property {number} NO_CONTENT - 204: Request succeeded with no content to return
 * @property {number} BAD_REQUEST - 400: Invalid request parameters
 * @property {number} UNAUTHORIZED - 401: Authentication required or failed
 * @property {number} FORBIDDEN - 403: Access denied
 * @property {number} NOT_FOUND - 404: Resource not found
 * @property {number} TOO_MANY_REQUESTS - 429: Rate limit exceeded
 * @property {number} INTERNAL_ERROR - 500: Internal server error
 * @property {number} BAD_GATEWAY - 502: Upstream service error
 * @property {number} SERVICE_UNAVAILABLE - 503: Service temporarily unavailable
 *
 * @example
 * res.status(HTTP_STATUS.OK).json(data);
 * res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Not found' });
 */
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503
};

/**
 * Error codes used in error responses.
 * Provides machine-readable error identifiers for client-side handling.
 *
 * @type {Object.<string, string>}
 * @constant
 * @property {string} API_KEY_INVALID - YouTube API key is invalid
 * @property {string} API_KEY_MISSING - YouTube API key is not configured
 * @property {string} CHANNEL_NOT_FOUND - Requested channel does not exist
 * @property {string} RATE_LIMIT_EXCEEDED - Too many requests
 * @property {string} NETWORK_ERROR - Network connectivity issue
 * @property {string} PARSE_ERROR - Failed to parse response data
 * @property {string} VALIDATION_ERROR - Request validation failed
 * @property {string} INTERNAL_ERROR - Unexpected server error
 *
 * @example
 * res.status(401).json({
 *   error: 'API Error',
 *   message: 'Invalid API key',
 *   code: ERROR_CODES.API_KEY_INVALID
 * });
 */
const ERROR_CODES = {
  API_KEY_INVALID: 'API_KEY_INVALID',
  API_KEY_MISSING: 'API_KEY_MISSING',
  CHANNEL_NOT_FOUND: 'CHANNEL_NOT_FOUND',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  PARSE_ERROR: 'PARSE_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR'
};

/**
 * YouTube API related constants.
 *
 * @type {Object}
 * @constant
 * @property {number} MAX_RESULTS - Maximum number of results per API request (YouTube limit)
 * @property {string} BASE_URL - Base URL for YouTube Data API v3
 *
 * @example
 * const url = `${YOUTUBE.BASE_URL}/channels?maxResults=${YOUTUBE.MAX_RESULTS}`;
 */
const YOUTUBE = {
  MAX_RESULTS: 50,
  BASE_URL: 'https://www.googleapis.com/youtube/v3'
};

/**
 * Pagination constants.
 *
 * @type {Object}
 * @constant
 * @property {number} DEFAULT_PAGE - Default page number
 * @property {number} TRAILERS_PER_PAGE - Number of trailers to display per page
 *
 * @example
 * const startIndex = (currentPage - 1) * PAGINATION.TRAILERS_PER_PAGE;
 */
const PAGINATION = {
  DEFAULT_PAGE: 1,
  TRAILERS_PER_PAGE: 20
};

/**
 * Rate limiting constants.
 *
 * @type {Object}
 * @constant
 * @property {number} WINDOW_MS - Time window in milliseconds (15 minutes)
 * @property {number} MAX_REQUESTS - Maximum requests per window per IP
 *
 * @example
 * const limiter = rateLimit({
 *   windowMs: RATE_LIMIT.WINDOW_MS,
 *   max: RATE_LIMIT.MAX_REQUESTS
 * });
 */
const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100
};

module.exports = {
  EXCLUDED_KEYWORDS,
  SEARCH_KEYWORDS,
  CACHE_KEYS,
  HTTP_STATUS,
  ERROR_CODES,
  YOUTUBE,
  PAGINATION,
  RATE_LIMIT
};
