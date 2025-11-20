const NodeCache = require('node-cache');
const logger = require('./logger');

// Cache for 5 minutes by default
const cache = new NodeCache({
  stdTTL: 300,
  checkperiod: 60,
  useClones: false
});

cache.on('set', (key, value) => {
  logger.debug(`Cache SET: ${key}`);
});

cache.on('expired', (key, value) => {
  logger.debug(`Cache EXPIRED: ${key}`);
});

module.exports = cache;
