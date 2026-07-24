const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

/**
 * Strip keys that start with $ or contain . to reduce NoSQL injection risk.
 * express-mongo-sanitize v2+ may need replaceWith for Express 5 req.query getters.
 */
const sanitizeRequest = (req, res, next) => {
  const clean = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    Object.keys(obj).forEach((key) => {
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key];
        return;
      }
      if (typeof obj[key] === 'object') clean(obj[key]);
    });
    return obj;
  };

  if (req.body) clean(req.body);
  if (req.params) clean(req.params);

  // Express 5: req.query can be a getter — mutate carefully
  try {
    if (req.query && typeof req.query === 'object') clean(req.query);
  } catch {
    // ignore immutable query bags
  }

  next();
};

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 400,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many auth attempts. Please try again later.',
  },
});

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many uploads. Please try again later.',
  },
});

const securityHeaders = helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
});

module.exports = {
  securityHeaders,
  globalLimiter,
  authLimiter,
  uploadLimiter,
  sanitizeRequest,
  mongoSanitize,
};
