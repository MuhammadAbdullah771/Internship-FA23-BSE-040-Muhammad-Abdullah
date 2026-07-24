const { clerkClient } = require('@clerk/express');
const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Project = require('../models/Project');
const PortfolioSettings = require('../models/PortfolioSettings');
const ViewEvent = require('../models/ViewEvent');
const {
  validatePasswordStrength,
} = require('../utils/passwordValidation');

/**
 * @desc    Update account basics (full name)
 * @route   PUT /api/account
 * @access  Private
 */
const updateAccount = asyncHandler(async (req, res) => {
  const fullName = String(req.body.fullName || '').trim();
  if (!fullName || fullName.length < 2) {
    throw new AppError('Full name must be at least 2 characters', 400);
  }
  if (fullName.length > 100) {
    throw new AppError('Full name cannot exceed 100 characters', 400);
  }

  const parts = fullName.split(/\s+/);
  const firstName = parts[0] || fullName;
  const lastName = parts.slice(1).join(' ') || '';

  await clerkClient.users.updateUser(req.clerkId, {
    firstName,
    lastName: lastName || undefined,
  });

  const user = await User.findOneAndUpdate(
    { clerkId: req.clerkId },
    { $set: { fullName } },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError('User not found. Sync auth first.', 404);
  }

  await Profile.findOneAndUpdate(
    { clerkId: req.clerkId },
    { $set: { fullName } }
  );

  res.status(200).json({
    success: true,
    message: 'Account updated',
    data: { user },
  });
});

/**
 * @desc    Update password via Clerk
 * @route   PUT /api/account/password
 * @access  Private
 */
const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const strengthError = validatePasswordStrength(newPassword);
  if (strengthError) {
    throw new AppError(strengthError, 400);
  }

  if (!currentPassword || typeof currentPassword !== 'string') {
    throw new AppError('Current password is required', 400);
  }

  try {
    await clerkClient.users.verifyPassword({
      userId: req.clerkId,
      password: currentPassword,
    });
  } catch {
    throw new AppError('Current password is incorrect', 400);
  }

  try {
    await clerkClient.users.updateUser(req.clerkId, {
      password: newPassword,
      signOutOfOtherSessions: true,
    });
  } catch (error) {
    const message =
      error?.errors?.[0]?.longMessage ||
      error?.errors?.[0]?.message ||
      error?.message ||
      'Unable to update password';
    throw new AppError(message, 400);
  }

  res.status(200).json({
    success: true,
    message: 'Password updated successfully',
  });
});

/**
 * @desc    Delete account (Clerk + local data cascade)
 * @route   DELETE /api/account
 * @access  Private
 */
const deleteAccount = asyncHandler(async (req, res) => {
  const confirmation = String(req.body.confirmation || '').trim();
  if (confirmation !== 'DELETE') {
    throw new AppError(
      'Type DELETE to confirm permanent account deletion',
      400
    );
  }

  const clerkId = req.clerkId;
  const projects = await Project.find({ clerkId }).select('images');

  // Best-effort local cleanup first so orphaned Mongo docs are unlikely.
  await Promise.all([
    Profile.deleteOne({ clerkId }),
    PortfolioSettings.deleteOne({ clerkId }),
    Project.deleteMany({ clerkId }),
    ViewEvent.deleteMany({ ownerClerkId: clerkId }),
    User.deleteOne({ clerkId }),
  ]);

  // Local image files are left for ops cleanup; paths were under uploads/.
  void projects;

  try {
    await clerkClient.users.deleteUser(clerkId);
  } catch (error) {
    const message =
      error?.errors?.[0]?.longMessage ||
      error?.message ||
      'Local data removed, but Clerk deletion failed. Contact support.';
    throw new AppError(message, 502);
  }

  res.status(200).json({
    success: true,
    message: 'Account deleted permanently',
  });
});

/**
 * @desc    Get account summary for settings page
 * @route   GET /api/account
 * @access  Private
 */
const getAccount = asyncHandler(async (req, res) => {
  const user = await User.findOne({ clerkId: req.clerkId });
  if (!user) {
    throw new AppError('User not found. Sync auth first.', 404);
  }

  const settings = await PortfolioSettings.findOne({ clerkId: req.clerkId })
    .select('username portfolioStatus portfolioViews')
    .lean();

  res.status(200).json({
    success: true,
    data: {
      user,
      portfolio: settings || null,
    },
  });
});

module.exports = {
  getAccount,
  updateAccount,
  updatePassword,
  deleteAccount,
};
