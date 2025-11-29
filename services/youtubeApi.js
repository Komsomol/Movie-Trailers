/**
 * @module services/youtubeApi
 * @description Centralized YouTube API service for all YouTube Data API v3 calls.
 * Consolidates channel details and video fetching into a single, testable module.
 * This service handles all communication with the YouTube API including validation,
 * error handling, and response parsing.
 *
 * @example
 * const youtubeApi = require('./services/youtubeApi');
 *
 * // Validate API key
 * const isValid = await youtubeApi.validateApiKey();
 *
 * // Get channel details
 * const channel = await youtubeApi.getChannelDetails('UC123', 'Warner Bros');
 *
 * // Get videos from playlist
 * const videos = await youtubeApi.getPlaylistVideos('UC123', 'UU123', 'Warner Bros');
 */

const fetch = require('node-fetch');
const config = require('../config');
const logger = require('../utils/logger');
const {
  YouTubeAPIError,
  APIKeyError,
  ValidationError,
  NetworkError
} = require('../utils/errors');

/**
 * @typedef {Object} ChannelDetails
 * @property {string} channelID - The YouTube channel ID
 * @property {string} uploadsURL - The uploads playlist ID for fetching videos
 * @property {string} channelName - The display name of the channel
 */

/**
 * @typedef {Object} VideoItem
 * @property {Object} snippet - Video metadata
 * @property {string} snippet.title - Video title
 * @property {string} snippet.publishedAt - ISO 8601 publish date
 * @property {Object} snippet.resourceId - Resource identifier
 * @property {string} snippet.resourceId.videoId - YouTube video ID
 * @property {Object} snippet.thumbnails - Thumbnail images
 */

/**
 * @typedef {Object} PlaylistResponse
 * @property {VideoItem[]} items - Array of video items
 * @property {Object} [pageInfo] - Pagination information
 * @property {string} [nextPageToken] - Token for next page of results
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - Whether the API key is valid
 * @property {Object} [error] - Error details if validation failed
 */

/**
 * Default timeout for API requests in milliseconds.
 * @constant {number}
 */
const DEFAULT_REQUEST_TIMEOUT = 10000;

/**
 * YouTube API Service Class.
 * Provides methods for interacting with the YouTube Data API v3.
 *
 * @class YouTubeApiService
 */
class YouTubeApiService {
  /**
   * Creates a new YouTubeApiService instance.
   * Initializes with configuration from the config module.
   */
  constructor() {
    this.baseUrl = config.youtube.baseUrl;
    this.apiKey = config.youtube.apiKey;
    this.maxResults = config.youtube.maxResults;
    this.requestTimeout = DEFAULT_REQUEST_TIMEOUT;
  }

  /**
   * Makes a request to the YouTube API with error handling and timeout.
   *
   * @private
   * @async
   * @param {string} endpoint - API endpoint (e.g., 'channels', 'playlistItems')
   * @param {Object.<string, string|number>} [params={}] - Query parameters
   * @returns {Promise<Object>} Parsed JSON response from the API
   * @throws {APIKeyError} When the API key is missing
   * @throws {YouTubeAPIError} When the API returns an error
   * @throws {NetworkError} When the network request fails or times out
   */
  async _request(endpoint, params = {}) {
    if (!this.apiKey) {
      throw new APIKeyError('YouTube API key is not configured');
    }

    const url = new URL(`${this.baseUrl}/${endpoint}`);
    url.searchParams.append('key', this.apiKey);

    // Add additional parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });

    // Create AbortController for request timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout);

    try {
      logger.debug(`YouTube API request: ${endpoint}`, { params });

      const response = await fetch(url.toString(), {
        signal: controller.signal
      });

      // Clear timeout since request completed
      clearTimeout(timeoutId);

      // Check HTTP status BEFORE parsing JSON
      if (!response.ok) {
        // Handle rate limiting specifically
        if (response.status === 429) {
          throw new YouTubeAPIError(
            'YouTube API rate limit exceeded. Please try again later.',
            { status: 429, rateLimited: true }
          );
        }

        // Try to parse error response for more details
        let errorDetails = { status: response.status };
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorDetails = { ...errorDetails, ...errorData.error };
          }
        } catch {
          // Ignore JSON parse errors for error responses
        }

        // Handle specific HTTP status codes
        if (response.status === 403) {
          throw new APIKeyError('YouTube API key is invalid or quota exceeded');
        }
        if (response.status === 401) {
          throw new APIKeyError('YouTube API key is unauthorized');
        }

        throw new YouTubeAPIError(
          `HTTP ${response.status}: ${response.statusText}`,
          errorDetails
        );
      }

