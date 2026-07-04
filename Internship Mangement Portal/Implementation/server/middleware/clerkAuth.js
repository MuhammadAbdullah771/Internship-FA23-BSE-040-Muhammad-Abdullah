import { verifyToken, createClerkClient } from '@clerk/backend';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from './asyncHandler.js';
import { env } from '../config/env.js';
import { syncClerkUser } from '../modules/auth/auth.service.js';

const clerkClient = env.clerk.secretKey
  ? createClerkClient({ secretKey: env.clerk.secretKey })
  : null;

export const authenticate = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
  }

  if (!clerkClient) {
    throw new AppError('Clerk is not configured on the server', 500, 'CLERK_NOT_CONFIGURED');
  }

  const token = header.slice(7);

  let clerkUserId;
  try {
    const payload = await verifyToken(token, { secretKey: env.clerk.secretKey });
    clerkUserId = payload.sub;
  } catch {
    throw new AppError('Invalid or expired session', 401, 'UNAUTHORIZED');
  }

  let user = await User.findOne({ clerkId: clerkUserId });
  if (!user) {
    const clerkUser = await clerkClient.users.getUser(clerkUserId);
    const email = clerkUser.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress
      ?? clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
      throw new AppError('Clerk account has no email address', 400, 'NO_EMAIL');
    }

    user = await syncClerkUser({
      clerkId: clerkUserId,
      email,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
    });
  }

  req.user = user;
  req.clerkUserId = clerkUserId;
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
