import { User } from '../../models/User.js';
import { RefreshToken } from '../../models/RefreshToken.js';
import { PasswordResetToken } from '../../models/PasswordResetToken.js';
import { ROLES } from '../../constants/roles.js';
import { AppError } from '../../utils/AppError.js';
import { signAccessToken, signRefreshToken } from '../../utils/jwt.js';
import { hashToken, generateResetToken } from '../../utils/tokens.js';
import { toUserDTO } from '../../utils/userSerializer.js';
import { env } from '../../config/env.js';

const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const RESET_TTL_MS = 60 * 60 * 1000;

function buildAvatar(email) {
  return `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`;
}

function parseDurationToMs(duration) {
  const match = /^(\d+)([smhd])$/.exec(duration);
  if (!match) return REFRESH_TTL_MS;
  const value = Number(match[1]);
  const unit = match[2];
  const multipliers = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return value * (multipliers[unit] ?? multipliers.d);
}

async function issueTokenPair(user) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  const expiresAt = new Date(Date.now() + parseDurationToMs(env.jwt.refreshExpiresIn));

  await RefreshToken.create({
    userId: user._id,
    tokenHash: hashToken(refreshToken),
    expiresAt,
  });

  return { accessToken, refreshToken };
}

async function revokeRefreshToken(refreshToken) {
  if (!refreshToken) return;
  await RefreshToken.deleteOne({ tokenHash: hashToken(refreshToken) });
}

export async function registerStudent({ firstName, lastName, email, password }) {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError('An account with this email already exists', 409, 'EMAIL_EXISTS');
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    passwordHash: password,
    role: ROLES.STUDENT,
    avatar: buildAvatar(email),
  });

  const tokens = await issueTokenPair(user);
  return { user: toUserDTO(user), ...tokens };
}

export async function login({ email, password, expectedRole }) {
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  const passwordMatch = await user.comparePassword(password);
  if (!passwordMatch) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  if (expectedRole && user.role !== expectedRole) {
    const message = expectedRole === ROLES.SUPERADMIN
      ? 'Access denied. Superadmin credentials required.'
      : 'This account cannot access the internship portal.';
    throw new AppError(message, 403, 'ROLE_MISMATCH');
  }

  const tokens = await issueTokenPair(user);
  return { user: toUserDTO(user), ...tokens };
}

export async function refreshSession(refreshToken) {
  const stored = await RefreshToken.findOne({ tokenHash: hashToken(refreshToken) });
  if (!stored || stored.expiresAt < new Date()) {
    throw new AppError('Invalid or expired refresh token', 401, 'INVALID_REFRESH_TOKEN');
  }

  const user = await User.findById(stored.userId);
  if (!user) {
    throw new AppError('User no longer exists', 401, 'UNAUTHORIZED');
  }

  await stored.deleteOne();
  const tokens = await issueTokenPair(user);
  return { user: toUserDTO(user), ...tokens };
}

export async function logout(refreshToken) {
  await revokeRefreshToken(refreshToken);
}

export async function getProfile(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }
  return toUserDTO(user);
}

export async function requestPasswordReset(email) {
  const user = await User.findOne({ email });
  if (!user) {
    return { message: 'If an account exists, a reset link has been sent.' };
  }

  await PasswordResetToken.deleteMany({ userId: user._id, usedAt: null });

  const rawToken = generateResetToken();
  await PasswordResetToken.create({
    userId: user._id,
    tokenHash: hashToken(rawToken),
    expiresAt: new Date(Date.now() + RESET_TTL_MS),
  });

  if (env.isDev) {
    console.log(`[dev] Password reset token for ${email}: ${rawToken}`);
  }

  return {
    message: 'If an account exists, a reset link has been sent.',
    ...(env.isDev ? { devResetToken: rawToken } : {}),
  };
}

export async function resetPassword({ token, password }) {
  const record = await PasswordResetToken.findOne({
    tokenHash: hashToken(token),
    usedAt: null,
    expiresAt: { $gt: new Date() },
  });

  if (!record) {
    throw new AppError('Invalid or expired reset token', 400, 'INVALID_RESET_TOKEN');
  }

  const user = await User.findById(record.userId).select('+passwordHash');
  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  user.passwordHash = password;
  await user.save();

  record.usedAt = new Date();
  await record.save();
  await RefreshToken.deleteMany({ userId: user._id });

  return { message: 'Password updated successfully' };
}
