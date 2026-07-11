import { verifyToken, createClerkClient } from '@clerk/backend';
import { verifyAccessToken } from '../utils/jwt.js';
import { AppError } from '../utils/AppError.js';
import { User } from '../models/User.js';
import { asyncHandler } from './asyncHandler.js';
import { env } from '../config/env.js';
import { ROLES } from '../constants/roles.js';
import { syncClerkUser } from '../modules/auth/auth.service.js';

const PLACEHOLDER_PATTERN = /your_secret_key|your_publishable_key|replace_me/i;

function isClerkConfigured() {
  return Boolean(
    env.clerk.secretKey
    && env.clerk.secretKey.startsWith('sk_')
    && !PLACEHOLDER_PATTERN.test(env.clerk.secretKey),
  );
}

const clerkClient = isClerkConfigured()
  ? createClerkClient({
    secretKey: env.clerk.secretKey,
    publishableKey: env.clerk.publishableKey,
  })
  : null;

/** Detect our app JWT (HS256) vs Clerk session JWT (usually RS256). */
function isAppJwt(token) {
  try {
    const header = JSON.parse(Buffer.from(token.split('.')[0], 'base64url').toString('utf8'));
    return header?.alg === 'HS256';
  } catch {
    return false;
  }
}

async function authenticateWithClerk(token) {
  if (!clerkClient) {
    throw new AppError('Clerk is not configured on the server', 500, 'CLERK_NOT_CONFIGURED');
  }

  const verifyOptions = {
    secretKey: env.clerk.secretKey,
    clockSkewInMs: env.isDev ? 120_000 : 10_000,
  };

  if (env.isProd) {
    verifyOptions.authorizedParties = [...new Set([env.clientUrl, ...env.corsOrigin])];
  }

  let payload;
  try {
    payload = await verifyToken(token, verifyOptions);
  } catch (error) {
    const reason = error?.reason || error?.message || 'token-invalid';
    if (reason === 'token-iat-in-the-future') {
      throw new AppError(
        'Server clock is behind Clerk. Sync your system time and try again.',
        401,
        'UNAUTHORIZED',
      );
    }
    if (reason === 'jwk-kid-mismatch') {
      throw new AppError(
        'Clerk keys mismatch. Ensure VITE_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY are from the same Clerk application.',
        401,
        'CLERK_KEY_MISMATCH',
      );
    }
    throw new AppError('Invalid or expired Clerk session. Please sign in again.', 401, 'UNAUTHORIZED');
  }

  const clerkUserId = payload.sub;

  let user = await User.findOne({ clerkId: clerkUserId });
  if (user) {
    if (user.role === ROLES.SUPERADMIN) {
      throw new AppError('Superadmin accounts require password login', 403, 'FORBIDDEN');
    }
    return user;
  }

  let clerkUser;
  try {
    clerkUser = await clerkClient.users.getUser(clerkUserId);
  } catch (error) {
    if (env.isDev) {
      console.error('[auth] Failed to fetch Clerk user profile:', error?.message || error);
    }
    throw new AppError(
      'Could not load your Clerk profile. Check CLERK_SECRET_KEY and try again.',
      502,
      'CLERK_PROFILE_FETCH_FAILED',
    );
  }

  const email = clerkUser.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress
    ?? clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) {
    throw new AppError('Clerk account has no email address', 400, 'NO_EMAIL');
  }

  try {
    return await syncClerkUser({
      clerkId: clerkUserId,
      email,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    if (error?.code === 11000) {
      const existing = await User.findOne({
        $or: [{ clerkId: clerkUserId }, { email: email.toLowerCase().trim() }],
      });
      if (existing) return existing;
    }
    if (env.isDev) {
      console.error('[auth] syncClerkUser failed:', error);
    }
    throw new AppError(
      error?.message || 'Failed to sync portal profile',
      500,
      'PROFILE_SYNC_FAILED',
    );
  }
}

async function authenticateWithJwt(token) {
  const payload = verifyAccessToken(token);
  const user = await User.findById(payload.sub).select('+passwordHash');
  if (!user) {
    throw new AppError('User no longer exists', 401, 'UNAUTHORIZED');
  }
  return user;
}

export const authenticate = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
  }

  const token = header.slice(7);
  let user;

  // Prefer app JWT for superadmin tokens so we never hit Clerk with HS256 JWTs.
  if (isAppJwt(token)) {
    try {
      user = await authenticateWithJwt(token);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Invalid or expired token', 401, 'UNAUTHORIZED');
    }
  } else if (isClerkConfigured()) {
    user = await authenticateWithClerk(token);
  } else {
    try {
      user = await authenticateWithJwt(token);
    } catch {
      throw new AppError('Invalid or expired token', 401, 'UNAUTHORIZED');
    }
  }

  req.user = user;
  next();
});

export function authorize(...roles) {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('Insufficient permissions', 403, 'FORBIDDEN'));
    }
    return next();
  };
}
