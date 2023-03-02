const rateLimit = require('express-rate-limit');

const rateLimiterUsingThirdParty = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 100,
  message: 'Вы превысили количество реквестов за сутки!',
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = rateLimiterUsingThirdParty;
