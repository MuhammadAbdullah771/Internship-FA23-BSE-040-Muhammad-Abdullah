import { verifyToken, createClerkClient } from '@clerk/backend';
import { verifyAccessToken } from '../utils/jwt.js';
import { AppError } from '../utils/AppError.js';
import { User } from '../models/User.js';
import { asyncHandler } from './asyncHandler.js';
import { env } from '../config/env.js';
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
  ? createClerkClient({ secretKey: env.clerk.secretKey })
  : null;

async function authenticateWithClerk(token) {
  const payload = await verifyToken(token, { secretKey: env.clerk.secretKey });
  const clerkUserId = payload.sub;

  let user = await User.findOne({ clerkId: clerkUserId });
  if (user) return user;

  const clerkUser = await clerkClient.users.getUser(clerkUserId);
  const email = clerkUser.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress
    ?? clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) {
    throw new AppError('Clerk account has no email address', 400, 'NO_EMAIL');
  }

  return syncClerkUser({
    clerkId: clerkUserId,
    email,
    firstName: clerkUser.firstName,
    lastName: clerkUser.lastName,
    imageUrl: clerkUser.imageUrl,
  });
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

  if (isClerkConfigured()) {
    try {
      user = await authenticateWithClerk(token);
    } catch {
      user = await authenticateWithJwt(token);
    }
  } else {
    user = await authenticateWithJwt(token);
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
