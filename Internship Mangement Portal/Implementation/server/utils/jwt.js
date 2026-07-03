import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from './AppError.js';

export function signAccessToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role, email: user.email },
    env.jwt.accessSecret,
    { expiresIn: env.jwt.accessExpiresIn },
  );
}

export function signRefreshToken(user) {
  return jwt.sign(
    { sub: user._id.toString() },
    env.jwt.refreshSecret,
    { expiresIn: env.jwt.refreshExpiresIn },
  );
}

export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, env.jwt.accessSecret);
  } catch {
    throw new AppError('Invalid or expired access token', 401, 'INVALID_ACCESS_TOKEN');
  }
}

export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, env.jwt.refreshSecret);
  } catch {
    throw new AppError('Invalid or expired refresh token', 401, 'INVALID_REFRESH_TOKEN');
  }
}
