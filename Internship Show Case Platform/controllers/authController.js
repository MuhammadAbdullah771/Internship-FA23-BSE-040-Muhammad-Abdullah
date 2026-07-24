const { clerkClient } = require('@clerk/express');
const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');
const User = require('../models/User');

const PROVIDER_MAP = {
  oauth_google: 'google',
  google: 'google',
  oauth_github: 'github',
  github: 'github',
  oauth_apple: 'apple',
  apple: 'apple',
};

const normalizeProviders = (clerkUser) => {
  const providers = new Set();

  if (clerkUser.passwordEnabled) {
    providers.add('email');
  }

  const accounts = clerkUser.externalAccounts || [];
  accounts.forEach((account) => {
    const mapped = PROVIDER_MAP[account.provider];
    if (mapped) providers.add(mapped);
  });

  if (providers.size === 0) {
    providers.add('email');
  }

  const list = Array.from(providers);
  const primaryAuthProvider =
    list.find((item) => item !== 'email') || list[0] || 'email';

  return { authProviders: list, primaryAuthProvider };
};

const buildUserPayload = (clerkUser) => {
  const primaryEmail =
    clerkUser.emailAddresses?.find(
      (item) => item.id === clerkUser.primaryEmailAddressId
    )?.emailAddress ||
    clerkUser.emailAddresses?.[0]?.emailAddress;

  if (!primaryEmail) {
    throw new AppError(
      'Your account needs an email address to use InternShowcase.',
      400
    );
  }

  const fullName =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ').trim() ||
    clerkUser.username ||
    primaryEmail.split('@')[0];

  const { authProviders, primaryAuthProvider } = normalizeProviders(clerkUser);

  return {
    clerkId: clerkUser.id,
    fullName,
    email: primaryEmail.toLowerCase(),
    profileImage: clerkUser.imageUrl || '',
    authProviders,
    primaryAuthProvider,
  };
};

/**
 * @desc    Sync Clerk user into MongoDB (create or update)
 * @route   POST /api/auth/sync
 * @access  Private (Clerk JWT)
 */
const syncUser = asyncHandler(async (req, res) => {
  const clerkUser = await clerkClient.users.getUser(req.clerkId);
  const payload = buildUserPayload(clerkUser);

  const user = await User.findOneAndUpdate(
    { clerkId: payload.clerkId },
    {
      $set: {
        fullName: payload.fullName,
        email: payload.email,
        profileImage: payload.profileImage,
        authProviders: payload.authProviders,
        primaryAuthProvider: payload.primaryAuthProvider,
      },
      $setOnInsert: {
        clerkId: payload.clerkId,
        role: 'intern',
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    message: 'User synced successfully',
    data: { user },
  });
});

/**
 * @desc    Get current application user
 * @route   GET /api/auth/me
 * @access  Private (Clerk JWT)
 */
const getMe = asyncHandler(async (req, res) => {
  let user = await User.findOne({ clerkId: req.clerkId });

  if (!user) {
    const clerkUser = await clerkClient.users.getUser(req.clerkId);
    const payload = buildUserPayload(clerkUser);

    user = await User.create({
      ...payload,
      role: 'intern',
    });
  }

  res.status(200).json({
    success: true,
    data: { user },
  });
});

module.exports = {
  syncUser,
  getMe,
};
