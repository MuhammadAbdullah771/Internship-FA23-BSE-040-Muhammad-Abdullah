import { verifyAccessToken } from '../utils/jwt.js';
import { AppError } from '../utils/AppError.js';
import { User } from '../models/User.js';
import { asyncHandler } from './asyncHandler.js';

export const authenticate = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
  }

  const token = header.slice(7);
  const payload = verifyAccessToken(token);

  const user = await User.findById(payload.sub).select('+passwordHash');
  if (!user) {
    throw new AppError('User no longer exists', 401, 'UNAUTHORIZED');
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
