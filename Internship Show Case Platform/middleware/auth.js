const { getAuth, verifyToken } = require('@clerk/express');
const AppError = require('../utils/AppError');
const asyncHandler = require('./asyncHandler');
const User = require('../models/User');
const config = require('../config');

const isClerkConfigured = () =>
  Boolean(config.clerkPublishableKey) &&
  Boolean(config.clerkSecretKey) &&
  !config.clerkPublishableKey.includes('your_publishable_key') &&
  !config.clerkSecretKey.includes('your_secret_key');

const getBearerToken = (req) => {
  const header = req.headers.authorization || req.headers.Authorization;
  if (!header || typeof header !== 'string') return null;
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return null;
  return token;
};

/**
 * Prefer verifying the Authorization Bearer JWT (SPA pattern).
 * Cookie-based auth via clerkMiddleware is a fallback only.
 */
const resolveClerkUserId = async (req) => {
  const bearer = getBearerToken(req);

  if (bearer) {
    const payload = await verifyToken(bearer, {
      secretKey: config.clerkSecretKey,
      // Windows clocks often drift slightly vs Clerk; default 5s is too tight.
      clockSkewInMs: 60_000,
    });
    if (payload?.sub) return payload.sub;
  }

  const auth = getAuth(req);
  if (auth?.isAuthenticated && auth.userId) {
    return auth.userId;
  }

  return null;
};

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

  try {
    const clerkId = await resolveClerkUserId(req);

    if (!clerkId) {
      throw new AppError('Authentication required. Please sign in.', 401);
    }

    req.clerkId = clerkId;
    next();
  } catch (error) {
    if (error instanceof AppError) throw error;

    const reason = error?.reason || error?.message || 'invalid token';
    const lower = String(reason).toLowerCase();

    if (
      lower.includes('expired') ||
      lower.includes('token-expired') ||
      lower.includes('jwt expired')
    ) {
      throw new AppError(
        'Your session has expired. Please sign in again.',
        401
      );
    }

    throw new AppError(`Authentication required. Please sign in. (${reason})`, 401);
  }
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
