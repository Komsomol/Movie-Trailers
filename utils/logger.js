/**
 * @module utils/logger
 * @description Winston logger configuration for the Movie-Trailers application.
 * Provides structured logging with different transports for development and production.
 *
 * Features:
 * - Console output with colorization in development
 * - JSON format with timestamps for structured logging
 * - File transports for error and combined logs in production
 * - Configurable log level via LOG_LEVEL environment variable
 *
 * Log Levels (from highest to lowest priority):
 * - error: Error messages, exceptions, and failures
 * - warn: Warning messages for potentially problematic situations
 * - info: General information about application flow
 * - debug: Detailed debugging information
 *
 * @example
 * const logger = require('./utils/logger');
 *
 * // Basic logging
 * logger.info('Server started', { port: 3030 });
 * logger.error('Failed to fetch data', { error: err.message });
 * logger.debug('Processing request', { requestId: '123' });
 *
 * // Logging with metadata
 * logger.info('User action', {
 *   action: 'fetch_trailers',
 *   userId: 'anonymous',
 *   duration: 1500
 * });
 */

const winston = require('winston');

/**
 * Custom log format for console output.
 * Combines colorization and simple format for readable output.
 *
 * @type {winston.Logform.Format}
 */
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.simple()
);

/**
 * Custom log format for file and structured output.
 * Includes timestamps, error stack traces, and JSON formatting.
 *
 * @type {winston.Logform.Format}
 */
const fileFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

/**
 * Winston logger instance configured for the application.
 * Uses console transport by default, adds file transports in production.
 *
 * @type {winston.Logger}
 *
 * @example
 * // Log an informational message
 * logger.info('Application started');
 *
 * // Log with metadata object
 * logger.info('Request processed', { duration: 150, status: 200 });
 *
 * // Log an error with stack trace
 * logger.error('Database connection failed', { error: err.message, stack: err.stack });
 *
 * // Log debug information (only shown when LOG_LEVEL=debug)
 * logger.debug('Cache hit', { key: 'trailer_content', ttl: 300 });
 *
 * // Log a warning
 * logger.warn('Rate limit approaching', { remaining: 10, limit: 100 });
 */
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: fileFormat,
  defaultMeta: { service: 'movie-trailers' },
  transports: [
    new winston.transports.Console({
      format: consoleFormat
    })
  ]
});

/**
 * Add file transports in production environment.
 * Creates separate log files for errors and all logs.
 *
 * Log files:
 * - logs/error.log: Only error-level messages
 * - logs/combined.log: All log messages
 */
if (process.env.NODE_ENV === 'production') {
  logger.add(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  );
  logger.add(
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  );
}

/**
 * Creates a child logger with additional default metadata.
 * Useful for module-specific logging with context.
 *
 * @param {Object} metadata - Default metadata to include in all log messages
 * @returns {winston.Logger} Child logger instance
 *
 * @example
 * const moduleLogger = logger.child({ module: 'youtube-api' });
 * moduleLogger.info('Fetching channel data'); // Includes module: 'youtube-api'
 */
logger.createChildLogger = (metadata) => {
  return logger.child(metadata);
};

module.exports = logger;
