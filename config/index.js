/**
 * @module config
 * @description Centralized configuration module for the Movie-Trailers application.
 * This is the single point of initialization for environment variables via dotenv.
 * All other modules should import configuration from here instead of accessing
 * process.env directly.
 *
 * @example
 * const config = require('./config');
 * console.log(config.server.port); // 3030
 * console.log(config.youtube.apiKey); // Your API key
 */

require('dotenv').config();

/**
 * @typedef {Object} YouTubeConfig
 * @property {string} apiKey - YouTube Data API v3 key from YT_API_KEY env var
 * @property {string} baseUrl - Base URL for YouTube API endpoints
 * @property {number} maxResults - Maximum results per API request (max 50)
 */

/**
 * @typedef {Object} ServerConfig
 * @property {number} port - Server port number (default: 3030)
 * @property {string} nodeEnv - Node environment: 'development' | 'production' | 'test'
 * @property {string} corsOrigin - CORS allowed origin URL
 * @property {string} logLevel - Winston log level: 'error' | 'warn' | 'info' | 'debug'
 */

/**
 * @typedef {Object} CacheConfig
 * @property {number} ttl - Cache time-to-live in seconds (default: 300)
 * @property {number} checkPeriod - Cache cleanup check period in seconds
 */

/**
 * @typedef {Object} TrailersConfig
 * @property {number} daysRange - Number of days to look back for trailers (default: 30)
 * @property {number} perPage - Number of trailers per page for pagination
 */

/**
 * @typedef {Object} Config
 * @property {YouTubeConfig} youtube - YouTube API configuration
 * @property {ServerConfig} server - Server configuration
 * @property {CacheConfig} cache - Cache configuration
 * @property {TrailersConfig} trailers - Trailer filtering configuration
 */

/**
 * Application configuration object
 * @type {Config}
 */
const config = {
  /**
   * YouTube API configuration
   * @type {YouTubeConfig}
   */
  youtube: {
    apiKey: process.env.YT_API_KEY,
    baseUrl: 'https://www.googleapis.com/youtube/v3',
    maxResults: 50
  },

  /**
   * Server configuration
   * @type {ServerConfig}
   */
  server: {
    port: parseInt(process.env.PORT, 10) || 3030,
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    logLevel: process.env.LOG_LEVEL || 'info'
  },

  /**
   * Cache configuration
   * @type {CacheConfig}
   */
  cache: {
    ttl: parseInt(process.env.CACHE_TTL, 10) || 300,
    checkPeriod: 60
  },

  /**
   * Trailers configuration
   * @type {TrailersConfig}
   */
  trailers: {
    daysRange: parseInt(process.env.TRAILER_DATE_RANGE, 10) || 30,
    perPage: 20
  }
};

/**
 * Validates the configuration and returns an array of error messages.
 * An empty array indicates all required configuration is present.
 *
 * @returns {string[]} Array of validation error messages
 * @example
 * const errors = validateConfig();
 * if (errors.length > 0) {
 *   console.error('Configuration errors:', errors);
 *   process.exit(1);
 * }
 */
const validateConfig = () => {
  const errors = [];

  if (!config.youtube.apiKey) {
    errors.push('YT_API_KEY environment variable is not set');
  }

  if (config.server.port < 1 || config.server.port > 65535) {
    errors.push(`Invalid PORT: ${config.server.port}. Must be between 1 and 65535`);
  }

  if (config.cache.ttl < 0) {
    errors.push(`Invalid CACHE_TTL: ${config.cache.ttl}. Must be a positive number`);
  }

  if (config.trailers.daysRange < 1) {
    errors.push(`Invalid TRAILER_DATE_RANGE: ${config.trailers.daysRange}. Must be at least 1`);
  }

  return errors;
};

/**
 * Checks if the application is running in production mode
 * @returns {boolean} True if NODE_ENV is 'production'
 */
const isProduction = () => config.server.nodeEnv === 'production';

/**
 * Checks if the application is running in development mode
 * @returns {boolean} True if NODE_ENV is 'development'
 */
const isDevelopment = () => config.server.nodeEnv === 'development';

/**
 * Checks if the application is running in test mode
 * @returns {boolean} True if NODE_ENV is 'test'
 */
const isTest = () => config.server.nodeEnv === 'test';

module.exports = config;
module.exports.validateConfig = validateConfig;
module.exports.isProduction = isProduction;
module.exports.isDevelopment = isDevelopment;
module.exports.isTest = isTest;
