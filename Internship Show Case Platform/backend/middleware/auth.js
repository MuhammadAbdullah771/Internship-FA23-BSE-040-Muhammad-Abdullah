const { getAuth } = require('@clerk/express');
const AppError = require('../utils/AppError');
const asyncHandler = require('./asyncHandler');
const User = require('../models/User');
const config = require('../config');

const isClerkConfigured = () =>
  Boolean(config.clerkPublishableKey) &&
  Boolean(config.clerkSecretKey) &&
  !config.clerkPublishableKey.includes('your_publishable_key') &&
  !config.clerkSecretKey.includes('your_secret_key');

/**
 * Requires a valid Clerk session JWT on the request.
 * Attaches clerkId to req for downstream handlers.
 */
const requireAuth = asyncHandler(async (req, res, next) => {
  if (!isClerkConfigured()) {
    throw new AppError(
      'Clerk is not configured. Set CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY in backend/.env',
      503
    );
  }

  const auth = getAuth(req);

  if (!auth?.isAuthenticated || !auth.userId) {
    throw new AppError('Authentication required. Please sign in.', 401);
  }

  req.auth = auth;
  req.clerkId = auth.userId;
  next();
});

/**
 * Loads the application User document for the authenticated Clerk user.
 * Must run after requireAuth.
 */
const attachAppUser = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ clerkId: req.clerkId });

  if (!user) {
    throw new AppError(
      'User record not found. Please sync your account first.',
      404
    );
  }

  req.user = user;
  next();
});

/**
 * Restricts access to specific application roles.
 * Must run after attachAppUser.
 */
const authorizeRoles = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new AppError('User context missing', 500);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError(
        'You do not have permission to perform this action',
        403
      );
    }

    next();
  });

module.exports = {
  requireAuth,
  attachAppUser,
  authorizeRoles,
};
