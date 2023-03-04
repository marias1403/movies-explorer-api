const rateLimit = require('express-rate-limit');
const validationConstants = require('../utils/constants');

const rateLimiterUsingThirdParty = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 100,
  message: validationConstants.RATE_LIMIT_ERROR,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = rateLimiterUsingThirdParty;
