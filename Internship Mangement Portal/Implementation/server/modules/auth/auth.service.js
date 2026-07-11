import { User } from '../../models/User.js';
import { RefreshToken } from '../../models/RefreshToken.js';
import { PasswordResetToken } from '../../models/PasswordResetToken.js';
import { ROLES } from '../../constants/roles.js';
import { AppError } from '../../utils/AppError.js';
import { signAccessToken, signRefreshToken } from '../../utils/jwt.js';
import { hashToken, generateResetToken } from '../../utils/tokens.js';
import { toUserDTO } from '../../utils/userSerializer.js';
import { env } from '../../config/env.js';
import { createClerkClient } from '@clerk/backend';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { broadcastToRole, broadcastToUser } from '../events/eventBus.js';
import { enrichPortalAccessPosting } from '../portal-access/portal-access.service.js';

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const avatarsDir = path.resolve(moduleDir, '../../uploads/avatars');

const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const RESET_TTL_MS = 60 * 60 * 1000;

function buildAvatar(email) {
  return `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`;
}

function getClerkClient() {
  if (!env.clerk.secretKey?.startsWith('sk_')) return null;
  return createClerkClient({
    secretKey: env.clerk.secretKey,
    publishableKey: env.clerk.publishableKey,
  });
}

async function ensureAvatarDir() {
  await fs.mkdir(avatarsDir, { recursive: true });
}

async function saveAvatarImage(dataUrl, userId) {
  const match = /^data:image\/(png|jpe?g|webp);base64,(.+)$/i.exec(dataUrl);
  if (!match) {
    throw new AppError('Avatar must be a PNG, JPG, or WebP image', 400, 'INVALID_IMAGE');
  }

  const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
  const buffer = Buffer.from(match[2], 'base64');

  if (buffer.length > 2 * 1024 * 1024) {
    throw new AppError('Avatar must be under 2MB', 400, 'IMAGE_TOO_LARGE');
  }

  await ensureAvatarDir();
  const filename = `${userId}-avatar-${Date.now()}.${ext}`;
  await fs.writeFile(path.join(avatarsDir, filename), buffer);
  return `/uploads/avatars/${filename}`;
}

export async function syncAvatarFromClerk(user) {
  if (!user?.clerkId) return user;

  const client = getClerkClient();
  if (!client) return user;

  try {
    const clerkUser = await client.users.getUser(user.clerkId);
    if (clerkUser.imageUrl && clerkUser.imageUrl !== user.avatar) {
      user.avatar = clerkUser.imageUrl;
      await user.save();
      broadcastToUser(user._id.toString(), 'profile:updated', { userId: user._id.toString() });
    }
  } catch (error) {
    // Never fail profile load because Clerk avatar sync is unavailable
    if (env.isDev) {
      console.warn('[auth] Avatar sync skipped:', error?.message || error);
    }
  }

  return user;
}

export async function syncClerkUser({ clerkId, email, firstName, lastName, imageUrl }) {
  const normalizedEmail = email.toLowerCase().trim();
  const safeFirstName = (firstName?.trim() || 'Student').slice(0, 80);
  const safeLastName = (lastName?.trim() || 'User').slice(0, 80);

  let user = await User.findOne({ clerkId });
  if (user) {
    if (imageUrl && imageUrl !== user.avatar) {
      user.avatar = imageUrl;
      await user.save();
    }
    return user;
  }

  user = await User.findOne({ email: normalizedEmail });
  if (user) {
    if (user.role === ROLES.SUPERADMIN) {
      throw new AppError('Superadmin accounts use the admin login only', 403, 'SUPERADMIN_PASSWORD_ONLY');
    }
    user.clerkId = clerkId;
    if (imageUrl) user.avatar = imageUrl;
    if (!user.firstName) user.firstName = safeFirstName;
    if (!user.lastName) user.lastName = safeLastName;
    await user.save();
    broadcastToRole(ROLES.SUPERADMIN, 'students:updated', { userId: user._id.toString() });
    return user;
  }

  try {
    const created = await User.create({
      clerkId,
      email: normalizedEmail,
      firstName: safeFirstName,
      lastName: safeLastName,
      role: ROLES.STUDENT,
      avatar: imageUrl || buildAvatar(normalizedEmail),
      portalAccess: { status: 'unsubmitted', enrollmentStatus: 'none' },
    });
    broadcastToRole(ROLES.SUPERADMIN, 'students:updated', { userId: created._id.toString() });
    return created;
  } catch (error) {
    if (error?.code === 11000) {
      const existing = await User.findOne({
        $or: [{ clerkId }, { email: normalizedEmail }],
      });
      if (existing) {
        if (!existing.clerkId) {
          existing.clerkId = clerkId;
          if (imageUrl) existing.avatar = imageUrl;
          await existing.save();
        }
        return existing;
      }
    }
    throw error;
  }
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
  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');
  if (!user) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  if (expectedRole === ROLES.SUPERADMIN && user.role !== ROLES.SUPERADMIN) {
    throw new AppError('Access denied. Superadmin credentials required.', 403, 'ROLE_MISMATCH');
  }

  if (expectedRole === ROLES.STUDENT && user.role === ROLES.SUPERADMIN) {
    throw new AppError('Use the superadmin login page for admin accounts.', 403, 'ROLE_MISMATCH');
  }

  if (!user.passwordHash) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  const passwordMatch = await user.comparePassword(password);
  if (!passwordMatch) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
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
  let user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  // Heal legacy approved students missing an active enrollment flag
  if (
    user.portalAccess?.status === 'approved'
    && (!user.portalAccess.enrollmentStatus || user.portalAccess.enrollmentStatus === 'none')
  ) {
    user.portalAccess.enrollmentStatus = 'active';
    await user.save();
  }

  if (user.clerkId) {
    user = await syncAvatarFromClerk(user);
  }

  await enrichPortalAccessPosting(user);
  const dto = toUserDTO(user);
  const applicationName = dto.portalAccess?.fullName?.trim();
  return {
    ...dto,
    name: applicationName || dto.name,
    displayName: applicationName || dto.name,
  };
}

export async function syncClerkAvatarForUser(userId) {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  if (!user.clerkId) {
    throw new AppError('No Clerk account linked', 400, 'NO_CLERK_ACCOUNT');
  }

  const updated = await syncAvatarFromClerk(user);
  await enrichPortalAccessPosting(updated);
  const dto = toUserDTO(updated);
  const applicationName = dto.portalAccess?.fullName?.trim();
  return {
    ...dto,
    name: applicationName || dto.name,
    displayName: applicationName || dto.name,
  };
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

export async function updateProfile(userId, { firstName, lastName, contactNumber, avatar }) {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (contactNumber !== undefined) {
    if (!user.portalAccess) user.portalAccess = {};
    user.portalAccess.contactNumber = contactNumber;
  }

  if (avatar) {
    if (avatar.startsWith('data:image/')) {
      user.avatar = await saveAvatarImage(avatar, userId);
    } else if (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('/uploads/')) {
      user.avatar = avatar;
    }
  }

  await user.save();
  await user.populate('portalAccess.postingId');
  const dto = toUserDTO(user);
  broadcastToUser(userId.toString(), 'profile:updated', { userId: userId.toString() });
  return dto;
}
