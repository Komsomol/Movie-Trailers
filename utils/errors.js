/**
 * @module utils/errors
 * @description Custom error classes for consistent error handling across the application.
 * These error classes provide structured error information including error codes,
 * HTTP status codes, and the ability to serialize to JSON for API responses.
 *
 * @example
 * const { YouTubeAPIError, ValidationError } = require('./utils/errors');
 *
 * // Throwing a YouTube API error
 * throw new YouTubeAPIError('Failed to fetch channel data', originalError);
 *
 * // Throwing a validation error
 * throw new ValidationError('Channel ID is required', 'channelId');
 */

/**
 * Base application error class.
 * All custom errors should extend this class for consistent error handling.
 *
 * @class AppError
 * @extends Error
 *
 * @example
 * try {
 *   throw new AppError('Something went wrong', 'GENERIC_ERROR', 500);
 * } catch (error) {
 *   console.log(error.toJSON());
 *   // { error: 'AppError', message: 'Something went wrong', code: 'GENERIC_ERROR' }
 * }
 */
class AppError extends Error {
  /**
   * Creates a new AppError instance
   *
   * @param {string} message - Human-readable error message
   * @param {string} code - Machine-readable error code for programmatic handling
   * @param {number} [statusCode=500] - HTTP status code to return in API responses
   */
  constructor(message, code, statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Converts the error to a JSON-serializable object for API responses.
   * Does not include stack trace for security reasons.
   *
   * @returns {{error: string, message: string, code: string, timestamp: string}}
   */
  toJSON() {
    return {
      error: this.name,
      message: this.message,
      code: this.code,
      timestamp: this.timestamp
    };
  }
}

/**
 * Error class for YouTube API related failures.
 * Used when the YouTube Data API returns an error or is unreachable.
 *
 * @class YouTubeAPIError
 * @extends AppError
 *
 * @example
 * try {
 *   const response = await fetch(youtubeUrl);
 *   if (!response.ok) {
 *     throw new YouTubeAPIError('YouTube API request failed', response.error);
 *   }
 * } catch (error) {
 *   logger.error('YouTube API error:', error);
 * }
 */
class YouTubeAPIError extends AppError {
  /**
   * Creates a new YouTubeAPIError instance
   *
   * @param {string} message - Description of what went wrong
   * @param {Error|Object|null} [originalError=null] - The original error from the API
   */
  constructor(message, originalError = null) {
    super(message, 'YOUTUBE_API_ERROR', 502);
    this.originalError = originalError;
  }

  /**
   * @override
   * @returns {{error: string, message: string, code: string, timestamp: string, details?: Object}}
   */
  toJSON() {
    const json = super.toJSON();
    if (this.originalError && this.originalError.message) {
      json.details = { originalMessage: this.originalError.message };
    }
    return json;
  }
}

/**
 * Error class for invalid or missing API key.
 * Used when the YouTube API key is not configured or has been rejected.
 *
 * @class APIKeyError
 * @extends AppError
 *
 * @example
 * if (!config.youtube.apiKey) {
 *   throw new APIKeyError();
 * }
 */
class APIKeyError extends AppError {
  /**
   * Creates a new APIKeyError instance
   *
   * @param {string} [message='YouTube API key is invalid or not configured'] - Error message
   */
  constructor(message = 'YouTube API key is invalid or not configured') {
    super(message, 'API_KEY_ERROR', 401);
  }
}

/**
 * Error class for configuration issues.
 * Used when required configuration is missing or invalid.
 *
 * @class ConfigurationError
 * @extends AppError
 *
 * @example
 * const errors = validateConfig();
 * if (errors.length > 0) {
 *   throw new ConfigurationError(`Invalid configuration: ${errors.join(', ')}`);
 * }
 */
class ConfigurationError extends AppError {
  /**
   * Creates a new ConfigurationError instance
   *
   * @param {string} message - Description of the configuration issue
   */
  constructor(message) {
    super(message, 'CONFIGURATION_ERROR', 500);
  }
}

/**
 * Error class for validation failures.
 * Used when input data fails validation checks.
 *
 * @class ValidationError
 * @extends AppError
 *
 * @example
 * if (!channelId) {
 *   throw new ValidationError('Channel ID is required', 'channelId');
 * }
 */
class ValidationError extends AppError {
  /**
   * Creates a new ValidationError instance
   *
   * @param {string} message - Description of the validation failure
   * @param {string|null} [field=null] - The field that failed validation
   */
  constructor(message, field = null) {
    super(message, 'VALIDATION_ERROR', 400);
    this.field = field;
  }

  /**
   * @override
   * @returns {{error: string, message: string, code: string, timestamp: string, field?: string}}
   */
  toJSON() {
    const json = super.toJSON();
    if (this.field) {
      json.field = this.field;
    }
    return json;
  }
}

/**
 * Error class for channel data fetch failures.
 * Used when fetching data for a specific YouTube channel fails.
 *
 * @class ChannelFetchError
 * @extends AppError
 *
 * @example
 * try {
 *   const data = await fetchChannelData(channelId);
 * } catch (error) {
 *   throw new ChannelFetchError('Warner Bros', error);
 * }
 */
class ChannelFetchError extends AppError {
  /**
   * Creates a new ChannelFetchError instance
   *
   * @param {string} channelName - Name of the channel that failed to fetch
   * @param {Error|null} [originalError=null] - The original error that caused the failure
   */
  constructor(channelName, originalError = null) {
    super(
      `Failed to fetch data for channel: ${channelName}`,
      'CHANNEL_FETCH_ERROR',
      502
    );
    this.channelName = channelName;
    this.originalError = originalError;
  }

  /**
   * @override
   * @returns {{error: string, message: string, code: string, timestamp: string, channel: string}}
   */
  toJSON() {
    const json = super.toJSON();
    json.channel = this.channelName;
    return json;
  }
}

/**
 * Error class for network-related failures.
 * Used when network requests fail due to connectivity issues.
 *
 * @class NetworkError
 * @extends AppError
 *
 * @example
 * try {
 *   await fetch(url);
 * } catch (error) {
 *   if (error.code === 'ECONNREFUSED') {
 *     throw new NetworkError('Unable to connect to YouTube API', error);
 *   }
 * }
 */
class NetworkError extends AppError {
  /**
   * Creates a new NetworkError instance
   *
   * @param {string} message - Description of the network issue
   * @param {Error|null} [originalError=null] - The original network error
   */
  constructor(message, originalError = null) {
    super(message, 'NETWORK_ERROR', 503);
    this.originalError = originalError;
  }
}

/**
 * Error class for cache-related failures.
 * Used when cache operations fail.
 *
 * @class CacheError
 * @extends AppError
 *
 * @example
 * try {
 *   cache.set(key, value);
 * } catch (error) {
 *   throw new CacheError('Failed to cache trailer data', error);
 * }
 */
class CacheError extends AppError {
  /**
   * Creates a new CacheError instance
   *
   * @param {string} message - Description of the cache issue
   * @param {Error|null} [originalError=null] - The original cache error
   */
  constructor(message, originalError = null) {
    super(message, 'CACHE_ERROR', 500);
    this.originalError = originalError;
  }
}

module.exports = {
  AppError,
  YouTubeAPIError,
  APIKeyError,
  ConfigurationError,
  ValidationError,
  ChannelFetchError,
  NetworkError,
  CacheError
};