      // Parse successful response
      const data = await response.json();

      // Check for API errors in response body (YouTube sometimes returns 200 with error)
      if (data.error) {
        const errorMessage = data.error.message || 'Unknown YouTube API error';
        const errorCode = data.error.code;

        logger.error(`YouTube API error: ${errorMessage}`, {
          endpoint,
          errorCode,
          error: data.error
        });

        // Handle specific error codes
        if (errorCode === 400 && errorMessage.includes('API key')) {
          throw new APIKeyError(errorMessage);
        }
        if (errorCode === 403) {
          throw new APIKeyError('YouTube API key is invalid or quota exceeded');
        }

        throw new YouTubeAPIError(errorMessage, data.error);
      }

      return data;
    } catch (error) {
      // Clear timeout on error
      clearTimeout(timeoutId);

      // Handle abort/timeout errors
      if (error.name === 'AbortError') {
        throw new NetworkError(
          `YouTube API request timed out after ${this.requestTimeout}ms`,
          { timeout: true, endpoint }
        );
      }

      // Re-throw our custom errors
      if (
        error instanceof YouTubeAPIError ||
        error instanceof APIKeyError ||
        error instanceof NetworkError
      ) {
        throw error;
      }

      // Handle network errors
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        throw new NetworkError(
          'Unable to connect to YouTube API. Please check your internet connection.',
          error
        );
      }

      // Wrap unknown errors
      logger.error(`Unexpected error in YouTube API request: ${error.message}`, {
        endpoint,
        error: error.message
      });
      throw new YouTubeAPIError(`Request failed: ${error.message}`, error);
    }
  }

  /**
   * Validates the YouTube API key by making a test request.
   * Uses the search endpoint with minimal parameters to verify the key works.
   *
   * @async
   * @returns {Promise<ValidationResult>} Validation result with status and any error
   *
   * @example
   * const result = await youtubeApi.validateApiKey();
   * if (!result.valid) {
   *   console.error('API key validation failed:', result.error);
   * }
   */
  async validateApiKey() {
    if (!this.apiKey) {
      logger.error('YT_API_KEY is not configured');
      return {
        valid: false,
        error: { message: 'YT_API_KEY environment variable is not set' }
      };
    }

    try {
      await this._request('search', {
        part: 'snippet',
        q: 'YouTube Data API',
        type: 'video',
        maxResults: 1
      });

      logger.info('YouTube API key validated successfully');
      return { valid: true, error: null };
    } catch (error) {
      logger.error('YouTube API key validation failed:', {
        error: error.message
      });
      return {
        valid: false,
        error: {
          message: error.message,
          code: error.code || 'VALIDATION_FAILED'
        }
      };
    }
  }

  /**
   * Fetches channel details including the uploads playlist ID.
   * The uploads playlist ID is required to fetch the channel's videos.
   *
   * @async
   * @param {string} channelId - The YouTube channel ID
   * @param {string} channelName - The display name of the channel (for logging)
   * @returns {Promise<ChannelDetails>} Channel details with uploads playlist ID
   * @throws {ValidationError} When channelId or channelName is missing
   * @throws {YouTubeAPIError} When the API request fails or channel not found
   *
   * @example
   * const details = await youtubeApi.getChannelDetails(
   *   'UCjmJDM5pRKbUlVIzDYYWb6g',
   *   'Warner Bros. Pictures'
   * );
   * console.log(details.uploadsURL); // 'UUjmJDM5pRKbUlVIzDYYWb6g'
   */
  async getChannelDetails(channelId, channelName) {
    // Validate inputs
    if (!channelId) {
      throw new ValidationError('Channel ID is required', 'channelId');
    }
    if (!channelName) {
      throw new ValidationError('Channel name is required', 'channelName');
    }

    try {
      const data = await this._request('channels', {
        part: 'snippet,contentDetails',
        id: channelId
      });

      // Check if channel was found
      if (!data.items || data.items.length === 0) {
        throw new YouTubeAPIError(
          `Channel not found: ${channelName} (${channelId})`
        );
      }

      const channel = data.items[0];

      // Validate required data exists
      if (!channel.contentDetails?.relatedPlaylists?.uploads) {
        throw new YouTubeAPIError(
          `Uploads playlist not found for channel: ${channelName}`
        );
      }

      logger.debug(`Retrieved channel details for ${channelName}`, {
        channelId: channel.id,
        uploadsPlaylist: channel.contentDetails.relatedPlaylists.uploads
      });

      return {
        channelID: channel.id,
        uploadsURL: channel.contentDetails.relatedPlaylists.uploads,
        channelName
      };
    } catch (error) {
      if (
        error instanceof ValidationError ||
        error instanceof YouTubeAPIError
      ) {
        throw error;
      }
      logger.error(`Error fetching channel details for ${channelName}:`, {
        error: error.message,
        channelId
      });
      throw new YouTubeAPIError(
        `Failed to fetch channel details for ${channelName}`,
        error
      );
    }
  }

  /**
   * Fetches videos from a channel's uploads playlist.
   * Returns the most recent videos up to the configured maxResults limit.
   *
   * @async
   * @param {string} channelId - The YouTube channel ID
   * @param {string} playlistId - The uploads playlist ID
   * @param {string} [channelName='Unknown'] - Channel name for logging
   * @returns {Promise<PlaylistResponse>} YouTube API response with video items
   * @throws {ValidationError} When playlistId is missing
   * @throws {YouTubeAPIError} When the API request fails
   *
   * @example
   * const response = await youtubeApi.getPlaylistVideos(
   *   'UCjmJDM5pRKbUlVIzDYYWb6g',
   *   'UUjmJDM5pRKbUlVIzDYYWb6g',
   *   'Warner Bros. Pictures'
   * );
   * console.log(`Found ${response.items.length} videos`);
   */
  async getPlaylistVideos(channelId, playlistId, channelName = 'Unknown') {
    // Validate inputs
    if (!playlistId) {
      throw new ValidationError('Playlist ID is required', 'playlistId');
    }

    try {
      const data = await this._request('playlistItems', {
        part: 'snippet,contentDetails',
        playlistId,
        channelId,
        maxResults: this.maxResults
      });

      const itemCount = data.items?.length || 0;
      logger.debug(`Retrieved ${itemCount} videos from ${channelName}`, {
        playlistId,
        itemCount
      });

      return data;
    } catch (error) {
      if (
        error instanceof ValidationError ||
        error instanceof YouTubeAPIError
      ) {
        throw error;
      }
      logger.error(`Error fetching videos from ${channelName}:`, {
        error: error.message,
        playlistId
      });
      throw new YouTubeAPIError(
        `Failed to fetch videos from ${channelName}`,
        error
      );
    }
  }

  /**
   * Fetches channel details and videos in a single operation.
   * Convenience method that combines getChannelDetails and getPlaylistVideos.
   *
   * @async
   * @param {string} channelId - The YouTube channel ID
   * @param {string} channelName - The display name of the channel
   * @returns {Promise<{channel: ChannelDetails, videos: PlaylistResponse}>}
   * @throws {ValidationError} When required parameters are missing
   * @throws {YouTubeAPIError} When any API request fails
   *
   * @example
   * const { channel, videos } = await youtubeApi.getChannelWithVideos(
   *   'UCjmJDM5pRKbUlVIzDYYWb6g',
   *   'Warner Bros. Pictures'
   * );
   */
  async getChannelWithVideos(channelId, channelName) {
    const channel = await this.getChannelDetails(channelId, channelName);
    const videos = await this.getPlaylistVideos(
      channel.channelID,
      channel.uploadsURL,
      channelName
    );

    return { channel, videos };
  }
}

// Export a singleton instance
module.exports = new YouTubeApiService();

// Also export the class for testing purposes
module.exports.YouTubeApiService = YouTubeApiService;
