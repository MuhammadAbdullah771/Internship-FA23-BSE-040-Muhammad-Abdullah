const path = require('path');
const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');
const Profile = require('../models/Profile');
const User = require('../models/User');

const normalizeSkill = (skill) => skill.trim().replace(/\s+/g, ' ');

const getOrFailProfile = async (clerkId) => {
  const profile = await Profile.findOne({ clerkId });
  if (!profile) {
    throw new AppError('Profile not found. Create your profile first.', 404);
  }
  return profile;
};

const syncUserBasics = async (clerkId, profile) => {
  await User.findOneAndUpdate(
    { clerkId },
    {
      $set: {
        fullName: profile.fullName,
        profileImage: profile.profileImage || '',
      },
    }
  );
};

/**
 * @desc    Get current intern profile
 * @route   GET /api/profiles/me
 * @access  Private
 */
const getMyProfile = asyncHandler(async (req, res) => {
  let profile = await Profile.findOne({ clerkId: req.clerkId });

  if (!profile) {
    const user = await User.findOne({ clerkId: req.clerkId });
    if (!user) {
      throw new AppError('User not found. Sync auth first.', 404);
    }

    return res.status(200).json({
      success: true,
      data: {
        profile: null,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          profileImage: user.profileImage,
        },
        completionPercent: 0,
      },
    });
  }

  res.status(200).json({
    success: true,
    data: {
      profile,
      completionPercent: profile.completionPercent,
    },
  });
});

/**
 * @desc    Create intern profile
 * @route   POST /api/profiles
 * @access  Private
 */
const createProfile = asyncHandler(async (req, res) => {
  const existing = await Profile.findOne({ clerkId: req.clerkId });
  if (existing) {
    throw new AppError('Profile already exists. Use update instead.', 409);
  }

  const user = await User.findOne({ clerkId: req.clerkId });
  if (!user) {
    throw new AppError('User not found. Sync auth first.', 404);
  }

  const {
    fullName,
    professionalTitle,
    bio,
    location,
    university,
    degree,
    graduationYear,
    skills,
    githubUrl,
    linkedinUrl,
    portfolioUrl,
  } = req.body;

  const profile = await Profile.create({
    user: user._id,
    clerkId: req.clerkId,
    fullName: fullName?.trim() || user.fullName,
    professionalTitle: professionalTitle || '',
    bio: bio || '',
    profileImage: user.profileImage || '',
    location: location || '',
    university: university || '',
    degree: degree || '',
    graduationYear: graduationYear ? Number(graduationYear) : null,
    skills: Array.isArray(skills)
      ? [...new Set(skills.map(normalizeSkill).filter(Boolean))]
      : [],
    githubUrl: githubUrl || '',
    linkedinUrl: linkedinUrl || '',
    portfolioUrl: portfolioUrl || '',
  });

  await syncUserBasics(req.clerkId, profile);

  res.status(201).json({
    success: true,
    message: 'Profile created successfully',
    data: {
      profile,
      completionPercent: profile.completionPercent,
    },
  });
});

/**
 * @desc    Update intern profile
 * @route   PUT /api/profiles/me
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const profile = await getOrFailProfile(req.clerkId);

  const fields = [
    'fullName',
    'professionalTitle',
    'bio',
    'location',
    'university',
    'degree',
    'githubUrl',
    'linkedinUrl',
    'portfolioUrl',
  ];

  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      profile[field] =
        typeof req.body[field] === 'string'
          ? req.body[field].trim()
          : req.body[field];
    }
  });

  if (req.body.graduationYear !== undefined) {
    profile.graduationYear = req.body.graduationYear
      ? Number(req.body.graduationYear)
      : null;
  }

  if (Array.isArray(req.body.skills)) {
    profile.skills = [
      ...new Set(req.body.skills.map(normalizeSkill).filter(Boolean)),
    ];
  }

  await profile.save();
  await syncUserBasics(req.clerkId, profile);

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      profile,
      completionPercent: profile.completionPercent,
    },
  });
});

/**
 * @desc    Upload profile image
 * @route   POST /api/profiles/me/image
 * @access  Private
 */
const uploadProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('Please upload a profile image file', 400);
  }

  let profile = await Profile.findOne({ clerkId: req.clerkId });
  const imagePath = `/uploads/profiles/${req.file.filename}`;

  if (!profile) {
    const user = await User.findOne({ clerkId: req.clerkId });
    if (!user) {
      throw new AppError('User not found. Sync auth first.', 404);
    }

    profile = await Profile.create({
      user: user._id,
      clerkId: req.clerkId,
      fullName: user.fullName,
      profileImage: imagePath,
    });
  } else {
    profile.profileImage = imagePath;
    await profile.save();
  }

  await syncUserBasics(req.clerkId, profile);

  res.status(200).json({
    success: true,
    message: 'Profile image uploaded successfully',
    data: {
      profile,
      completionPercent: profile.completionPercent,
    },
  });
});

/**
 * @desc    Add a skill
 * @route   POST /api/profiles/me/skills
 * @access  Private
 */
const addSkill = asyncHandler(async (req, res) => {
  const skill = normalizeSkill(req.body.skill || '');
  if (!skill) {
    throw new AppError('Skill is required', 400);
  }

  const profile = await getOrFailProfile(req.clerkId);
  const exists = profile.skills.some(
    (item) => item.toLowerCase() === skill.toLowerCase()
  );

  if (exists) {
    throw new AppError('Skill already added', 409);
  }

  if (profile.skills.length >= 30) {
    throw new AppError('Maximum of 30 skills allowed', 400);
  }

  profile.skills.push(skill);
  await profile.save();

  res.status(200).json({
    success: true,
    message: 'Skill added',
    data: {
      profile,
      completionPercent: profile.completionPercent,
    },
  });
});

/**
 * @desc    Remove a skill
 * @route   DELETE /api/profiles/me/skills/:skill
 * @access  Private
 */
const removeSkill = asyncHandler(async (req, res) => {
  const skillParam = decodeURIComponent(req.params.skill || '').trim();
  if (!skillParam) {
    throw new AppError('Skill is required', 400);
  }

  const profile = await getOrFailProfile(req.clerkId);
  const before = profile.skills.length;
  profile.skills = profile.skills.filter(
    (item) => item.toLowerCase() !== skillParam.toLowerCase()
  );

  if (profile.skills.length === before) {
    throw new AppError('Skill not found on profile', 404);
  }

  await profile.save();

  res.status(200).json({
    success: true,
    message: 'Skill removed',
    data: {
      profile,
      completionPercent: profile.completionPercent,
    },
  });
});

/**
 * @desc    Update social links
 * @route   PUT /api/profiles/me/social
 * @access  Private
 */
const updateSocialLinks = asyncHandler(async (req, res) => {
  const profile = await getOrFailProfile(req.clerkId);

  ['githubUrl', 'linkedinUrl', 'portfolioUrl'].forEach((field) => {
    if (req.body[field] !== undefined) {
      profile[field] = String(req.body[field] || '').trim();
    }
  });

  await profile.save();

  res.status(200).json({
    success: true,
    message: 'Social links updated',
    data: {
      profile,
      completionPercent: profile.completionPercent,
    },
  });
});

module.exports = {
  getMyProfile,
  createProfile,
  updateProfile,
  uploadProfileImage,
  addSkill,
  removeSkill,
  updateSocialLinks,
};
