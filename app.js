/**
 * @module app
 * @description Express application entry point for the Movie-Trailers backend server.
 * Configures middleware, routes, error handling, and server lifecycle management.
 *
 * Features:
 * - CORS support for Vue frontend
 * - Response compression
 * - Rate limiting on API endpoints
 * - Request logging
 * - Graceful shutdown handling
 * - Health check endpoint
 *
 * @example
 * // Start the server (production)
 * NODE_ENV=production node app.improved.js
 *
 * // Start with nodemon (development)
 * npm run dev:improved
 *
 * // Import for testing
 * const app = require('./app.improved');
 * const request = require('supertest');
 * await request(app).get('/api').expect(200);
 */

const express = require('express');
const cors = require('cors');
const compression = require('compression');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const { validateConfig } = require('./config');
const logger = require('./utils/logger');
const routes = require('./routes/routes');
const { HTTP_STATUS, RATE_LIMIT } = require('./constants');

// Validate configuration on module load
const configErrors = validateConfig();
if (configErrors.length > 0) {
  logger.error('Configuration validation failed', { errors: configErrors });
  if (require.main === module) {
    // Only exit if running directly (not in tests)
    console.error('Configuration errors:', configErrors.join(', '));
    process.exit(1);
  }
}

/**
 * Express application instance.
 * @type {express.Application}
 */
const app = express();

// ============================================================================
// MIDDLEWARE CONFIGURATION
// ============================================================================

/**
 * Trust proxy settings for rate limiting behind reverse proxies (nginx, etc.)
 * Required for correct IP detection when behind a proxy.
 */
app.set('trust proxy', 1);

/**
 * Response compression middleware.
 * Compresses JSON responses to reduce bandwidth usage.
 */
app.use(compression());

/**
 * CORS (Cross-Origin Resource Sharing) configuration.
 * Allows the Vue frontend to make requests to this API.
 *
 * @type {cors.CorsOptions}
 */
const corsOptions = {
  origin: config.server.corsOrigin,
  optionsSuccessStatus: HTTP_STATUS.OK,
  credentials: true
};
app.use(cors(corsOptions));

/**
 * Body parser middleware for parsing request bodies.
 * Supports URL-encoded and JSON payloads.
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Request logging middleware.
 * Logs all incoming requests with method, path, IP, and user agent.
 *
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 * @param {express.NextFunction} next - Express next function
 */
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

/**
 * Rate limiting configuration.
 * Protects API endpoints from abuse by limiting requests per IP.
 *
 * @type {rateLimit.RateLimitRequestHandler}
 */
const limiter = rateLimit({
  windowMs: RATE_LIMIT.WINDOW_MS,
  max: RATE_LIMIT.MAX_REQUESTS,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  /**
   * Custom handler for rate limit exceeded.
   * Logs the event and returns a JSON error response.
   *
   * @param {express.Request} req - Express request object
   * @param {express.Response} res - Express response object
   */
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      path: req.path
    });
    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      error: 'Too many requests',
      message: 'Please try again later',
      code: 'RATE_LIMIT_EXCEEDED'
    });
  }
});

// Apply rate limiting to API routes only
app.use('/api', limiter);

// ============================================================================
// TEMPLATE ENGINE & STATIC FILES
// ============================================================================

/**
 * Pug template engine configuration.
 * Used for rendering the legacy HTML interface.
 */
app.set('views', './public');
app.set('view engine', 'pug');

/**
 * Static file serving.
 * Serves files from the public directory.
 */
app.use(express.static('public'));

// ============================================================================
// ROUTES
// ============================================================================

/**
 * Health check endpoint.
 * Returns server status information for monitoring and load balancers.
 *
 * @name GetHealth
 * @route {GET} /health
 * @returns {Object} 200 - Health status object
 *
 * @example
 * // Response:
 * {
 *   "status": "healthy",
 *   "timestamp": "2025-01-15T10:00:00.000Z",
 *   "uptime": 3600.5,
 *   "environment": "production",
 *   "version": "2.0.0"
 * }
 */
app.get('/health', (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.server.nodeEnv,
    version: '2.0.0'
  });
});

/**
 * Main application routes.
 * Includes / (HTML) and /api (JSON) endpoints.
 */
app.use('/', routes);

// ============================================================================
// ERROR HANDLERS
// ============================================================================

/**
 * 404 Not Found handler.
 * Catches requests to undefined routes and returns a JSON error.
 *
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 */
app.use((req, res) => {
  logger.warn('404 Not Found', {
    method: req.method,
    path: req.path,
    ip: req.ip
  });
  res.status(HTTP_STATUS.NOT_FOUND).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    code: 'NOT_FOUND'
  });
});

/**
 * Global error handler.
 * Catches all unhandled errors and returns a safe JSON response.
 * In production, error details are hidden for security.
 *
 * @param {Error} err - Error object
 * @param {express.Request} req - Express request object
 * @param {express.Response} res - Express response object
 * @param {express.NextFunction} next - Express next function
 */
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip
  });

  const statusCode = err.statusCode || err.status || HTTP_STATUS.INTERNAL_ERROR;

  res.status(statusCode).json({
    error: 'Internal Server Error',
    message: config.server.nodeEnv === 'production'
      ? 'An error occurred processing your request'
      : err.message,
    code: err.code || 'INTERNAL_ERROR'
  });
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

/**
 * Server port from configuration.
 * @type {number}
 */
const PORT = config.server.port;

/**
 * Start the server only when this file is run directly (not imported for testing).
 * Enables proper test isolation without starting the server.
 */
if (require.main === module) {
  /**
   * HTTP server instance.
   * @type {import('http').Server}
   */
  const server = app.listen(PORT, () => {
    logger.info(`Server started on http://localhost:${PORT}`, {
      environment: config.server.nodeEnv,
      nodeVersion: process.version,
      port: PORT
    });
  });

  /**
   * Graceful shutdown handler.
   * Closes the server gracefully when receiving termination signals.
   * Allows in-flight requests to complete before shutting down.
   *
   * @param {string} signal - The signal received (SIGTERM, SIGINT)
   */
  const gracefulShutdown = (signal) => {
    logger.info(`Received ${signal}, closing server gracefully...`);

    server.close(() => {
      logger.info('Server closed successfully');
      process.exit(0);
    });

    // Force shutdown after 10 seconds if graceful shutdown fails
    setTimeout(() => {
      logger.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  };

  // Register shutdown handlers
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception', {
      error: error.message,
      stack: error.stack
    });
    gracefulShutdown('uncaughtException');
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled promise rejection', {
      reason: reason instanceof Error ? reason.message : reason,
      stack: reason instanceof Error ? reason.stack : undefined
    });
  });
}

module.exports = app;
